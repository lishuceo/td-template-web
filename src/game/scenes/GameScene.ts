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
    const path = this.levelConfig.path;
    const pathWidth = 50;
    const wallWidth = 40;
    const wallOffset = pathWidth / 2 + wallWidth / 2;

    // 绘制城墙（绿色高地，带立体感）- 在路径两侧
    // 路径本身不需要绘制，它只是被城墙围起来的地面
    this.drawWalls(path, wallOffset);

    // 绘制起点和终点标记
    this.drawStartPoint(path[0]);
    this.drawEndPoint(path[path.length - 1]);
  }

  private drawWalls(path: { x: number; y: number }[], offset: number): void {
    const graphics = this.add.graphics();

    // 计算每个路径点的垂直向量（左侧墙点和右侧墙点）
    const leftWallPoints: { x: number; y: number }[] = [];
    const rightWallPoints: { x: number; y: number }[] = [];

    for (let i = 0; i < path.length; i++) {
      const curr = path[i];
      const prev = i > 0 ? path[i - 1] : null;
      const next = i < path.length - 1 ? path[i + 1] : null;

      let perpX = 0;
      let perpY = 0;

      if (prev && next) {
        // 中间点：使用角平分线方向，并根据转角角度调整距离
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

        // 计算角平分线方向（两个方向向量的平均）
        const bisectX = dir1X + dir2X;
        const bisectY = dir1Y + dir2Y;
        const bisectLen = Math.sqrt(bisectX * bisectX + bisectY * bisectY);

        // 角平分线的垂直方向
        const bisectNormX = -bisectY / bisectLen;
        const bisectNormY = bisectX / bisectLen;

        // 计算转角的夹角余弦值
        const cosAngle = dir1X * dir2X + dir1Y * dir2Y;
        const sinHalfAngle = Math.sqrt((1 - cosAngle) / 2);

        // 根据转角调整offset，保持恒定宽度
        // 当转角越尖锐，需要的offset越大
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

    // 长阴影偏移（向右下方）
    const shadowOffsetX = 12;
    const shadowOffsetY = 12;

    // 1. 绘制长阴影（最底层）
    graphics.fillStyle(0x000000, 0.3);
    graphics.beginPath();
    graphics.moveTo(leftWallPoints[0].x + shadowOffsetX, leftWallPoints[0].y + shadowOffsetY);
    for (let i = 1; i < leftWallPoints.length; i++) {
      graphics.lineTo(leftWallPoints[i].x + shadowOffsetX, leftWallPoints[i].y + shadowOffsetY);
    }
    for (let i = rightWallPoints.length - 1; i >= 0; i--) {
      graphics.lineTo(rightWallPoints[i].x + shadowOffsetX, rightWallPoints[i].y + shadowOffsetY);
    }
    graphics.closePath();
    graphics.fillPath();

    // 2. 绘制城墙侧面（深绿色，立体感）
    graphics.fillStyle(COLORS.WALL_SIDE, 1);
    graphics.beginPath();
    graphics.moveTo(leftWallPoints[0].x + shadowOffsetX/2, leftWallPoints[0].y + shadowOffsetY/2);
    for (let i = 1; i < leftWallPoints.length; i++) {
      graphics.lineTo(leftWallPoints[i].x + shadowOffsetX/2, leftWallPoints[i].y + shadowOffsetY/2);
    }
    for (let i = rightWallPoints.length - 1; i >= 0; i--) {
      graphics.lineTo(rightWallPoints[i].x + shadowOffsetX/2, rightWallPoints[i].y + shadowOffsetY/2);
    }
    graphics.closePath();
    graphics.fillPath();

    // 3. 绘制城墙顶部（亮绿色）
    graphics.fillStyle(COLORS.WALL, 1);
    graphics.beginPath();
    graphics.moveTo(leftWallPoints[0].x, leftWallPoints[0].y);
    for (let i = 1; i < leftWallPoints.length; i++) {
      graphics.lineTo(leftWallPoints[i].x, leftWallPoints[i].y);
    }
    for (let i = rightWallPoints.length - 1; i >= 0; i--) {
      graphics.lineTo(rightWallPoints[i].x, rightWallPoints[i].y);
    }
    graphics.closePath();
    graphics.fillPath();
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
