import type { LevelConfig } from '@/types/game';
import { BASE_CONFIG, ECONOMY_CONFIG } from './constants';

/**
 * 10个关卡配置
 * 难度逐渐递增
 */
export const LEVELS: LevelConfig[] = [
  // 关卡1：教学关
  {
    id: 1,
    name: '新手村',
    description: '欢迎来到塔防世界！这是一个简单的教学关卡。',
    baseHP: BASE_CONFIG.INITIAL_HP,
    startGold: ECONOMY_CONFIG.INITIAL_GOLD,
    path: [
      { x: 100, y: 100 },
      { x: 400, y: 100 },
      { x: 400, y: 300 },
      { x: 700, y: 300 },
      { x: 700, y: 500 },
      { x: 1000, y: 500 },
    ],
    slots: [
      { x: 250, y: 200 },
      { x: 550, y: 200 },
      { x: 550, y: 400 },
    ],
    waves: [
      {
        batches: [
          { enemyType: 'normal', count: 3, delay: 0 },
        ],
      },
      {
        batches: [
          { enemyType: 'normal', count: 5, delay: 0 },
        ],
      },
    ],
  },

  // 关卡2
  {
    id: 2,
    name: '森林小径',
    description: '敌人数量增加了！',
    baseHP: BASE_CONFIG.INITIAL_HP,
    startGold: ECONOMY_CONFIG.INITIAL_GOLD,
    path: [
      { x: 100, y: 200 },
      { x: 500, y: 200 },
      { x: 500, y: 400 },
      { x: 800, y: 400 },
      { x: 800, y: 600 },
      { x: 1100, y: 600 },
    ],
    slots: [
      { x: 300, y: 300 },
      { x: 650, y: 300 },
      { x: 650, y: 500 },
      { x: 950, y: 500 },
    ],
    waves: [
      {
        batches: [
          { enemyType: 'normal', count: 5, delay: 0 },
        ],
      },
      {
        batches: [
          { enemyType: 'normal', count: 8, delay: 0 },
          { enemyType: 'normal', count: 5, delay: 3 },
        ],
      },
      {
        batches: [
          { enemyType: 'normal', count: 10, delay: 0 },
          { enemyType: 'elite', count: 1, delay: 3 },
        ],
      },
    ],
  },

  // 关卡3
  {
    id: 3,
    name: '山谷防线',
    description: '精英敌人出现了！',
    baseHP: BASE_CONFIG.INITIAL_HP,
    startGold: 550,
    path: [
      { x: 50, y: 400 },
      { x: 300, y: 400 },
      { x: 300, y: 150 },
      { x: 600, y: 150 },
      { x: 600, y: 450 },
      { x: 900, y: 450 },
      { x: 900, y: 250 },
      { x: 1150, y: 250 },
    ],
    slots: [
      { x: 200, y: 280 },
      { x: 450, y: 280 },
      { x: 750, y: 350 },
      { x: 750, y: 550 },
      { x: 1000, y: 150 },
    ],
    waves: [
      {
        batches: [
          { enemyType: 'normal', count: 8, delay: 0 },
        ],
      },
      {
        batches: [
          { enemyType: 'normal', count: 10, delay: 0 },
          { enemyType: 'elite', count: 2, delay: 3 },
        ],
      },
      {
        batches: [
          { enemyType: 'normal', count: 12, delay: 0 },
          { enemyType: 'elite', count: 3, delay: 2 },
          { enemyType: 'normal', count: 8, delay: 3 },
        ],
      },
      {
        batches: [
          { enemyType: 'elite', count: 5, delay: 0 },
        ],
      },
    ],
  },

  // 关卡4
  {
    id: 4,
    name: '曲折之路',
    description: '路径更复杂了！',
    baseHP: BASE_CONFIG.INITIAL_HP,
    startGold: 600,
    path: [
      { x: 100, y: 100 },
      { x: 400, y: 100 },
      { x: 400, y: 300 },
      { x: 200, y: 300 },
      { x: 200, y: 500 },
      { x: 600, y: 500 },
      { x: 600, y: 250 },
      { x: 900, y: 250 },
      { x: 900, y: 600 },
      { x: 1100, y: 600 },
    ],
    slots: [
      { x: 250, y: 200 },
      { x: 300, y: 400 },
      { x: 450, y: 400 },
      { x: 750, y: 350 },
      { x: 750, y: 450 },
      { x: 1000, y: 500 },
    ],
    waves: [
      {
        batches: [
          { enemyType: 'normal', count: 10, delay: 0 },
          { enemyType: 'normal', count: 10, delay: 2 },
        ],
      },
      {
        batches: [
          { enemyType: 'normal', count: 15, delay: 0 },
          { enemyType: 'elite', count: 3, delay: 3 },
        ],
      },
      {
        batches: [
          { enemyType: 'elite', count: 4, delay: 0 },
          { enemyType: 'normal', count: 20, delay: 2 },
        ],
      },
      {
        batches: [
          { enemyType: 'normal', count: 15, delay: 0 },
          { enemyType: 'elite', count: 5, delay: 2 },
          { enemyType: 'elite', count: 5, delay: 3 },
        ],
      },
      {
        batches: [
          { enemyType: 'elite', count: 8, delay: 0 },
        ],
      },
    ],
  },

  // 关卡5
  {
    id: 5,
    name: '荆棘环道',
    description: '环形路径，小心应对！',
    baseHP: BASE_CONFIG.INITIAL_HP,
    startGold: 650,
    path: [
      { x: 600, y: 100 },
      { x: 900, y: 200 },
      { x: 900, y: 500 },
      { x: 600, y: 600 },
      { x: 300, y: 500 },
      { x: 300, y: 200 },
      { x: 600, y: 100 },
      { x: 600, y: 350 },
      { x: 100, y: 350 },
    ],
    slots: [
      { x: 750, y: 100 },
      { x: 1000, y: 350 },
      { x: 750, y: 650 },
      { x: 450, y: 650 },
      { x: 200, y: 500 },
      { x: 200, y: 200 },
      { x: 450, y: 100 },
    ],
    waves: [
      {
        batches: [
          { enemyType: 'normal', count: 15, delay: 0 },
        ],
      },
      {
        batches: [
          { enemyType: 'normal', count: 20, delay: 0 },
          { enemyType: 'elite', count: 3, delay: 2 },
        ],
      },
      {
        batches: [
          { enemyType: 'elite', count: 5, delay: 0 },
          { enemyType: 'normal', count: 25, delay: 2 },
        ],
      },
      {
        batches: [
          { enemyType: 'normal', count: 20, delay: 0 },
          { enemyType: 'elite', count: 6, delay: 2 },
          { enemyType: 'elite', count: 6, delay: 3 },
        ],
      },
      {
        batches: [
          { enemyType: 'elite', count: 10, delay: 0 },
          { enemyType: 'elite', count: 5, delay: 3 },
        ],
      },
      {
        batches: [
          { enemyType: 'boss', count: 1, delay: 0 },
        ],
      },
    ],
  },

  // 关卡6-10（后续继续增加难度）
  {
    id: 6,
    name: '峡谷突围',
    description: '更多的敌人，更少的空间！',
    baseHP: BASE_CONFIG.INITIAL_HP,
    startGold: 700,
    path: [
      { x: 50, y: 300 },
      { x: 350, y: 300 },
      { x: 350, y: 100 },
      { x: 650, y: 100 },
      { x: 650, y: 500 },
      { x: 950, y: 500 },
      { x: 950, y: 200 },
      { x: 1150, y: 200 },
    ],
    slots: [
      { x: 200, y: 200 },
      { x: 500, y: 200 },
      { x: 500, y: 400 },
      { x: 800, y: 350 },
      { x: 1050, y: 350 },
    ],
    waves: [
      { batches: [{ enemyType: 'normal', count: 20, delay: 0 }] },
      { batches: [{ enemyType: 'normal', count: 25, delay: 0 }, { enemyType: 'elite', count: 4, delay: 2 }] },
      { batches: [{ enemyType: 'elite', count: 8, delay: 0 }, { enemyType: 'normal', count: 30, delay: 2 }] },
      { batches: [{ enemyType: 'normal', count: 20, delay: 0 }, { enemyType: 'elite', count: 10, delay: 2 }] },
      { batches: [{ enemyType: 'elite', count: 15, delay: 0 }] },
      { batches: [{ enemyType: 'elite', count: 10, delay: 0 }, { enemyType: 'boss', count: 1, delay: 3 }] },
    ],
  },

  {
    id: 7,
    name: '迷宫挑战',
    description: '复杂的路径，严峻的考验！',
    baseHP: BASE_CONFIG.INITIAL_HP,
    startGold: 750,
    path: [
      { x: 100, y: 150 },
      { x: 400, y: 150 },
      { x: 400, y: 350 },
      { x: 200, y: 350 },
      { x: 200, y: 550 },
      { x: 600, y: 550 },
      { x: 600, y: 200 },
      { x: 900, y: 200 },
      { x: 900, y: 650 },
      { x: 1100, y: 650 },
    ],
    slots: [
      { x: 250, y: 250 },
      { x: 300, y: 450 },
      { x: 500, y: 400 },
      { x: 750, y: 350 },
      { x: 750, y: 500 },
      { x: 1000, y: 400 },
    ],
    waves: [
      { batches: [{ enemyType: 'normal', count: 25, delay: 0 }] },
      { batches: [{ enemyType: 'normal', count: 30, delay: 0 }, { enemyType: 'elite', count: 5, delay: 2 }] },
      { batches: [{ enemyType: 'elite', count: 10, delay: 0 }, { enemyType: 'normal', count: 35, delay: 2 }] },
      { batches: [{ enemyType: 'normal', count: 25, delay: 0 }, { enemyType: 'elite', count: 12, delay: 2 }] },
      { batches: [{ enemyType: 'elite', count: 18, delay: 0 }] },
      { batches: [{ enemyType: 'elite', count: 12, delay: 0 }, { enemyType: 'boss', count: 1, delay: 3 }] },
    ],
  },

  {
    id: 8,
    name: '风暴前夕',
    description: '敌人的攻势越来越猛烈！',
    baseHP: BASE_CONFIG.INITIAL_HP,
    startGold: 800,
    path: [
      { x: 50, y: 400 },
      { x: 300, y: 400 },
      { x: 300, y: 150 },
      { x: 600, y: 150 },
      { x: 600, y: 450 },
      { x: 900, y: 450 },
      { x: 900, y: 250 },
      { x: 1150, y: 250 },
    ],
    slots: [
      { x: 175, y: 275 },
      { x: 450, y: 275 },
      { x: 450, y: 550 },
      { x: 750, y: 300 },
      { x: 750, y: 550 },
      { x: 1025, y: 350 },
    ],
    waves: [
      { batches: [{ enemyType: 'normal', count: 30, delay: 0 }] },
      { batches: [{ enemyType: 'normal', count: 35, delay: 0 }, { enemyType: 'elite', count: 6, delay: 2 }] },
      { batches: [{ enemyType: 'elite', count: 12, delay: 0 }, { enemyType: 'normal', count: 40, delay: 2 }] },
      { batches: [{ enemyType: 'normal', count: 30, delay: 0 }, { enemyType: 'elite', count: 15, delay: 2 }] },
      { batches: [{ enemyType: 'elite', count: 20, delay: 0 }, { enemyType: 'elite', count: 10, delay: 3 }] },
      { batches: [{ enemyType: 'elite', count: 15, delay: 0 }, { enemyType: 'boss', count: 1, delay: 3 }] },
    ],
  },

  {
    id: 9,
    name: '血战之地',
    description: '只有最强的守卫者才能通过！',
    baseHP: BASE_CONFIG.INITIAL_HP,
    startGold: 850,
    path: [
      { x: 100, y: 100 },
      { x: 500, y: 100 },
      { x: 500, y: 400 },
      { x: 200, y: 400 },
      { x: 200, y: 650 },
      { x: 700, y: 650 },
      { x: 700, y: 300 },
      { x: 1000, y: 300 },
      { x: 1000, y: 550 },
      { x: 1100, y: 550 },
    ],
    slots: [
      { x: 300, y: 200 },
      { x: 350, y: 500 },
      { x: 450, y: 550 },
      { x: 850, y: 475 },
      { x: 850, y: 200 },
      { x: 1050, y: 425 },
    ],
    waves: [
      { batches: [{ enemyType: 'normal', count: 35, delay: 0 }] },
      { batches: [{ enemyType: 'normal', count: 40, delay: 0 }, { enemyType: 'elite', count: 8, delay: 2 }] },
      { batches: [{ enemyType: 'elite', count: 15, delay: 0 }, { enemyType: 'normal', count: 45, delay: 2 }] },
      { batches: [{ enemyType: 'normal', count: 35, delay: 0 }, { enemyType: 'elite', count: 18, delay: 2 }] },
      { batches: [{ enemyType: 'elite', count: 25, delay: 0 }, { enemyType: 'elite', count: 12, delay: 3 }] },
      { batches: [{ enemyType: 'elite', count: 20, delay: 0 }, { enemyType: 'boss', count: 1, delay: 3 }] },
      { batches: [{ enemyType: 'elite', count: 15, delay: 0 }, { enemyType: 'boss', count: 1, delay: 2 }] },
    ],
  },

  {
    id: 10,
    name: '终极之战',
    description: '最后的考验！打败Boss，赢得胜利！',
    baseHP: BASE_CONFIG.INITIAL_HP,
    startGold: 900,
    path: [
      { x: 600, y: 50 },
      { x: 900, y: 150 },
      { x: 900, y: 400 },
      { x: 600, y: 500 },
      { x: 300, y: 400 },
      { x: 300, y: 150 },
      { x: 600, y: 50 },
      { x: 600, y: 300 },
      { x: 100, y: 300 },
    ],
    slots: [
      { x: 750, y: 50 },
      { x: 1000, y: 275 },
      { x: 750, y: 550 },
      { x: 450, y: 550 },
      { x: 200, y: 400 },
      { x: 200, y: 150 },
      { x: 450, y: 50 },
      { x: 600, y: 400 },
    ],
    waves: [
      { batches: [{ enemyType: 'normal', count: 40, delay: 0 }] },
      { batches: [{ enemyType: 'normal', count: 45, delay: 0 }, { enemyType: 'elite', count: 10, delay: 2 }] },
      { batches: [{ enemyType: 'elite', count: 18, delay: 0 }, { enemyType: 'normal', count: 50, delay: 2 }] },
      { batches: [{ enemyType: 'normal', count: 40, delay: 0 }, { enemyType: 'elite', count: 20, delay: 2 }] },
      { batches: [{ enemyType: 'elite', count: 30, delay: 0 }, { enemyType: 'elite', count: 15, delay: 3 }] },
      { batches: [{ enemyType: 'elite', count: 25, delay: 0 }, { enemyType: 'boss', count: 1, delay: 3 }] },
      { batches: [{ enemyType: 'elite', count: 20, delay: 0 }, { enemyType: 'boss', count: 1, delay: 2 }] },
      { batches: [{ enemyType: 'elite', count: 15, delay: 0 }, { enemyType: 'boss', count: 2, delay: 3 }] },
    ],
  },
];

export function getLevelById(id: number): LevelConfig | undefined {
  return LEVELS.find((level) => level.id === id);
}
