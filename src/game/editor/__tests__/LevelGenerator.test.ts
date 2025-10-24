/**
 * LevelGenerator 测试
 */

import { describe, it, expect } from 'vitest';
import { LevelGenerator } from '../LevelGenerator';
import type { AILevelConfig } from '../types';

describe('LevelGenerator', () => {
  const generator = new LevelGenerator();

  describe('基本关卡生成', () => {
    it('应该成功生成简单关卡', () => {
      const config: AILevelConfig = {
        id: 1,
        name: '测试关卡',
        description: '基本测试',
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
      };

      const level = generator.generate(config);

      expect(level).toBeDefined();
      expect(level.id).toBe(1);
      expect(level.name).toBe('测试关卡');
      expect(level.path).toHaveLength(4);
      expect(level.slots.length).toBeGreaterThan(0);
      expect(level.waves).toHaveLength(1);
    });

    it('应该使用默认值', () => {
      const config: AILevelConfig = {
        id: 2,
        name: '默认值测试',
        description: '测试默认值',
        path: {
          points: [
            { x: 100, y: 100 },
            { x: 500, y: 100 },
          ],
        },
        towerSlots: { strategy: 'auto' },
        waves: [
          {
            batches: [{ enemyType: 'normal', count: 5, delay: 0 }],
          },
        ],
      };

      const level = generator.generate(config);

      expect(level.baseHP).toBe(20); // 默认值
      expect(level.startGold).toBe(500); // 默认值
    });

    it('应该正确处理自定义游戏参数', () => {
      const config: AILevelConfig = {
        id: 3,
        name: '自定义参数',
        description: '测试',
        path: {
          points: [
            { x: 100, y: 100 },
            { x: 500, y: 100 },
          ],
        },
        towerSlots: { strategy: 'auto' },
        waves: [
          {
            batches: [{ enemyType: 'normal', count: 5, delay: 0 }],
          },
        ],
        baseHP: 30,
        startGold: 800,
      };

      const level = generator.generate(config);

      expect(level.baseHP).toBe(30);
      expect(level.startGold).toBe(800);
    });
  });

  describe('塔位策略', () => {
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

    const baseWaves = [
      { batches: [{ enemyType: 'normal' as const, count: 5, delay: 0 }] },
    ];

    it('auto 策略应该生成塔位', () => {
      const config: AILevelConfig = {
        id: 10,
        name: 'Auto Strategy',
        description: 'Test',
        path: basePath,
        towerSlots: { strategy: 'auto', count: 5 },
        waves: baseWaves,
      };

      const level = generator.generate(config);
      expect(level.slots.length).toBeGreaterThan(0);
    });

    it('dense 策略应该生成更多塔位', () => {
      const denseConfig: AILevelConfig = {
        id: 11,
        name: 'Dense',
        description: 'Test',
        path: basePath,
        towerSlots: { strategy: 'dense' },
        waves: baseWaves,
      };

      const sparseConfig: AILevelConfig = {
        id: 12,
        name: 'Sparse',
        description: 'Test',
        path: basePath,
        towerSlots: { strategy: 'sparse' },
        waves: baseWaves,
      };

      const denseLevel = generator.generate(denseConfig);
      const sparseLevel = generator.generate(sparseConfig);

      expect(denseLevel.slots.length).toBeGreaterThan(sparseLevel.slots.length);
    });

    it('custom 策略应该使用指定的塔位', () => {
      const config: AILevelConfig = {
        id: 14,
        name: 'Custom',
        description: 'Test',
        path: basePath,
        towerSlots: {
          strategy: 'custom',
          customPositions: [
            { x: 200, y: 200 },
            { x: 500, y: 400 },
          ],
        },
        waves: baseWaves,
      };

      const level = generator.generate(config);
      expect(level.slots).toHaveLength(2);
      expect(level.slots[0]).toEqual({ x: 200, y: 200 });
      expect(level.slots[1]).toEqual({ x: 500, y: 400 });
    });

    it('corners-only 策略应该只在转角生成', () => {
      const config: AILevelConfig = {
        id: 13,
        name: 'Corners Only',
        description: 'Test',
        path: basePath,
        towerSlots: { strategy: 'corners-only' },
        waves: baseWaves,
      };

      const level = generator.generate(config);
      expect(level.slots.length).toBeGreaterThan(0);
      // 转角数应该少于路径点数
      expect(level.slots.length).toBeLessThan(basePath.points.length * 2);
    });
  });

  describe('预览功能', () => {
    it('应该生成完整的预览数据', () => {
      const config: AILevelConfig = {
        id: 20,
        name: 'Preview Test',
        description: 'Test',
        path: {
          points: [
            { x: 100, y: 100 },
            { x: 400, y: 100 },
            { x: 400, y: 300 },
          ],
        },
        towerSlots: { strategy: 'auto', count: 3 },
        waves: [
          {
            batches: [{ enemyType: 'normal', count: 5, delay: 0 }],
          },
        ],
      };

      const preview = generator.generatePreview(config);

      expect(preview.path).toHaveLength(3);
      expect(preview.wallPoints.left).toHaveLength(3);
      expect(preview.wallPoints.right).toHaveLength(3);
      expect(preview.slots.length).toBeGreaterThan(0);
      expect(preview.basePosition).toEqual({ x: 400, y: 300 });
    });
  });

  describe('城墙计算', () => {
    it('应该为直线路径正确计算城墙', () => {
      const config: AILevelConfig = {
        id: 30,
        name: 'Straight Path',
        description: 'Test',
        path: {
          points: [
            { x: 100, y: 300 },
            { x: 900, y: 300 },
          ],
        },
        towerSlots: { strategy: 'auto' },
        waves: [
          {
            batches: [{ enemyType: 'normal', count: 5, delay: 0 }],
          },
        ],
      };

      const preview = generator.generatePreview(config);

      // 城墙应该在路径两侧（左右）
      // 注意：左右是相对于路径方向的，所以可能y坐标不同
      expect(preview.wallPoints.left.length).toBe(2);
      expect(preview.wallPoints.right.length).toBe(2);
      // 验证城墙点不在路径上
      const pathY = 300;
      expect(preview.wallPoints.left[0].y).not.toBe(pathY);
      expect(preview.wallPoints.right[0].y).not.toBe(pathY);
    });

    it('应该为转角路径正确计算城墙', () => {
      const config: AILevelConfig = {
        id: 31,
        name: 'Corner Path',
        description: 'Test',
        path: {
          points: [
            { x: 100, y: 100 },
            { x: 400, y: 100 },
            { x: 400, y: 400 },
          ],
        },
        towerSlots: { strategy: 'auto' },
        waves: [
          {
            batches: [{ enemyType: 'normal', count: 5, delay: 0 }],
          },
        ],
      };

      const preview = generator.generatePreview(config);

      // 城墙点数应该等于路径点数
      expect(preview.wallPoints.left.length).toBe(3);
      expect(preview.wallPoints.right.length).toBe(3);
    });
  });

  describe('自定义选项', () => {
    it('应该使用自定义的墙体宽度', () => {
      const customGenerator = new LevelGenerator({
        wallWidth: 60,
        pathWidth: 80,
      });

      const config: AILevelConfig = {
        id: 40,
        name: 'Custom Options',
        description: 'Test',
        path: {
          points: [
            { x: 100, y: 100 },
            { x: 400, y: 100 },
            { x: 400, y: 300 },
            { x: 700, y: 300 },
          ],
        },
        towerSlots: { strategy: 'auto', count: 3 },
        waves: [
          {
            batches: [{ enemyType: 'normal', count: 5, delay: 0 }],
          },
        ],
      };

      const level = customGenerator.generate(config);
      expect(level).toBeDefined();
      expect(level.path).toHaveLength(4);
      // 验证关卡生成成功
      expect(level.id).toBe(40);
      expect(level.slots).toBeDefined();
    });
  });
});
