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
    const path = this.levelConfig.path;
    const pathWidth = 50;
    const wallWidth = 35;
    const wallOffset = pathWidth / 2 + wallWidth / 2;

    // 1. 绘制城墙（蓝色高地）- 在路径两侧
    this.drawWalls(path, wallOffset, wallWidth);

    // 2. 绘制路径（棕色地面道路）
    this.pathGraphics.lineStyle(pathWidth, COLORS.PATH);
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

  private drawWalls(path: { x: number; y: number }[], offset: number, width: number): void {
    const graphics = this.add.graphics();

    // 先绘制所有城墙段
    const wallSegments: Array<{side: 'left' | 'right', points: {x: number, y: number}[]}> = [];

    for (let i = 0; i < path.length - 1; i++) {
      const p1 = path[i];
      const p2 = path[i + 1];

      // 计算路径方向的垂直向量
      const dx = p2.x - p1.x;
      const dy = p2.y - p1.y;
      const len = Math.sqrt(dx * dx + dy * dy);
      const perpX = (-dy / len) * offset;
      const perpY = (dx / len) * offset;

      // 存储城墙段的端点
      wallSegments.push({
        side: 'left',
        points: [
          { x: p1.x + perpX, y: p1.y + perpY },
          { x: p2.x + perpX, y: p2.y + perpY }
        ]
      });

      wallSegments.push({
        side: 'right',
        points: [
          { x: p1.x - perpX, y: p1.y - perpY },
          { x: p2.x - perpX, y: p2.y - perpY }
        ]
      });
    }

    // 绘制连续的城墙路径（左侧）
    graphics.lineStyle(width, COLORS.WALL, 1);

    graphics.beginPath();
    for (let i = 0; i < wallSegments.length; i += 2) {
      const seg = wallSegments[i];
      if (i === 0) {
        graphics.moveTo(seg.points[0].x, seg.points[0].y);
      }
      graphics.lineTo(seg.points[1].x, seg.points[1].y);
    }
    graphics.strokePath();

    // 绘制连续的城墙路径（右侧）
    graphics.beginPath();
    for (let i = 1; i < wallSegments.length; i += 2) {
      const seg = wallSegments[i];
      if (i === 1) {
        graphics.moveTo(seg.points[0].x, seg.points[0].y);
      }
      graphics.lineTo(seg.points[1].x, seg.points[1].y);
    }
    graphics.strokePath();

    // 在转角处绘制圆形填充以平滑连接
    graphics.fillStyle(COLORS.WALL, 1);
    for (let i = 1; i < path.length - 1; i++) {
      const p1 = path[i];
      const p0 = path[i - 1];

      const dx = p1.x - p0.x;
      const dy = p1.y - p0.y;
      const len = Math.sqrt(dx * dx + dy * dy);
      const perpX = (-dy / len) * offset;
      const perpY = (dx / len) * offset;

      graphics.fillCircle(p1.x + perpX, p1.y + perpY, width / 2);
      graphics.fillCircle(p1.x - perpX, p1.y - perpY, width / 2);
    }
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

    // 显示建造菜单
    this.events.on('showBuildMenu', (slot: TowerSlot) => {
      // 发送给React层显示菜单
      this.events.emit('openBuildMenu', slot);
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
