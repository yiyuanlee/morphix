<div align="center">

# ⚡ MORPHIX

### *Transform Your Body. Powered by Science.*
### *科学驱动，打造你的专属健身计划。*

[![GitHub Pages](https://img.shields.io/badge/Live%20Demo-yiyuanlee.github.io%2Fmorphix-6C63FF?style=for-the-badge&logo=github)](https://yiyuanlee.github.io/morphix)
[![License](https://img.shields.io/badge/License-MIT-00D4FF?style=for-the-badge)](LICENSE)
[![HTML5](https://img.shields.io/badge/HTML5-Pure-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://github.com/yiyuanlee/morphix)
[![i18n](https://img.shields.io/badge/i18n-中文%20%2F%20English-a855f7?style=for-the-badge)](https://yiyuanlee.github.io/morphix)

> **Morphix** is an AI-driven fitness planning engine that generates fully personalized workout schedules and nutrition targets — based on your body metrics, goals, fitness level, and lifestyle. No login. No subscription. Just results.
>
> **Morphix** 是一款 AI 驱动的智能健身引擎，根据你的身体数据、目标、健身水平和生活习惯，自动生成个性化训练计划与营养方案。无需注册，无需付费，即刻开始。

</div>

---

## 🔥 Features / 功能特性

| Module / 模块 | Description / 描述 |
|--------|-------------|
| 📊 **BMI Analysis / BMI 健康评估** | Instant BMI calculation with health range indicators / 精准 BMI 计算与健康范围指示 |
| 🏋️ **7-Day Training Plan / 每周训练计划** | Adaptive routines for Beginner · Intermediate · Advanced / 适配新手·进阶·高级的差异化训练方案 |
| 🥗 **Macro Nutrition / 营养宏量** | Calorie, protein, carb & fat targets by goal and level / 按目标和水平定制的热量、蛋白质、碳水与脂肪 |
| ⏱️ **Goal Timeline / 目标周期** | Science-backed weeks-to-goal prediction / 基于运动科学的达标时间预测 |
| 🔥 **TDEE Calculator / 能量消耗** | BMR + activity factor × level multiplier model / 基础代谢 × 活动系数 × 水平系数模型 |
| 🎯 **3 Goal Modes / 三大模式** | Fat Loss · Recomposition · Muscle Gain / 减脂 · 塑形 · 增肌 |
| 💪 **Level-Aware Engine / 水平感知引擎** | Level deeply affects TDEE, calories, protein, MET, progress rate / 健身水平深度影响所有计算参数 |
| 📄 **PDF Export / PDF 导出** | One-click download as a styled PDF / 一键下载精美排版的 PDF 计划 |
| 🌐 **Bilingual / 双语支持** | Full Chinese / English with one-click toggle / 中英文一键切换 |
| ⚡ **Zero Setup / 零配置** | Pure HTML/CSS/JS — runs anywhere / 纯前端，无需安装，随处运行 |

---

## 🚀 Live Demo / 在线体验

👉 **[https://yiyuanlee.github.io/morphix](https://yiyuanlee.github.io/morphix)**

---

## 🛠️ Run Locally / 本地运行

```bash
# Clone the repo / 克隆仓库
git clone https://github.com/yiyuanlee/morphix.git
cd morphix

# Option A: Python / 方式一：Python
python -m http.server 8080

# Option B: Node.js / 方式二：Node.js
npx serve .

# Open → http://localhost:8080
```

---

## 🧮 Science Behind Morphix / 科学原理

### Body Mass Index / 身体质量指数
```
BMI = weight(kg) / height(m)²
BMI = 体重(kg) / 身高(m)²
```

### Basal Metabolic Rate — Mifflin-St Jeor / 基础代谢率
```
Male / 男:   BMR = 10×weight + 6.25×height − 5×age + 5
Female / 女: BMR = 10×weight + 6.25×height − 5×age − 161
```

### Total Daily Energy Expenditure / 每日总能量消耗
```
TDEE = BMR × Activity Factor × Level Multiplier
TDEE = BMR × 活动系数 × 水平系数
```

### Level Multipliers / 水平系数

The fitness level you select significantly impacts **every** aspect of your plan:

你选择的健身水平会**深度影响**计划的所有维度：

| Level / 水平 | TDEE Multiplier / TDEE 系数 | MET Intensity / 运动强度 | Protein (Lose) / 蛋白质 (减脂) | Protein (Gain) / 蛋白质 (增肌) |
|:---:|:---:|:---:|:---:|:---:|
| 🟢 Beginner / 新手 | ×0.90 | ×0.75 | 1.4 g/kg | 1.6 g/kg |
| 🟡 Intermediate / 进阶 | ×1.00 | ×1.00 | 1.8 g/kg | 2.1 g/kg |
| 🔴 Advanced / 高级 | ×1.12 | ×1.30 | 2.2 g/kg | 2.6 g/kg |

### Caloric Targets / 热量目标

| Goal / 目标 | 🟢 Beginner / 新手 | 🟡 Intermediate / 进阶 | 🔴 Advanced / 高级 | Weekly Rate / 每周进度 |
|:---:|:---:|:---:|:---:|:---:|
| 🔥 Fat Loss / 减脂 | TDEE − 350 | TDEE − 500 | TDEE − 650 | 0.3 – 0.55 kg |
| ⚡ Recomp / 塑形 | TDEE | TDEE | TDEE | Maintain / 维持 |
| 💪 Gain / 增肌 | TDEE + 200 | TDEE + 300 | TDEE + 450 | 0.15 – 0.35 kg |

### Macro Split / 宏量分配

| Level / 水平 | Carbs / 碳水 | Fat / 脂肪 | Rationale / 原因 |
|:---:|:---:|:---:|-----------|
| 🟢 Beginner / 新手 | 42% | 28% | Higher fat for satiety & hormones / 更多脂肪保障饱腹感与激素水平 |
| 🟡 Intermediate / 进阶 | 45% | 25% | Balanced approach / 均衡分配 |
| 🔴 Advanced / 高级 | 48% | 22% | More carbs for high-intensity performance / 更多碳水支撑高强度训练 |

---

## 🧱 Tech Stack / 技术栈

```
Morphix is intentionally lean — minimal dependencies, maximum impact.
Morphix 追求极简 — 最少依赖，最大效果。
```

| Technology / 技术 | Detail / 详情 |
|--------|-------------|
| **Structure / 结构** | HTML5 Semantic Markup / HTML5 语义化标签 |
| **Styling / 样式** | Vanilla CSS3 — glassmorphism, gradients, animations / 原生 CSS3 — 毛玻璃、渐变、动画 |
| **Logic / 逻辑** | Vanilla JavaScript ES6+ / 原生 JavaScript ES6+ |
| **PDF Export / 导出** | [html2pdf.js](https://github.com/eKoopmans/html2pdf.js) (CDN) |
| **Visual FX / 视觉** | Canvas API particle system / Canvas 粒子动画系统 |
| **Typography / 字体** | Google Fonts — Inter + Outfit |
| **i18n / 国际化** | Built-in translation engine / 内置中英文翻译引擎 |
| **Hosting / 部署** | GitHub Pages (static, free, fast / 静态、免费、快速) |

---

## 📁 Project Structure / 项目结构

```
morphix/
├── index.html      # App entry point + html2pdf.js CDN / 入口 + PDF 库
├── style.css       # Design system, animations & print styles / 设计系统与动画
├── app.js          # Core engine — BMR, TDEE, level system, PDF / 核心引擎
├── favicon.svg     # Vector app icon / 矢量图标
└── README.md       # You are here / 你在这里
```

---

## ⚠️ Disclaimer / 免责声明

Morphix generates fitness plans based on established exercise science principles for **informational purposes only**. Always consult a licensed physician or certified personal trainer before starting any new training program, especially if you have pre-existing health conditions.

本计划基于运动科学理论生成，**仅供参考**。如有特殊健康情况，请在开始训练前咨询专业医师或私人教练。

---

## 📄 License / 许可证

[MIT](LICENSE) — Free to use, modify, and distribute. / 自由使用、修改与分发。

---

<div align="center">

**Built with ⚡ by [yiyuanlee](https://github.com/yiyuanlee)**

*Morphix — Because transformation starts with a plan.*

*Morphix — 蜕变，从一份计划开始。*

</div>
