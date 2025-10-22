# Tower Defense Game

一款极简主义扁平化设计风格的2D塔防游戏。

## 技术栈

- **前端框架**: React 18 + TypeScript
- **游戏引擎**: Phaser 3
- **构建工具**: Vite
- **状态管理**: Zustand
- **样式**: Tailwind CSS

## 功能特性

- 10个精心设计的关卡
- 3种敌人类型（普通、精英、Boss）
- 3种防御塔类型（箭塔、减速塔、范围塔）
- 防御塔升级系统
- 波次管理系统
- 经济系统
- 扁平化美术风格配合长阴影效果

## 开发

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

## 游戏设计

详细的游戏设计文档请查看 [GAME_DESIGN.md](./GAME_DESIGN.md)

## 目录结构

```
src/
├── components/          # React UI组件
├── game/                # Phaser游戏逻辑
│   ├── scenes/          # 游戏场景
│   ├── entities/        # 游戏实体（塔、敌人等）
│   ├── managers/        # 游戏管理器
│   └── config/          # 游戏配置
├── store/               # 状态管理
├── types/               # 类型定义
└── utils/               # 工具函数
```

## 许可证

MIT
