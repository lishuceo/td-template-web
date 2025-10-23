# Tower Defense Game

一款极简主义扁平化设计风格的2D塔防游戏。

## 🎮 游戏特性

- 10个精心设计的关卡
- 3种敌人类型（普通、精英、Boss）
- 3种防御塔类型（箭塔、减速塔、范围塔）
- 防御塔升级系统
- 波次管理系统
- 经济系统
- 扁平化美术风格配合长阴影效果

## 🛠️ 技术栈

- **前端框架**: React 18 + TypeScript
- **游戏引擎**: Phaser 3
- **构建工具**: Vite
- **状态管理**: Zustand
- **样式**: Tailwind CSS
- **AI 开发**: Claude Code

## 🚀 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览生产版本
npm run preview
```

## 🤖 AI 驱动的开发工作流

本项目配置了 Claude Code 和 GitHub Actions，实现全自动化开发流程。

### 使用 Claude Code

项目包含自定义 Slash Commands 用于快速开发：

```bash
# 开发新功能
/feature <功能描述>

# 修复 Bug
/fix <问题描述>

# 重构代码
/refactor <目标>

# 代码审查
/review

# 发布到生产环境
/ship
```

**示例：**
```bash
/feature 添加一个新的塔类型：激光塔，具有穿透攻击能力
```

Claude Code 会自动：
1. 分析需求
2. 探索代码库
3. 实现功能
4. 运行测试
5. 创建 Pull Request

### 自动化 CI/CD

创建 PR 后，GitHub Actions 自动执行：

- ✅ TypeScript 类型检查
- ✅ ESLint 代码检查
- ✅ 构建项目
- 🤖 Claude AI 代码审查
- 🚀 部署预览环境
- ✨ 自动合并（可选）

### 完整文档

详见 [.github/WORKFLOW.md](.github/WORKFLOW.md) 查看完整工作流文档。

## 📁 项目结构

```
td-template-web/
├── .claude/                  # Claude Code 配置
│   ├── commands/            # 自定义 Slash Commands
│   └── settings.local.json  # 本地权限配置
├── .github/
│   ├── workflows/           # GitHub Actions 工作流
│   └── WORKFLOW.md          # 工作流文档
├── src/
│   ├── components/          # React UI 组件
│   ├── game/               # Phaser 游戏代码
│   │   ├── scenes/         # 游戏场景
│   │   ├── entities/       # 游戏实体
│   │   ├── managers/       # 游戏管理器
│   │   └── config/         # 游戏配置
│   ├── store/              # Zustand 状态管理
│   └── types/              # TypeScript 类型定义
└── public/                  # 静态资源
```

## 🎯 开发理念

本项目采用 AI 优先的开发方式：

1. **Prompt 驱动开发**: 描述需求，Claude Code 自动实现
2. **自动化质量保证**: AI 审查每个 PR
3. **持续部署**: 合并后自动部署
4. **最佳实践**: 内置 React + Phaser 集成模式

## 📚 相关文档

- [游戏设计文档](./GAME_DESIGN.md)
- [工作流文档](.github/WORKFLOW.md)
- [Claude Code 文档](https://docs.claude.com/en/docs/claude-code)
- [Phaser 3 文档](https://photonstorm.github.io/phaser3-docs/)
- [React 文档](https://react.dev/)

## 🤝 贡献指南

1. 使用 Claude Code Slash Commands 进行开发
2. 所有 PR 自动获得 AI 代码审查
3. 遵循 `.github/WORKFLOW.md` 中的自动化工作流

## 📝 许可证

MIT

---

**Powered by Claude Code** 🤖
