# AI关卡编辑器完整文档

## 目录

1. [概述](#概述)
2. [核心设计原则](#核心设计原则)
3. [快速开始](#快速开始)
4. [核心概念](#核心概念)
5. [API参考](#api参考)
6. [使用示例](#使用示例)
7. [高级特性](#高级特性)
8. [最佳实践](#最佳实践)
9. [测试和验证](#测试和验证)
10. [故障排除](#故障排除)

---

## 概述

AI关卡编辑器是一个专为AI设计的塔防游戏关卡创作工具。它的目标是让AI能够通过简单的自然语言式描述来创建完整、可玩的塔防关卡，而无需处理复杂的几何计算和坐标转换。

### 主要特性

- 🤖 **AI友好** - 简化的配置接口，易于AI理解和生成
- 🏗️ **自动化** - 自动生成城墙、塔位等复杂元素
- ✅ **智能验证** - 详细的错误检查和警告提示
- 🎨 **灵活策略** - 多种塔位生成策略可选
- 📦 **开箱即用** - 内置模板，快速原型

### 设计哲学

传统的关卡编辑器需要设计师手动放置每个元素。而AI关卡编辑器采用"描述性"而非"命令式"的方式：

**传统方式：**
```
放置路径点1在(100, 100)
放置路径点2在(400, 100)
计算城墙左侧点...
计算城墙右侧点...
放置塔位1在(250, 50)
放置塔位2在(250, 150)
...
```

**AI编辑器方式：**
```
路径从(100, 100)到(400, 100)
在城墙上自动放置4个塔位
```

---

## 核心设计原则

### 1. 兵线（路径）

**兵线**是怪物的进攻路线，由一系列路径点组成。

```typescript
path: {
  points: [
    { x: 100, y: 100 },  // 起点（怪物出生点）
    { x: 400, y: 100 },
    { x: 400, y: 300 },
    { x: 700, y: 300 }   // 终点（基地位置）
  ]
}
```

### 2. 自动生成城墙

城墙会**自动**在兵线两侧生成，作为游戏的视觉边界和防御结构。

- 左侧城墙：路径左边
- 右侧城墙：路径右边
- 城墙宽度：可配置（默认40px）
- 城墙距离路径中心：可配置（默认25px + wallWidth/2）

### 3. 塔在城墙上

所有的塔位（建造点）都位于城墙上，玩家只能在这些预定义的位置建造塔。

### 4. 终点是基地

路径的最后一个点就是我方基地的位置，怪物到达这里会对基地造成伤害。

---

## 快速开始

### 安装和导入

```typescript
// 导入主要函数
import { createLevel } from '@game/editor';

// 或导入所有功能
import {
  createLevel,
  validateLevelConfig,
  previewLevelLayout,
  templates
} from '@game/editor';
```

### 第一个关卡

```typescript
const result = createLevel({
  id: 1,
  name: '新手村',
  description: '欢迎来到塔防世界！',

  // 路径配置
  path: {
    points: [
      { x: 100, y: 300 },
      { x: 1100, y: 300 }
    ]
  },

  // 塔位配置
  towerSlots: {
    strategy: 'auto',  // 自动生成
    count: 3           // 3个塔位
  },

  // 波次配置
  waves: [
    {
      batches: [
        { enemyType: 'normal', count: 5, delay: 0 }
      ]
    }
  ]
});

// 检查结果
if (result.level) {
  console.log('✅ 关卡创建成功！');
  console.log('塔位数量:', result.level.slots.length);
} else {
  console.error('❌ 创建失败:', result.validation.errors);
}
```

---

## 核心概念

### AILevelConfig（AI友好的关卡配置）

这是AI用来描述关卡的主要接口：

```typescript
interface AILevelConfig {
  // ========== 基本信息 ==========
  id: number;              // 关卡ID（必须唯一）
  name: string;            // 关卡名称
  description: string;     // 关卡描述

  // ========== 路径配置 ==========
  path: {
    points: PathPoint[];   // 路径点数组（至少2个）
    width?: number;        // 路径宽度（默认50）
  };

  // ========== 塔位配置 ==========
  towerSlots: {
    strategy: TowerSlotStrategy;    // 生成策略
    customPositions?: PathPoint[];  // 自定义位置（strategy='custom'时）
    count?: number;                 // 期望的塔位数量
  };

  // ========== 波次配置 ==========
  waves: WaveConfig[];     // 波次数组

  // ========== 游戏参数（可选）==========
  baseHP?: number;         // 基地生命值（默认20）
  startGold?: number;      // 初始金币（默认500）
}
```

### 塔位生成策略

#### 1. `auto` - 自动智能分配（推荐）

根据路径长度和期望的塔位数量，智能均匀分配塔位。

```typescript
towerSlots: {
  strategy: 'auto',
  count: 5  // 期望生成5个塔位
}
```

**适用场景：** 大多数情况，让系统智能决定位置。

#### 2. `dense` - 密集布置

在路径的每个点附近都生成塔位，塔位数量较多。

```typescript
towerSlots: {
  strategy: 'dense'
}
```

**适用场景：** 需要大量塔位的防御关卡。

#### 3. `sparse` - 稀疏布置

每隔2-3个路径点才生成塔位，数量较少。

```typescript
towerSlots: {
  strategy: 'sparse'
}
```

**适用场景：** 高难度关卡，资源有限。

#### 4. `corners-only` - 仅在转角

只在路径的转角处生成塔位。

```typescript
towerSlots: {
  strategy: 'corners-only'
}
```

**适用场景：** 特殊关卡设计，考验玩家的精准布局。

#### 5. `custom` - 自定义位置

手动指定每个塔位的精确位置。

```typescript
towerSlots: {
  strategy: 'custom',
  customPositions: [
    { x: 300, y: 200 },
    { x: 500, y: 400 },
    { x: 700, y: 600 }
  ]
}
```

**适用场景：** 需要精确控制的特殊关卡。

### 波次配置

每个波次由多个批次（batch）组成：

```typescript
waves: [
  {
    batches: [
      {
        enemyType: 'normal',  // 敌人类型
        count: 10,            // 数量
        delay: 0              // 距离上一批的延迟（秒）
      },
      {
        enemyType: 'elite',
        count: 2,
        delay: 3              // 3秒后出现
      }
    ]
  }
]
```

**敌人类型：**
- `normal` - 普通敌人
- `elite` - 精英敌人（更强）
- `boss` - Boss（最强）

---

## API参考

### 核心函数

#### `createLevel(config, options?)`

创建关卡（包含验证和生成）。

```typescript
function createLevel(
  aiConfig: AILevelConfig,
  options?: LevelGenerationOptions
): {
  level: LevelConfig | null;
  validation: ValidationResult;
}
```

**参数：**
- `aiConfig` - AI关卡配置
- `options` - 生成选项（可选）

**返回：**
- `level` - 生成的关卡配置（验证失败时为null）
- `validation` - 验证结果

**示例：**
```typescript
const { level, validation } = createLevel({
  id: 1,
  name: '测试关卡',
  // ...
});

if (level) {
  // 使用关卡
} else {
  console.error(validation.errors);
}
```

#### `quickGenerateLevel(config, options?)`

快速生成关卡（跳过验证）。

```typescript
function quickGenerateLevel(
  aiConfig: AILevelConfig,
  options?: LevelGenerationOptions
): LevelConfig
```

**适用场景：** 当你确定配置正确时，可以跳过验证以提升性能。

#### `validateLevelConfig(config)`

仅验证配置，不生成关卡。

```typescript
function validateLevelConfig(
  aiConfig: AILevelConfig
): ValidationResult
```

**返回：**
```typescript
interface ValidationResult {
  valid: boolean;       // 是否有效
  errors: string[];     // 错误列表
  warnings: string[];   // 警告列表
}
```

#### `previewLevelLayout(config, options?)`

预览关卡布局（获取城墙和塔位坐标）。

```typescript
function previewLevelLayout(
  aiConfig: AILevelConfig,
  options?: LevelGenerationOptions
): LevelPreview
```

**返回：**
```typescript
interface LevelPreview {
  path: PathPoint[];              // 路径点
  wallPoints: {
    left: PathPoint[];            // 左侧城墙点
    right: PathPoint[];           // 右侧城墙点
  };
  slots: PathPoint[];             // 塔位坐标
  basePosition: PathPoint;        // 基地位置
}
```

#### `exportLevelAsJSON(config, options?, pretty?)`

导出为JSON字符串。

```typescript
function exportLevelAsJSON(
  aiConfig: AILevelConfig,
  options?: LevelGenerationOptions,
  pretty?: boolean
): string
```

#### `exportLevelAsTypeScript(config, options?)`

导出为TypeScript代码。

```typescript
function exportLevelAsTypeScript(
  aiConfig: AILevelConfig,
  options?: LevelGenerationOptions
): string
```

### 生成选项

```typescript
interface LevelGenerationOptions {
  wallWidth?: number;           // 城墙宽度（默认40）
  pathWidth?: number;           // 路径宽度（默认50）
  slotOffset?: number;          // 塔位距城墙偏移（默认20）
  minSlotDistance?: number;     // 塔位最小间距（默认100）
}
```

### 内置模板

```typescript
import { templates } from '@game/editor';

// 简单直线
templates.simpleStraight(id);

// L型路径
templates.lShape(id);

// S型曲线
templates.sShape(id);

// 环形路径
templates.circular(id);
```

---

## 使用示例

### 示例1：简单教学关

```typescript
import { createLevel } from '@game/editor';

const tutorial = createLevel({
  id: 1,
  name: '教学关卡',
  description: '学习基础玩法',
  path: {
    points: [
      { x: 100, y: 300 },
      { x: 1100, y: 300 }
    ]
  },
  towerSlots: {
    strategy: 'auto',
    count: 3
  },
  waves: [
    {
      batches: [
        { enemyType: 'normal', count: 3, delay: 0 }
      ]
    },
    {
      batches: [
        { enemyType: 'normal', count: 5, delay: 0 }
      ]
    }
  ],
  baseHP: 20,
  startGold: 500
});
```

### 示例2：复杂S型关卡

```typescript
const sLevel = createLevel({
  id: 2,
  name: '曲折之路',
  description: 'S型曲线，考验策略布局',
  path: {
    points: [
      { x: 100, y: 200 },
      { x: 400, y: 200 },
      { x: 400, y: 500 },
      { x: 800, y: 500 },
      { x: 800, y: 200 },
      { x: 1100, y: 200 }
    ],
    width: 50
  },
  towerSlots: {
    strategy: 'auto',
    count: 6
  },
  waves: [
    {
      batches: [
        { enemyType: 'normal', count: 10, delay: 0 }
      ]
    },
    {
      batches: [
        { enemyType: 'normal', count: 15, delay: 0 },
        { enemyType: 'elite', count: 3, delay: 3 }
      ]
    },
    {
      batches: [
        { enemyType: 'elite', count: 5, delay: 0 },
        { enemyType: 'normal', count: 20, delay: 2 }
      ]
    }
  ],
  baseHP: 20,
  startGold: 600
});
```

### 示例3：Boss挑战

```typescript
const bossLevel = createLevel({
  id: 10,
  name: '终极之战',
  description: '击败强大的Boss！',
  path: {
    points: [
      { x: 600, y: 100 },
      { x: 900, y: 300 },
      { x: 900, y: 500 },
      { x: 600, y: 600 },
      { x: 300, y: 500 },
      { x: 300, y: 300 },
      { x: 600, y: 100 },
      { x: 600, y: 350 },
      { x: 100, y: 350 }
    ]
  },
  towerSlots: {
    strategy: 'auto',
    count: 8
  },
  waves: [
    // 热身波次
    {
      batches: [
        { enemyType: 'normal', count: 20, delay: 0 }
      ]
    },
    {
      batches: [
        { enemyType: 'elite', count: 10, delay: 0 },
        { enemyType: 'normal', count: 25, delay: 2 }
      ]
    },
    // Boss波次
    {
      batches: [
        { enemyType: 'elite', count: 15, delay: 0 },
        { enemyType: 'boss', count: 1, delay: 5 }
      ]
    },
    // 最终波次
    {
      batches: [
        { enemyType: 'elite', count: 20, delay: 0 },
        { enemyType: 'boss', count: 2, delay: 4 }
      ]
    }
  ],
  baseHP: 20,
  startGold: 900
});
```

### 示例4：使用模板快速创建

```typescript
import { templates, createLevel } from '@game/editor';

// 使用S型模板
const level1 = createLevel(templates.sShape(101));

// 使用环形模板
const level2 = createLevel(templates.circular(102));

// 修改模板
const customLevel = createLevel({
  ...templates.lShape(103),
  name: '自定义L型',
  startGold: 800,
  waves: [
    // 自定义波次
  ]
});
```

---

## 高级特性

### 1. 预览和调试

```typescript
import { previewLevelLayout } from '@game/editor';

const preview = previewLevelLayout({
  // AILevelConfig...
});

console.log('路径点数:', preview.path.length);
console.log('左城墙点数:', preview.wallPoints.left.length);
console.log('右城墙点数:', preview.wallPoints.right.length);
console.log('塔位数量:', preview.slots.length);
console.log('基地位置:', preview.basePosition);

// 可视化塔位
preview.slots.forEach((slot, i) => {
  console.log(`塔位${i + 1}: (${slot.x}, ${slot.y})`);
});
```

### 2. 自定义生成参数

```typescript
import { createLevel } from '@game/editor';

const level = createLevel(
  {
    // AILevelConfig...
  },
  {
    // 自定义生成参数
    wallWidth: 50,           // 更宽的城墙
    pathWidth: 60,           // 更宽的路径
    slotOffset: 30,          // 塔位更远离城墙
    minSlotDistance: 150     // 塔位间距更大
  }
);
```

### 3. 批量创建关卡

```typescript
import { createLevel, templates } from '@game/editor';

const levels = [];

// 使用模板创建一系列关卡
for (let i = 1; i <= 5; i++) {
  const template = i % 2 === 0
    ? templates.sShape(i)
    : templates.lShape(i);

  const result = createLevel({
    ...template,
    name: `关卡${i}`,
    startGold: 500 + i * 50,  // 递增金币
    waves: [
      // 根据i动态调整难度
      {
        batches: [
          {
            enemyType: 'normal',
            count: 5 + i * 2,
            delay: 0
          }
        ]
      }
    ]
  });

  if (result.level) {
    levels.push(result.level);
  }
}

console.log(`成功创建${levels.length}个关卡`);
```

### 4. 验证和错误处理

```typescript
import { validateLevelConfig, createLevel } from '@game/editor';

const config: AILevelConfig = {
  // ... 配置
};

// 先验证
const validation = validateLevelConfig(config);

if (validation.errors.length > 0) {
  console.error('配置错误：');
  validation.errors.forEach(err => console.error('  -', err));
  return;
}

if (validation.warnings.length > 0) {
  console.warn('配置警告：');
  validation.warnings.forEach(warn => console.warn('  -', warn));
}

// 验证通过后再生成
const { level } = createLevel(config);
```

---

## 最佳实践

### 1. 路径设计

**推荐：**
- 路径点之间距离：100-400px
- 总路径长度：800-3000px
- 转角角度：避免过于锐利（< 30度）
- 路径点数量：3-10个

**避免：**
- 相邻点距离太近（< 50px）
- 相邻点距离太远（> 500px）
- 路径交叉或重叠
- 过于复杂的曲线（> 15个点）

### 2. 塔位布局

**推荐：**
- 使用 `auto` 策略作为起点
- 塔位数量：3-8个（基于路径长度）
- 确保覆盖路径的关键区域

**避免：**
- 塔位过少（< 2）
- 塔位过多（> 15）
- 塔位分布不均

### 3. 波次平衡

**推荐：**
```typescript
waves: [
  // 第1波：简单热身
  {
    batches: [
      { enemyType: 'normal', count: 5, delay: 0 }
    ]
  },
  // 第2波：数量增加
  {
    batches: [
      { enemyType: 'normal', count: 10, delay: 0 }
    ]
  },
  // 第3波：引入精英
  {
    batches: [
      { enemyType: 'normal', count: 15, delay: 0 },
      { enemyType: 'elite', count: 2, delay: 3 }
    ]
  },
  // 第4波：Boss挑战
  {
    batches: [
      { enemyType: 'elite', count: 5, delay: 0 },
      { enemyType: 'boss', count: 1, delay: 5 }
    ]
  }
]
```

**难度曲线：**
- 逐步增加敌人数量
- 逐步引入更强的敌人类型
- Boss通常在后期波次出现
- 每波之间留有准备时间

### 4. 经济平衡

```typescript
// 初始金币应该足够建造2-3座塔
startGold: 500  // 对于塔成本100-150的游戏

// 基地生命值基于难度
baseHP: 20      // 标准难度
baseHP: 10      // 困难难度
baseHP: 30      // 简单难度
```

---

## 测试和验证

关卡编辑器提供了完整的测试套件，确保所有功能正常工作。

### 运行测试

#### 方法1：浏览器测试页面（推荐）

1. 启动开发服务器：
```bash
npm run dev
```

2. 在浏览器中打开：
```
http://localhost:5173/src/game/editor/test-runner.html
```

3. 点击 "运行所有测试" 按钮

#### 方法2：在控制台运行

```javascript
import { testLevelEditor } from './src/game/editor/test.ts';
testLevelEditor();
```

### 测试覆盖

测试套件包含 **50+ 个测试用例**，覆盖：

1. ✅ **基本关卡生成** - 验证基础功能
2. ✅ **路径验证** - 测试各种路径配置
3. ✅ **塔位策略** - 测试所有5种策略
4. ✅ **波次配置** - 验证波次系统
5. ✅ **边界情况** - 测试极端情况
6. ✅ **模板功能** - 验证所有内置模板
7. ✅ **导出功能** - 测试JSON和TS导出
8. ✅ **预览功能** - 验证预览数据
9. ✅ **验证器** - 测试错误检测
10. ✅ **自定义选项** - 验证配置选项

### 快速Demo

运行快速Demo来体验编辑器功能：

```javascript
import { runAllDemos } from './src/game/editor/demo.ts';

// 运行所有Demo
runAllDemos();

// 或运行单个Demo
import {
  demo1_SimpleLevel,
  demo2_UseTemplate,
  demo3_PreviewLevel
} from './src/game/editor/demo.ts';

demo1_SimpleLevel();
```

### 预期测试结果

成功率应该达到 **100%**：

```
========================================
测试结果汇总
========================================
总计: 50+ 个测试
✅ 通过: 50+
❌ 失败: 0
成功率: 100.00%
========================================
```

### 手动验证

你也可以手动验证关卡编辑器：

```typescript
import { createLevel, previewLevelLayout } from '@game/editor';

// 1. 创建测试关卡
const result = createLevel({
  id: 999,
  name: '手动测试',
  description: '验证功能',
  path: {
    points: [
      { x: 100, y: 300 },
      { x: 900, y: 300 }
    ]
  },
  towerSlots: { strategy: 'auto', count: 3 },
  waves: [
    {
      batches: [{ enemyType: 'normal', count: 5, delay: 0 }]
    }
  ]
});

// 2. 检查结果
console.log('验证通过:', result.validation.valid);
console.log('关卡:', result.level);

// 3. 预览布局
const preview = previewLevelLayout(result.level);
console.log('预览:', preview);
```

### 性能基准

- **测试执行时间**: 2-5秒
- **单个关卡生成**: < 10ms
- **验证速度**: < 5ms
- **预览生成**: < 5ms

如果性能低于这些基准，请检查：
- 浏览器性能
- 路径复杂度（点数过多）
- 塔位数量（是否过多）

### 更多测试信息

详细的测试说明和故障排除，请参考：
- `src/game/editor/run-tests.md` - 完整测试指南
- `src/game/editor/test.ts` - 测试源码
- `src/game/editor/demo.ts` - Demo示例

---

## 故障排除

### 常见错误

#### 错误：路径点太少

```
错误: 路径必须至少包含2个点（起点和终点）
```

**解决：** 确保 `path.points` 至少有2个点。

#### 错误：塔位策略无效

```
错误: 无效的塔位策略: xxx
```

**解决：** 使用有效的策略：`'auto'`, `'dense'`, `'sparse'`, `'corners-only'`, `'custom'`

#### 错误：自定义策略缺少位置

```
错误: 自定义策略必须提供塔位位置
```

**解决：**
```typescript
towerSlots: {
  strategy: 'custom',
  customPositions: [
    { x: 100, y: 100 },
    // ... 更多位置
  ]
}
```

### 常见警告

#### 警告：路径点超出游戏区域

```
警告: 路径点1(1300, 800)可能超出游戏区域
```

**解决：** 将坐标限制在游戏区域内（默认1200x700）。

#### 警告：塔位距离路径太近

```
警告: 塔位1距离路径太近(25)，可能阻挡敌人
```

**解决：** 增加 `slotOffset` 参数，或使用自动生成策略。

### 调试技巧

```typescript
// 1. 使用预览查看生成结果
const preview = previewLevelLayout(config);
console.log(preview);

// 2. 分步验证
const validation = validateLevelConfig(config);
console.log('有效:', validation.valid);
console.log('错误:', validation.errors);
console.log('警告:', validation.warnings);

// 3. 导出JSON查看完整配置
const json = exportLevelAsJSON(config, undefined, true);
console.log(json);
```

---

## 附录

### 完整类型定义

```typescript
// 路径点
interface PathPoint {
  x: number;
  y: number;
}

// 塔位策略
type TowerSlotStrategy =
  | 'auto'
  | 'dense'
  | 'sparse'
  | 'corners-only'
  | 'custom';

// 敌人类型
type EnemyType = 'normal' | 'elite' | 'boss';

// 批次配置
interface BatchConfig {
  enemyType: EnemyType;
  count: number;
  delay: number;
}

// 波次配置
interface WaveConfig {
  batches: BatchConfig[];
}

// AI关卡配置
interface AILevelConfig {
  id: number;
  name: string;
  description: string;
  path: {
    points: PathPoint[];
    width?: number;
  };
  towerSlots: {
    strategy: TowerSlotStrategy;
    customPositions?: PathPoint[];
    count?: number;
  };
  waves: WaveConfig[];
  baseHP?: number;
  startGold?: number;
}

// 生成选项
interface LevelGenerationOptions {
  wallWidth?: number;
  pathWidth?: number;
  slotOffset?: number;
  minSlotDistance?: number;
}

// 验证结果
interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

// 关卡预览
interface LevelPreview {
  path: PathPoint[];
  wallPoints: {
    left: PathPoint[];
    right: PathPoint[];
  };
  slots: PathPoint[];
  basePosition: PathPoint;
}
```

---

## 相关资源

- **源代码：** `src/game/editor/`
- **示例代码：** `src/game/editor/examples.ts`
- **类型定义：** `src/game/editor/types.ts`
- **README：** `src/game/editor/README.md`

---

**最后更新：** 2024

**版本：** 1.0.0
