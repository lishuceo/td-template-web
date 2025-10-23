import { create } from 'zustand';
import type { GameState, TowerType } from '@/types/game';
import { ECONOMY_CONFIG, BASE_CONFIG } from '@game/config/constants';

interface GameStore extends GameState {
  // Actions
  setCurrentLevel: (level: number) => void;
  startGame: (levelId: number, baseHP: number, startGold: number) => void;
  endGame: (status: 'victory' | 'defeat') => void;

  setGold: (gold: number) => void;
  addGold: (amount: number) => void;
  spendGold: (amount: number) => boolean;

  setBaseHP: (hp: number) => void;
  damageBase: (damage: number) => void;

  nextWave: () => void;
  togglePause: () => void;
  setGameSpeed: (speed: number) => void;

  incrementTowerBuildCount: (type: TowerType) => void;
  resetTowerBuildCounts: () => void;

  // Score tracking
  addScore: (points: number) => void;
  setScore: (score: number) => void;

  reset: () => void;
}

const initialState: GameState = {
  currentLevel: null,
  currentWave: 0,
  gold: ECONOMY_CONFIG.INITIAL_GOLD,
  score: 0,
  baseHP: BASE_CONFIG.INITIAL_HP,
  maxBaseHP: BASE_CONFIG.INITIAL_HP,
  isPaused: false,
  gameSpeed: 1,
  gameStatus: 'menu',
  towerBuildCounts: {
    arrow: 0,
    slow: 0,
    aoe: 0,
  },
};

export const useGameStore = create<GameStore>((set, get) => ({
  ...initialState,

  setCurrentLevel: (level) => set({ currentLevel: level }),

  startGame: (levelId, baseHP, startGold) => set({
    currentLevel: levelId,
    currentWave: 0,
    gold: startGold,
    score: 0,
    baseHP: baseHP,
    maxBaseHP: baseHP,
    gameStatus: 'playing',
    isPaused: false,
    gameSpeed: 1,
    towerBuildCounts: {
      arrow: 0,
      slow: 0,
      aoe: 0,
    },
  }),

  endGame: (status) => set({ gameStatus: status }),

  setGold: (gold) => set({ gold }),

  addGold: (amount) => set((state) => ({ gold: state.gold + amount })),

  spendGold: (amount) => {
    const { gold } = get();
    if (gold >= amount) {
      set({ gold: gold - amount });
      return true;
    }
    return false;
  },

  setBaseHP: (hp) => set({ baseHP: hp }),

  damageBase: (damage) => set((state) => {
    const newHP = Math.max(0, state.baseHP - damage);
    if (newHP === 0) {
      return { baseHP: 0, gameStatus: 'defeat' };
    }
    return { baseHP: newHP };
  }),

  nextWave: () => set((state) => ({
    currentWave: state.currentWave + 1,
    gold: state.gold + ECONOMY_CONFIG.WAVE_COMPLETION_BONUS,
  })),

  togglePause: () => set((state) => ({ isPaused: !state.isPaused })),

  setGameSpeed: (speed) => set({ gameSpeed: speed }),

  incrementTowerBuildCount: (type) => set((state) => ({
    towerBuildCounts: {
      ...state.towerBuildCounts,
      [type]: state.towerBuildCounts[type] + 1,
    },
  })),

  resetTowerBuildCounts: () => set({
    towerBuildCounts: {
      arrow: 0,
      slow: 0,
      aoe: 0,
    },
  }),

  addScore: (points) => set((state) => ({ score: state.score + points })),

  setScore: (score) => set({ score }),

  reset: () => set(initialState),
}));
