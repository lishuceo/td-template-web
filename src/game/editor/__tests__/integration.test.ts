/**
 * 集成测试 - 测试完整的工作流程
 */

import { describe, it, expect } from 'vitest';
import {
  createLevel,
  quickGenerateLevel,
  validateLevelConfig,
  previewLevelLayout,
  exportLevelAsJSON,
  exportLevelAsTypeScript,
} from '../index';
import type { AILevelConfig } from '../types';

describe('Level Editor Integration', () => {
  describe('createLevel 完整流程', () => {
    it('应该创建、验证并生成关卡', () => {
      const config: AILevelConfig = {
        id: 1,
        name: '集成测试关卡',
        description: '测试完整流程',
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
        ],
        baseHP: 20,
        startGold: 600,
      };

      const result = createLevel(config);

      expect(result.validation.valid).toBe(true);
      expect(result.level).toBeDefined();

      if (result.level) {
        expect(result.level.id).toBe(1);
        expect(result.level.name).toBe('集成测试关卡');
        expect(result.level.path).toHaveLength(4);
        expect(result.level.slots.length).toBeGreaterThan(0);
        expect(result.level.waves).toHaveLength(2);
        expect(result.level.baseHP).toBe(20);
        expect(result.level.startGold).toBe(600);
      }
    });

    it('验证失败时应该返回null', () => {
      const invalidConfig: AILevelConfig = {
        id: -1,
        name: '',
        description: 'Invalid',
        path: {
          points: [{ x: 100, y: 100 }],
        },
        towerSlots: { strategy: 'auto' },
        waves: [],
      };

      const result = createLevel(invalidConfig);

      expect(result.validation.valid).toBe(false);
      expect(result.level).toBeNull();
      expect(result.validation.errors.length).toBeGreaterThan(0);
    });
  });

  describe('quickGenerateLevel 快速生成', () => {
    it('应该跳过验证直接生成', () => {
      const config: AILevelConfig = {
        id: 10,
        name: 'Quick Gen',
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

      const level = quickGenerateLevel(config);

      expect(level).toBeDefined();
      expect(level.id).toBe(10);
      expect(level.name).toBe('Quick Gen');
    });
  });

  describe('validateLevelConfig 单独验证', () => {
    it('应该验证有效配置', () => {
      const config: AILevelConfig = {
        id: 20,
        name: 'Valid',
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

      const validation = validateLevelConfig(config);

      expect(validation.valid).toBe(true);
      expect(validation.errors).toHaveLength(0);
    });

    it('应该检测无效配置', () => {
      const config: AILevelConfig = {
        id: 21,
        name: '',
        description: 'Invalid',
        path: {
          points: [{ x: 100, y: 100 }],
        },
        towerSlots: { strategy: 'auto' },
        waves: [],
      };

      const validation = validateLevelConfig(config);

      expect(validation.valid).toBe(false);
      expect(validation.errors.length).toBeGreaterThan(0);
    });
  });

  describe('previewLevelLayout 预览', () => {
    it('应该生成完整的预览数据', () => {
      const config: AILevelConfig = {
        id: 30,
        name: 'Preview',
        description: 'Test',
        path: {
          points: [
            { x: 100, y: 100 },
            { x: 400, y: 100 },
            { x: 400, y: 300 },
            { x: 700, y: 300 },
          ],
        },
        towerSlots: { strategy: 'auto', count: 4 },
        waves: [
          {
            batches: [{ enemyType: 'normal', count: 5, delay: 0 }],
          },
        ],
      };

      const preview = previewLevelLayout(config);

      expect(preview.path).toHaveLength(4);
      expect(preview.wallPoints.left).toHaveLength(4);
      expect(preview.wallPoints.right).toHaveLength(4);
      expect(preview.slots.length).toBeGreaterThan(0);
      expect(preview.basePosition).toEqual({ x: 700, y: 300 });

      // 验证城墙点的有效性
      preview.wallPoints.left.forEach((point) => {
        expect(point.x).toBeDefined();
        expect(point.y).toBeDefined();
        expect(isFinite(point.x)).toBe(true);
        expect(isFinite(point.y)).toBe(true);
      });
    });
  });

  describe('导出功能', () => {
    const testConfig: AILevelConfig = {
      id: 40,
      name: 'Export Test',
      description: 'Test export functions',
      path: {
        points: [
          { x: 100, y: 100 },
          { x: 500, y: 100 },
        ],
      },
      towerSlots: { strategy: 'auto', count: 3 },
      waves: [
        {
          batches: [{ enemyType: 'normal', count: 5, delay: 0 }],
        },
      ],
    };

    it('应该导出有效的JSON', () => {
      const json = exportLevelAsJSON(testConfig, undefined, true);

      expect(json).toBeTruthy();
      expect(json.length).toBeGreaterThan(0);

      // 验证JSON可解析
      const parsed = JSON.parse(json);
      expect(parsed.id).toBe(40);
      expect(parsed.name).toBe('Export Test');
      expect(parsed.path).toBeDefined();
      expect(parsed.slots).toBeDefined();
      expect(parsed.waves).toBeDefined();
    });

    it('应该导出有效的TypeScript代码', () => {
      const tsCode = exportLevelAsTypeScript(testConfig);

      expect(tsCode).toBeTruthy();
      expect(tsCode).toContain('export const');
      expect(tsCode).toContain('LevelConfig');
      expect(tsCode).toContain('"id": 40');
      expect(tsCode).toContain('Export Test');
    });

    it('JSON应该包含所有必要字段', () => {
      const json = exportLevelAsJSON(testConfig);
      const parsed = JSON.parse(json);

      expect(parsed).toHaveProperty('id');
      expect(parsed).toHaveProperty('name');
      expect(parsed).toHaveProperty('description');
      expect(parsed).toHaveProperty('path');
      expect(parsed).toHaveProperty('slots');
      expect(parsed).toHaveProperty('waves');
      expect(parsed).toHaveProperty('baseHP');
      expect(parsed).toHaveProperty('startGold');
    });
  });

  describe('完整工作流程', () => {
    it('应该支持 验证 -> 生成 -> 预览 -> 导出 的完整流程', () => {
      const config: AILevelConfig = {
        id: 50,
        name: '完整流程测试',
        description: '测试从验证到导出的完整流程',
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
            batches: [
              { enemyType: 'normal', count: 10, delay: 0 },
              { enemyType: 'elite', count: 2, delay: 3 },
            ],
          },
        ],
      };

      // 1. 验证
      const validation = validateLevelConfig(config);
      expect(validation.valid).toBe(true);

      // 2. 生成
      const result = createLevel(config);
      expect(result.level).not.toBeNull();

      // 3. 预览
      const preview = previewLevelLayout(config);
      expect(preview.path).toBeDefined();
      expect(preview.slots.length).toBeGreaterThan(0);

      // 4. 导出JSON
      const json = exportLevelAsJSON(config);
      const parsed = JSON.parse(json);
      expect(parsed.id).toBe(50);

      // 5. 导出TypeScript
      const tsCode = exportLevelAsTypeScript(config);
      expect(tsCode).toContain('level50');
    });
  });

  describe('错误处理', () => {
    it('应该优雅地处理缺失字段', () => {
      const incompleteConfig: Partial<AILevelConfig> = {
        id: 60,
        name: 'Incomplete',
        path: {
          points: [
            { x: 100, y: 100 },
            { x: 500, y: 100 },
          ],
        },
      };

      const validation = validateLevelConfig(incompleteConfig as AILevelConfig);
      expect(validation.valid).toBe(false);
    });

    it('应该处理极端值', () => {
      const extremeConfig: AILevelConfig = {
        id: 999999,
        name: 'Extreme Values',
        description: 'Test extreme values',
        path: {
          points: [
            { x: 0, y: 0 },
            { x: 10000, y: 10000 },
          ],
        },
        towerSlots: { strategy: 'auto', count: 100 },
        waves: [
          {
            batches: [{ enemyType: 'boss', count: 100, delay: 0 }],
          },
        ],
        baseHP: 10000,
        startGold: 100000,
      };

      const result = createLevel(extremeConfig);
      // 应该生成但可能有警告
      expect(result.level).toBeDefined();
    });
  });
});
