import Phaser from 'phaser';
import type { LevelConfig, TowerType } from '@/types/game';
import { COLORS } from '@game/config/constants';
import { WaveManager } from '@game/managers/WaveManager';
import { TowerManager, type TowerSlot } from '@game/managers/TowerManager';
import { Base } from '@game/entities/Base';
import { useGameStore } from '@store/gameStore';

export class GameScene extends Phaser.Scene {
  private levelConfig!: LevelConfig;
  private waveManager!: WaveManager;
  private towerManager!: TowerManager;
  private base!: Base;
  private pathGraphics!: Phaser.GameObjects.Graphics;

  constructor() {
    super({ key: 'GameScene' });
  }

  public initLevel(levelConfig: LevelConfig): void {
    this.levelConfig = levelConfig;
  }

  create(): void {
    if (!this.levelConfig) {
      console.error('Level config not initialized!');
      return;
    }

    // 设置背景
    this.cameras.main.setBackgroundColor(COLORS.BACKGROUND);

    // 绘制路径
    this.drawPath();

    // 创建基地
    const endPoint = this.levelConfig.path[this.levelConfig.path.length - 1];
    this.base = new Base(this, endPoint.x, endPoint.y);

    // 初始化管理器
    this.waveManager = new WaveManager(
      this,
      this.levelConfig.waves,
      this.levelConfig.path
    );

    this.towerManager = new TowerManager(this, this.levelConfig.slots);

    // 设置游戏状态
    const store = useGameStore.getState();
    store.startGame(
      this.levelConfig.id,
      this.levelConfig.baseHP,
      this.levelConfig.startGold
    );

    // 监听事件
    this.setupEventListeners();

    // 开始第一波
    this.time.delayedCall(2000, () => {
      this.waveManager.startNextWave();
    });
  }

  private drawPath(): void {
    this.pathGraphics = this.add.graphics();

    // 绘制路径（带阴影效果）
    const path = this.levelConfig.path;

    // 阴影
    this.pathGraphics.lineStyle(35, 0x000000, 0.3);
    this.pathGraphics.beginPath();
    this.pathGraphics.moveTo(path[0].x + 6, path[0].y + 6);
    for (let i = 1; i < path.length; i++) {
      this.pathGraphics.lineTo(path[i].x + 6, path[i].y + 6);
    }
    this.pathGraphics.strokePath();

    // 路径主体
    this.pathGraphics.lineStyle(30, COLORS.PATH);
    this.pathGraphics.beginPath();
    this.pathGraphics.moveTo(path[0].x, path[0].y);
    for (let i = 1; i < path.length; i++) {
      this.pathGraphics.lineTo(path[i].x, path[i].y);
    }
    this.pathGraphics.strokePath();

    // 绘制起点和终点标记
    this.drawStartPoint(path[0]);
    this.drawEndPoint(path[path.length - 1]);
  }

  private drawStartPoint(point: { x: number; y: number }): void {
    const graphics = this.add.graphics();
    graphics.fillStyle(COLORS.DANGER, 0.8);
    graphics.fillCircle(point.x, point.y, 20);
    graphics.lineStyle(3, 0xffffff);
    graphics.strokeCircle(point.x, point.y, 20);

    // 添加箭头
    const arrow = this.add.text(point.x, point.y, '▶', {
      fontSize: '24px',
      color: '#ffffff',
    });
    arrow.setOrigin(0.5);
  }

  private drawEndPoint(point: { x: number; y: number }): void {
    // 终点由Base对象表示，这里可以添加额外的标记
    const graphics = this.add.graphics();
    graphics.lineStyle(3, COLORS.BASE, 0.5);
    graphics.strokeCircle(point.x, point.y, 60);
  }

  private setupEventListeners(): void {
    const store = useGameStore.getState();

    // 敌人被击杀
    this.events.on('enemyKilled', (goldReward: number) => {
      store.addGold(goldReward);
    });

    // 敌人到达终点
    this.events.on('enemyReachEnd', () => {
      store.damageBase(1);
      this.base.damage();

      // 检查游戏是否失败
      if (store.baseHP <= 0) {
        this.gameOver(false);
      }
    });

    // 波次开始
    this.events.on('waveStart', (waveNumber: number) => {
      console.log(`Wave ${waveNumber} started!`);
    });

    // 波次完成
    this.events.on('waveComplete', (waveNumber: number) => {
      console.log(`Wave ${waveNumber} completed!`);
      store.nextWave();
    });

    // 所有波次完成
    this.events.on('allWavesComplete', () => {
      this.gameOver(true);
    });

    // 建造塔
    this.events.on('tryBuildTower', (towerType: TowerType, slot: TowerSlot) => {
      const buildCount = store.towerBuildCounts[towerType];
      const cost = this.towerManager.getTowerCost(towerType, buildCount);

      if (store.spendGold(cost)) {
        this.towerManager.buildTower(towerType, slot);
        store.incrementTowerBuildCount(towerType);
      } else {
        console.log('Not enough gold!');
      }
    });

    // 塔升级
    this.events.on('towerUpgraded', () => {
      console.log('Tower upgraded!');
    });
  }

  update(_time: number, delta: number): void {
    const store = useGameStore.getState();

    // 应用游戏速度
    const adjustedDelta = delta * store.gameSpeed;

    // 暂停检查
    if (store.isPaused) return;

    // 更新波次管理器
    this.waveManager.update(adjustedDelta);

    // 更新塔管理器
    this.towerManager.update(this.waveManager.enemies);
  }

  private gameOver(victory: boolean): void {
    const store = useGameStore.getState();
    store.endGame(victory ? 'victory' : 'defeat');

    // 显示游戏结束UI（通过React组件）
    console.log(victory ? 'Victory!' : 'Defeat!');
  }

  public setBuildMode(towerType: TowerType | null): void {
    this.towerManager.setBuildMode(towerType);
  }

  public upgradeTower(): boolean {
    const tower = this.towerManager.getSelectedTower();
    if (!tower) return false;

    const cost = tower.getUpgradeCost();
    const store = useGameStore.getState();

    if (store.spendGold(cost)) {
      return this.towerManager.upgradeTower(tower);
    }

    return false;
  }

  public sellTower(): void {
    const tower = this.towerManager.getSelectedTower();
    if (tower) {
      this.towerManager.sellTower(tower);
    }
  }

  public startNextWave(): void {
    this.waveManager.skipPreparation();
  }
}
