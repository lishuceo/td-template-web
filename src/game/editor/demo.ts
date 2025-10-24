/**
 * 关卡编辑器快速Demo
 *
 * 这个文件展示如何快速使用关卡编辑器创建关卡
 * 可以在浏览器控制台中直接运行
 */

import { createLevel, templates, previewLevelLayout, exportLevelAsJSON } from './index';
import type { AILevelConfig } from './types';

/**
 * Demo 1: 创建一个简单的关卡
 */
export function demo1_SimpleLevel() {
  console.log('=== Demo 1: 创建简单关卡 ===\n');

  const result = createLevel({
    id: 1,
    name: '新手关',
    description: '欢迎来到塔防世界',
    path: {
      points: [
        { x: 100, y: 300 },
        { x: 500, y: 300 },
        { x: 500, y: 500 },
        { x: 900, y: 500 },
      ],
    },
    towerSlots: {
      strategy: 'auto',
      count: 4,
    },
    waves: [
      {
        batches: [{ enemyType: 'normal', count: 5, delay: 0 }],
      },
    ],
  });

  if (result.level) {
    console.log('✅ 关卡创建成功！');
    console.log('📊 关卡信息：');
    console.log(`  - ID: ${result.level.id}`);
    console.log(`  - 名称: ${result.level.name}`);
    console.log(`  - 路径点数: ${result.level.path.length}`);
    console.log(`  - 塔位数: ${result.level.slots.length}`);
    console.log(`  - 波次数: ${result.level.waves.length}`);
    console.log(`  - 初始金币: ${result.level.startGold}`);
    console.log(`  - 基地生命: ${result.level.baseHP}`);

    console.log('\n📍 塔位位置：');
    result.level.slots.forEach((slot, i) => {
      console.log(`  塔位${i + 1}: (${slot.x}, ${slot.y})`);
    });
  } else {
    console.error('❌ 关卡创建失败');
    console.error('错误：', result.validation.errors);
  }

  return result;
}

/**
 * Demo 2: 使用模板
 */
export function demo2_UseTemplate() {
  console.log('\n=== Demo 2: 使用模板 ===\n');

  const sTemplate = templates.sShape(2);
  console.log('📋 使用 S型模板创建关卡...');

  const result = createLevel(sTemplate);

  if (result.level) {
    console.log('✅ S型关卡创建成功！');
    console.log(`  - 名称: ${result.level.name}`);
    console.log(`  - 路径点数: ${result.level.path.length}`);
    console.log(`  - 塔位数: ${result.level.slots.length}`);
  }

  return result;
}

/**
 * Demo 3: 预览关卡布局
 */
export function demo3_PreviewLevel() {
  console.log('\n=== Demo 3: 预览关卡布局 ===\n');

  const config: AILevelConfig = {
    id: 3,
    name: '预览测试',
    description: '测试预览功能',
    path: {
      points: [
        { x: 100, y: 100 },
        { x: 400, y: 100 },
        { x: 400, y: 300 },
        { x: 700, y: 300 },
      ],
    },
    towerSlots: {
      strategy: 'auto',
      count: 4,
    },
    waves: [
      {
        batches: [{ enemyType: 'normal', count: 5, delay: 0 }],
      },
    ],
  };

  const preview = previewLevelLayout(config);

  console.log('🔍 关卡预览信息：');
  console.log(`  - 路径点数: ${preview.path.length}`);
  console.log(`  - 左城墙点数: ${preview.wallPoints.left.length}`);
  console.log(`  - 右城墙点数: ${preview.wallPoints.right.length}`);
  console.log(`  - 塔位数: ${preview.slots.length}`);
  console.log(`  - 基地位置: (${preview.basePosition.x}, ${preview.basePosition.y})`);

  console.log('\n🏰 城墙坐标：');
  console.log('左侧城墙：');
  preview.wallPoints.left.forEach((p, i) => {
    console.log(`  点${i + 1}: (${p.x.toFixed(1)}, ${p.y.toFixed(1)})`);
  });

  console.log('\n右侧城墙：');
  preview.wallPoints.right.forEach((p, i) => {
    console.log(`  点${i + 1}: (${p.x.toFixed(1)}, ${p.y.toFixed(1)})`);
  });

  return preview;
}

/**
 * Demo 4: 测试所有策略
 */
export function demo4_TestAllStrategies() {
  console.log('\n=== Demo 4: 测试所有塔位策略 ===\n');

  const basePath = {
    points: [
      { x: 100, y: 100 },
      { x: 400, y: 100 },
      { x: 400, y: 300 },
      { x: 700, y: 300 },
      { x: 700, y: 500 },
      { x: 1000, y: 500 },
    ],
  };

  const strategies: Array<'auto' | 'dense' | 'sparse' | 'corners-only'> = [
    'auto',
    'dense',
    'sparse',
    'corners-only',
  ];

  const results = strategies.map((strategy) => {
    const result = createLevel({
      id: 10 + strategies.indexOf(strategy),
      name: `${strategy} Strategy`,
      description: `Test ${strategy}`,
      path: basePath,
      towerSlots: { strategy },
      waves: [
        {
          batches: [{ enemyType: 'normal', count: 5, delay: 0 }],
        },
      ],
    });

    console.log(`📍 ${strategy.toUpperCase()} 策略:`);
    if (result.level) {
      console.log(`  ✅ 成功 - 生成了 ${result.level.slots.length} 个塔位`);
    } else {
      console.log('  ❌ 失败');
    }

    return { strategy, result };
  });

  console.log('\n📊 策略对比：');
  results.forEach(({ strategy, result }) => {
    if (result.level) {
      console.log(`  ${strategy}: ${result.level.slots.length} 个塔位`);
    }
  });

  return results;
}

/**
 * Demo 5: 导出JSON
 */
export function demo5_ExportJSON() {
  console.log('\n=== Demo 5: 导出JSON ===\n');

  const config: AILevelConfig = {
    id: 100,
    name: '导出测试',
    description: '测试JSON导出',
    path: {
      points: [
        { x: 100, y: 300 },
        { x: 900, y: 300 },
      ],
    },
    towerSlots: {
      strategy: 'auto',
      count: 3,
    },
    waves: [
      {
        batches: [{ enemyType: 'normal', count: 10, delay: 0 }],
      },
    ],
  };

  const json = exportLevelAsJSON(config, undefined, true);

  console.log('📄 导出的JSON：');
  console.log(json);

  console.log('\n✅ JSON导出成功！');
  console.log(`  - 大小: ${json.length} 字符`);

  return json;
}

/**
 * Demo 6: 比较不同路径长度的关卡
 */
export function demo6_ComparePathLengths() {
  console.log('\n=== Demo 6: 比较不同路径长度 ===\n');

  const configs = [
    {
      name: '短路径',
      points: [
        { x: 100, y: 300 },
        { x: 500, y: 300 },
      ],
    },
    {
      name: '中等路径',
      points: [
        { x: 100, y: 300 },
        { x: 500, y: 300 },
        { x: 500, y: 500 },
        { x: 900, y: 500 },
      ],
    },
    {
      name: '长路径',
      points: [
        { x: 100, y: 100 },
        { x: 400, y: 100 },
        { x: 400, y: 300 },
        { x: 700, y: 300 },
        { x: 700, y: 500 },
        { x: 1000, y: 500 },
      ],
    },
  ];

  configs.forEach((config, index) => {
    const result = createLevel({
      id: 200 + index,
      name: config.name,
      description: '路径长度对比',
      path: { points: config.points },
      towerSlots: { strategy: 'auto' },
      waves: [
        {
          batches: [{ enemyType: 'normal', count: 5, delay: 0 }],
        },
      ],
    });

    if (result.level) {
      console.log(`📍 ${config.name}:`);
      console.log(`  - 路径点数: ${result.level.path.length}`);
      console.log(`  - 自动生成塔位: ${result.level.slots.length}`);

      // 计算路径总长度
      let totalLength = 0;
      for (let i = 0; i < result.level.path.length - 1; i++) {
        const p1 = result.level.path[i];
        const p2 = result.level.path[i + 1];
        const distance = Math.sqrt(
          Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2)
        );
        totalLength += distance;
      }
      console.log(`  - 路径总长度: ${totalLength.toFixed(1)}px`);
      console.log(`  - 平均塔位密度: ${(totalLength / result.level.slots.length).toFixed(1)}px/塔\n`);
    }
  });
}

/**
 * 运行所有Demo
 */
export function runAllDemos() {
  console.log('🎮 开始运行所有Demo...\n');
  console.log('='.repeat(60));

  demo1_SimpleLevel();
  demo2_UseTemplate();
  demo3_PreviewLevel();
  demo4_TestAllStrategies();
  demo5_ExportJSON();
  demo6_ComparePathLengths();

  console.log('\n' + '='.repeat(60));
  console.log('✅ 所有Demo运行完成！');
}

// 如果在浏览器环境
if (typeof window !== 'undefined') {
  (window as any).runLevelEditorDemo = runAllDemos;
  (window as any).demo1_SimpleLevel = demo1_SimpleLevel;
  (window as any).demo2_UseTemplate = demo2_UseTemplate;
  (window as any).demo3_PreviewLevel = demo3_PreviewLevel;
  (window as any).demo4_TestAllStrategies = demo4_TestAllStrategies;
  (window as any).demo5_ExportJSON = demo5_ExportJSON;
  (window as any).demo6_ComparePathLengths = demo6_ComparePathLengths;

  console.log('✨ 关卡编辑器Demo已加载');
  console.log('💡 可用命令：');
  console.log('  - runLevelEditorDemo()     : 运行所有Demo');
  console.log('  - demo1_SimpleLevel()      : Demo 1 - 简单关卡');
  console.log('  - demo2_UseTemplate()      : Demo 2 - 使用模板');
  console.log('  - demo3_PreviewLevel()     : Demo 3 - 预览布局');
  console.log('  - demo4_TestAllStrategies(): Demo 4 - 测试策略');
  console.log('  - demo5_ExportJSON()       : Demo 5 - 导出JSON');
  console.log('  - demo6_ComparePathLengths(): Demo 6 - 路径对比');
}

export default runAllDemos;
