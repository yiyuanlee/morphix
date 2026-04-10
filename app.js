/* =====================================================
   FitAI — Main Application Logic
   ===================================================== */

// ── State ─────────────────────────────────────────────
let state = {
  gender: 'male',
  dailyTime: 45,
  frequency: 4,
  goal: 'balance',
  level: 'beginner'
};

// ── Selector Helpers ──────────────────────────────────
function selectGender(g) {
  state.gender = g;
  document.querySelectorAll('.gender-btn').forEach(b => b.classList.toggle('active', b.dataset.gender === g));
}

function selectFrequency(d) {
  state.frequency = d;
  document.querySelectorAll('.freq-btn').forEach(b => b.classList.toggle('active', parseInt(b.dataset.days) === d));
}

function selectGoal(g) {
  state.goal = g;
  document.querySelectorAll('.goal-btn').forEach(b => b.classList.toggle('active', b.dataset.goal === g));
}

function selectLevel(l) {
  state.level = l;
  document.querySelectorAll('.level-btn').forEach(b => b.classList.toggle('active', b.dataset.level === l));
}

function updateTimeDisplay(val) {
  state.dailyTime = parseInt(val);
  document.getElementById('timeDisplay').textContent = `${val} 分钟 / 天`;
  // Update slider fill
  const slider = document.getElementById('dailyTime');
  const min = parseInt(slider.min), max = parseInt(slider.max);
  const pct = ((val - min) / (max - min)) * 100;
  slider.style.background = `linear-gradient(90deg, #00d4ff ${pct}%, rgba(255,255,255,0.1) ${pct}%)`;
}

// ── Validation ────────────────────────────────────────
function validateInputs(height, age, current, target) {
  const errors = [];
  if (!height || height < 100 || height > 250) errors.push('请输入有效身高（100–250 cm）');
  if (!age || age < 15 || age > 80) errors.push('请输入有效年龄（15–80 岁）');
  if (!current || current < 30 || current > 300) errors.push('请输入有效当前体重（30–300 kg）');
  if (!target || target < 30 || target > 300) errors.push('请输入有效目标体重（30–300 kg）');
  return errors;
}

// ── Calculations ──────────────────────────────────────
function calcBMI(weight, height) {
  const h = height / 100;
  return (weight / (h * h)).toFixed(1);
}

function getBMICategory(bmi) {
  if (bmi < 18.5) return { label: '偏轻', cls: 'underweight', pct: (bmi / 18.5) * 25 };
  if (bmi < 25)   return { label: '正常', cls: 'normal',      pct: 25 + ((bmi - 18.5) / 6.5) * 30 };
  if (bmi < 30)   return { label: '超重', cls: 'overweight',  pct: 55 + ((bmi - 25) / 5) * 25 };
  return { label: '肥胖', cls: 'obese', pct: Math.min(100, 80 + ((bmi - 30) / 10) * 20) };
}

// BMR using Mifflin-St Jeor
function calcBMR(weight, height, age, gender) {
  const base = 10 * weight + 6.25 * height - 5 * age;
  return gender === 'male' ? base + 5 : base - 161;
}

// TDEE based on activity
function calcTDEE(bmr, daysPerWeek) {
  const factors = { 3: 1.375, 4: 1.55, 5: 1.55, 6: 1.725, 7: 1.9 };
  return Math.round(bmr * (factors[daysPerWeek] || 1.55));
}

// Calories burned estimate per session
function calcCaloriesBurned(weight, minutes, goal) {
  const metMap = { lose: 8, balance: 6.5, gain: 5 };
  return Math.round((metMap[goal] * weight * 3.5 / 200) * minutes);
}

// Weekly deficit/surplus for losing/gaining ~0.5kg
function targetCalories(tdee, mode) {
  if (mode === 'lose')    return Math.max(tdee - 500, 1200);
  if (mode === 'gain')    return tdee + 300;
  return tdee;
}

// Estimate weeks
function estimateWeeks(currentWeight, targetWeight, mode, daysPerWeek, dailyMinutes) {
  const diff = Math.abs(targetWeight - currentWeight);
  if (diff < 0.5) return 0;
  const kgPerWeek = mode === 'lose' ? 0.4 : mode === 'gain' ? 0.25 : 0.3;
  return Math.ceil(diff / kgPerWeek);
}

// ── Plan Database ─────────────────────────────────────
const PLAN_TEMPLATES = {
  beginner: {
    lose: [
      { type: '有氧+基础力量', exercises: '快走/骑车 + 深蹲 3×12 + 弓步 3×10 + 俯卧撑 3×8' },
      { type: '全身有氧', exercises: '跳绳/慢跑 + 平板支撑 3×30s + 腹部卷腹 3×15' },
      { type: '核心+有氧', exercises: 'HIIT 训练（20分钟）+ 核心强化 + 拉伸放松' },
      { type: '低强度有氧', exercises: '快走 + 瑜伽/拉伸（保持活跃，促进恢复）' },
    ],
    balance: [
      { type: '上肢力量', exercises: '哑铃弯举 3×12 + 俯卧撑 4×10 + 肩推 3×12 + 平板支撑 3×30s' },
      { type: '下肢力量', exercises: '深蹲 4×12 + 弓步 3×10 + 罗马尼亚硬拉 3×12 + 小腿提踵 3×15' },
      { type: '有氧+核心', exercises: '慢跑 20分钟 + 核心训练 + 全身拉伸' },
      { type: '全身功能训练', exercises: '波比跳 3×8 + 登山者 3×20 + 深蹲跳 3×10 + 冷却拉伸' },
    ],
    gain: [
      { type: '上肢推力', exercises: '哑铃卧推 4×10 + 肩部推举 3×12 + 三头肌撑 3×12 + 侧平举 3×12' },
      { type: '下肢训练', exercises: '杠铃深蹲 4×8 + 腿举 3×12 + 腿弯举 3×12 + 小腿提踵 4×15' },
      { type: '上肢拉力', exercises: '哑铃划船 4×10 + 二头肌弯举 3×12 + 面拉 3×15' },
      { type: '恢复+拉伸', exercises: '轻量有氧 15分钟 + 泡沫轴放松 + 全身拉伸' },
    ]
  },
  intermediate: {
    lose: [
      { type: 'HIIT + 力量', exercises: 'HIIT 25分钟 + 深蹲 4×15 + 硬拉 4×10 + 核心训练' },
      { type: '推力日', exercises: '哑铃卧推 4×12 + 哑铃肩推 4×10 + 绳索下压 3×15 + HIIT 15分钟' },
      { type: '拉力日', exercises: '哑铃划船 4×12 + 反向划船 3×12 + 弯举 3×15 + 有氧 20分钟' },
      { type: '腿+有氧', exercises: '深蹲 5×10 + 弓步 4×12 + 臀桥 3×15 + 跑步机 20分钟' },
      { type: '代谢训练', exercises: '循环训练（短暂休息）+ 波比跳+深蹲跳+登山者+跳绳' },
    ],
    balance: [
      { type: '胸+三头', exercises: '哑铃卧推 4×10 + 上斜推 3×12 + 绳索飞鸟 3×15 + 撑体 3×12' },
      { type: '背+二头', exercises: '引体向上/辅助 4×8 + 哑铃划船 4×10 + 锤式弯举 3×12' },
      { type: '腿日', exercises: '深蹲 5×10 + 腿举 4×12 + 罗马尼亚硬拉 3×10 + 提踵 4×15' },
      { type: '肩+核心', exercises: '军事推举 4×10 + 侧平举 3×15 + 前平举 3×12 + 核心训练 20分钟' },
      { type: '有氧+恢复', exercises: '中强度有氧 30分钟 + 泡沫轴+ 拉伸 20分钟' },
    ],
    gain: [
      { type: '胸+三头（推）', exercises: '哑铃卧推 5×8 + 上斜推 4×10 + 绳索飞鸟 3×12 + 臂屈伸 4×10' },
      { type: '背+二头（拉）', exercises: '引体向上 4×6-8 + 杠铃划船 4×8 + 二头弯举 4×10 + 面拉 3×15' },
      { type: '腿+臀', exercises: '深蹲 5×8 + 前蹲 3×8 + 罗马尼亚硬拉 4×8 + 腿举 3×10' },
      { type: '肩+核心', exercises: '推举 4×8 + 侧平举 4×12 + 俯立飞鸟 3×12 + 核心训练' },
      { type: '全身+弱点训练', exercises: '小肌群补强 + 轻量有氧 15分钟 + 充分拉伸' },
    ]
  },
  advanced: {
    lose: [
      { type: '力量+HIIT 超组', exercises: '深蹲超组 HIIT + 硬拉 + 高强度间歇跑（4×4 分法）' },
      { type: '上肢力量+有氧', exercises: '卧推 5×5 + 划船 5×5 + 推举 4×6 + 有氧 20分钟' },
      { type: '代谢综合训练', exercises: '循环推拉腿（无休息） + 战绳/划船机 15分钟' },
      { type: '腿日+核心', exercises: '深蹲 6×5 + 前蹲 4×5 + 早安式 3×10 + 核心强化 20分钟' },
      { type: '运动成就+有氧', exercises: '技术练习 + 中强度稳态有氧 40分钟 + 拉伸' },
      { type: '主动恢复', exercises: '瑜伽/游泳 + 深度拉伸 + 冷热水交替淋浴' },
    ],
    balance: [
      { type: '推（胸肩三头）', exercises: '平板推 5×5 + 上斜推 4×8 + 肩推 4×8 + 绳索 3×12' },
      { type: '拉（背二头）', exercises: '杠铃硬拉 4×5 + 引体 4×8 + 划船 4×8 + 弯举 3×10' },
      { type: '腿（股四+腘绳）', exercises: '深蹲 5×5 + 前蹲 3×5 + 保加利亚分腿 3×8 + 腿弯 3×10' },
      { type: '推2（辅助肌群）', exercises: '上斜飞鸟 4×12 + 绳索推 3×15 + 侧平举 4×12 + 前平举 3×12' },
      { type: '拉2+臀', exercises: '宽握引体 3×8 + 单臂划船 3×10 + 臀桥 4×10 + 弯举 3×12' },
      { type: '运动能力+恢复', exercises: '爆发力训练（跳跃/投掷）+ 轻量有氧 + 拉伸' },
    ],
    gain: [
      { type: '推（大重量）', exercises: '平板推 6×4-5 + 上斜哑铃推 4×6-8 + 三头撑 4×8-10' },
      { type: '拉（大重量）', exercises: '杠铃硬拉 5×4-5 + 引体 5×6-8 + 划船 4×6-8' },
      { type: '腿（大重量）', exercises: '深蹲 6×4-5 + 前蹲 3×5 + 罗马尼亚硬拉 4×6 + 提踵 5×12' },
      { type: '推（中重量辅助）', exercises: '哑铃推 4×10 + 绳索飞鸟 4×12 + 侧平举 4×15 + 三头综合' },
      { type: '拉（中重量辅助）', exercises: '单臂划船 4×10 + 反向飞鸟 4×12 + 二头综合 4×10' },
      { type: '腿2+恢复', exercises: '腿举 4×10 + 腿弯 4×10 + 提踵 5×12 + 全身拉伸' },
    ]
  }
};

const NUTRITION_TIPS = {
  lose: [
    '保持蛋白质摄入量在体重(kg) × 1.6g 以上，防止肌肉流失',
    '避免精制碳水（白面包、含糖饮料），选择全谷物与蔬菜',
    '每餐保持蛋白质 + 蔬菜 + 优质脂肪的组合',
    '睡前 2-3 小时停止进食，有助于脂肪代谢',
    '每天饮水 2-3L，饮水有助于控制食欲',
    '间歇性断食（16:8）可辅助加速减脂效果'
  ],
  balance: [
    '每天蛋白质摄入：体重(kg) × 1.8g，助力塑形',
    '训练前 1-1.5 小时摄入含碳水的食物提供能量',
    '训练后 30 分钟内摄入蛋白质 + 碳水，加速恢复',
    '控制加工食品，增加天然食材比例',
    '合理补充 Omega-3（三文鱼、坚果），减少炎症'
  ],
  gain: [
    '每天热量盈余 250-500 kcal，干净增肌',
    '蛋白质需求：体重(kg) × 2-2.2g，达到肌肉合成需求',
    '碳水化合物是训练燃料，不要过度削减',
    '训练后摄入快速蛋白（乳清蛋白）+ 高GI碳水',
    '每天保证 8 小时以上的优质睡眠，促进生长激素分泌',
    '可考虑补充肌酸（3-5g/天），科学增强力量与肌肉'
  ]
};

// ── Generate Plan ─────────────────────────────────────
function generatePlan() {
  const height = parseFloat(document.getElementById('height').value);
  const age = parseFloat(document.getElementById('age').value);
  const currentWeight = parseFloat(document.getElementById('currentWeight').value);
  const targetWeight = parseFloat(document.getElementById('targetWeight').value);

  const errors = validateInputs(height, age, currentWeight, targetWeight);
  if (errors.length > 0) {
    showError(errors);
    return;
  }

  // Loading animation
  const btn = document.getElementById('generateBtn');
  btn.classList.add('loading');
  btn.disabled = true;
  btn.querySelector('.btn-text').textContent = '正在生成计划';

  setTimeout(() => {
    btn.classList.remove('loading');
    btn.disabled = false;
    btn.querySelector('.btn-text').textContent = '重新生成计划';

    renderResults(height, age, currentWeight, targetWeight);
  }, 1200);
}

function showError(errors) {
  const panel = document.getElementById('resultsPanel');
  const placeholder = document.getElementById('resultsPlaceholder');
  const content = document.getElementById('resultsContent');

  content.style.display = 'none';
  placeholder.style.display = 'flex';
  placeholder.innerHTML = `
    <div class="placeholder-icon">⚠️</div>
    <p style="color: #ef4444;">${errors.join('<br/>')}</p>
    <p style="font-size:0.8rem; margin-top:8px;">请修正以上信息后重试</p>
  `;
}

function renderResults(height, age, currentWeight, targetWeight) {
  const { gender, dailyTime, frequency, goal, level } = state;

  const bmi = parseFloat(calcBMI(currentWeight, height));
  const bmiCat = getBMICategory(bmi);
  const bmr = calcBMR(currentWeight, height, age, gender);
  const tdee = calcTDEE(bmr, frequency);
  const targetCal = targetCalories(tdee, goal);
  const proteinG = Math.round(currentWeight * (goal === 'gain' ? 2.1 : goal === 'lose' ? 1.8 : 1.9));
  const carbG = Math.round((targetCal * 0.45) / 4);
  const fatG = Math.round((targetCal * 0.25) / 9);
  const calBurned = calcCaloriesBurned(currentWeight, dailyTime, goal);
  const weeks = estimateWeeks(currentWeight, targetWeight, goal === 'balance' ? 'lose' : goal, frequency, dailyTime);

  const weightDiff = (targetWeight - currentWeight).toFixed(1);
  const direction = targetWeight < currentWeight ? '减' : targetWeight > currentWeight ? '增' : '维持';

  // Select right plan
  const planDays = PLAN_TEMPLATES[level][goal];
  const scheduleDays = buildSchedule(planDays, frequency);

  // Nutrition tips
  const tips = NUTRITION_TIPS[goal];

  // Ideal BMI weight range
  const heightM = height / 100;
  const idealMin = (18.5 * heightM * heightM).toFixed(1);
  const idealMax = (24.9 * heightM * heightM).toFixed(1);

  const html = `
    <div class="result-header">
      <div class="result-greeting">你的个性化健身计划已生成 ✨</div>
      <div class="result-title">${getGoalLabel(goal)} · ${getLevelLabel(level)} 方案</div>
    </div>

    <!-- BMI Card -->
    <div class="bmi-card">
      <div class="bmi-row">
        <span class="bmi-label">BMI 指数</span>
        <span class="bmi-value bmi-${bmiCat.cls}">${bmi}</span>
        <span class="bmi-status status-${bmiCat.cls}">${bmiCat.label}</span>
      </div>
      <div style="font-size:0.72rem; color: var(--text-muted); margin-bottom:8px;">
        健康 BMI 范围：18.5–24.9 · 对应体重 ${idealMin}–${idealMax} kg
      </div>
      <div class="bmi-bar-wrap">
        <div class="bmi-bar" id="bmiBar" style="width: 0%; background: var(--gradient-primary);"></div>
      </div>
    </div>

    <!-- Key Metrics -->
    <div class="metrics-grid">
      <div class="metric-card">
        <div class="metric-icon">🎯</div>
        <div class="metric-value">${Math.abs(weightDiff)} kg</div>
        <div class="metric-label">需${direction}体重</div>
      </div>
      <div class="metric-card">
        <div class="metric-icon">📅</div>
        <div class="metric-value">${weeks > 0 ? weeks + ' 周' : '已达标'}</div>
        <div class="metric-label">预计达成时间</div>
      </div>
      <div class="metric-card">
        <div class="metric-icon">🔥</div>
        <div class="metric-value">${targetCal}</div>
        <div class="metric-label">每日目标热量 (kcal)</div>
      </div>
      <div class="metric-card">
        <div class="metric-icon">⚡</div>
        <div class="metric-value">${calBurned}</div>
        <div class="metric-label">每次消耗热量 (kcal)</div>
      </div>
    </div>

    <!-- Training Schedule -->
    <div class="plan-block">
      <div class="plan-block-header">🏋️ 每周训练计划（${frequency} 天 / 周 · ${dailyTime} 分钟 / 天）</div>
      <div class="plan-block-body">
        ${scheduleDays}
      </div>
    </div>

    <!-- Nutrition -->
    <div class="plan-block">
      <div class="plan-block-header">🥗 每日营养目标</div>
      <div class="plan-block-body">
        <div class="nutrition-item">
          <span class="nutrition-name">💪 蛋白质</span>
          <span class="nutrition-val">${proteinG}g / 天</span>
        </div>
        <div class="nutrition-item">
          <span class="nutrition-name">⚡ 碳水化合物</span>
          <span class="nutrition-val">${carbG}g / 天</span>
        </div>
        <div class="nutrition-item">
          <span class="nutrition-name">🥑 健康脂肪</span>
          <span class="nutrition-val">${fatG}g / 天</span>
        </div>
        <div class="nutrition-item">
          <span class="nutrition-name">🔥 每日总热量</span>
          <span class="nutrition-val">${targetCal} kcal</span>
        </div>
        <div class="nutrition-item">
          <span class="nutrition-name">📊 基础代谢率 (BMR)</span>
          <span class="nutrition-val">${Math.round(bmr)} kcal</span>
        </div>
      </div>
    </div>

    <!-- Tips -->
    <div class="plan-block">
      <div class="plan-block-header">💡 营养 & 生活建议</div>
      <div class="plan-block-body">
        <ul class="tips-list">
          ${tips.map(t => `<li>${t}</li>`).join('')}
        </ul>
      </div>
    </div>

    <div class="result-warning">
      ⚠️ 此计划基于运动科学算法生成，仅供参考。如有特殊健康状况，请在开始训练前咨询专业医师或私人教练。
    </div>
  `;

  const placeholder = document.getElementById('resultsPlaceholder');
  const content = document.getElementById('resultsContent');
  const panel = document.getElementById('resultsPanel');

  placeholder.style.display = 'none';
  panel.style.alignItems = 'flex-start';
  content.style.display = 'flex';
  content.innerHTML = html;

  // Animate BMI bar
  setTimeout(() => {
    const bar = document.getElementById('bmiBar');
    if (bar) bar.style.width = `${Math.min(bmiCat.pct, 100)}%`;
  }, 200);

  // Scroll to results on mobile
  if (window.innerWidth <= 1024) {
    document.getElementById('resultsPanel').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

function buildSchedule(planDays, frequency) {
  const dayNames = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
  const restDays = 7 - frequency;

  // Distribute rest days evenly
  const schedule = [];
  let trainingIdx = 0;
  let restCount = 0;

  for (let i = 0; i < 7; i++) {
    const remaining = 7 - i;
    const trainingRemaining = frequency - trainingIdx;
    const restRemaining = restDays - restCount;

    if (trainingRemaining === 0) {
      schedule.push({ day: dayNames[i], rest: true });
      restCount++;
    } else if (restRemaining === 0) {
      schedule.push({ day: dayNames[i], plan: planDays[trainingIdx % planDays.length], rest: false });
      trainingIdx++;
    } else {
      // Alternate to spread rest days
      if (trainingIdx > 0 && trainingIdx % 2 === 0 && restCount < restDays) {
        schedule.push({ day: dayNames[i], rest: true });
        restCount++;
      } else {
        schedule.push({ day: dayNames[i], plan: planDays[trainingIdx % planDays.length], rest: false });
        trainingIdx++;
      }
    }
  }

  return schedule.map((s, idx) => `
    <div class="schedule-day">
      <div class="day-badge">${s.day}</div>
      <div class="day-info">
        <div class="day-title">${s.rest ? '🛌 休息恢复' : `🏃 ${s.plan.type}`}</div>
        <div class="day-detail">${s.rest ? '主动恢复：散步 / 拉伸 / 充足睡眠' : s.plan.exercises}</div>
      </div>
    </div>
  `).join('');
}

function getGoalLabel(g) {
  return { lose: '减脂燃脂', balance: '塑形均衡', gain: '增肌增重' }[g] || '';
}
function getLevelLabel(l) {
  return { beginner: '新手', intermediate: '进阶', advanced: '高级' }[l] || '';
}

// ── Navbar Scroll Effect ───────────────────────────────
window.addEventListener('scroll', () => {
  const navbar = document.getElementById('navbar');
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// ── Intersection Observer for Animations ──────────────
const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.fade-in').forEach(el => io.observe(el));

// Stagger feature cards
document.querySelectorAll('.feature-card').forEach((card, i) => {
  const delay = parseInt(card.dataset.delay || 0);
  card.style.animationDelay = `${delay}ms`;
  io.observe(card);
});

// ── Particle Canvas ────────────────────────────────────
(function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  const ctx = canvas.getContext('2d');
  let particles = [];
  let animFrame;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  function createParticle() {
    return {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      size: Math.random() * 2 + 0.5,
      alpha: Math.random() * 0.5 + 0.1,
      color: Math.random() > 0.5 ? '0, 212, 255' : '168, 85, 247'
    };
  }

  for (let i = 0; i < 60; i++) particles.push(createParticle());

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width) p.x = 0;
      if (p.y < 0) p.y = canvas.height;
      if (p.y > canvas.height) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.color}, ${p.alpha})`;
      ctx.fill();
    });

    // Draw connections
    particles.forEach((p, i) => {
      particles.slice(i + 1).forEach(q => {
        const dx = p.x - q.x, dy = p.y - q.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = `rgba(0, 212, 255, ${0.08 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      });
    });

    animFrame = requestAnimationFrame(animate);
  }
  animate();
})();

// ── Init Slider Fill ───────────────────────────────────
updateTimeDisplay(45);

// ── Smooth scroll for nav links ───────────────────────
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});
