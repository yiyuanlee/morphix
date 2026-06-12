import assert from 'node:assert/strict';
import { createHmac, webcrypto } from 'node:crypto';
import test from 'node:test';
import {
  constructStripeEvent,
  parseStripeSignatureHeader,
  subscriptionRecordFromStripe,
} from '../worker.mjs';

if (!globalThis.crypto) {
  globalThis.crypto = webcrypto;
}

function signedHeader(payload, secret, timestamp = Math.floor(Date.now() / 1000)) {
  const signature = createHmac('sha256', secret)
    .update(`${timestamp}.${payload}`)
    .digest('hex');
  return `t=${timestamp},v1=${signature}`;
}

test('constructStripeEvent verifies a valid Stripe signature', async () => {
  const secret = 'whsec_test_secret';
  const timestamp = 1_800_000_000;
  const payload = JSON.stringify({
    id: 'evt_123',
    type: 'customer.subscription.updated',
    data: { object: { id: 'sub_123' } },
  });

  const event = await constructStripeEvent(
    payload,
    signedHeader(payload, secret, timestamp),
    secret,
    () => timestamp * 1000,
  );

  assert.equal(event.id, 'evt_123');
});

test('constructStripeEvent rejects a tampered payload', async () => {
  const secret = 'whsec_test_secret';
  const timestamp = 1_800_000_000;
  const payload = JSON.stringify({ id: 'evt_123', type: 'invoice.payment_failed' });
  const tamperedPayload = JSON.stringify({ id: 'evt_999', type: 'invoice.payment_failed' });

  await assert.rejects(
    () => constructStripeEvent(
      tamperedPayload,
      signedHeader(payload, secret, timestamp),
      secret,
      () => timestamp * 1000,
    ),
    /invalid_stripe_signature/,
  );
});

test('parseStripeSignatureHeader keeps multiple v1 signatures', () => {
  assert.deepEqual(parseStripeSignatureHeader('t=123,v1=aaa,v0=old,v1=bbb'), {
    timestamp: 123,
    signatures: ['aaa', 'bbb'],
  });
});

test('subscriptionRecordFromStripe maps Stripe subscriptions to Supabase rows', () => {
  const record = subscriptionRecordFromStripe({
    id: 'sub_123',
    customer: { id: 'cus_123' },
    status: 'active',
    current_period_end: 1_800_000_000,
    metadata: { user_id: '00000000-0000-0000-0000-000000000001' },
  });

  assert.deepEqual(record, {
    user_id: '00000000-0000-0000-0000-000000000001',
    stripe_customer_id: 'cus_123',
    stripe_subscription_id: 'sub_123',
    status: 'active',
    current_period_end: '2027-01-15T08:00:00.000Z',
  });
});

test('subscriptionRecordFromStripe requires a user id source', () => {
  assert.throws(
    () => subscriptionRecordFromStripe({
      id: 'sub_missing_user',
      customer: 'cus_123',
      status: 'active',
      current_period_end: null,
      metadata: {},
    }),
    /Missing user id metadata/,
  );
});
