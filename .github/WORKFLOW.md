# 🚀 AI-Powered Development Workflow

This document describes the automated development workflow for the Tower Defense game project using Claude Code and GitHub Actions.

## 📋 Table of Contents

1. [Workflow Overview](#workflow-overview)
2. [Claude Code Setup](#claude-code-setup)
3. [GitHub Actions Setup](#github-actions-setup)
4. [Development Process](#development-process)
5. [Best Practices](#best-practices)

---

## Workflow Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Developer (You)                          │
│                  提供 Prompt/需求描述                        │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│                Claude Code (Local)                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   /feature   │  │    /fix      │  │  /refactor   │     │
│  │   /review    │  │    /ship     │  │   SubAgents  │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│                                                             │
│  • 自动分析需求                                              │
│  • 自动编写代码                                              │
│  • 自动测试验证                                              │
│  • 自动创建 PR                                               │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│              GitHub Actions (CI/CD)                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   CI Tests   │  │ Claude Review│  │Deploy Preview│     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│                                                             │
│  • 自动运行测试                                              │
│  • AI 代码审查                                               │
│  • 部署预览环境                                              │
│  • 自动合并 (可选)                                           │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│                Production Deployment                        │
│              合并到 main → 自动部署生产环境                  │
└─────────────────────────────────────────────────────────────┘
```

---

## Claude Code Setup

### 1. Available Slash Commands

在项目根目录运行 Claude Code，使用以下命令：

#### `/feature <description>`
开发新功能的完整工作流

**用法示例：**
```
/feature 添加一个新的塔类型：激光塔，具有穿透攻击能力
```

**自动执行：**
- 分析需求并创建任务列表
- 探索相关代码库
- 实现新功能
- 运行 TypeScript 编译和 ESLint
- 创建 Git commit
- 创建 Pull Request

#### `/fix <issue>`
修复 bug 的完整工作流

**用法示例：**
```
/fix 敌人到达终点后游戏没有扣除生命值
```

**自动执行：**
- 定位问题代码
- 理解根本原因
- 实现修复
- 验证修复效果
- 创建 PR

#### `/refactor <target>`
重构代码

**用法示例：**
```
/refactor 将塔的攻击逻辑提取到独立的系统类中
```

#### `/review`
对当前更改进行代码审查

**自动检查：**
- 代码质量和最佳实践
- TypeScript 类型安全
- React 和 Phaser 3 最佳实践
- 性能问题
- 安全漏洞

#### `/ship`
完成开发并准备发布

**自动执行：**
- 运行完整构建
- 运行 Linter
- 创建有意义的 commit message
- Push 到远程分支
- 创建详细的 PR

### 2. SubAgents 使用

在 Slash Commands 中，已经配置好使用 SubAgents：

- **Explore Agent**: 用于理解代码库结构
  ```
  Use Task tool with subagent_type="Explore" to understand codebase
  ```

- **General-Purpose Agent**: 用于复杂的多步骤任务
  ```
  自动在 /feature 命令中使用，处理功能开发
  ```

### 3. 配置权限

编辑 `.claude/settings.local.json` 添加你需要的权限：

```json
{
  "permissions": {
    "allow": [
      "Bash(npm run build)",
      "Bash(npm run lint)",
      "Bash(git *)"
    ],
    "deny": [],
    "ask": []
  }
}
```

---

## GitHub Actions Setup

### 1. 配置 Secrets

在 GitHub 仓库的 Settings → Secrets and variables → Actions 中添加：

#### 必需的 Secrets:
- `ANTHROPIC_API_KEY`: Claude API 密钥（用于 AI 代码审查）

#### 可选的 Secrets（根据部署平台）:

**Vercel:**
- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

**Netlify:**
- `NETLIFY_AUTH_TOKEN`
- `NETLIFY_SITE_ID`

**GitHub Pages:**
- 无需额外配置，使用 `GITHUB_TOKEN`（自动提供）

### 2. 启用 GitHub Pages（如果使用）

1. Settings → Pages
2. Source: Deploy from a branch
3. Branch: `gh-pages` / `root`
4. Save

### 3. Workflow 说明

#### `ci.yml` - 持续集成
**触发时机：** 任何 PR 或 push 到 main/develop

**执行内容：**
- ESLint 代码检查
- TypeScript 类型检查
- 构建项目
- 上传构建产物

#### `deploy-preview.yml` - 预览部署
**触发时机：** PR 创建或更新

**执行内容：**
- 构建项目
- 部署到预览环境（Vercel/Netlify/GitHub Pages）
- 在 PR 中评论预览链接

**启用方法：**
编辑文件，将对应平台的 `if: false` 改为 `if: true`

#### `claude-review.yml` - AI 代码审查
**触发时机：** PR 创建或更新

**执行内容：**
- 获取代码变更
- 调用 Claude API 进行代码审查
- 在 PR 中发布审查评论

**前置条件：** 需要配置 `ANTHROPIC_API_KEY`

#### `auto-merge.yml` - 自动合并
**触发时机：** PR 的所有检查通过

**执行内容：**
- 检查所有 CI 是否通过
- 自动合并 PR（使用 squash 模式）
- 删除源分支

**触发条件：**
- PR 创建者是 `github-actions[bot]`，或
- PR 有 `auto-merge` 标签

#### `deploy-production.yml` - 生产部署
**触发时机：** push 到 main 分支

**执行内容：**
- 运行完整测试
- 构建生产版本
- 部署到生产环境
- 创建部署通知

---

## Development Process

### 典型的开发流程

#### 1. 开发新功能

```bash
# 在 Claude Code 中
/feature 添加一个新的敌人类型：飞行敌人，可以飞越障碍物
```

Claude Code 会：
1. 创建 todo list
2. 探索现有代码
3. 实现功能
4. 运行测试
5. 创建 PR

#### 2. 自动化流程接管

GitHub Actions 自动：
1. 运行 CI 检查 (`.github/workflows/ci.yml`)
2. Claude AI 审查代码 (`.github/workflows/claude-review.yml`)
3. 部署预览环境 (`.github/workflows/deploy-preview.yml`)

#### 3. 审查和合并

你可以：
- 查看 Claude 的代码审查建议
- 在预览环境中测试功能
- 添加 `auto-merge` 标签自动合并，或
- 手动合并 PR

#### 4. 生产部署

合并到 main 后：
- 自动运行生产部署 (`.github/workflows/deploy-production.yml`)
- 部署到生产环境
- 创建部署通知

### 快速开发循环

```bash
# 1. 提供需求
/feature <your feature description>

# 2. Claude 自动开发并创建 PR

# 3. GitHub Actions 自动检查和审查

# 4. 如果一切正常，自动合并和部署
```

---

## Best Practices

### 1. Prompt 编写技巧

**好的 Prompt:**
```
/feature 实现塔的升级系统：
- 每座塔可以升级 3 次
- 每次升级增加 25% 的伤害和 10% 的攻击速度
- 升级费用为基础价格的 50%/75%/100%
- 在 UI 中显示升级按钮和当前等级
```

**不好的 Prompt:**
```
/feature 塔升级
```

**原则:**
- 具体描述需求
- 包含关键参数和数值
- 说明 UI 交互要求
- 提及集成点

### 2. 代码审查流程

#### 自动审查（Claude AI）
- 每个 PR 都会自动获得 AI 审查
- 关注：代码质量、最佳实践、潜在 bug、性能

#### 手动审查（可选）
- 对于关键功能，仍建议人工审查
- 关注：业务逻辑、用户体验、架构决策

### 3. 测试策略

当前项目使用手动测试，建议逐步添加：

**短期:**
- 类型检查（已配置）
- ESLint（已配置）
- 手动测试清单

**中期:**
- 单元测试（Jest + Testing Library）
- 组件测试

**长期:**
- E2E 测试（Playwright）
- 性能测试
- 视觉回归测试

### 4. 分支策略

```
main (生产)
  ↑
  └─ develop (开发)
       ↑
       ├─ feature/laser-tower
       ├─ feature/enemy-waves
       ├─ fix/collision-bug
       └─ refactor/state-management
```

**建议:**
- `main`: 生产环境，只接受来自 `develop` 的 PR
- `develop`: 开发环境，接受功能分支的 PR
- `feature/*`: 新功能
- `fix/*`: Bug 修复
- `refactor/*`: 代码重构

### 5. Commit Message 规范

Claude Code 会自动生成规范的 commit message：

```
feat: add laser tower with penetration attack

Implements a new tower type that fires laser beams capable of
hitting multiple enemies in a line. Includes:
- LaserTower class extending Tower base class
- Laser beam animation and effects
- Damage calculation for multiple targets
- UI integration for tower placement

🤖 Generated with Claude Code
Co-Authored-By: Claude <noreply@anthropic.com>
```

### 6. 性能优化建议

- 使用 Phaser 对象池避免频繁创建/销毁
- 实现空间分区优化碰撞检测
- 使用 React.memo 优化 UI 组件
- 监控 FPS 和内存使用

### 7. 安全考虑

- 不要在代码中硬编码密钥
- 使用 GitHub Secrets 管理敏感信息
- 审查依赖包的安全漏洞
- 定期更新依赖

---

## Troubleshooting

### Claude Code 相关

**问题：** Slash command 不工作
**解决：** 确保 `.claude/commands/` 目录下的 `.md` 文件使用正确的参数语法（`$ARGUMENTS` 或 `$1 $2 ...`）

**问题：** 权限被拒绝
**解决：** 编辑 `.claude/settings.local.json` 添加相应权限到 `allow` 列表

**问题：** SubAgent 没有使用
**解决：** 检查 slash command 中是否包含了使用 Task tool 的指令

### GitHub Actions 相关

**问题：** CI 失败
**解决：**
1. 检查 npm 依赖是否正确
2. 本地运行 `npm run build` 和 `npm run lint` 确认通过
3. 查看 GitHub Actions 日志定位具体错误

**问题：** Claude Review 失败
**解决：**
1. 确认 `ANTHROPIC_API_KEY` 已配置
2. 检查 API 密钥是否有效
3. 确认 API 配额充足

**问题：** Auto-merge 不工作
**解决：**
1. 确认 PR 有 `auto-merge` 标签或由 bot 创建
2. 确认所有 CI checks 都通过
3. 检查分支保护规则设置

**问题：** 部署失败
**解决：**
1. 确认对应平台的 secrets 已配置
2. 确认部署配置正确（workflow 文件中的 `if: false` 改为 `if: true`）
3. 检查部署平台的访问权限

---

## Next Steps

### 立即可用
- ✅ Slash Commands（已配置）
- ✅ CI/CD（已配置）
- ✅ 代码审查（需配置 API key）

### 需要配置
- ⚙️ 配置 `ANTHROPIC_API_KEY` 启用 AI 审查
- ⚙️ 选择并配置部署平台（Vercel/Netlify/GitHub Pages）
- ⚙️ 根据需要启用 auto-merge

### 建议添加
- 📝 添加单元测试
- 📝 添加 E2E 测试
- 📝 配置代码覆盖率报告
- 📝 添加性能监控
- 📝 添加错误追踪（如 Sentry）

---

## 总结

这套工作流让你可以：

1. **只需提供 Prompt** - 描述你想要的功能
2. **Claude Code 自动开发** - 分析、实现、测试、提交
3. **GitHub Actions 自动检查** - CI、审查、部署
4. **自动化发布** - 合并后自动部署到生产

**核心理念：** Prompt → Code → Review → Deploy，全程自动化

开始使用：
```bash
cd td-template-web
# 使用 Claude Code
/feature 你的功能描述
```

享受 AI 驱动的开发体验！🚀
