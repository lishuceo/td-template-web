// 游戏核心类型定义

export interface PathPoint {
  x: number;
  y: number;
}

export interface SlotPosition {
  x: number;
  y: number;
}

export type EnemyType = 'normal' | 'elite' | 'boss';

export type TowerType = 'arrow' | 'slow' | 'aoe';

export interface EnemyConfig {
  type: EnemyType;
  hp: number;
  speed: number;
  goldReward: number;
  color: number;
  size: number;
}

export interface TowerConfig {
  type: TowerType;
  name: string;
  baseCost: number;
  damage: number;
  attackSpeed: number;
  range: number;
  special?: {
    slowPercent?: number;
    aoeRadius?: number;
    aoeSplash?: number;
  };
}

export interface BatchConfig {
  enemyType: EnemyType;
  count: number;
  delay: number; // 距离上一批的延迟（秒）
}

export interface WaveConfig {
  batches: BatchConfig[];
}

export interface LevelConfig {
  id: number;
  name: string;
  description: string;
  path: PathPoint[];
  slots: SlotPosition[];
  waves: WaveConfig[];
  baseHP: number;
  startGold: number;
}

export interface GameState {
  currentLevel: number | null;
  currentWave: number;
  gold: number;
  baseHP: number;
  maxBaseHP: number;
  isPaused: boolean;
  gameSpeed: number;
  gameStatus: 'menu' | 'playing' | 'victory' | 'defeat';

  // Tower build counts (for cost scaling)
  towerBuildCounts: Record<TowerType, number>;
}

export interface TowerData {
  id: string;
  type: TowerType;
  x: number;
  y: number;
  level: number;
  damage: number;
  attackSpeed: number;
  range: number;
}

export interface EnemyData {
  id: string;
  type: EnemyType;
  hp: number;
  maxHp: number;
  speed: number;
  currentSpeed: number;
  pathProgress: number;
}
