<div align="center">

# ⚡ MORPHIX

### *Transform Your Body. Powered by Science.*

[![GitHub Pages](https://img.shields.io/badge/Live%20Demo-yiyuanlee.github.io%2Fmorphix-6C63FF?style=for-the-badge&logo=github)](https://yiyuanlee.github.io/morphix)
[![License](https://img.shields.io/badge/License-MIT-00D4FF?style=for-the-badge)](LICENSE)
[![HTML5](https://img.shields.io/badge/HTML5-Pure-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://github.com/yiyuanlee/morphix)
[![i18n](https://img.shields.io/badge/i18n-中文%20%2F%20English-a855f7?style=for-the-badge)](https://yiyuanlee.github.io/morphix)

> **Morphix** is an AI-driven fitness planning engine that generates fully personalized workout schedules and nutrition targets — based on your body metrics, goals, fitness level, and lifestyle. No login. No subscription. Just results.

</div>

---

## 🔥 Features

| Module | Description |
|--------|-------------|
| 📊 **BMI Analysis** | Instant body mass index calculation with health range indicators |
| 🏋️ **7-Day Training Plan** | Adaptive routines across Beginner / Intermediate / Advanced levels |
| 🥗 **Macro Nutrition** | Daily calorie, protein, carb & fat targets calibrated to your goal and level |
| ⏱️ **Goal Timeline** | Science-backed prediction of weeks needed to reach target weight |
| 🔥 **TDEE Calculator** | Basal metabolic rate + activity factor × level multiplier energy model |
| 🎯 **3 Goal Modes** | Fat Loss · Recomposition · Muscle Gain — each with distinct protocols |
| 💪 **Level-Aware Engine** | Fitness level deeply affects all calculations — TDEE, calories, protein, MET intensity, progress rate |
| 📄 **PDF Export** | One-click download of your complete plan as a styled PDF |
| 🌐 **Bilingual (i18n)** | Full Chinese / English support with one-click toggle |
| ⚡ **Zero Setup** | Pure HTML/CSS/JS — runs anywhere, no install required |

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
TDEE = BMR × Activity Factor × Level Multiplier
```
| Level | TDEE Multiplier | MET Intensity | Protein (Fat Loss) | Protein (Muscle Gain) |
|-------|:-:|:-:|:-:|:-:|
| 🟢 Beginner | ×0.90 | ×0.75 | 1.4 g/kg | 1.6 g/kg |
| 🟡 Intermediate | ×1.00 | ×1.00 | 1.8 g/kg | 2.1 g/kg |
| 🔴 Advanced | ×1.12 | ×1.30 | 2.2 g/kg | 2.6 g/kg |

### Caloric Targets by Goal & Level
| Goal | Beginner | Intermediate | Advanced | Weekly Progress |
|------|:--------:|:------------:|:--------:|:---------------:|
| 🔥 Fat Loss | TDEE − 350 | TDEE − 500 | TDEE − 650 | 0.3 – 0.55 kg |
| ⚡ Recomposition | TDEE | TDEE | TDEE | Maintain |
| 💪 Muscle Gain | TDEE + 200 | TDEE + 300 | TDEE + 450 | 0.15 – 0.35 kg |

### Macro Split by Level
| Level | Carbohydrate | Fat | Rationale |
|-------|:------------:|:---:|-----------|
| Beginner | 42% | 28% | Higher fat for satiety and hormonal support |
| Intermediate | 45% | 25% | Balanced approach |
| Advanced | 48% | 22% | More carbs for high-intensity performance |

---

## 🧱 Tech Stack

```
Morphix is intentionally lean — minimal dependencies, maximum impact.
```

- **Structure**: HTML5 Semantic Markup
- **Styling**: Vanilla CSS3 — glassmorphism, gradients, animations
- **Logic**: Vanilla JavaScript ES6+
- **PDF Export**: [html2pdf.js](https://github.com/eKoopmans/html2pdf.js) (CDN)
- **Visual FX**: Canvas API particle system
- **Typography**: Google Fonts — Inter + Outfit
- **i18n**: Built-in Chinese / English translation engine
- **Hosting**: GitHub Pages (static, free, fast)

---

## 📁 Project Structure

```
morphix/
├── index.html      # App entry point + html2pdf.js CDN
├── style.css       # Full design system, animations & print styles
├── app.js          # Core logic — BMR, TDEE, level engine, plan generator, PDF export
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
