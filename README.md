# 🏋️ FitAI · 智能健身计划定制

> 根据你的身高、体重和目标，AI 驱动的个性化健身计划生成器

![FitAI Preview](./preview.png)

## ✨ 功能特点

| 功能 | 描述 |
|------|------|
| 📏 BMI 评估 | 精准计算 BMI，提供健康范围参考 |
| 🏋️ 训练计划 | 7天详细训练安排（新手/进阶/高级） |
| 🥗 营养建议 | 每日热量、蛋白质、碳水、脂肪目标 |
| 📅 时间规划 | 基于科学算法预测达成目标所需周数 |
| 🔥 卡路里计算 | 基础代谢率（BMR）与每日消耗估算 |
| 🎯 多目标支持 | 减脂 / 塑形 / 增肌三种目标模式 |

## 🚀 快速开始

### 在线使用（GitHub Pages）

部署后直接访问：`https://[你的用户名].github.io/fitness-app`

### 本地运行

```bash
# 克隆仓库
git clone https://github.com/[你的用户名]/fitness-app.git
cd fitness-app

# 使用任意 HTTP 服务器（无需安装依赖！）
# 方法一：VS Code 的 Live Server 插件
# 方法二：Python
python -m http.server 8080

# 然后访问 http://localhost:8080
```

## 📖 使用说明

1. **填写基本信息**：身高、年龄、当前体重、目标体重
2. **选择性别**：影响基础代谢率计算
3. **设置训练安排**：每天健身时间（15-120分钟）、每周频率
4. **选择目标**：减脂 🔥 / 塑形 ⚡ / 增肌 💪
5. **选择当前水平**：新手 / 进阶 / 高级
6. **点击生成计划** → 获取专属方案！

## 🧮 计算原理

### BMI 计算
```
BMI = 体重(kg) / 身高(m)²
```

### 基础代谢率（Mifflin-St Jeor 公式）
```
男性：BMR = 10×体重 + 6.25×身高 - 5×年龄 + 5
女性：BMR = 10×体重 + 6.25×身高 - 5×年龄 - 161
```

### 每日总能耗（TDEE）
```
TDEE = BMR × 活动系数（1.375~1.9）
```

### 热量目标
- **减脂**：TDEE - 500 kcal（约每周减重 0.4kg）
- **增肌**：TDEE + 300 kcal（干净增肌）
- **塑形**：维持 TDEE

## 🛠️ 技术栈

- **纯 HTML5 + CSS3 + Vanilla JavaScript**
- 无需任何依赖或构建工具
- 响应式设计，移动端友好
- 粒子动画背景（Canvas API）
- Google Fonts：Inter + Outfit

## 🌐 部署到 GitHub Pages

```bash
# 1. 在 GitHub 创建新仓库 fitness-app
# 2. 推送代码
git init
git add .
git commit -m "🚀 Initial commit: FitAI fitness planner"
git branch -M main
git remote add origin https://github.com/[你的用户名]/fitness-app.git
git push -u origin main

# 3. 在 GitHub 仓库设置中启用 GitHub Pages
#    Settings → Pages → Source: Deploy from branch → main / (root)
```

## ⚠️ 免责声明

本应用生成的健身计划基于运动科学理论，仅供参考。如有特殊健康状况、慢性病或伤病史，请在开始任何训练计划前咨询专业医师或持证私人教练。

## 📄 许可证

MIT License — 自由使用、修改和分发。

---

**Made with ❤️ by FitAI**
