const STRIPE_SIGNATURE_TOLERANCE_SECONDS = 300;
const STRIPE_API_VERSION = '2025-05-28.basil';

const SYNCED_EVENT_TYPES = new Set([
  'checkout.session.completed',
  'customer.subscription.updated',
  'customer.subscription.deleted',
  'invoice.payment_failed',
]);

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === '/api/webhooks/stripe') {
      return handleStripeWebhook(request, env);
    }

    if (env.ASSETS) {
      return env.ASSETS.fetch(request);
    }

    return new Response('Not found', { status: 404 });
  },
};

export async function handleStripeWebhook(request, env, deps = {}) {
  try {
    return await handleStripeWebhookUnchecked(request, env, deps);
  } catch (error) {
    if (error instanceof WebhookError) {
      return jsonResponse({ error: error.message }, error.status);
    }
    throw error;
  }
}

async function handleStripeWebhookUnchecked(request, env, deps = {}) {
  if (request.method !== 'POST') {
    return jsonResponse({ error: 'method_not_allowed' }, 405, {
      Allow: 'POST',
    });
  }

  assertRequiredEnv(env, [
    'STRIPE_WEBHOOK_SECRET',
    'STRIPE_SECRET_KEY',
    'SUPABASE_URL',
    'SUPABASE_SERVICE_ROLE_KEY',
  ]);

  const rawBody = await request.text();
  const signature = request.headers.get('stripe-signature');
  const event = await constructStripeEvent(rawBody, signature, env.STRIPE_WEBHOOK_SECRET, deps.now);

  if (!SYNCED_EVENT_TYPES.has(event.type)) {
    return jsonResponse({ received: true, ignored: true });
  }

  const stored = await insertWebhookEvent(env, event, rawBody, deps.fetch);
  if (stored.duplicate) {
    return jsonResponse({ received: true, duplicate: true });
  }

  try {
    await syncStripeEvent(env, event, deps.fetch);
    await markWebhookEventProcessed(env, event.id, deps.fetch);
    return jsonResponse({ received: true });
  } catch (error) {
    await markWebhookEventFailed(env, event.id, String(error && error.message ? error.message : error), deps.fetch);
    throw error;
  }
}

export async function constructStripeEvent(rawBody, signatureHeader, webhookSecret, now = () => Date.now()) {
  if (!signatureHeader) {
    throw new WebhookError('missing_stripe_signature', 400);
  }

  const parsed = parseStripeSignatureHeader(signatureHeader);
  if (!parsed.timestamp || parsed.signatures.length === 0) {
    throw new WebhookError('invalid_stripe_signature_header', 400);
  }

  const ageSeconds = Math.abs(Math.floor(now() / 1000) - parsed.timestamp);
  if (ageSeconds > STRIPE_SIGNATURE_TOLERANCE_SECONDS) {
    throw new WebhookError('stale_stripe_signature', 400);
  }

  const signedPayload = `${parsed.timestamp}.${rawBody}`;
  const expected = await hmacSha256Hex(webhookSecret, signedPayload);
  const verified = parsed.signatures.some((signature) => timingSafeEqualHex(signature, expected));

  if (!verified) {
    throw new WebhookError('invalid_stripe_signature', 400);
  }

  try {
    return JSON.parse(rawBody);
  } catch {
    throw new WebhookError('invalid_json_payload', 400);
  }
}

export function parseStripeSignatureHeader(header) {
  return header.split(',').reduce(
    (acc, item) => {
      const [key, value] = item.split('=');
      if (key === 't') {
        acc.timestamp = Number(value);
      } else if (key === 'v1' && value) {
        acc.signatures.push(value);
      }
      return acc;
    },
    { timestamp: null, signatures: [] },
  );
}

export async function syncStripeEvent(env, event, fetchImpl = fetch) {
  switch (event.type) {
    case 'checkout.session.completed':
      return syncCheckoutSessionCompleted(env, event.data.object, fetchImpl);
    case 'customer.subscription.updated':
    case 'customer.subscription.deleted':
      return syncSubscriptionObject(env, event.data.object, fetchImpl);
    case 'invoice.payment_failed':
      return syncInvoicePaymentFailed(env, event.data.object, fetchImpl);
    default:
      return undefined;
  }
}

export function subscriptionRecordFromStripe(subscription, fallbackUserId) {
  const userId = subscription.metadata?.user_id
    || subscription.metadata?.supabase_user_id
    || subscription.metadata?.morphix_user_id
    || fallbackUserId;

  if (!userId) {
    throw new Error(`Missing user id metadata for Stripe subscription ${subscription.id}`);
  }

  return {
    user_id: userId,
    stripe_customer_id: asStripeId(subscription.customer),
    stripe_subscription_id: subscription.id,
    status: normalizeSubscriptionStatus(subscription.status),
    current_period_end: subscription.current_period_end
      ? new Date(subscription.current_period_end * 1000).toISOString()
      : null,
  };
}

async function syncCheckoutSessionCompleted(env, session, fetchImpl) {
  if (session.mode && session.mode !== 'subscription') {
    return;
  }

  const userId = session.metadata?.user_id
    || session.metadata?.supabase_user_id
    || session.metadata?.morphix_user_id
    || session.client_reference_id;

  if (!session.subscription) {
    throw new Error(`Checkout session ${session.id} is missing subscription id`);
  }

  const subscription = await fetchStripeSubscription(env, asStripeId(session.subscription), fetchImpl);
  const record = subscriptionRecordFromStripe(subscription, userId);
  await upsertSubscriptionByUser(env, record, fetchImpl);
}

async function syncSubscriptionObject(env, subscription, fetchImpl) {
  const existing = await findSubscriptionByStripeId(env, subscription.id, fetchImpl);
  const fallbackUserId = existing?.user_id;
  const record = subscriptionRecordFromStripe(subscription, fallbackUserId);
  await upsertSubscriptionByUser(env, record, fetchImpl);
}

async function syncInvoicePaymentFailed(env, invoice, fetchImpl) {
  const subscriptionId = asStripeId(invoice.subscription);
  if (!subscriptionId) {
    return;
  }

  const subscription = await fetchStripeSubscription(env, subscriptionId, fetchImpl);
  const existing = await findSubscriptionByStripeId(env, subscription.id, fetchImpl);
  const record = subscriptionRecordFromStripe(subscription, existing?.user_id);

  await upsertSubscriptionByUser(env, {
    ...record,
    status: record.status === 'active' || record.status === 'trialing' ? 'past_due' : record.status,
  }, fetchImpl);
}

async function fetchStripeSubscription(env, subscriptionId, fetchImpl) {
  const response = await fetchImpl(`https://api.stripe.com/v1/subscriptions/${encodeURIComponent(subscriptionId)}`, {
    headers: {
      Authorization: `Bearer ${env.STRIPE_SECRET_KEY}`,
      'Stripe-Version': STRIPE_API_VERSION,
    },
  });

  if (!response.ok) {
    throw new Error(`Stripe subscription fetch failed: ${response.status}`);
  }

  return response.json();
}

async function insertWebhookEvent(env, event, rawBody, fetchImpl = fetch) {
  const response = await supabaseFetch(env, '/rest/v1/stripe_webhook_events', {
    method: 'POST',
    headers: {
      Prefer: 'return=minimal',
    },
    body: JSON.stringify({
      event_id: event.id,
      event_type: event.type,
      stripe_created_at: event.created ? new Date(event.created * 1000).toISOString() : null,
      payload: safeJsonParse(rawBody),
      processing_status: 'processing',
    }),
  }, fetchImpl);

  if (response.status === 409) {
    return { duplicate: true };
  }

  await assertOk(response, 'Supabase webhook event insert failed');
  return { duplicate: false };
}

async function markWebhookEventProcessed(env, eventId, fetchImpl = fetch) {
  const response = await supabaseFetch(
    env,
    `/rest/v1/stripe_webhook_events?event_id=eq.${encodeURIComponent(eventId)}`,
    {
      method: 'PATCH',
      headers: {
        Prefer: 'return=minimal',
      },
      body: JSON.stringify({
        processing_status: 'processed',
        processed_at: new Date().toISOString(),
        processing_error: null,
      }),
    },
    fetchImpl,
  );
  await assertOk(response, 'Supabase webhook event processed update failed');
}

async function markWebhookEventFailed(env, eventId, errorMessage, fetchImpl = fetch) {
  const response = await supabaseFetch(
    env,
    `/rest/v1/stripe_webhook_events?event_id=eq.${encodeURIComponent(eventId)}`,
    {
      method: 'PATCH',
      headers: {
        Prefer: 'return=minimal',
      },
      body: JSON.stringify({
        processing_status: 'failed',
        processing_error: errorMessage.slice(0, 2000),
      }),
    },
    fetchImpl,
  );
  await assertOk(response, 'Supabase webhook event failure update failed');
}

async function findSubscriptionByStripeId(env, stripeSubscriptionId, fetchImpl = fetch) {
  const response = await supabaseFetch(
    env,
    `/rest/v1/subscriptions?stripe_subscription_id=eq.${encodeURIComponent(stripeSubscriptionId)}&select=user_id,stripe_subscription_id`,
    {
      method: 'GET',
    },
    fetchImpl,
  );
  await assertOk(response, 'Supabase subscription lookup failed');
  const rows = await response.json();
  return rows[0] || null;
}

async function upsertSubscriptionByUser(env, record, fetchImpl = fetch) {
  const response = await supabaseFetch(env, '/rest/v1/subscriptions?on_conflict=user_id', {
    method: 'POST',
    headers: {
      Prefer: 'resolution=merge-duplicates,return=minimal',
    },
    body: JSON.stringify(record),
  }, fetchImpl);
  await assertOk(response, 'Supabase subscription upsert failed');
}

async function supabaseFetch(env, path, options, fetchImpl) {
  const url = env.SUPABASE_URL.replace(/\/$/, '') + path;
  const headers = new Headers(options.headers || {});
  headers.set('apikey', env.SUPABASE_SERVICE_ROLE_KEY);
  headers.set('Authorization', `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`);
  headers.set('Content-Type', 'application/json');

  return fetchImpl(url, {
    ...options,
    headers,
  });
}

async function assertOk(response, message) {
  if (!response.ok) {
    const body = await response.text().catch(() => '');
    throw new Error(`${message}: ${response.status}${body ? ` ${body}` : ''}`);
  }
}

function assertRequiredEnv(env, keys) {
  const missing = keys.filter((key) => !env[key]);
  if (missing.length > 0) {
    throw new WebhookError(`missing_env:${missing.join(',')}`, 500);
  }
}

function normalizeSubscriptionStatus(status) {
  const allowed = new Set([
    'trialing',
    'active',
    'past_due',
    'canceled',
    'incomplete',
    'incomplete_expired',
    'unpaid',
    'paused',
  ]);
  return allowed.has(status) ? status : 'incomplete';
}

function asStripeId(value) {
  if (!value) return null;
  if (typeof value === 'string') return value;
  return value.id || null;
}

function safeJsonParse(rawBody) {
  try {
    return JSON.parse(rawBody);
  } catch {
    return { raw: rawBody };
  }
}

async function hmacSha256Hex(secret, payload) {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const signature = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(payload));
  return bytesToHex(new Uint8Array(signature));
}

function timingSafeEqualHex(left, right) {
  const leftBytes = hexToBytes(left);
  const rightBytes = hexToBytes(right);
  if (!leftBytes || !rightBytes || leftBytes.length !== rightBytes.length) {
    return false;
  }

  let diff = 0;
  for (let i = 0; i < leftBytes.length; i += 1) {
    diff |= leftBytes[i] ^ rightBytes[i];
  }
  return diff === 0;
}

function hexToBytes(hex) {
  if (!/^[0-9a-f]+$/i.test(hex) || hex.length % 2 !== 0) {
    return null;
  }
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < bytes.length; i += 1) {
    bytes[i] = Number.parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  }
  return bytes;
}

function bytesToHex(bytes) {
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('');
}

function jsonResponse(body, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...extraHeaders,
    },
  });
}

class WebhookError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}
