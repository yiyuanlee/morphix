/* =====================================================
   Morphix — Main Application Logic
   ===================================================== */

// ── State ─────────────────────────────────────────────
let state = {
  gender: 'male',
  dailyTime: 45,
  frequency: 4,
  goal: 'balance',
  intensity: 'balanced',
  level: 'beginner',
  lang: 'zh'
};

// ── i18n Translations ─────────────────────────────────
const i18n = {
  zh: {
    navFeatures: '功能', navCalc: '开始计划', navHow: '原理', navCta: '立即开始',
    heroBadge: 'AI 驱动·个性化定制',
    heroTitle1: '打造', heroTitle2: '专属你的', heroTitle3: '智能健身计划',
    heroSub: '输入你的身体数据和目标，Morphix 将为你生成科学的训练计划、营养建议与时间规划，高效开启健康生活。',
    heroCta: '立即定制我的计划', heroGhost: '了解原理',
    statBmi: 'BMI 评估', statCustom: '定制方案', statPlan: '目标规划',
    featuresTag: '核心功能', featuresTitle: '一切你需要的，都在这里',
    f1Title: '智能计划生成', f1Desc: '根据你的数据自动生成每日训练安排，涵盖有氧、力量与柔韧性训练。',
    f2Title: 'BMI 健康评估', f2Desc: '精准计算 BMI 并给出健康状况评估，了解你的当前体型与目标差距。',
    f3Title: '目标时间预测', f3Desc: '基于你的训练强度和生理数据，科学预测达成目标体重所需时间。',
    f4Title: '营养饮食建议', f4Desc: '根据目标提供每日卡路里摄入建议和蛋白质配比，助力高效塑形。',
    f5Title: '个性化适配',   f5Desc: '考虑训练时间效率，计划适配健身新手到进阶用户的不同需求。',
    f6Title: '科学依据支撑', f6Desc: '计划基于运动科学和营养学原理，安全、高效、可持续。',
    howTag: '使用流程', howTitle: '三步开启健身之旅',
    step1Title: '输入你的数据', step1Desc: '填写身高、体重、目标体重和每天可用于健身的时间。',
    step2Title: 'AI 分析评估', step2Desc: '系统分析你的 BMI、体重差距，计算每周健康减重/增重目标。',
    step3Title: '获取专属计划', step3Desc: '获得完整的训练计划、营养建议和达成目标的预计时间表。',
    calcTag: '开始定制', calcTitle: '填写你的健身信息', calcSub: '所有数据仅在本地计算，完全保护你的隐私。',
    formBasic: '基本信息',
    labelHeight: '身高', labelAge: '年龄', labelCurrent: '当前体重', labelTarget: '目标体重',
    labelGender: '性别', labelMale: '♂ 男性', labelFemale: '♀ 女性',
    formTraining: '训练安排', labelDailyTime: '每天健身时间', labelFrequency: '健身频率（每周）',
    labelGoal: '健身目标', goalLose: '🔥 减脂', goalBalance: '⚡ 塑形', goalGain: '💪 增肌',
    labelLevel: '当前健身水平', levelBeginner: '新手', levelIntermediate: '进阶', levelAdvanced: '高级',
    labelIntensity: '计划强度', intensityMild: '温和', intensityBalanced: '均衡', intensityAggressive: '激进',
    generateBtn: '生成我的专属计划',
    placeholderMsg: '填写左侧信息后，<br/>你的专属计划将在这里呈现',
    phHeight: '例如 175', phAge: '例如 25', phCurrent: '例如 75', phTarget: '例如 65',
    timeUnit: (v) => `${v} 分钟 / 天`,
    errHeight: '请输入有效身高（100–250 cm）', errAge: '请输入有效年龄（15–80 岁）',
    errCurrent: '请输入有效当前体重（30–300 kg）', errTarget: '请输入有效目标体重（30–300 kg）',
    errFix: '请修正以上信息后重试',
    generatingPlan: '正在生成计划', regenerateBtn: '重新生成计划',
    resultGenerated: '你的个性化健身计划已生成 ✨',
    bmiLabel: 'BMI 指数',
    bmiRange: (a, b) => `健康 BMI 范围：18.5–24.9 · 对应体重 ${a}–${b} kg`,
    needChange: (d) => `需${d}体重`, dirReduce: '减', dirIncrease: '增', dirMaintain: '维持',
    estTime: '预计达成时间', dailyCal: '每日目标热量 (kcal)', sessionBurn: '每次消耗热量 (kcal)',
    weeklyPlan: (f, m) => `🏋️ 每周训练计划（${f} 天 / 周 · ${m} 分钟 / 天）`,
    nutritionTarget: '🥗 每日营养目标',
    proteinLabel: '💪 蛋白质', carbLabel: '⚡ 碳水化合物', fatLabel: '🥑 健康脂肪',
    totalCal: '🔥 每日总热量', bmrLabel: '📊 基础代谢率 (BMR)', perDay: '/ 天',
    tipsHeader: '💡 营养 & 生活建议',
    resultWarning: '⚠️ 此计划基于运动科学算法生成，仅供参考。如有特殊健康状况，请在开始训练前咨询专业医师或私人教练。',
    goalLabels: { lose: '减脂燃脂', balance: '塑形均衡', gain: '增肌增重' },
    levelLabels: { beginner: '新手', intermediate: '进阶', advanced: '高级' },
    levelSuffix: '方案',
    dayNames: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
    restDay: '🛌 休息恢复', restDetail: '主动恢复：散步 / 拉伸 / 充足睡眠',
    weeksUnit: (w) => `${w} 周`, goalReached: '已达标',
    timelineTitle: '目标进度时间线',
    timelineCurrent: '现在',
    timelineWeek: (w) => `第 ${w} 周`,
    timelineBmiNormal: 'BMI 正常范围',
    timelineGoal: '🎯 目标达成',
    footerDisclaimer: '⚠️ 本计划基于运动科学理论生成，仅供参考。如有特殊健康情况，请咨询专业医师或教练后再开始训练。',
    statNum1: '科学', statNum2: '个性', statNum3: '精准',
    phoneHeader: '今日训练',
    ex1Name: '热身跑步', ex1Time: '10 分钟',
    ex2Name: '深蹲训练',
    ex3Name: '卧推',
    ex4Name: '核心训练', ex4Time: '15 分钟',
    fcKcalLabel: '卡路里消耗', fcDaysLabel: '预计天数',
    exportBtn: '下载 PDF 计划',
    printByLine: '由 Morphix 生成',
    printPlanLine: '个性化健身计划',
    shareBtn: '分享计划链接',
    shareCopied: '✅ 链接已复制到剪贴板！',
    previewBmi: 'BMI 预览',
    previewTdee: '每日消耗',
    previewCal: '目标热量',
    previewHint: '继续填写更多信息以获取完整预览',
    clearDataBtn: '清除已保存数据',
    dataCleared: '已清除所有保存的数据',
  },
  en: {
    navFeatures: 'Features', navCalc: 'Get Started', navHow: 'How It Works', navCta: 'Start Now',
    heroBadge: 'AI-Powered · Personalized',
    heroTitle1: 'Build', heroTitle2: 'Your Perfect', heroTitle3: 'Fitness Plan',
    heroSub: 'Enter your body metrics and goals — Morphix generates your personalized training schedule, nutrition targets, and goal timeline. All powered by science.',
    heroCta: 'Customize My Plan', heroGhost: 'How It Works',
    statBmi: 'BMI Analysis', statCustom: 'Custom Plan', statPlan: 'Goal Timeline',
    featuresTag: 'Core Features', featuresTitle: 'Everything You Need, All In One Place',
    f1Title: 'Smart Plan Generator', f1Desc: 'Auto-generates daily training schedules based on your data — covering cardio, strength, and flexibility.',
    f2Title: 'BMI Health Assessment', f2Desc: 'Calculates your BMI precisely and provides a health evaluation with your target gap.',
    f3Title: 'Goal Timeline Prediction', f3Desc: "Uses your training intensity and biometrics to scientifically predict when you'll hit your target.",
    f4Title: 'Nutrition Guidance', f4Desc: 'Provides daily calorie targets and macro breakdowns tailored to your specific fitness goal.',
    f5Title: 'Fully Personalized', f5Desc: 'Adapts plans for all levels — from beginners to advanced athletes — based on available workout time.',
    f6Title: 'Science-Backed', f6Desc: 'Plans are grounded in exercise science and nutrition principles — safe, effective, and sustainable.',
    howTag: 'How It Works', howTitle: '3 Steps to Your Fitness Journey',
    step1Title: 'Enter Your Data', step1Desc: 'Fill in your height, weight, target weight, and daily available workout time.',
    step2Title: 'AI Analysis', step2Desc: 'Morphix analyzes your BMI, weight gap, and calculates your weekly healthy change target.',
    step3Title: 'Get Your Plan', step3Desc: 'Receive a complete training schedule, nutrition targets, and an estimated goal timeline.',
    calcTag: 'Get Started', calcTitle: 'Enter Your Fitness Info', calcSub: 'All data is processed locally — your privacy is fully protected.',
    formBasic: 'Basic Info',
    labelHeight: 'Height', labelAge: 'Age', labelCurrent: 'Current Weight', labelTarget: 'Target Weight',
    labelGender: 'Gender', labelMale: '♂ Male', labelFemale: '♀ Female',
    formTraining: 'Training Setup', labelDailyTime: 'Daily Workout Duration', labelFrequency: 'Weekly Frequency',
    labelGoal: 'Fitness Goal', goalLose: '🔥 Fat Loss', goalBalance: '⚡ Recomposition', goalGain: '💪 Muscle Gain',
    labelLevel: 'Fitness Level', levelBeginner: 'Beginner', levelIntermediate: 'Intermediate', levelAdvanced: 'Advanced',
    labelIntensity: 'Plan Intensity', intensityMild: 'Mild', intensityBalanced: 'Balanced', intensityAggressive: 'Aggressive',
    generateBtn: 'Generate My Plan',
    placeholderMsg: 'Fill in your info on the left<br/>and your personalized plan will appear here.',
    phHeight: 'e.g. 175', phAge: 'e.g. 25', phCurrent: 'e.g. 75', phTarget: 'e.g. 65',
    timeUnit: (v) => `${v} min / day`,
    errHeight: 'Please enter a valid height (100–250 cm)', errAge: 'Please enter a valid age (15–80)',
    errCurrent: 'Please enter a valid current weight (30–300 kg)', errTarget: 'Please enter a valid target weight (30–300 kg)',
    errFix: 'Please fix the errors above and try again.',
    generatingPlan: 'Generating your plan', regenerateBtn: 'Regenerate Plan',
    resultGenerated: 'Your personalized fitness plan is ready ✨',
    bmiLabel: 'BMI Index',
    bmiRange: (a, b) => `Healthy BMI: 18.5–24.9 · Weight range ${a}–${b} kg`,
    needChange: (d) => `To ${d}`, dirReduce: 'Lose', dirIncrease: 'Gain', dirMaintain: 'Maintain',
    estTime: 'Estimated Timeline', dailyCal: 'Daily Calorie Target (kcal)', sessionBurn: 'Per Session Burn (kcal)',
    weeklyPlan: (f, m) => `🏋️ Weekly Training Schedule (${f} days/wk · ${m} min/day)`,
    nutritionTarget: '🥗 Daily Nutrition Targets',
    proteinLabel: '💪 Protein', carbLabel: '⚡ Carbohydrates', fatLabel: '🥑 Healthy Fats',
    totalCal: '🔥 Total Daily Calories', bmrLabel: '📊 Basal Metabolic Rate (BMR)', perDay: '/ day',
    tipsHeader: '💡 Nutrition & Lifestyle Tips',
    resultWarning: '⚠️ This plan is generated based on exercise science algorithms for informational purposes only. Consult a licensed physician or certified trainer before starting.',
    goalLabels: { lose: 'Fat Loss', balance: 'Recomposition', gain: 'Muscle Gain' },
    levelLabels: { beginner: 'Beginner', intermediate: 'Intermediate', advanced: 'Advanced' },
    levelSuffix: 'Plan',
    dayNames: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    restDay: '🛌 Rest & Recovery', restDetail: 'Active recovery: walking / stretching / quality sleep',
    weeksUnit: (w) => `${w} wks`, goalReached: 'Already at goal!',
    timelineTitle: 'Goal Progress Timeline',
    timelineCurrent: 'Now',
    timelineWeek: (w) => `Week ${w}`,
    timelineBmiNormal: 'BMI Normal Range',
    timelineGoal: '🎯 Goal Reached',
    footerDisclaimer: '⚠️ Plans are generated based on exercise science principles for informational purposes only. Consult a licensed physician or certified trainer before starting any new program.',
    exportBtn: 'Download PDF Plan',
    printByLine: 'Generated by Morphix',
    printPlanLine: 'Personalized Fitness Plan',
    shareBtn: 'Share Plan Link',
    shareCopied: '✅ Link copied to clipboard!',
    previewBmi: 'BMI Preview',
    previewTdee: 'Daily Expenditure',
    previewCal: 'Target Calories',
    previewHint: 'Fill in more fields for a full preview',
    clearDataBtn: 'Clear Saved Data',
    dataCleared: 'All saved data cleared',
    statNum1: 'Science', statNum2: 'Personal', statNum3: 'Precise',
    phoneHeader: "Today's Workout",
    ex1Name: 'Warm-Up Run', ex1Time: '10 min',
    ex2Name: 'Squat Training',
    ex3Name: 'Bench Press',
    ex4Name: 'Core Training', ex4Time: '15 min',
    fcKcalLabel: 'Calories Burned', fcDaysLabel: 'Est. Days',
  }
};

// Translation helper
const t  = (key)          => i18n[state.lang][key];
const tf = (key, ...args) => { const v = t(key); return typeof v === 'function' ? v(...args) : v; };

// ── Language Toggle ────────────────────────────────────
function toggleLang() {
  state.lang = state.lang === 'zh' ? 'en' : 'zh';
  document.getElementById('langLabel').textContent = state.lang === 'zh' ? 'EN' : '中';
  document.documentElement.lang = state.lang === 'zh' ? 'zh-CN' : 'en';
  applyTranslations();
  // Re-render results if visible
  if (document.getElementById('resultsContent').style.display !== 'none') {
    const h = parseFloat(document.getElementById('height').value);
    const a = parseFloat(document.getElementById('age').value);
    const cw = parseFloat(document.getElementById('currentWeight').value);
    const tw = parseFloat(document.getElementById('targetWeight').value);
    if (h && a && cw && tw) renderResults(h, a, cw, tw);
  }
}

function applyTranslations() {
  const L = state.lang;
  const T = i18n[L];

  // Nav
  setText('navFeatures', T.navFeatures);
  setText('navCalc', T.navCalc);
  setText('navHow', T.navHow);
  setText('navCta', T.navCta);

  // Hero
  setText('heroBadgeText', T.heroBadge);
  setText('heroTitle1', T.heroTitle1);
  setText('heroTitle2', T.heroTitle2);
  setText('heroTitle3', T.heroTitle3);
  setText('heroSub', T.heroSub);
  setText('heroCta', T.heroCta);
  setText('heroGhost', T.heroGhost);
  setText('statBmi', T.statBmi);
  setText('statCustom', T.statCustom);
  setText('statPlan', T.statPlan);

  // Features
  setText('featuresTag', T.featuresTag);
  setText('featuresTitle', T.featuresTitle);
  setText('f1Title', T.f1Title); setText('f1Desc', T.f1Desc);
  setText('f2Title', T.f2Title); setText('f2Desc', T.f2Desc);
  setText('f3Title', T.f3Title); setText('f3Desc', T.f3Desc);
  setText('f4Title', T.f4Title); setText('f4Desc', T.f4Desc);
  setText('f5Title', T.f5Title); setText('f5Desc', T.f5Desc);
  setText('f6Title', T.f6Title); setText('f6Desc', T.f6Desc);

  // How It Works
  setText('howTag', T.howTag);
  setText('howTitle', T.howTitle);
  setText('step1Title', T.step1Title); setText('step1Desc', T.step1Desc);
  setText('step2Title', T.step2Title); setText('step2Desc', T.step2Desc);
  setText('step3Title', T.step3Title); setText('step3Desc', T.step3Desc);

  // Calculator
  setText('calcTag', T.calcTag);
  setText('calcTitle', T.calcTitle);
  setText('calcSub', T.calcSub);
  setText('formBasicTitle', T.formBasic);
  setText('labelHeight', T.labelHeight);
  setText('labelAge', T.labelAge);
  setText('labelCurrent', T.labelCurrent);
  setText('labelTarget', T.labelTarget);
  setText('labelGender', T.labelGender);
  setText('genderMaleText', T.labelMale);
  setText('genderFemaleText', T.labelFemale);
  setText('formTrainingTitle', T.formTraining);
  setText('labelDailyTime', T.labelDailyTime);
  setText('labelFrequency', T.labelFrequency);
  setText('labelGoal', T.labelGoal);
  setText('goalLoseText', T.goalLose);
  setText('goalBalanceText', T.goalBalance);
  setText('goalGainText', T.goalGain);
  setText('labelLevel', T.labelLevel);
  setText('levelBeginnerText', T.levelBeginner);
  setText('levelIntermediateText', T.levelIntermediate);
  setText('levelAdvancedText', T.levelAdvanced);
  setText('labelIntensity', T.labelIntensity);
  setText('intensityMildText', T.intensityMild);
  setText('intensityBalancedText', T.intensityBalanced);
  setText('intensityAggressiveText', T.intensityAggressive);
  setText('generateBtnText', T.generateBtn);

  // Placeholders
  setPlaceholder('height', T.phHeight);
  setPlaceholder('age', T.phAge);
  setPlaceholder('currentWeight', T.phCurrent);
  setPlaceholder('targetWeight', T.phTarget);

  // Export button (if results visible)
  setText('exportBtnLabel', T.exportBtn);

  // Time display
  updateTimeDisplay(state.dailyTime);
  const rp = document.getElementById('resultsPlaceholder');
  const rpEl = document.getElementById('resultsPlaceholderMsg');
  if (rpEl) rpEl.innerHTML = T.placeholderMsg;

  // Footer
  const fd = document.getElementById('footerDisclaimer');
  if (fd) fd.textContent = T.footerDisclaimer;

  // Hero stat numbers & phone mockup
  setText('statNum1', T.statNum1);
  setText('statNum2', T.statNum2);
  setText('statNum3', T.statNum3);
  setText('phoneHeader', T.phoneHeader);
  setText('ex1Name', T.ex1Name); setText('ex1Time', T.ex1Time);
  setText('ex2Name', T.ex2Name);
  setText('ex3Name', T.ex3Name);
  setText('ex4Name', T.ex4Name); setText('ex4Time', T.ex4Time);
  setText('fcKcalLabel', T.fcKcalLabel);
  setText('fcDaysLabel', T.fcDaysLabel);
}

function setText(id, txt) {
  const el = document.getElementById(id);
  if (el && txt !== undefined) el.textContent = txt;
}
function setPlaceholder(id, txt) {
  const el = document.getElementById(id);
  if (el && txt !== undefined) el.placeholder = txt;
}

// ── Selector Helpers ──────────────────────────────────
function selectGender(g) {
  state.gender = g;
  document.querySelectorAll('.gender-btn').forEach(b => b.classList.toggle('active', b.dataset.gender === g));
  saveToLocalStorage();
  updateLivePreview();
}

function selectFrequency(d) {
  state.frequency = d;
  document.querySelectorAll('.freq-btn').forEach(b => b.classList.toggle('active', parseInt(b.dataset.days) === d));
  saveToLocalStorage();
  updateLivePreview();
}

function selectGoal(g) {
  state.goal = g;
  document.querySelectorAll('.goal-btn').forEach(b => b.classList.toggle('active', b.dataset.goal === g));
  saveToLocalStorage();
  updateLivePreview();
}

function selectIntensity(i) {
  state.intensity = i;
  document.querySelectorAll('.intensity-btn').forEach(b => b.classList.toggle('active', b.dataset.intensity === i));
  saveToLocalStorage();
  updateLivePreview();
}

function selectLevel(l) {
  state.level = l;
  document.querySelectorAll('.level-btn').forEach(b => b.classList.toggle('active', b.dataset.level === l));
  saveToLocalStorage();
  updateLivePreview();
}

function updateTimeDisplay(val) {
  state.dailyTime = parseInt(val);
  document.getElementById('timeDisplay').textContent = tf('timeUnit', val);
  const slider = document.getElementById('dailyTime');
  const min = parseInt(slider.min), max = parseInt(slider.max);
  const pct = ((val - min) / (max - min)) * 100;
  slider.style.background = `linear-gradient(90deg, #00d4ff ${pct}%, rgba(255,255,255,0.1) ${pct}%)`;
  saveToLocalStorage();
  updateLivePreview();
}

// ── Validation ────────────────────────────────────────
function validateInputs(height, age, current, target) {
  const errors = [];
  if (!height || height < 100 || height > 250) errors.push(t('errHeight'));
  if (!age || age < 15 || age > 80)             errors.push(t('errAge'));
  if (!current || current < 30 || current > 300) errors.push(t('errCurrent'));
  if (!target || target < 30 || target > 300)    errors.push(t('errTarget'));
  return errors;
}

// ── Calculations ──────────────────────────────────────
function calcBMI(weight, height) {
  const h = height / 100;
  return (weight / (h * h)).toFixed(1);
}

function getBMICategory(bmi) {
  if (bmi < 18.5) return { label: state.lang === 'zh' ? '偏轻' : 'Underweight', cls: 'underweight', pct: (bmi / 18.5) * 25 };
  if (bmi < 25)   return { label: state.lang === 'zh' ? '正常' : 'Normal',      cls: 'normal',      pct: 25 + ((bmi - 18.5) / 6.5) * 30 };
  if (bmi < 30)   return { label: state.lang === 'zh' ? '超重' : 'Overweight',  cls: 'overweight',  pct: 55 + ((bmi - 25) / 5) * 25 };
  return           { label: state.lang === 'zh' ? '肥胖' : 'Obese',             cls: 'obese',        pct: Math.min(100, 80 + ((bmi - 30) / 10) * 20) };
}

function calcBMR(weight, height, age, gender) {
  const base = 10 * weight + 6.25 * height - 5 * age;
  return gender === 'male' ? base + 5 : base - 161;
}

function calcTDEE(bmr, daysPerWeek, level) {
  // Level significantly shifts the activity multiplier
  // Advanced users train harder/longer even within the same session time
  const baseFactor = { 3: 1.375, 4: 1.55, 5: 1.55, 6: 1.725, 7: 1.9 };
  const levelMultiplier = { beginner: 0.90, intermediate: 1.0, advanced: 1.12 };
  const base = baseFactor[daysPerWeek] || 1.55;
  return Math.round(bmr * base * (levelMultiplier[level] || 1.0));
}

function calcCaloriesBurned(weight, minutes, goal, level) {
  // Level drastically changes MET (exercise intensity)
  // Advanced users perform movements at far higher intensity
  const metBase = { lose: 8, balance: 6.5, gain: 5 };
  const levelMETBoost = { beginner: 0.75, intermediate: 1.0, advanced: 1.30 };
  const met = metBase[goal] * (levelMETBoost[level] || 1.0);
  return Math.round((met * weight * 3.5 / 200) * minutes);
}

function targetCalories(tdee, mode, intensity) {
  const deficitMap = { mild: 250, balanced: 500, aggressive: 750 };
  const surplusMap = { mild: 200, balanced: 300, aggressive: 500 };
  if (mode === 'lose') return Math.max(tdee - (deficitMap[intensity] || 500), 1200);
  if (mode === 'gain') return tdee + (surplusMap[intensity] || 300);
  return tdee;
}

function estimateWeeks(currentWeight, targetWeight, mode, intensity) {
  const diff = Math.abs(targetWeight - currentWeight);
  if (diff < 0.5) return 0;
  const rateBase = {
    lose:    { mild: 0.3, balanced: 0.55, aggressive: 0.8 },
    gain:    { mild: 0.15, balanced: 0.3, aggressive: 0.5 },
    balance: { mild: 0.2, balanced: 0.4, aggressive: 0.6 }
  };
  const kgPerWeek = (rateBase[mode] && rateBase[mode][intensity]) || 0.55;
  return Math.ceil(diff / kgPerWeek);
}

function generateTimelineSVG(currentWeight, targetWeight, height, totalWeeks) {
  const isEN = state.lang === 'en';
  if (totalWeeks <= 0) {
    return `<div class="timeline-empty">${isEN ? 'You are already at your target weight!' : '你已经达到目标体重了！'}</div>`;
  }

  const nodes = [];
  nodes.push({ week: 0, weight: currentWeight, label: isEN ? 'Now' : '现在', isNormalBmi: false, isGoal: false });

  let intervals = [Math.floor(totalWeeks / 3), Math.floor(totalWeeks * 2 / 3)];
  if (totalWeeks <= 4) intervals = [];
  else if (totalWeeks <= 8) intervals = [Math.floor(totalWeeks / 2)];

  const currentBMI = calcBMI(currentWeight, height);
  let thresholdBmi = 0;
  let isLosing = targetWeight < currentWeight;

  if (isLosing && currentBMI > 24.9) thresholdBmi = 24.9;
  else if (!isLosing && currentBMI < 18.5) thresholdBmi = 18.5;

  let bmiWeek = -1;
  let bmiWeight = 0;

  if (thresholdBmi > 0) {
    bmiWeight = thresholdBmi * Math.pow(height / 100, 2);
    if ((isLosing && bmiWeight >= targetWeight) || (!isLosing && bmiWeight <= targetWeight)) {
       const weightDiff = Math.abs(currentWeight - targetWeight);
       const rate = weightDiff / totalWeeks;
       bmiWeek = Math.round(Math.abs(currentWeight - bmiWeight) / rate);
    }
  }

  const weeksSet = new Set(intervals);
  if (bmiWeek > 0 && bmiWeek < totalWeeks) weeksSet.add(bmiWeek);

  const middleWeeks = Array.from(weeksSet).filter(w => w > 0 && w < totalWeeks).sort((a,b) => a - b);
  
  const finalMiddleWeeks = [];
  let lastW = 0;
  middleWeeks.forEach(w => {
     if (w === bmiWeek) {
        finalMiddleWeeks.push(w);
        lastW = w;
     } else {
        if (Math.abs(w - lastW) >= 2 && Math.abs(totalWeeks - w) >= 2) {
           finalMiddleWeeks.push(w);
           lastW = w;
        }
     }
  });

  const rate = (targetWeight - currentWeight) / totalWeeks;
  finalMiddleWeeks.forEach(w => {
     nodes.push({
        week: w,
        weight: (currentWeight + rate * w),
        label: isEN ? `Week ${w}` : `第 ${w} 周`,
        isNormalBmi: (w === bmiWeek),
        isGoal: false
     });
  });

  nodes.push({ week: totalWeeks, weight: targetWeight, label: isEN ? '🎯 Goal' : '🎯 目标达成', isNormalBmi: (totalWeeks === bmiWeek && bmiWeek > 0), isGoal: true });

  const wMin = Math.min(currentWeight, targetWeight) - 2;
  const wMax = Math.max(currentWeight, targetWeight) + 2;
  
  const mapX = (w) => 40 + (w / totalWeeks) * 520;
  const mapY = (w) => 120 - ((w - wMin) / (wMax - wMin)) * 80;

  const pathD = nodes.map((n, i) => `${i === 0 ? 'M' : 'L'} ${mapX(n.week)} ${mapY(n.weight)}`).join(' ');

  let svgHtml = `
    <div class="timeline-wrap">
      <svg viewBox="0 0 600 160" preserveAspectRatio="xMidYMid meet" class="timeline-svg">
        <defs>
          <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stop-color="#00d4ff"/>
            <stop offset="100%" stop-color="#a855f7"/>
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        <path d="${pathD}" fill="none" stroke="url(#lineGrad)" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" filter="url(#glow)" class="timeline-path" />
  `;

  nodes.forEach(n => {
    const x = mapX(n.week);
    const y = mapY(n.weight);
    const weightStr = n.weight.toFixed(1) + 'kg';
    
    // adjust labels based on line direction above/below
    const labelY = isLosing ? y + 25 : y - 25;
    const isSpecial = n.isNormalBmi || n.isGoal;

    svgHtml += `
      <text x="${x}" y="${labelY}" class="tl-label ${isSpecial ? 'tl-highlight' : ''}">${n.label}</text>
      <text x="${x}" y="${isLosing ? labelY + 14 : labelY - 14}" class="tl-weight">${weightStr}</text>
    `;
    
    if (n.isNormalBmi) {
        svgHtml += `
          <text x="${x}" y="${isLosing ? labelY - 42 : labelY + 42}" class="tl-tag bmi-tag">${isEN ? 'BMI Normal Range' : 'BMI 正常范围'}</text>
        `;
    }

    svgHtml += `
      <circle cx="${x}" cy="${y}" r="${isSpecial ? 6 : 4}" fill="${isSpecial ? '#a855f7' : '#00d4ff'}" stroke="#0d1030" stroke-width="2" class="tl-node ${n.isGoal ? 'tl-goal' : ''}" />
    `;
  });

  svgHtml += `</svg></div>`;
  return svgHtml;
}

function getProteinMultiplier(goal, level) {
  // Protein needs vary significantly by level and goal
  const map = {
    lose:    { beginner: 1.4, intermediate: 1.8, advanced: 2.2 },
    balance: { beginner: 1.5, intermediate: 1.9, advanced: 2.3 },
    gain:    { beginner: 1.6, intermediate: 2.1, advanced: 2.6 }
  };
  return (map[goal] && map[goal][level]) || 1.8;
}

// ── Plan Database (Chinese) ────────────────────────────
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

// ── Plan Database (English) ────────────────────────────
const PLAN_TEMPLATES_EN = {
  beginner: {
    lose: [
      { type: 'Cardio + Basic Strength', exercises: 'Brisk walk/cycling + Squats 3×12 + Lunges 3×10 + Push-ups 3×8' },
      { type: 'Full-Body Cardio', exercises: 'Jump rope/jog + Plank 3×30s + Crunches 3×15' },
      { type: 'Core + Cardio', exercises: 'HIIT (20min) + Core strengthening + Cool-down stretch' },
      { type: 'Low-Intensity Cardio', exercises: 'Brisk walk + Yoga/Stretching (active recovery)' },
    ],
    balance: [
      { type: 'Upper Body Strength', exercises: 'Dumbbell curls 3×12 + Push-ups 4×10 + Shoulder press 3×12 + Plank 3×30s' },
      { type: 'Lower Body Strength', exercises: 'Squats 4×12 + Lunges 3×10 + Romanian deadlift 3×12 + Calf raises 3×15' },
      { type: 'Cardio + Core', exercises: 'Jog 20min + Core training + Full-body stretch' },
      { type: 'Full-Body Functional', exercises: 'Burpees 3×8 + Mountain climbers 3×20 + Jump squats 3×10 + Cool-down' },
    ],
    gain: [
      { type: 'Upper Push', exercises: 'Dumbbell bench press 4×10 + Shoulder press 3×12 + Tricep dips 3×12 + Lateral raises 3×12' },
      { type: 'Lower Body', exercises: 'Barbell squat 4×8 + Leg press 3×12 + Leg curl 3×12 + Calf raises 4×15' },
      { type: 'Upper Pull', exercises: 'Dumbbell rows 4×10 + Bicep curls 3×12 + Face pulls 3×15' },
      { type: 'Recovery + Stretch', exercises: 'Light cardio 15min + Foam rolling + Full-body stretch' },
    ]
  },
  intermediate: {
    lose: [
      { type: 'HIIT + Strength', exercises: 'HIIT 25min + Squats 4×15 + Deadlifts 4×10 + Core work' },
      { type: 'Push Day', exercises: 'Dumbbell bench 4×12 + Shoulder press 4×10 + Tricep pushdown 3×15 + HIIT 15min' },
      { type: 'Pull Day', exercises: 'Dumbbell rows 4×12 + Reverse rows 3×12 + Curls 3×15 + Cardio 20min' },
      { type: 'Legs + Cardio', exercises: 'Squats 5×10 + Lunges 4×12 + Hip thrusts 3×15 + Treadmill 20min' },
      { type: 'Metabolic Training', exercises: 'Circuit (minimal rest): Burpees + Jump squats + Mountain climbers + Jump rope' },
    ],
    balance: [
      { type: 'Chest + Triceps', exercises: 'Dumbbell bench 4×10 + Incline press 3×12 + Cable flyes 3×15 + Dips 3×12' },
      { type: 'Back + Biceps', exercises: 'Pull-ups/assisted 4×8 + Dumbbell rows 4×10 + Hammer curls 3×12' },
      { type: 'Leg Day', exercises: 'Squats 5×10 + Leg press 4×12 + Romanian deadlift 3×10 + Calf raises 4×15' },
      { type: 'Shoulders + Core', exercises: 'Military press 4×10 + Lateral raises 3×15 + Front raises 3×12 + Core 20min' },
      { type: 'Cardio + Recovery', exercises: 'Moderate cardio 30min + Foam rolling + Stretching 20min' },
    ],
    gain: [
      { type: 'Chest + Triceps (Push)', exercises: 'Dumbbell bench 5×8 + Incline press 4×10 + Cable flyes 3×12 + Dips 4×10' },
      { type: 'Back + Biceps (Pull)', exercises: 'Pull-ups 4×6-8 + Barbell rows 4×8 + Bicep curls 4×10 + Face pulls 3×15' },
      { type: 'Legs + Glutes', exercises: 'Squats 5×8 + Front squats 3×8 + Romanian deadlift 4×8 + Leg press 3×10' },
      { type: 'Shoulders + Core', exercises: 'Overhead press 4×8 + Lateral raises 4×12 + Rear flyes 3×12 + Core work' },
      { type: 'Full-Body + Weak Points', exercises: 'Accessory work + Light cardio 15min + Full stretch' },
    ]
  },
  advanced: {
    lose: [
      { type: 'Strength + HIIT Superset', exercises: 'Squat superset HIIT + Deadlifts + High-intensity intervals (4×4)' },
      { type: 'Upper Strength + Cardio', exercises: 'Bench press 5×5 + Rows 5×5 + Press 4×6 + Cardio 20min' },
      { type: 'Metabolic Complex', exercises: 'Push-pull-legs circuit (no rest) + Battle ropes/rowing 15min' },
      { type: 'Leg Day + Core', exercises: 'Squats 6×5 + Front squats 4×5 + Good mornings 3×10 + Core 20min' },
      { type: 'Performance + Cardio', exercises: 'Technical drills + Steady-state cardio 40min + Stretch' },
      { type: 'Active Recovery', exercises: 'Yoga/swimming + Deep stretching + Contrast shower' },
    ],
    balance: [
      { type: 'Push (Chest/Shoulders/Triceps)', exercises: 'Bench press 5×5 + Incline press 4×8 + Shoulder press 4×8 + Cable 3×12' },
      { type: 'Pull (Back/Biceps)', exercises: 'Barbell deadlift 4×5 + Pull-ups 4×8 + Rows 4×8 + Curls 3×10' },
      { type: 'Legs (Quads/Hamstrings)', exercises: 'Squats 5×5 + Front squats 3×5 + Bulgarian split squats 3×8 + Leg curls 3×10' },
      { type: 'Push 2 (Accessory)', exercises: 'Incline flyes 4×12 + Cable pushdown 3×15 + Lateral raises 4×12 + Front raises 3×12' },
      { type: 'Pull 2 + Glutes', exercises: 'Wide-grip pull-ups 3×8 + Single-arm rows 3×10 + Hip thrusts 4×10 + Curls 3×12' },
      { type: 'Athletic Performance + Recovery', exercises: 'Power training (jumps/throws) + Light cardio + Full stretch' },
    ],
    gain: [
      { type: 'Push (Heavy)', exercises: 'Bench press 6×4-5 + Incline dumbbell press 4×6-8 + Tricep dips 4×8-10' },
      { type: 'Pull (Heavy)', exercises: 'Barbell deadlift 5×4-5 + Pull-ups 5×6-8 + Barbell rows 4×6-8' },
      { type: 'Legs (Heavy)', exercises: 'Squats 6×4-5 + Front squats 3×5 + Romanian deadlift 4×6 + Calf raises 5×12' },
      { type: 'Push (Moderate Accessory)', exercises: 'Dumbbell press 4×10 + Cable flyes 4×12 + Lateral raises 4×15 + Tricep complex' },
      { type: 'Pull (Moderate Accessory)', exercises: 'Single-arm rows 4×10 + Rear flyes 4×12 + Bicep complex 4×10' },
      { type: 'Legs 2 + Recovery', exercises: 'Leg press 4×10 + Leg curls 4×10 + Calf raises 5×12 + Full stretch' },
    ]
  }
};

// ── Nutrition Tips (Chinese) ──────────────────────────
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

// ── Nutrition Tips (English) ─────────────────────────
const NUTRITION_TIPS_EN = {
  lose: [
    'Keep protein intake at bodyweight (kg) × 1.6g or more to preserve muscle mass',
    'Avoid refined carbs (white bread, sugary drinks) — choose whole grains and vegetables',
    'Each meal should include protein + vegetables + healthy fats',
    'Stop eating 2–3 hours before bed to support fat metabolism',
    'Drink 2–3L of water daily — hydration helps control appetite',
    'Consider intermittent fasting (16:8) to accelerate fat loss'
  ],
  balance: [
    'Daily protein target: bodyweight (kg) × 1.8g to support body recomposition',
    'Eat carbs 1–1.5 hours before training for sustained energy',
    'Consume protein + carbs within 30 minutes after training for recovery',
    'Minimize processed foods and increase natural, whole foods',
    'Supplement with Omega-3 (salmon, walnuts) to reduce inflammation'
  ],
  gain: [
    'Aim for a 250–500 kcal daily surplus for clean muscle gain',
    'Protein needs: bodyweight (kg) × 2–2.2g to meet muscle protein synthesis demands',
    'Carbohydrates are your training fuel — do not cut them too low',
    'Post-workout: fast protein (whey) + high-GI carbs for optimal recovery',
    'Get 8+ hours of quality sleep every night to maximize growth hormone release',
    'Consider creatine (3–5g/day) — scientifically proven to enhance strength and muscle'
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

  const btn = document.getElementById('generateBtn');
  btn.classList.add('loading');
  btn.disabled = true;
  document.getElementById('generateBtnText').textContent = t('generatingPlan');

  setTimeout(() => {
    btn.classList.remove('loading');
    btn.disabled = false;
    document.getElementById('generateBtnText').textContent = t('regenerateBtn');
    renderResults(height, age, currentWeight, targetWeight);
  }, 1200);
}

function showError(errors) {
  const placeholder = document.getElementById('resultsPlaceholder');
  const content = document.getElementById('resultsContent');
  content.style.display = 'none';
  placeholder.style.display = 'flex';
  placeholder.innerHTML = `
    <div class="placeholder-icon">⚠️</div>
    <p style="color: #ef4444;">${errors.join('<br/>')}</p>
    <p style="font-size:0.8rem; margin-top:8px;">${t('errFix')}</p>
  `;
}

function renderResults(height, age, currentWeight, targetWeight) {
  const { gender, dailyTime, frequency, goal, level } = state;

  const bmi = parseFloat(calcBMI(currentWeight, height));
  const bmiCat = getBMICategory(bmi);
  const bmr = calcBMR(currentWeight, height, age, gender);
  const tdee = calcTDEE(bmr, frequency, level);
  const targetCal = targetCalories(tdee, goal, state.intensity);
  const proteinG = Math.round(currentWeight * getProteinMultiplier(goal, level));
  // Macro split also varies by level — advanced athletes need more carbs for performance
  const carbPct = level === 'advanced' ? 0.48 : level === 'intermediate' ? 0.45 : 0.42;
  const fatPct = level === 'advanced' ? 0.22 : level === 'intermediate' ? 0.25 : 0.28;
  const carbG = Math.round((targetCal * carbPct) / 4);
  const fatG = Math.round((targetCal * fatPct) / 9);
  const calBurned = calcCaloriesBurned(currentWeight, dailyTime, goal, level);
  const weeks = estimateWeeks(currentWeight, targetWeight, goal === 'balance' ? 'lose' : goal, state.intensity);

  const weightDiff = (targetWeight - currentWeight).toFixed(1);
  const dir = targetWeight < currentWeight ? t('dirReduce') : targetWeight > currentWeight ? t('dirIncrease') : t('dirMaintain');

  const isEN = state.lang === 'en';
  const templates = isEN ? PLAN_TEMPLATES_EN : PLAN_TEMPLATES;
  const tipsDB = isEN ? NUTRITION_TIPS_EN : NUTRITION_TIPS;

  const planDays = templates[level][goal];
  const scheduleDays = buildSchedule(planDays, frequency);
  const tips = tipsDB[goal];

  const heightM = height / 100;
  const idealMin = (18.5 * heightM * heightM).toFixed(1);
  const idealMax = (24.9 * heightM * heightM).toFixed(1);

  const goalName = t('goalLabels')[goal] || goal;
  const levelName = t('levelLabels')[level] || level;

  const date = new Date().toLocaleDateString(
    state.lang === 'zh' ? 'zh-CN' : 'en-US',
    { year: 'numeric', month: 'long', day: 'numeric' }
  );

  const html = `
    <div class="print-header">
      <div class="print-logo">⚡ MORPHIX</div>
      <div class="print-meta">
        <div>${t('printPlanLine')}</div>
        <div>${goalName} · ${levelName} ${t('levelSuffix')}</div>
        <div>${date} · ${t('printByLine')}</div>
      </div>
    </div>
    <div class="result-header">
      <div class="result-greeting">${t('resultGenerated')}</div>
      <div class="result-title">${goalName} · ${levelName} ${t('levelSuffix')}</div>
    </div>

    <div class="bmi-card">
      <div class="bmi-row">
        <span class="bmi-label">${t('bmiLabel')}</span>
        <span class="bmi-value bmi-${bmiCat.cls}">${bmi}</span>
        <span class="bmi-status status-${bmiCat.cls}">${bmiCat.label}</span>
      </div>
      <div style="font-size:0.72rem; color: var(--text-muted); margin-bottom:8px;">
        ${tf('bmiRange', idealMin, idealMax)}
      </div>
      <div class="bmi-bar-wrap">
        <div class="bmi-bar" id="bmiBar" style="width: 0%; background: var(--gradient-primary);"></div>
      </div>
    </div>

    <div class="metrics-grid">
      <div class="metric-card">
        <div class="metric-icon">🎯</div>
        <div class="metric-value">${Math.abs(weightDiff)} kg</div>
        <div class="metric-label">${tf('needChange', dir)}</div>
      </div>
      <div class="metric-card">
        <div class="metric-icon">📅</div>
        <div class="metric-value">${weeks > 0 ? tf('weeksUnit', weeks) : t('goalReached')}</div>
        <div class="metric-label">${t('estTime')}</div>
      </div>
      <div class="metric-card">
        <div class="metric-icon">🔥</div>
        <div class="metric-value">${targetCal}</div>
        <div class="metric-label">${t('dailyCal')}</div>
      </div>
      <div class="metric-card">
        <div class="metric-icon">⚡</div>
        <div class="metric-value">${calBurned}</div>
        <div class="metric-label">${t('sessionBurn')}</div>
      </div>
    </div>

    <div class="plan-block">
      <div class="plan-block-header">${tf('weeklyPlan', frequency, dailyTime)}</div>
      <div class="plan-block-body">${scheduleDays}</div>
    </div>

    <div class="plan-block">
      <div class="plan-block-header">📊 ${t('timelineTitle') || '目标进度时间线'}</div>
      <div class="plan-block-body timeline-body">
        ${generateTimelineSVG(currentWeight, targetWeight, height, weeks)}
      </div>
    </div>

    <div class="plan-block">
      <div class="plan-block-header">${t('nutritionTarget')}</div>
      <div class="plan-block-body">
        <div class="nutrition-item">
          <span class="nutrition-name">${t('proteinLabel')}</span>
          <span class="nutrition-val">${proteinG}g ${t('perDay')}</span>
        </div>
        <div class="nutrition-item">
          <span class="nutrition-name">${t('carbLabel')}</span>
          <span class="nutrition-val">${carbG}g ${t('perDay')}</span>
        </div>
        <div class="nutrition-item">
          <span class="nutrition-name">${t('fatLabel')}</span>
          <span class="nutrition-val">${fatG}g ${t('perDay')}</span>
        </div>
        <div class="nutrition-item">
          <span class="nutrition-name">${t('totalCal')}</span>
          <span class="nutrition-val">${targetCal} kcal</span>
        </div>
        <div class="nutrition-item">
          <span class="nutrition-name">${t('bmrLabel')}</span>
          <span class="nutrition-val">${Math.round(bmr)} kcal</span>
        </div>
      </div>
    </div>

    <div class="plan-block">
      <div class="plan-block-header">${t('tipsHeader')}</div>
      <div class="plan-block-body">
        <ul class="tips-list">
          ${tips.map(tip => `<li>${tip}</li>`).join('')}
        </ul>
      </div>
    </div>

    <div class="result-warning">${t('resultWarning')}</div>

    <button class="export-btn" onclick="exportPDF()">
      <svg viewBox="0 0 24 24" fill="none" width="18" height="18">
        <path d="M12 15V3m0 12l-4-4m4 4l4-4M2 17l.621 2.485A2 2 0 004.561 21h14.878a2 2 0 001.94-1.515L22 17"
          stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      <span id="exportBtnLabel">${t('exportBtn')}</span>
    </button>

    <button class="share-btn" onclick="shareLink()">
      <svg viewBox="0 0 24 24" fill="none" width="18" height="18">
        <circle cx="18" cy="5" r="3" stroke="currentColor" stroke-width="2"/>
        <circle cx="6" cy="12" r="3" stroke="currentColor" stroke-width="2"/>
        <circle cx="18" cy="19" r="3" stroke="currentColor" stroke-width="2"/>
        <path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98" stroke="currentColor" stroke-width="2"/>
      </svg>
      <span id="shareBtnLabel">${t('shareBtn')}</span>
    </button>
  `;

  const placeholder = document.getElementById('resultsPlaceholder');
  const content = document.getElementById('resultsContent');
  const panel = document.getElementById('resultsPanel');

  placeholder.style.display = 'none';
  panel.style.alignItems = 'flex-start';
  content.style.display = 'flex';
  content.innerHTML = html;

  setTimeout(() => {
    const bar = document.getElementById('bmiBar');
    if (bar) bar.style.width = `${Math.min(bmiCat.pct, 100)}%`;
  }, 200);

  if (window.innerWidth <= 1024) {
    document.getElementById('resultsPanel').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

function buildSchedule(planDays, frequency) {
  const dayNames = t('dayNames');
  const schedule = [];

  // Optimal training day indices — maximally spread rest days across the week
  // 3 days: Mon/Wed/Fri  →  T R T R T R R
  // 4 days: Mon/Tue/Thu/Sat  →  T T R T R T R
  // 5 days: Mon/Tue/Thu/Fri/Sun  →  T T R T T R T
  // 6 days: Mon–Sat  →  T T T T T T R
  // 7 days: Every day  →  T T T T T T T
  const OPTIMAL = {
    3: [0, 2, 4],
    4: [0, 1, 3, 5],
    5: [0, 1, 3, 4, 6],
    6: [0, 1, 2, 3, 4, 5],
    7: [0, 1, 2, 3, 4, 5, 6]
  };

  const trainingDays = new Set(OPTIMAL[frequency] || OPTIMAL[4]);
  let trainingIdx = 0;

  for (let i = 0; i < 7; i++) {
    if (trainingDays.has(i)) {
      schedule.push({ day: dayNames[i], plan: planDays[trainingIdx % planDays.length], rest: false });
      trainingIdx++;
    } else {
      schedule.push({ day: dayNames[i], rest: true });
    }
  }

  return schedule.map(s => `
    <div class="schedule-day">
      <div class="day-badge">${s.day}</div>
      <div class="day-info">
        <div class="day-title">${s.rest ? t('restDay') : `🏃 ${s.plan.type}`}</div>
        <div class="day-detail">${s.rest ? t('restDetail') : s.plan.exercises}</div>
      </div>
    </div>
  `).join('');
}

// ── Export PDF (html2pdf.js) ─────────────────────────
function exportPDF() {
  const content = document.getElementById('resultsContent');
  if (!content || content.style.display === 'none') return;

  const btn = document.querySelector('.export-btn');
  if (btn) {
    btn.disabled = true;
    btn.style.opacity = '0.6';
    btn.querySelector('span').textContent = state.lang === 'zh' ? '正在生成 PDF…' : 'Generating PDF…';
  }

  const goalName = t('goalLabels')[state.goal] || state.goal;
  const levelName = t('levelLabels')[state.level] || state.level;
  const filename = `Morphix_${goalName}_${levelName}_${new Date().toISOString().slice(0,10)}.pdf`;

  const opt = {
    margin:       [10, 10, 10, 10],
    filename:     filename,
    image:        { type: 'jpeg', quality: 0.98 },
    html2canvas:  { scale: 2, useCORS: true, backgroundColor: '#0d1030' },
    jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' },
    pagebreak:    { mode: ['avoid-all', 'css', 'legacy'] }
  };

  html2pdf().set(opt).from(content).save().then(() => {
    if (btn) {
      btn.disabled = false;
      btn.style.opacity = '1';
      btn.querySelector('span').textContent = t('exportBtn');
    }
  }).catch(() => {
    if (btn) {
      btn.disabled = false;
      btn.style.opacity = '1';
      btn.querySelector('span').textContent = t('exportBtn');
    }
  });
}

// ── Navbar Scroll Effect ───────────────────────────────
window.addEventListener('scroll', () => {
  const navbar = document.getElementById('navbar');
  if (window.scrollY > 50) navbar.classList.add('scrolled');
  else navbar.classList.remove('scrolled');
});

// ── Intersection Observer for Animations ──────────────
const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('visible'); });
}, { threshold: 0.1 });

document.querySelectorAll('.fade-in').forEach(el => io.observe(el));
document.querySelectorAll('.feature-card').forEach((card) => {
  const delay = parseInt(card.dataset.delay || 0);
  card.style.animationDelay = `${delay}ms`;
  io.observe(card);
});

// ── Particle Canvas ────────────────────────────────────
(function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  const ctx = canvas.getContext('2d');
  let particles = [];

  function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
  window.addEventListener('resize', resize);
  resize();

  function createParticle() {
    return {
      x: Math.random() * canvas.width, y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.4, vy: (Math.random() - 0.5) * 0.4,
      size: Math.random() * 2 + 0.5, alpha: Math.random() * 0.5 + 0.1,
      color: Math.random() > 0.5 ? '0, 212, 255' : '168, 85, 247'
    };
  }

  for (let i = 0; i < 60; i++) particles.push(createParticle());

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width) p.x = 0;
      if (p.y < 0) p.y = canvas.height;
      if (p.y > canvas.height) p.y = 0;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.color}, ${p.alpha})`;
      ctx.fill();
    });
    particles.forEach((p, i) => {
      particles.slice(i + 1).forEach(q => {
        const dx = p.x - q.x, dy = p.y - q.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = `rgba(0, 212, 255, ${0.08 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.5; ctx.stroke();
        }
      });
    });
    requestAnimationFrame(animate);
  }
  animate();
})();

// ── LocalStorage ──────────────────────────────────────
const LS_KEY = 'morphix_data';

function saveToLocalStorage() {
  const data = {
    height: document.getElementById('height').value,
    age: document.getElementById('age').value,
    currentWeight: document.getElementById('currentWeight').value,
    targetWeight: document.getElementById('targetWeight').value,
    gender: state.gender,
    dailyTime: state.dailyTime,
    frequency: state.frequency,
    goal: state.goal,
    intensity: state.intensity,
    level: state.level,
    lang: state.lang
  };
  try { localStorage.setItem(LS_KEY, JSON.stringify(data)); } catch(e) {}
}

function loadFromLocalStorage() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch(e) { return null; }
}

function clearSavedData() {
  localStorage.removeItem(LS_KEY);
  // Flash feedback
  const btn = document.getElementById('clearDataBtn');
  if (btn) {
    const orig = btn.textContent;
    btn.textContent = t('dataCleared');
    btn.style.borderColor = 'rgba(16,185,129,0.5)';
    btn.style.color = '#10b981';
    setTimeout(() => {
      btn.textContent = orig;
      btn.style.borderColor = '';
      btn.style.color = '';
    }, 2000);
  }
}

function applyFormData(data) {
  if (data.height) document.getElementById('height').value = data.height;
  if (data.age) document.getElementById('age').value = data.age;
  if (data.currentWeight) document.getElementById('currentWeight').value = data.currentWeight;
  if (data.targetWeight) document.getElementById('targetWeight').value = data.targetWeight;
  if (data.gender) selectGender(data.gender);
  if (data.dailyTime) {
    document.getElementById('dailyTime').value = data.dailyTime;
    updateTimeDisplay(data.dailyTime);
  }
  if (data.frequency) selectFrequency(parseInt(data.frequency));
  if (data.goal) selectGoal(data.goal);
  if (data.intensity) selectIntensity(data.intensity);
  if (data.level) selectLevel(data.level);
  if (data.lang && data.lang !== state.lang) {
    state.lang = data.lang;
    document.getElementById('langLabel').textContent = state.lang === 'zh' ? 'EN' : '中';
    document.documentElement.lang = state.lang === 'zh' ? 'zh-CN' : 'en';
    applyTranslations();
  }
}

// ── URL Parameter Sharing ─────────────────────────────
function getShareURL() {
  const params = new URLSearchParams();
  const h = document.getElementById('height').value;
  const a = document.getElementById('age').value;
  const cw = document.getElementById('currentWeight').value;
  const tw = document.getElementById('targetWeight').value;
  if (h) params.set('h', h);
  if (a) params.set('a', a);
  if (cw) params.set('cw', cw);
  if (tw) params.set('tw', tw);
  params.set('g', state.gender);
  params.set('t', state.dailyTime);
  params.set('f', state.frequency);
  params.set('goal', state.goal);
  params.set('it', state.intensity);
  params.set('lv', state.level);
  params.set('lang', state.lang);
  return window.location.origin + window.location.pathname + '?' + params.toString();
}

function shareLink() {
  const url = getShareURL();
  navigator.clipboard.writeText(url).then(() => {
    const btn = document.getElementById('shareBtnLabel');
    if (btn) {
      const orig = btn.textContent;
      btn.textContent = t('shareCopied');
      setTimeout(() => { btn.textContent = orig; }, 2500);
    }
  }).catch(() => {
    // Fallback: select a temporary input
    const tmp = document.createElement('input');
    tmp.value = url;
    document.body.appendChild(tmp);
    tmp.select();
    document.execCommand('copy');
    document.body.removeChild(tmp);
    const btn = document.getElementById('shareBtnLabel');
    if (btn) {
      const orig = btn.textContent;
      btn.textContent = t('shareCopied');
      setTimeout(() => { btn.textContent = orig; }, 2500);
    }
  });
}

function parseURLParams() {
  const params = new URLSearchParams(window.location.search);
  if (params.size === 0) return null;
  return {
    height: params.get('h') || '',
    age: params.get('a') || '',
    currentWeight: params.get('cw') || '',
    targetWeight: params.get('tw') || '',
    gender: params.get('g') || 'male',
    dailyTime: params.get('t') || 45,
    frequency: params.get('f') || 4,
    goal: params.get('goal') || 'balance',
    intensity: params.get('it') || 'balanced',
    level: params.get('lv') || 'beginner',
    lang: params.get('lang') || 'zh'
  };
}

// ── Live Preview ──────────────────────────────────────
function updateLivePreview() {
  // Only update if full results are NOT currently shown
  const content = document.getElementById('resultsContent');
  if (content && content.style.display !== 'none') return;

  const h = parseFloat(document.getElementById('height').value);
  const a = parseFloat(document.getElementById('age').value);
  const cw = parseFloat(document.getElementById('currentWeight').value);
  const tw = parseFloat(document.getElementById('targetWeight').value);

  const placeholder = document.getElementById('resultsPlaceholder');
  if (!placeholder) return;

  // Need at least height + weight for BMI
  if (!h || h < 100 || h > 250 || !cw || cw < 30 || cw > 300) {
    placeholder.innerHTML = `
      <div class="placeholder-icon">
        <svg viewBox="0 0 80 80" fill="none" width="80" height="80">
          <circle cx="40" cy="40" r="36" stroke="rgba(255,255,255,0.1)" stroke-width="2" stroke-dasharray="4 4"/>
          <path d="M28 40l8 8 16-16" stroke="url(#pGrad)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
          <defs>
            <linearGradient id="pGrad" x1="0" y1="0" x2="80" y2="80">
              <stop stop-color="#00d4ff"/>
              <stop offset="1" stop-color="#a855f7"/>
            </linearGradient>
          </defs>
        </svg>
      </div>
      <p id="resultsPlaceholderMsg">${t('placeholderMsg')}</p>
    `;
    return;
  }

  const bmi = parseFloat(calcBMI(cw, h));
  const bmiCat = getBMICategory(bmi);

  let previewCards = `
    <div class="preview-card">
      <div class="preview-label">${t('previewBmi')}</div>
      <div class="preview-value bmi-${bmiCat.cls}">${bmi}</div>
      <div class="preview-sub">${bmiCat.label}</div>
    </div>
  `;

  // If age is also available, show TDEE + target calories
  if (a && a >= 15 && a <= 80) {
    const bmr = calcBMR(cw, h, a, state.gender);
    const tdee = calcTDEE(bmr, state.frequency, state.level);
    const targetCal = targetCalories(tdee, state.goal, state.intensity);
    const calBurned = calcCaloriesBurned(cw, state.dailyTime, state.goal, state.level);

    previewCards += `
      <div class="preview-card">
        <div class="preview-label">${t('previewTdee')}</div>
        <div class="preview-value">${tdee}</div>
        <div class="preview-sub">kcal</div>
      </div>
      <div class="preview-card">
        <div class="preview-label">${t('previewCal')}</div>
        <div class="preview-value">${targetCal}</div>
        <div class="preview-sub">kcal</div>
      </div>
    `;

    if (tw && tw >= 30 && tw <= 300) {
      const weeks = estimateWeeks(cw, tw, state.goal === 'balance' ? 'lose' : state.goal, state.intensity);
      previewCards += `
        <div class="preview-card">
          <div class="preview-label">${t('estTime')}</div>
          <div class="preview-value">${weeks > 0 ? tf('weeksUnit', weeks) : t('goalReached')}</div>
          <div class="preview-sub">⚡ ${calBurned} kcal/${state.lang === 'zh' ? '次' : 'session'}</div>
        </div>
      `;
    }
  }

  placeholder.innerHTML = `
    <div class="live-preview">
      <div class="preview-grid">${previewCards}</div>
      <p class="preview-hint">${t('previewHint')}</p>
    </div>
  `;
}

// ── Form Input Listeners (for live preview + localStorage) ──
function initFormListeners() {
  ['height', 'age', 'currentWeight', 'targetWeight'].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('input', () => {
        saveToLocalStorage();
        updateLivePreview();
      });
    }
  });
}

// ── Init ───────────────────────────────────────────────
(function init() {
  // 1. URL params take priority, then localStorage
  const urlData = parseURLParams();
  const lsData = loadFromLocalStorage();
  const initData = urlData || lsData;

  if (initData) {
    applyFormData(initData);
  } else {
    updateTimeDisplay(45);
  }

  // 2. Set up form listeners for live preview
  initFormListeners();

  // 3. Trigger initial preview
  updateLivePreview();

  // 4. If loaded from URL with complete data, auto-generate
  if (urlData) {
    const h = parseFloat(document.getElementById('height').value);
    const a = parseFloat(document.getElementById('age').value);
    const cw = parseFloat(document.getElementById('currentWeight').value);
    const tw = parseFloat(document.getElementById('targetWeight').value);
    if (h && a && cw && tw) {
      setTimeout(() => generatePlan(), 300);
    }
  }
})();

document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      const top = target.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});
