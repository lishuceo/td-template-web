/**
 * 模板测试
 */

import { describe, it, expect } from 'vitest';
import { templates, createLevel } from '../index';

describe('Level Templates', () => {
  describe('simpleStraight 模板', () => {
    it('应该生成有效的直线关卡', () => {
      const config = templates.simpleStraight(1);

      expect(config.id).toBe(1);
      expect(config.name).toContain('简单直线');
      expect(config.path.points).toHaveLength(2);
      expect(config.towerSlots.strategy).toBe('auto');
      expect(config.waves.length).toBeGreaterThan(0);

      // 验证能够成功生成
      const result = createLevel(config);
      expect(result.validation.valid).toBe(true);
      expect(result.level).not.toBeNull();
    });

    it('路径应该是直线', () => {
      const config = templates.simpleStraight(1);
      const points = config.path.points;

      expect(points.length).toBe(2);
      // 直线，所以y坐标应该相同
      expect(points[0].y).toBe(points[1].y);
    });
  });

  describe('lShape 模板', () => {
    it('应该生成有效的L型关卡', () => {
      const config = templates.lShape(2);

      expect(config.id).toBe(2);
      expect(config.name).toContain('L型');
      expect(config.path.points).toHaveLength(3);
      expect(config.towerSlots.strategy).toBe('auto');

      const result = createLevel(config);
      expect(result.validation.valid).toBe(true);
      expect(result.level).not.toBeNull();
    });

    it('应该有一个转角', () => {
      const config = templates.lShape(2);
      const points = config.path.points;

      expect(points.length).toBe(3);
      // L型应该在中间点转向
      const isHorizontalFirst = points[0].y === points[1].y;
      const isVerticalSecond = points[1].x === points[2].x;
      const isVerticalFirst = points[0].x === points[1].x;
      const isHorizontalSecond = points[1].y === points[2].y;

      const isLShape =
        (isHorizontalFirst && isVerticalSecond) ||
        (isVerticalFirst && isHorizontalSecond);

      expect(isLShape).toBe(true);
    });
  });

  describe('sShape 模板', () => {
    it('应该生成有效的S型关卡', () => {
      const config = templates.sShape(3);

      expect(config.id).toBe(3);
      expect(config.name).toContain('S型');
      expect(config.path.points.length).toBeGreaterThanOrEqual(4);
      expect(config.towerSlots.strategy).toBe('auto');

      const result = createLevel(config);
      expect(result.validation.valid).toBe(true);
      expect(result.level).not.toBeNull();
    });

    it('路径应该比直线和L型更长', () => {
      const straightConfig = templates.simpleStraight(1);
      const lConfig = templates.lShape(2);
      const sConfig = templates.sShape(3);

      expect(sConfig.path.points.length).toBeGreaterThan(
        straightConfig.path.points.length
      );
      expect(sConfig.path.points.length).toBeGreaterThan(
        lConfig.path.points.length
      );
    });

    it('应该有多个波次', () => {
      const config = templates.sShape(3);
      expect(config.waves.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('circular 模板', () => {
    it('应该生成有效的环形关卡', () => {
      const config = templates.circular(4);

      expect(config.id).toBe(4);
      expect(config.name).toContain('环形');
      expect(config.path.points.length).toBeGreaterThanOrEqual(6);
      expect(config.towerSlots.strategy).toBe('auto');

      const result = createLevel(config);
      expect(result.validation.valid).toBe(true);
      expect(result.level).not.toBeNull();
    });

    it('路径应该最长', () => {
      const sShape = templates.sShape(3);
      const circular = templates.circular(4);

      expect(circular.path.points.length).toBeGreaterThanOrEqual(
        sShape.path.points.length
      );
    });

    it('应该有最多的塔位', () => {
      const circularConfig = templates.circular(4);
      expect(circularConfig.towerSlots.count).toBeGreaterThanOrEqual(6);
    });

    it('应该包含Boss波次', () => {
      const config = templates.circular(4);
      const hasBoss = config.waves.some((wave) =>
        wave.batches.some((batch) => batch.enemyType === 'boss')
      );
      expect(hasBoss).toBe(true);
    });
  });

  describe('模板对比', () => {
    it('所有模板都应该有效', () => {
      const templates_list = [
        templates.simpleStraight(1),
        templates.lShape(2),
        templates.sShape(3),
        templates.circular(4),
      ];

      templates_list.forEach((config, index) => {
        const result = createLevel(config);
        expect(result.validation.valid).toBe(true);
        expect(result.level).not.toBeNull();
        expect(result.level?.id).toBe(index + 1);
      });
    });

    it('难度应该递增', () => {
      const straight = templates.simpleStraight(1);
      const lShape = templates.lShape(2);
      const sShape = templates.sShape(3);
      const circular = templates.circular(4);

      // 路径复杂度递增
      expect(lShape.path.points.length).toBeGreaterThanOrEqual(
        straight.path.points.length
      );
      expect(sShape.path.points.length).toBeGreaterThanOrEqual(
        lShape.path.points.length
      );
      expect(circular.path.points.length).toBeGreaterThanOrEqual(
        sShape.path.points.length
      );

      // 波次数量递增
      expect(sShape.waves.length).toBeGreaterThanOrEqual(
        straight.waves.length
      );
      expect(circular.waves.length).toBeGreaterThanOrEqual(
        sShape.waves.length
      );
    });

    it('每个模板应该有唯一的名称', () => {
      const names = new Set([
        templates.simpleStraight(1).name,
        templates.lShape(2).name,
        templates.sShape(3).name,
        templates.circular(4).name,
      ]);

      expect(names.size).toBe(4);
    });

    it('生成的关卡应该可以直接使用', () => {
      const config = templates.sShape(100);
      const result = createLevel(config);

      expect(result.level).not.toBeNull();

      if (result.level) {
        // 验证关卡包含所有必要字段
        expect(result.level.id).toBeDefined();
        expect(result.level.name).toBeDefined();
        expect(result.level.description).toBeDefined();
        expect(result.level.path.length).toBeGreaterThan(0);
        expect(result.level.slots.length).toBeGreaterThan(0);
        expect(result.level.waves.length).toBeGreaterThan(0);
        expect(result.level.baseHP).toBeGreaterThan(0);
        expect(result.level.startGold).toBeGreaterThan(0);
      }
    });
  });

  describe('模板修改', () => {
    it('应该能够修改模板配置', () => {
      const baseTemplate = templates.sShape(5);
      const customConfig = {
        ...baseTemplate,
        name: '自定义S型',
        startGold: 1000,
        baseHP: 30,
      };

      const result = createLevel(customConfig);
      expect(result.validation.valid).toBe(true);
      expect(result.level?.name).toBe('自定义S型');
      expect(result.level?.startGold).toBe(1000);
      expect(result.level?.baseHP).toBe(30);
    });

    it('应该能够修改塔位策略', () => {
      const baseTemplate = templates.lShape(6);
      const customConfig = {
        ...baseTemplate,
        towerSlots: { strategy: 'dense' as const },
      };

      const result = createLevel(customConfig);
      expect(result.validation.valid).toBe(true);
      expect(result.level).not.toBeNull();
    });
  });
});
