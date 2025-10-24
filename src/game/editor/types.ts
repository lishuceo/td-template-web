/**
 * AI友好的关卡编辑器类型定义
 *
 * 设计理念：
 * 1. 使用简单的自然语言式配置
 * 2. 自动化生成复杂细节（城墙、塔位）
 * 3. 易于AI理解和生成
 */

import type { PathPoint, WaveConfig } from '@/types/game';

/**
 * AI友好的路径描述
 * 可以用简单的方式描述路径
 */
export interface SimplePathDescription {
  // 路径点（怪物的进攻路线）
  points: PathPoint[];
  // 可选：路径宽度（默认50）
  width?: number;
}

/**
 * 塔位生成策略
 */
export type TowerSlotStrategy =
  | 'auto'          // 自动在城墙上生成塔位
  | 'dense'         // 密集布置
  | 'sparse'        // 稀疏布置
  | 'corners-only'  // 仅在转角处
  | 'custom';       // 自定义位置

/**
 * AI友好的关卡配置
 * 这是AI用来创建关卡的简化接口
 */
export interface AILevelConfig {
  // 基本信息
  id: number;
  name: string;
  description: string;

  // 路径描述（兵线）
  path: SimplePathDescription;

  // 塔位生成策略
  towerSlots: {
    strategy: TowerSlotStrategy;
    // 如果是custom，提供具体位置
    customPositions?: PathPoint[];
    // 自动生成时的塔位数量（可选）
    count?: number;
  };

  // 波次配置
  waves: WaveConfig[];

  // 游戏参数
  baseHP?: number;      // 默认20
  startGold?: number;   // 默认500
}

/**
 * 关卡生成选项
 */
export interface LevelGenerationOptions {
  // 城墙宽度
  wallWidth?: number;
  // 路径宽度
  pathWidth?: number;
  // 塔位距离城墙的偏移
  slotOffset?: number;
  // 塔位之间的最小距离
  minSlotDistance?: number;
}

/**
 * 验证结果
 */
export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * 关卡预览数据（用于可视化）
 */
export interface LevelPreview {
  path: PathPoint[];
  wallPoints: {
    left: PathPoint[];
    right: PathPoint[];
  };
  slots: PathPoint[];
  basePosition: PathPoint;
}
