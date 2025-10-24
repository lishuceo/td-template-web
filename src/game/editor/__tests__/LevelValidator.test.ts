/**
 * LevelValidator 测试
 */

import { describe, it, expect } from 'vitest';
import { LevelValidator } from '../LevelValidator';
import type { AILevelConfig } from '../types';

describe('LevelValidator', () => {
  const validator = new LevelValidator();

  describe('路径验证', () => {
    it('应该拒绝路径点太少的配置', () => {
      const config: AILevelConfig = {
        id: 1,
        name: 'Invalid Path',
        description: 'Test',
        path: {
          points: [{ x: 100, y: 100 }], // 只有1个点
        },
        towerSlots: { strategy: 'auto' },
        waves: [
          {
            batches: [{ enemyType: 'normal', count: 5, delay: 0 }],
          },
        ],
      };

      const result = validator.validateAIConfig(config);

      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors.some((e) => e.includes('至少包含2个点'))).toBe(true);
    });

    it('应该接受有效的最小路径（2个点）', () => {
      const config: AILevelConfig = {
        id: 2,
        name: 'Valid Path',
        description: 'Test',
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

      const result = validator.validateAIConfig(config);

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('应该警告路径点之间距离过近', () => {
      const config: AILevelConfig = {
        id: 3,
        name: 'Close Points',
        description: 'Test',
        path: {
          points: [
            { x: 100, y: 100 },
            { x: 105, y: 100 }, // 距离只有5px
          ],
        },
        towerSlots: { strategy: 'auto' },
        waves: [
          {
            batches: [{ enemyType: 'normal', count: 5, delay: 0 }],
          },
        ],
      };

      const result = validator.validateAIConfig(config);

      expect(result.warnings.length).toBeGreaterThan(0);
    });

    it('应该检测无效的坐标', () => {
      const config: AILevelConfig = {
        id: 4,
        name: 'Invalid Coordinates',
        description: 'Test',
        path: {
          points: [
            { x: 100, y: 100 },
            { x: NaN, y: 100 }, // 无效坐标
          ],
        },
        towerSlots: { strategy: 'auto' },
        waves: [
          {
            batches: [{ enemyType: 'normal', count: 5, delay: 0 }],
          },
        ],
      };

      const result = validator.validateAIConfig(config);

      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.includes('有限数值'))).toBe(true);
    });
  });

  describe('基本信息验证', () => {
    it('应该拒绝空名称', () => {
      const config: AILevelConfig = {
        id: 10,
        name: '',
        description: 'Test',
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

      const result = validator.validateAIConfig(config);

      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.includes('名称不能为空'))).toBe(true);
    });

    it('应该拒绝无效的ID', () => {
      const config: AILevelConfig = {
        id: 0,
        name: 'Invalid ID',
        description: 'Test',
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

      const result = validator.validateAIConfig(config);

      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.includes('ID必须大于0'))).toBe(true);
    });

    it('应该拒绝负数的基地生命值', () => {
      const config: AILevelConfig = {
        id: 12,
        name: 'Invalid HP',
        description: 'Test',
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
        baseHP: -10,
      };

      const result = validator.validateAIConfig(config);

      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.includes('生命值必须大于0'))).toBe(
        true
      );
    });
  });

  describe('波次验证', () => {
    it('应该拒绝空波次', () => {
      const config: AILevelConfig = {
        id: 20,
        name: 'No Waves',
        description: 'Test',
        path: {
          points: [
            { x: 100, y: 100 },
            { x: 500, y: 100 },
          ],
        },
        towerSlots: { strategy: 'auto' },
        waves: [],
      };

      const result = validator.validateAIConfig(config);

      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.includes('至少需要一个波次'))).toBe(
        true
      );
    });

    it('应该拒绝空批次的波次', () => {
      const config: AILevelConfig = {
        id: 21,
        name: 'Empty Batches',
        description: 'Test',
        path: {
          points: [
            { x: 100, y: 100 },
            { x: 500, y: 100 },
          ],
        },
        towerSlots: { strategy: 'auto' },
        waves: [{ batches: [] }],
      };

      const result = validator.validateAIConfig(config);

      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.includes('没有敌人批次'))).toBe(true);
    });

    it('应该拒绝无效的敌人数量', () => {
      const config: AILevelConfig = {
        id: 22,
        name: 'Invalid Count',
        description: 'Test',
        path: {
          points: [
            { x: 100, y: 100 },
            { x: 500, y: 100 },
          ],
        },
        towerSlots: { strategy: 'auto' },
        waves: [
          {
            batches: [{ enemyType: 'normal', count: 0, delay: 0 }],
          },
        ],
      };

      const result = validator.validateAIConfig(config);

      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.includes('数量必须大于0'))).toBe(true);
    });

    it('应该拒绝负延迟', () => {
      const config: AILevelConfig = {
        id: 23,
        name: 'Negative Delay',
        description: 'Test',
        path: {
          points: [
            { x: 100, y: 100 },
            { x: 500, y: 100 },
          ],
        },
        towerSlots: { strategy: 'auto' },
        waves: [
          {
            batches: [{ enemyType: 'normal', count: 5, delay: -1 }],
          },
        ],
      };

      const result = validator.validateAIConfig(config);

      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.includes('延迟不能为负数'))).toBe(true);
    });

    it('应该警告过多的Boss', () => {
      const config: AILevelConfig = {
        id: 24,
        name: 'Too Many Bosses',
        description: 'Test',
        path: {
          points: [
            { x: 100, y: 100 },
            { x: 500, y: 100 },
          ],
        },
        towerSlots: { strategy: 'auto' },
        waves: [
          {
            batches: [{ enemyType: 'boss', count: 10, delay: 0 }],
          },
        ],
      };

      const result = validator.validateAIConfig(config);

      expect(result.warnings.some((w) => w.includes('boss数量过多'))).toBe(true);
    });
  });

  describe('塔位配置验证', () => {
    it('应该拒绝无效的策略', () => {
      type InvalidStrategy = 'invalid_strategy';
      const config = {
        id: 30,
        name: 'Invalid Strategy',
        description: 'Test',
        path: {
          points: [
            { x: 100, y: 100 },
            { x: 500, y: 100 },
          ],
        },
        towerSlots: { strategy: 'invalid_strategy' as InvalidStrategy },
        waves: [
          {
            batches: [{ enemyType: 'normal', count: 5, delay: 0 }],
          },
        ],
      } as unknown as AILevelConfig;

      const result = validator.validateAIConfig(config);

      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.includes('无效的塔位策略'))).toBe(true);
    });

    it('custom策略必须提供位置', () => {
      const config: AILevelConfig = {
        id: 31,
        name: 'Custom Without Positions',
        description: 'Test',
        path: {
          points: [
            { x: 100, y: 100 },
            { x: 500, y: 100 },
          ],
        },
        towerSlots: { strategy: 'custom' },
        waves: [
          {
            batches: [{ enemyType: 'normal', count: 5, delay: 0 }],
          },
        ],
      };

      const result = validator.validateAIConfig(config);

      expect(result.valid).toBe(false);
      expect(
        result.errors.some((e) => e.includes('必须提供塔位位置'))
      ).toBe(true);
    });

    it('应该拒绝无效的塔位数量', () => {
      const config: AILevelConfig = {
        id: 32,
        name: 'Invalid Count',
        description: 'Test',
        path: {
          points: [
            { x: 100, y: 100 },
            { x: 500, y: 100 },
          ],
        },
        towerSlots: { strategy: 'auto', count: -1 },
        waves: [
          {
            batches: [{ enemyType: 'normal', count: 5, delay: 0 }],
          },
        ],
      };

      const result = validator.validateAIConfig(config);

      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.includes('数量必须大于0'))).toBe(true);
    });
  });

  describe('完整配置验证', () => {
    it('应该通过有效的配置', () => {
      const config: AILevelConfig = {
        id: 100,
        name: 'Valid Level',
        description: 'A fully valid level configuration',
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
            batches: [{ enemyType: 'normal', count: 10, delay: 0 }],
          },
          {
            batches: [
              { enemyType: 'normal', count: 15, delay: 0 },
              { enemyType: 'elite', count: 2, delay: 3 },
            ],
          },
          {
            batches: [{ enemyType: 'boss', count: 1, delay: 0 }],
          },
        ],
        baseHP: 20,
        startGold: 600,
      };

      const result = validator.validateAIConfig(config);

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('应该收集多个错误', () => {
      const config: AILevelConfig = {
        id: -1, // 错误1
        name: '', // 错误2
        description: 'Test',
        path: {
          points: [{ x: 100, y: 100 }], // 错误3
        },
        towerSlots: { strategy: 'auto', count: 0 }, // 错误4
        waves: [], // 错误5
      };

      const result = validator.validateAIConfig(config);

      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThanOrEqual(5);
    });
  });
});
