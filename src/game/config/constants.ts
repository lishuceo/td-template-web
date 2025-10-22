import type { EnemyConfig, TowerConfig } from '@/types/game';

// 游戏画布尺寸
export const GAME_WIDTH = 1200;
export const GAME_HEIGHT = 800;

// 游戏颜色
export const COLORS = {
  BACKGROUND: 0x1A1A1A,
  SCENE: 0x00CED1,
  ENEMY_NORMAL: 0xFF1493,
  ENEMY_ELITE: 0x9B30FF,
  ENEMY_BOSS: 0xFF4500,
  GOLD: 0xFFD700,
  BASE: 0x32CD32,
  DANGER: 0xFF8C00,
  PATH: 0x2F4F4F,
  TOWER_ARROW: 0xFFFFFF,
  TOWER_SLOW: 0x87CEEB,
  TOWER_AOE: 0xFF6347,
  SLOT: 0x696969,
  SLOT_HOVER: 0x808080,
};

// 敌人配置
export const ENEMY_CONFIGS: Record<string, EnemyConfig> = {
  normal: {
    type: 'normal',
    hp: 50,
    speed: 60,
    goldReward: 10,
    color: COLORS.ENEMY_NORMAL,
    size: 12,
  },
  elite: {
    type: 'elite',
    hp: 150,
    speed: 40,
    goldReward: 50,
    color: COLORS.ENEMY_ELITE,
    size: 18,
  },
  boss: {
    type: 'boss',
    hp: 1000,
    speed: 30,
    goldReward: 200,
    color: COLORS.ENEMY_BOSS,
    size: 30,
  },
};

// 防御塔配置
export const TOWER_CONFIGS: Record<string, TowerConfig> = {
  arrow: {
    type: 'arrow',
    name: '箭塔',
    baseCost: 100,
    damage: 20,
    attackSpeed: 1.0,
    range: 150,
  },
  slow: {
    type: 'slow',
    name: '减速塔',
    baseCost: 150,
    damage: 5,
    attackSpeed: 0.5,
    range: 120,
    special: {
      slowPercent: 0.5,
    },
  },
  aoe: {
    type: 'aoe',
    name: '范围塔',
    baseCost: 200,
    damage: 10,
    attackSpeed: 0.8,
    range: 180,
    special: {
      aoeRadius: 80,
      aoeSplash: 0.5,
    },
  },
};

// 升级配置
export const UPGRADE_CONFIG = {
  MAX_LEVEL: 3,
  COST_MULTIPLIER: 1.5, // 升级成本 = 基础成本 × 1.5 × 等级
  DAMAGE_INCREASE: 0.3, // 每级 +30% 伤害
  SPEED_INCREASE: 0.2,  // 每级 +20% 攻速
  RANGE_INCREASE: 0.1,  // 每级 +10% 范围
};

// 经济配置
export const ECONOMY_CONFIG = {
  INITIAL_GOLD: 500,
  WAVE_COMPLETION_BONUS: 50,
  TOWER_COST_INCREASE: 0.2, // 同种塔建造成本递增20%
};

// 波次配置
export const WAVE_CONFIG = {
  PREPARATION_TIME: 30, // 波次间隔30秒
  BATCH_SPAWN_INTERVAL: 0.5, // 同批怪物生成间隔0.5秒
};

// 基地配置
export const BASE_CONFIG = {
  INITIAL_HP: 20,
  SIZE: 40,
};

// 槽位配置
export const SLOT_CONFIG = {
  SIZE: 50,
  HOVER_ALPHA: 0.7,
};

// 物理配置
export const PHYSICS_CONFIG = {
  PROJECTILE_SPEED: 400,
};
