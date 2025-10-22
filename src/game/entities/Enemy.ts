import Phaser from 'phaser';
import type { EnemyType, PathPoint } from '@/types/game';
import { ENEMY_CONFIGS } from '@game/config/constants';
import { getPositionOnPath } from '@utils/pathfinding';

export class Enemy extends Phaser.GameObjects.Container {
  public enemyType: EnemyType;
  public hp: number;
  public maxHp: number;
  public speed: number;
  public currentSpeed: number;
  public goldReward: number;
  public pathProgress: number = 0;
  public isDead: boolean = false;

  private path: PathPoint[];
  private enemyBody: Phaser.GameObjects.Arc;
  private healthBar: Phaser.GameObjects.Graphics;
  private slowEffects: Map<string, { percent: number; endTime: number }>;

  constructor(
    scene: Phaser.Scene,
    path: PathPoint[],
    enemyType: EnemyType
  ) {
    const startPos = path[0];
    super(scene, startPos.x, startPos.y);

    this.enemyType = enemyType;
    this.path = path;

    const config = ENEMY_CONFIGS[enemyType];
    this.hp = config.hp;
    this.maxHp = config.hp;
    this.speed = config.speed;
    this.currentSpeed = config.speed;
    this.goldReward = config.goldReward;

    this.slowEffects = new Map();

    // 创建敌人身体（圆形）
    this.enemyBody = scene.add.circle(0, 0, config.size, config.color);
    this.add(this.enemyBody);

    // 创建血条
    this.healthBar = scene.add.graphics();
    this.add(this.healthBar);
    this.updateHealthBar();

    // 添加辉光效果
    this.enemyBody.setStrokeStyle(2, 0xffffff, 0.8);

    scene.add.existing(this);
  }

  public takeDamage(damage: number): boolean {
    this.hp -= damage;
    this.updateHealthBar();

    if (this.hp <= 0) {
      this.die();
      return true;
    }
    return false;
  }

  public applySlow(id: string, percent: number, duration: number): void {
    const endTime = Date.now() + duration * 1000;
    this.slowEffects.set(id, { percent, endTime });
    this.updateSpeed();
  }

  private updateSpeed(): void {
    // 移除过期的减速效果
    const now = Date.now();
    for (const [id, effect] of this.slowEffects.entries()) {
      if (now > effect.endTime) {
        this.slowEffects.delete(id);
      }
    }

    // 计算最强的减速效果
    let maxSlow = 0;
    for (const effect of this.slowEffects.values()) {
      maxSlow = Math.max(maxSlow, effect.percent);
    }

    this.currentSpeed = this.speed * (1 - maxSlow);
  }

  public update(delta: number): void {
    if (this.isDead) return;

    this.updateSpeed();

    // 沿路径移动
    const distance = (this.currentSpeed * delta) / 1000;
    const pathLength = this.calculatePathLength();
    this.pathProgress += distance / pathLength;

    if (this.pathProgress >= 1) {
      // 到达终点
      this.reachEnd();
      return;
    }

    // 更新位置
    const pos = getPositionOnPath(this.path, this.pathProgress);
    this.setPosition(pos.x, pos.y);
  }

  private calculatePathLength(): number {
    let length = 0;
    for (let i = 0; i < this.path.length - 1; i++) {
      const dx = this.path[i + 1].x - this.path[i].x;
      const dy = this.path[i + 1].y - this.path[i].y;
      length += Math.sqrt(dx * dx + dy * dy);
    }
    return length;
  }

  private updateHealthBar(): void {
    this.healthBar.clear();

    const barWidth = 30;
    const barHeight = 4;
    const barY = -(ENEMY_CONFIGS[this.enemyType].size + 10);

    // 背景
    this.healthBar.fillStyle(0x000000, 0.5);
    this.healthBar.fillRect(-barWidth / 2, barY, barWidth, barHeight);

    // 血量
    const hpPercent = this.hp / this.maxHp;
    const color = hpPercent > 0.5 ? 0x00ff00 : hpPercent > 0.25 ? 0xffff00 : 0xff0000;
    this.healthBar.fillStyle(color);
    this.healthBar.fillRect(-barWidth / 2, barY, barWidth * hpPercent, barHeight);
  }

  private die(): void {
    this.isDead = true;
    this.emit('death', this.goldReward);

    // 死亡动画
    this.scene.tweens.add({
      targets: this,
      alpha: 0,
      scale: 0.5,
      duration: 200,
      onComplete: () => {
        this.destroy();
      },
    });
  }

  private reachEnd(): void {
    this.isDead = true;
    this.emit('reachEnd');
    this.destroy();
  }
}
