/**
 * 关卡验证器
 *
 * 验证关卡配置的合法性，提供详细的错误和警告信息
 */

import type { PathPoint, LevelConfig } from '@/types/game';
import type { AILevelConfig, ValidationResult } from './types';

export class LevelValidator {
  /**
   * 验证AI关卡配置
   */
  validateAIConfig(config: AILevelConfig): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // 验证基本信息
    if (!config.name || config.name.trim() === '') {
      errors.push('关卡名称不能为空');
    }

    if (config.id <= 0) {
      errors.push('关卡ID必须大于0');
    }

    // 验证路径
    const pathValidation = this.validatePath(config.path.points);
    errors.push(...pathValidation.errors);
    warnings.push(...pathValidation.warnings);

    // 验证波次
    const waveValidation = this.validateWaves(config.waves);
    errors.push(...waveValidation.errors);
    warnings.push(...waveValidation.warnings);

    // 验证塔位配置
    const slotValidation = this.validateTowerSlotConfig(config.towerSlots);
    errors.push(...slotValidation.errors);
    warnings.push(...slotValidation.warnings);

    // 验证游戏参数
    if (config.baseHP !== undefined && config.baseHP <= 0) {
      errors.push('基地生命值必须大于0');
    }

    if (config.startGold !== undefined && config.startGold < 0) {
      errors.push('初始金币不能为负数');
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * 验证完整关卡配置
   */
  validateLevelConfig(config: LevelConfig): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // 验证路径
    const pathValidation = this.validatePath(config.path);
    errors.push(...pathValidation.errors);
    warnings.push(...pathValidation.warnings);

    // 验证塔位
    const slotValidation = this.validateSlots(config.slots, config.path);
    errors.push(...slotValidation.errors);
    warnings.push(...slotValidation.warnings);

    // 验证波次
    const waveValidation = this.validateWaves(config.waves);
    errors.push(...waveValidation.errors);
    warnings.push(...waveValidation.warnings);

    return {
      valid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * 验证路径
   */
  private validatePath(path: PathPoint[]): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // 路径必须至少有2个点
    if (!path || path.length < 2) {
      errors.push('路径必须至少包含2个点（起点和终点）');
      return { valid: false, errors, warnings };
    }

    // 检查点的有效性
    for (let i = 0; i < path.length; i++) {
      const point = path[i];

      if (typeof point.x !== 'number' || typeof point.y !== 'number') {
        errors.push(`路径点${i + 1}的坐标无效`);
        continue;
      }

      if (!isFinite(point.x) || !isFinite(point.y)) {
        errors.push(`路径点${i + 1}的坐标必须是有限数值`);
        continue;
      }

      // 检查坐标是否在合理范围内（假设游戏区域是1200x700）
      if (point.x < 0 || point.x > 1200 || point.y < 0 || point.y > 700) {
        warnings.push(`路径点${i + 1}(${point.x}, ${point.y})可能超出游戏区域`);
      }
    }

    // 检查相邻点之间的距离
    for (let i = 0; i < path.length - 1; i++) {
      const p1 = path[i];
      const p2 = path[i + 1];
      const distance = Math.sqrt(
        Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2)
      );

      if (distance < 10) {
        warnings.push(`路径点${i + 1}和${i + 2}之间的距离过小(${distance.toFixed(1)})`);
      }

      if (distance > 500) {
        warnings.push(`路径点${i + 1}和${i + 2}之间的距离过大(${distance.toFixed(1)})`);
      }
    }

    // 检查是否有重复点
    for (let i = 0; i < path.length; i++) {
      for (let j = i + 1; j < path.length; j++) {
        const p1 = path[i];
        const p2 = path[j];
        if (p1.x === p2.x && p1.y === p2.y) {
          warnings.push(`路径点${i + 1}和${j + 1}位置相同`);
        }
      }
    }

    return { valid: errors.length === 0, errors, warnings };
  }

  /**
   * 验证塔位
   */
  private validateSlots(
    slots: PathPoint[],
    path: PathPoint[]
  ): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!slots || slots.length === 0) {
      warnings.push('没有塔位，游戏可能无法进行');
      return { valid: true, errors, warnings };
    }

    // 检查塔位的有效性
    for (let i = 0; i < slots.length; i++) {
      const slot = slots[i];

      if (typeof slot.x !== 'number' || typeof slot.y !== 'number') {
        errors.push(`塔位${i + 1}的坐标无效`);
        continue;
      }

      if (!isFinite(slot.x) || !isFinite(slot.y)) {
        errors.push(`塔位${i + 1}的坐标必须是有限数值`);
        continue;
      }

      // 检查塔位是否太靠近路径
      const minDistanceToPath = this.getMinDistanceToPath(slot, path);
      if (minDistanceToPath < 30) {
        warnings.push(
          `塔位${i + 1}距离路径太近(${minDistanceToPath.toFixed(1)})，可能阻挡敌人`
        );
      }
    }

    // 检查塔位之间的距离
    for (let i = 0; i < slots.length; i++) {
      for (let j = i + 1; j < slots.length; j++) {
        const s1 = slots[i];
        const s2 = slots[j];
        const distance = Math.sqrt(
          Math.pow(s2.x - s1.x, 2) + Math.pow(s2.y - s1.y, 2)
        );

        if (distance < 50) {
          warnings.push(
            `塔位${i + 1}和${j + 1}之间的距离过小(${distance.toFixed(1)})`
          );
        }
      }
    }

    // 检查塔位数量
    if (slots.length < 3) {
      warnings.push(`塔位数量较少(${slots.length})，可能导致游戏难度过高`);
    }

    if (slots.length > 15) {
      warnings.push(`塔位数量较多(${slots.length})，可能导致游戏难度过低`);
    }

    return { valid: errors.length === 0, errors, warnings };
  }

  /**
   * 验证波次配置
   */
  private validateWaves(
    waves: AILevelConfig['waves']
  ): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!waves || waves.length === 0) {
      errors.push('至少需要一个波次');
      return { valid: false, errors, warnings };
    }

    for (let i = 0; i < waves.length; i++) {
      const wave = waves[i];

      if (!wave.batches || wave.batches.length === 0) {
        errors.push(`波次${i + 1}没有敌人批次`);
        continue;
      }

      for (let j = 0; j < wave.batches.length; j++) {
        const batch = wave.batches[j];

        if (batch.count <= 0) {
          errors.push(`波次${i + 1}批次${j + 1}的敌人数量必须大于0`);
        }

        if (batch.delay < 0) {
          errors.push(`波次${i + 1}批次${j + 1}的延迟不能为负数`);
        }

        if (!['normal', 'elite', 'boss'].includes(batch.enemyType)) {
          errors.push(
            `波次${i + 1}批次${j + 1}的敌人类型无效: ${batch.enemyType}`
          );
        }

        // 检查boss数量
        if (batch.enemyType === 'boss' && batch.count > 3) {
          warnings.push(
            `波次${i + 1}批次${j + 1}的boss数量过多(${batch.count})`
          );
        }
      }
    }

    // 检查总波次数
    if (waves.length > 20) {
      warnings.push(`波次数量较多(${waves.length})，游戏可能过长`);
    }

    return { valid: errors.length === 0, errors, warnings };
  }

  /**
   * 验证塔位配置
   */
  private validateTowerSlotConfig(
    config: AILevelConfig['towerSlots']
  ): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!config) {
      errors.push('塔位配置不能为空');
      return { valid: false, errors, warnings };
    }

    const validStrategies = ['auto', 'dense', 'sparse', 'corners-only', 'custom'];
    if (!validStrategies.includes(config.strategy)) {
      errors.push(`无效的塔位策略: ${config.strategy}`);
    }

    if (config.strategy === 'custom') {
      if (!config.customPositions || config.customPositions.length === 0) {
        errors.push('自定义策略必须提供塔位位置');
      }
    }

    if (config.count !== undefined && config.count <= 0) {
      errors.push('塔位数量必须大于0');
    }

    return { valid: errors.length === 0, errors, warnings };
  }

  /**
   * 计算点到路径的最小距离
   */
  private getMinDistanceToPath(point: PathPoint, path: PathPoint[]): number {
    let minDistance = Infinity;

    // 计算到每条路径线段的距离
    for (let i = 0; i < path.length - 1; i++) {
      const p1 = path[i];
      const p2 = path[i + 1];
      const distance = this.getDistanceToSegment(point, p1, p2);
      minDistance = Math.min(minDistance, distance);
    }

    return minDistance;
  }

  /**
   * 计算点到线段的距离
   */
  private getDistanceToSegment(
    point: PathPoint,
    segmentStart: PathPoint,
    segmentEnd: PathPoint
  ): number {
    const dx = segmentEnd.x - segmentStart.x;
    const dy = segmentEnd.y - segmentStart.y;
    const lengthSquared = dx * dx + dy * dy;

    if (lengthSquared === 0) {
      // 线段退化为点
      const px = point.x - segmentStart.x;
      const py = point.y - segmentStart.y;
      return Math.sqrt(px * px + py * py);
    }

    // 计算投影参数
    const t = Math.max(
      0,
      Math.min(
        1,
        ((point.x - segmentStart.x) * dx + (point.y - segmentStart.y) * dy) /
          lengthSquared
      )
    );

    // 投影点
    const projX = segmentStart.x + t * dx;
    const projY = segmentStart.y + t * dy;

    // 距离
    const distX = point.x - projX;
    const distY = point.y - projY;
    return Math.sqrt(distX * distX + distY * distY);
  }
}

/**
 * 便捷的验证函数
 */
export function validateAILevel(config: AILevelConfig): ValidationResult {
  const validator = new LevelValidator();
  return validator.validateAIConfig(config);
}

export function validateLevel(config: LevelConfig): ValidationResult {
  const validator = new LevelValidator();
  return validator.validateLevelConfig(config);
}
