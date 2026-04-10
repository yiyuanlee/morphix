<div align="center">

# ⚡ MORPHIX

### *Transform Your Body. Powered by Science.*

[![GitHub Pages](https://img.shields.io/badge/Live%20Demo-yiyuanlee.github.io%2Fmorphix-6C63FF?style=for-the-badge&logo=github)](https://yiyuanlee.github.io/morphix)
[![License](https://img.shields.io/badge/License-MIT-00D4FF?style=for-the-badge)](LICENSE)
[![HTML5](https://img.shields.io/badge/HTML5-Pure-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://github.com/yiyuanlee/morphix)
[![No Dependencies](https://img.shields.io/badge/Dependencies-Zero-00FF88?style=for-the-badge)](https://github.com/yiyuanlee/morphix)

> **Morphix** is an AI-driven fitness planning engine that generates fully personalized workout schedules and nutrition targets — based on your body metrics, goals, and lifestyle. No login. No subscription. Just results.

</div>

---

## 🔥 Features

| Module | Description |
|--------|-------------|
| 📊 **BMI Analysis** | Instant body mass index calculation with health range indicators |
| 🏋️ **7-Day Training Plan** | Adaptive routines across Beginner / Intermediate / Advanced levels |
| 🥗 **Macro Nutrition** | Daily calorie, protein, carb & fat targets calibrated to your goal |
| ⏱️ **Goal Timeline** | Science-backed prediction of weeks needed to reach target weight |
| 🔥 **TDEE Calculator** | Basal metabolic rate + activity factor energy expenditure model |
| 🎯 **3 Goal Modes** | Fat Loss · Recomposition · Muscle Gain — each with distinct protocols |
| 🌐 **Zero Setup** | Pure HTML/CSS/JS — runs anywhere, no install required |

---

## 🚀 Live Demo

👉 **[https://yiyuanlee.github.io/morphix](https://yiyuanlee.github.io/morphix)**

---

## 🛠️ Run Locally

```bash
# Clone the repo
git clone https://github.com/yiyuanlee/morphix.git
cd morphix

# Option A: Python (no install needed)
python -m http.server 8080

# Option B: Node.js
npx serve .

# Then open → http://localhost:8080
```

---

## 🧮 Science Behind Morphix

### Body Mass Index
```
BMI = weight(kg) / height(m)²
```

### Basal Metabolic Rate — Mifflin-St Jeor Equation
```
Male:   BMR = 10×weight + 6.25×height − 5×age + 5
Female: BMR = 10×weight + 6.25×height − 5×age − 161
```

### Total Daily Energy Expenditure
```
TDEE = BMR × Activity Factor  (range: 1.375 – 1.9)
```

### Caloric Targets by Goal
| Goal | Formula | Weekly Change |
|------|---------|---------------|
| 🔥 Fat Loss | TDEE − 500 kcal | ~−0.4 kg/week |
| ⚡ Recomposition | TDEE | Maintain weight |
| 💪 Muscle Gain | TDEE + 300 kcal | Lean bulk |

---

## 🧱 Tech Stack

```
Morphix is intentionally lean — no frameworks, no build tools.
```

- **Structure**: HTML5 Semantic Markup
- **Styling**: Vanilla CSS3 — glassmorphism, gradients, animations
- **Logic**: Vanilla JavaScript ES6+
- **Visual FX**: Canvas API particle system
- **Typography**: Google Fonts — Inter + Outfit
- **Hosting**: GitHub Pages (static, free, fast)

---

## 📁 Project Structure

```
morphix/
├── index.html      # App entry point
├── style.css       # Full design system & animations
├── app.js          # Core logic — BMR, TDEE, plan generator
├── favicon.svg     # Vector app icon
└── README.md       # You are here
```

---

## ⚠️ Disclaimer

Morphix generates fitness plans based on established exercise science principles for **informational purposes only**. Always consult a licensed physician or certified personal trainer before starting any new training program, especially if you have pre-existing health conditions.

---

## 📄 License

[MIT](LICENSE) — Free to use, modify, and distribute.

---

<div align="center">

**Built with ⚡ by [yiyuanlee](https://github.com/yiyuanlee)**

*Morphix — Because transformation starts with a plan.*

</div>
