/**
 * 关卡生成器
 *
 * 核心功能：
 * 1. 根据路径自动生成城墙坐标
 * 2. 在城墙上自动生成塔位
 * 3. 支持多种生成策略
 */

import type { PathPoint, LevelConfig, SlotPosition } from '@/types/game';
import type {
  AILevelConfig,
  LevelGenerationOptions,
  LevelPreview,
} from './types';
import { BASE_CONFIG, ECONOMY_CONFIG } from '@game/config/constants';

export class LevelGenerator {
  private options: Required<LevelGenerationOptions>;

  constructor(options?: LevelGenerationOptions) {
    // 默认配置
    this.options = {
      wallWidth: 40,
      pathWidth: 50,
      slotOffset: 20, // 塔位距离城墙中心线的偏移
      minSlotDistance: 100, // 塔位之间的最小距离
      ...options,
    };
  }

  /**
   * 生成完整的关卡配置
   */
  generate(aiConfig: AILevelConfig): LevelConfig {
    const path = aiConfig.path.points;
    const pathWidth = aiConfig.path.width || this.options.pathWidth;

    // 计算城墙位置
    const wallOffset = pathWidth / 2 + this.options.wallWidth / 2;
    const wallPoints = this.calculateWallPoints(path, wallOffset);

    // 生成塔位
    const slots = this.generateTowerSlots(
      path,
      wallPoints,
      aiConfig.towerSlots
    );

    // 返回完整配置
    return {
      id: aiConfig.id,
      name: aiConfig.name,
      description: aiConfig.description,
      path,
      slots,
      waves: aiConfig.waves,
      baseHP: aiConfig.baseHP || BASE_CONFIG.INITIAL_HP,
      startGold: aiConfig.startGold || ECONOMY_CONFIG.INITIAL_GOLD,
    };
  }

  /**
   * 生成关卡预览（用于可视化）
   */
  generatePreview(aiConfig: AILevelConfig): LevelPreview {
    const path = aiConfig.path.points;
    const pathWidth = aiConfig.path.width || this.options.pathWidth;
    const wallOffset = pathWidth / 2 + this.options.wallWidth / 2;
    const wallPoints = this.calculateWallPoints(path, wallOffset);

    const slots = this.generateTowerSlots(
      path,
      wallPoints,
      aiConfig.towerSlots
    );

    return {
      path,
      wallPoints,
      slots,
      basePosition: path[path.length - 1],
    };
  }

  /**
   * 计算城墙点位
   * 返回左侧和右侧城墙的所有点
   */
  private calculateWallPoints(
    path: PathPoint[],
    offset: number
  ): { left: PathPoint[]; right: PathPoint[] } {
    const leftWallPoints: PathPoint[] = [];
    const rightWallPoints: PathPoint[] = [];

    for (let i = 0; i < path.length; i++) {
      const curr = path[i];
      const prev = i > 0 ? path[i - 1] : null;
      const next = i < path.length - 1 ? path[i + 1] : null;

      let perpX = 0;
      let perpY = 0;

      if (prev && next) {
        // 中间点：使用角平分线方向
        const dx1 = curr.x - prev.x;
        const dy1 = curr.y - prev.y;
        const len1 = Math.sqrt(dx1 * dx1 + dy1 * dy1);
        const dir1X = dx1 / len1;
        const dir1Y = dy1 / len1;

        const dx2 = next.x - curr.x;
        const dy2 = next.y - curr.y;
        const len2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);
        const dir2X = dx2 / len2;
        const dir2Y = dy2 / len2;

        // 计算角平分线方向
        const bisectX = dir1X + dir2X;
        const bisectY = dir1Y + dir2Y;
        const bisectLen = Math.sqrt(bisectX * bisectX + bisectY * bisectY);

        // 角平分线的垂直方向
        const bisectNormX = -bisectY / bisectLen;
        const bisectNormY = bisectX / bisectLen;

        // 计算转角的夹角
        const cosAngle = dir1X * dir2X + dir1Y * dir2Y;
        const sinHalfAngle = Math.sqrt((1 - cosAngle) / 2);

        // 根据转角调整offset
        const adjustedOffset = sinHalfAngle > 0.1 ? offset / sinHalfAngle : offset;

        perpX = bisectNormX * adjustedOffset;
        perpY = bisectNormY * adjustedOffset;
      } else if (next) {
        // 起点
        const dx = next.x - curr.x;
        const dy = next.y - curr.y;
        const len = Math.sqrt(dx * dx + dy * dy);
        perpX = (-dy / len) * offset;
        perpY = (dx / len) * offset;
      } else if (prev) {
        // 终点
        const dx = curr.x - prev.x;
        const dy = curr.y - prev.y;
        const len = Math.sqrt(dx * dx + dy * dy);
        perpX = (-dy / len) * offset;
        perpY = (dx / len) * offset;
      }

      leftWallPoints.push({ x: curr.x + perpX, y: curr.y + perpY });
      rightWallPoints.push({ x: curr.x - perpX, y: curr.y - perpY });
    }

    return { left: leftWallPoints, right: rightWallPoints };
  }

  /**
   * 生成塔位
   */
  private generateTowerSlots(
    path: PathPoint[],
    wallPoints: { left: PathPoint[]; right: PathPoint[] },
    slotConfig: AILevelConfig['towerSlots']
  ): SlotPosition[] {
    // 如果是自定义位置
    if (slotConfig.strategy === 'custom' && slotConfig.customPositions) {
      return slotConfig.customPositions;
    }

    // 自动生成
    return this.autoGenerateSlots(path, wallPoints, slotConfig);
  }

  /**
   * 自动生成塔位
   */
  private autoGenerateSlots(
    path: PathPoint[],
    wallPoints: { left: PathPoint[]; right: PathPoint[] },
    slotConfig: AILevelConfig['towerSlots']
  ): SlotPosition[] {
    const slots: SlotPosition[] = [];

    // 根据策略决定采样点
    let sampleIndices: number[] = [];

    switch (slotConfig.strategy) {
      case 'corners-only':
        // 仅在转角处（排除起点和终点）
        sampleIndices = this.findCornerIndices(path);
        break;

      case 'sparse':
        // 稀疏布置：每隔2-3个点取一个
        for (let i = 1; i < path.length - 1; i += 3) {
          sampleIndices.push(i);
        }
        break;

      case 'dense':
        // 密集布置：每个点都可以
        sampleIndices = Array.from({ length: path.length - 2 }, (_, i) => i + 1);
        break;

      case 'auto':
      default:
        // 自动：根据路径长度和期望数量智能分配
        sampleIndices = this.calculateAutoSampleIndices(
          path,
          slotConfig.count
        );
        break;
    }

    // 在采样点处生成塔位（左右城墙各一个）
    for (const index of sampleIndices) {
      if (index >= 0 && index < wallPoints.left.length) {
        // 左侧塔位
        const leftPoint = wallPoints.left[index];
        const leftSlot = this.adjustSlotPosition(leftPoint, path[index], this.options.slotOffset);

        // 右侧塔位
        const rightPoint = wallPoints.right[index];
        const rightSlot = this.adjustSlotPosition(rightPoint, path[index], this.options.slotOffset);

        // 检查距离，避免塔位过于密集
        if (this.isValidSlotPosition(leftSlot, slots)) {
          slots.push(leftSlot);
        }
        if (this.isValidSlotPosition(rightSlot, slots)) {
          slots.push(rightSlot);
        }
      }
    }

    // 如果指定了数量，截取或补充
    if (slotConfig.count && slots.length !== slotConfig.count) {
      if (slots.length > slotConfig.count) {
        // 均匀采样减少
        const step = slots.length / slotConfig.count;
        const selectedSlots: SlotPosition[] = [];
        for (let i = 0; i < slotConfig.count; i++) {
          selectedSlots.push(slots[Math.floor(i * step)]);
        }
        return selectedSlots;
      }
    }

    return slots;
  }

  /**
   * 找出路径中的转角点
   */
  private findCornerIndices(path: PathPoint[]): number[] {
    const corners: number[] = [];

    for (let i = 1; i < path.length - 1; i++) {
      const prev = path[i - 1];
      const curr = path[i];
      const next = path[i + 1];

      // 计算方向向量
      const dir1 = { x: curr.x - prev.x, y: curr.y - prev.y };
      const dir2 = { x: next.x - curr.x, y: next.y - curr.y };

      // 归一化
      const len1 = Math.sqrt(dir1.x * dir1.x + dir1.y * dir1.y);
      const len2 = Math.sqrt(dir2.x * dir2.x + dir2.y * dir2.y);

      if (len1 > 0 && len2 > 0) {
        const normDir1 = { x: dir1.x / len1, y: dir1.y / len1 };
        const normDir2 = { x: dir2.x / len2, y: dir2.y / len2 };

        // 计算夹角余弦值
        const dot = normDir1.x * normDir2.x + normDir1.y * normDir2.y;

        // 如果方向改变明显（夹角 > 30度），认为是转角
        if (dot < 0.866) {
          // cos(30°) ≈ 0.866
          corners.push(i);
        }
      }
    }

    return corners;
  }

  /**
   * 计算自动模式下的采样点
   */
  private calculateAutoSampleIndices(
    path: PathPoint[],
    targetCount?: number
  ): number[] {
    const pathLength = path.length;
    const count = targetCount || Math.max(3, Math.floor(pathLength / 2));

    // 均匀分布，但排除起点和终点
    const indices: number[] = [];
    const step = (pathLength - 2) / count;

    for (let i = 0; i < count; i++) {
      const index = Math.floor(1 + i * step);
      if (index < pathLength - 1) {
        indices.push(index);
      }
    }

    return indices;
  }

  /**
   * 调整塔位位置，使其在城墙上
   */
  private adjustSlotPosition(
    wallPoint: PathPoint,
    pathPoint: PathPoint,
    offset: number
  ): SlotPosition {
    // 计算从路径点到城墙点的方向
    const dx = wallPoint.x - pathPoint.x;
    const dy = wallPoint.y - pathPoint.y;
    const len = Math.sqrt(dx * dx + dy * dy);

    if (len < 0.001) {
      return wallPoint;
    }

    // 在城墙方向上偏移
    return {
      x: pathPoint.x + (dx / len) * (len + offset),
      y: pathPoint.y + (dy / len) * (len + offset),
    };
  }

  /**
   * 检查塔位是否有效（不会与其他塔位太近）
   */
  private isValidSlotPosition(
    newSlot: SlotPosition,
    existingSlots: SlotPosition[]
  ): boolean {
    for (const slot of existingSlots) {
      const dx = newSlot.x - slot.x;
      const dy = newSlot.y - slot.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < this.options.minSlotDistance) {
        return false;
      }
    }
    return true;
  }
}

/**
 * 便捷的生成函数
 */
export function generateLevel(
  aiConfig: AILevelConfig,
  options?: LevelGenerationOptions
): LevelConfig {
  const generator = new LevelGenerator(options);
  return generator.generate(aiConfig);
}

export function previewLevel(
  aiConfig: AILevelConfig,
  options?: LevelGenerationOptions
): LevelPreview {
  const generator = new LevelGenerator(options);
  return generator.generatePreview(aiConfig);
}
