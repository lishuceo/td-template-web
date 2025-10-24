/**
 * 关卡编辑器使用示例
 *
 * 这个文件展示了如何使用AI关卡编辑器创建各种关卡
 */

import { createLevel, templates, type AILevelConfig } from './index';

// =============================================================================
// 示例1: 创建一个简单的直线关卡
// =============================================================================

export function example1_SimpleStraightLevel() {
  console.log('=== 示例1: 简单直线关卡 ===');

  const result = createLevel({
    id: 101,
    name: '新手村',
    description: '一条简单的直线路径，适合新手熟悉游戏',
    path: {
      points: [
        { x: 100, y: 300 },
        { x: 1100, y: 300 },
      ],
    },
    towerSlots: {
      strategy: 'auto',
      count: 3,
    },
    waves: [
      {
        batches: [{ enemyType: 'normal', count: 5, delay: 0 }],
      },
    ],
  });

  if (result.level) {
    console.log('✅ 关卡创建成功！');
    console.log('路径点数:', result.level.path.length);
    console.log('塔位数:', result.level.slots.length);
    console.log('波次数:', result.level.waves.length);
  } else {
    console.error('❌ 关卡创建失败:', result.validation.errors);
  }

  return result;
}

// =============================================================================
// 示例2: 创建一个复杂的S型关卡
// =============================================================================

export function example2_ComplexSShapeLevel() {
  console.log('=== 示例2: 复杂S型关卡 ===');

  const aiConfig: AILevelConfig = {
    id: 102,
    name: '曲折之路',
    description: 'S型曲线路径，考验你的策略布局',
    path: {
      points: [
        { x: 100, y: 200 },
        { x: 400, y: 200 },
        { x: 400, y: 500 },
        { x: 800, y: 500 },
        { x: 800, y: 200 },
        { x: 1100, y: 200 },
      ],
      width: 50,
    },
    towerSlots: {
      strategy: 'auto',
      count: 6,
    },
    waves: [
      {
        batches: [{ enemyType: 'normal', count: 10, delay: 0 }],
      },
      {
        batches: [
          { enemyType: 'normal', count: 15, delay: 0 },
          { enemyType: 'elite', count: 2, delay: 3 },
        ],
      },
      {
        batches: [
          { enemyType: 'elite', count: 5, delay: 0 },
          { enemyType: 'normal', count: 20, delay: 2 },
        ],
      },
    ],
    baseHP: 20,
    startGold: 600,
  };

  const result = createLevel(aiConfig);

  if (result.level) {
    console.log('✅ 关卡创建成功！');
    console.log('关卡名称:', result.level.name);
    console.log('路径点数:', result.level.path.length);
    console.log('塔位数:', result.level.slots.length);
    console.log('波次数:', result.level.waves.length);
    console.log('初始金币:', result.level.startGold);
  }

  return result;
}

// =============================================================================
// 示例3: 使用模板快速创建
// =============================================================================

export function example3_UseTemplate() {
  console.log('=== 示例3: 使用模板 ===');

  // 使用S型模板
  const sShapeLevel = templates.sShape(103);
  const result1 = createLevel(sShapeLevel);

  // 使用环形模板
  const circularLevel = templates.circular(104);
  const result2 = createLevel(circularLevel);

  console.log('✅ 使用模板创建了2个关卡');
  console.log('S型关卡:', result1.level?.name);
  console.log('环形关卡:', result2.level?.name);

  return { sShape: result1, circular: result2 };
}

// =============================================================================
// 示例4: 仅在转角处放置塔
// =============================================================================

export function example4_CornersOnlyStrategy() {
  console.log('=== 示例4: 仅在转角处放置塔 ===');

  const result = createLevel({
    id: 105,
    name: '转角防御',
    description: '塔只能建在转角处，考验你的精准布局',
    path: {
      points: [
        { x: 100, y: 100 },
        { x: 400, y: 100 },
        { x: 400, y: 300 },
        { x: 200, y: 300 },
        { x: 200, y: 500 },
        { x: 600, y: 500 },
        { x: 600, y: 200 },
        { x: 900, y: 200 },
      ],
    },
    towerSlots: {
      strategy: 'corners-only', // 仅在转角
    },
    waves: [
      {
        batches: [{ enemyType: 'normal', count: 15, delay: 0 }],
      },
      {
        batches: [
          { enemyType: 'elite', count: 5, delay: 0 },
          { enemyType: 'normal', count: 20, delay: 2 },
        ],
      },
    ],
  });

  if (result.level) {
    console.log('✅ 转角关卡创建成功！');
    console.log('转角数（塔位数）:', result.level.slots.length);
  }

  return result;
}

// =============================================================================
// 示例5: 自定义塔位位置
// =============================================================================

export function example5_CustomSlotPositions() {
  console.log('=== 示例5: 自定义塔位位置 ===');

  const result = createLevel({
    id: 106,
    name: '精确布局',
    description: '塔的位置已经精心设计',
    path: {
      points: [
        { x: 100, y: 300 },
        { x: 600, y: 300 },
        { x: 600, y: 500 },
        { x: 1100, y: 500 },
      ],
    },
    towerSlots: {
      strategy: 'custom',
      customPositions: [
        { x: 300, y: 200 },
        { x: 500, y: 400 },
        { x: 700, y: 400 },
        { x: 900, y: 600 },
      ],
    },
    waves: [
      {
        batches: [{ enemyType: 'normal', count: 10, delay: 0 }],
      },
    ],
  });

  if (result.level) {
    console.log('✅ 自定义塔位关卡创建成功！');
  }

  return result;
}

// =============================================================================
// 示例6: Boss挑战关卡
// =============================================================================

export function example6_BossChallenge() {
  console.log('=== 示例6: Boss挑战 ===');

  const result = createLevel({
    id: 107,
    name: '终极之战',
    description: '打败强大的Boss！',
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
        { x: 100, y: 350 },
      ],
    },
    towerSlots: {
      strategy: 'auto',
      count: 8,
    },
    waves: [
      // 预热波次
      {
        batches: [{ enemyType: 'normal', count: 20, delay: 0 }],
      },
      {
        batches: [
          { enemyType: 'normal', count: 25, delay: 0 },
          { enemyType: 'elite', count: 5, delay: 2 },
        ],
      },
      // Boss波次
      {
        batches: [
          { enemyType: 'elite', count: 10, delay: 0 },
          { enemyType: 'boss', count: 1, delay: 5 },
        ],
      },
      // 最终Boss波次
      {
        batches: [
          { enemyType: 'elite', count: 15, delay: 0 },
          { enemyType: 'boss', count: 2, delay: 4 },
        ],
      },
    ],
    baseHP: 20,
    startGold: 900,
  });

  if (result.level) {
    console.log('✅ Boss挑战关卡创建成功！');
    console.log('总波次:', result.level.waves.length);
    console.log('塔位数:', result.level.slots.length);
  }

  return result;
}

// =============================================================================
// 示例7: 密集塔防布局
// =============================================================================

export function example7_DenseLayout() {
  console.log('=== 示例7: 密集塔防布局 ===');

  const result = createLevel({
    id: 108,
    name: '密集防线',
    description: '大量塔位，打造铁壁防御',
    path: {
      points: [
        { x: 100, y: 350 },
        { x: 500, y: 350 },
        { x: 500, y: 150 },
        { x: 900, y: 150 },
        { x: 900, y: 550 },
        { x: 1100, y: 550 },
      ],
    },
    towerSlots: {
      strategy: 'dense', // 密集布置
    },
    waves: [
      {
        batches: [{ enemyType: 'normal', count: 30, delay: 0 }],
      },
      {
        batches: [
          { enemyType: 'elite', count: 10, delay: 0 },
          { enemyType: 'normal', count: 40, delay: 2 },
        ],
      },
    ],
    startGold: 800,
  });

  if (result.level) {
    console.log('✅ 密集布局关卡创建成功！');
    console.log('塔位数:', result.level.slots.length);
  }

  return result;
}

// =============================================================================
// 运行所有示例
// =============================================================================

export function runAllExamples() {
  console.log('\n🎮 开始运行所有关卡编辑器示例...\n');

  example1_SimpleStraightLevel();
  console.log('\n');

  example2_ComplexSShapeLevel();
  console.log('\n');

  example3_UseTemplate();
  console.log('\n');

  example4_CornersOnlyStrategy();
  console.log('\n');

  example5_CustomSlotPositions();
  console.log('\n');

  example6_BossChallenge();
  console.log('\n');

  example7_DenseLayout();
  console.log('\n');

  console.log('✅ 所有示例运行完成！');
}
