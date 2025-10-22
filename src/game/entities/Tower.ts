import Phaser from 'phaser';
import type { TowerType } from '@/types/game';
import { TOWER_CONFIGS, UPGRADE_CONFIG, COLORS, PHYSICS_CONFIG } from '@game/config/constants';
import { Enemy } from './Enemy';

export class Tower extends Phaser.GameObjects.Container {
  public towerType: TowerType;
  public level: number = 1;
  public damage: number;
  public attackSpeed: number;
  public range: number;
  public readonly id: string;

  private config: typeof TOWER_CONFIGS[TowerType];
  private lastAttackTime: number = 0;
  private target: Enemy | null = null;
  private rangeCircle: Phaser.GameObjects.Arc;
  private towerBody!: Phaser.GameObjects.Shape;
  private shadow!: Phaser.GameObjects.Shape;
  private levelText: Phaser.GameObjects.Text;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    towerType: TowerType,
    id: string
  ) {
    super(scene, x, y);

    this.towerType = towerType;
    this.id = id;
    this.config = TOWER_CONFIGS[towerType];

    this.damage = this.config.damage;
    this.attackSpeed = this.config.attackSpeed;
    this.range = this.config.range;

    // 创建射程圈（默认隐藏）
    this.rangeCircle = scene.add.circle(0, 0, this.range, 0xffffff, 0.1);
    this.rangeCircle.setStrokeStyle(2, 0xffffff, 0.3);
    this.rangeCircle.setVisible(false);
    this.add(this.rangeCircle);

    // 创建塔的视觉效果
    this.createVisuals();

    // 等级文本
    this.levelText = scene.add.text(0, -35, `Lv${this.level}`, {
      fontSize: '12px',
      color: '#ffffff',
      fontStyle: 'bold',
    });
    this.levelText.setOrigin(0.5);
    this.add(this.levelText);

    scene.add.existing(this);

    // 点击事件
    this.setInteractive(new Phaser.Geom.Circle(0, 0, 25), Phaser.Geom.Circle.Contains);
    this.on('pointerover', () => this.showRange());
    this.on('pointerout', () => this.hideRange());
  }

  private createVisuals(): void {
    const size = 40;
    const color = this.getTowerColor();

    // 长阴影
    if (this.towerType === 'arrow') {
      this.shadow = this.scene.add.rectangle(6, 6, size, size, 0x000000, 0.3);
      this.towerBody = this.scene.add.rectangle(0, 0, size, size, color);
    } else if (this.towerType === 'slow') {
      this.shadow = this.scene.add.circle(6, 6, size / 2, 0x000000, 0.3);
      this.towerBody = this.scene.add.circle(0, 0, size / 2, color);
    } else {
      // AOE - 六边形
      this.shadow = this.scene.add.polygon(6, 6, [
        -size / 2, 0,
        -size / 4, -size / 2,
        size / 4, -size / 2,
        size / 2, 0,
        size / 4, size / 2,
        -size / 4, size / 2,
      ], 0x000000, 0.3);
      this.towerBody = this.scene.add.polygon(0, 0, [
        -size / 2, 0,
        -size / 4, -size / 2,
        size / 4, -size / 2,
        size / 2, 0,
        size / 4, size / 2,
        -size / 4, size / 2,
      ], color);
    }

    this.add(this.shadow);
    this.add(this.towerBody);

    // 添加边框
    if (this.body instanceof Phaser.GameObjects.Arc) {
      (this.body as Phaser.GameObjects.Arc).setStrokeStyle(3, 0xffffff);
    }
  }

  private getTowerColor(): number {
    switch (this.towerType) {
      case 'arrow':
        return COLORS.TOWER_ARROW;
      case 'slow':
        return COLORS.TOWER_SLOW;
      case 'aoe':
        return COLORS.TOWER_AOE;
      default:
        return COLORS.TOWER_ARROW;
    }
  }

  public upgrade(): boolean {
    if (this.level >= UPGRADE_CONFIG.MAX_LEVEL) return false;

    this.level++;
    this.damage *= (1 + UPGRADE_CONFIG.DAMAGE_INCREASE);
    this.attackSpeed *= (1 + UPGRADE_CONFIG.SPEED_INCREASE);
    this.range *= (1 + UPGRADE_CONFIG.RANGE_INCREASE);

    // 更新视觉
    this.rangeCircle.setRadius(this.range);
    this.levelText.setText(`Lv${this.level}`);

    // 升级动画
    this.scene.tweens.add({
      targets: this,
      scale: 1.2,
      yoyo: true,
      duration: 150,
    });

    return true;
  }

  public getUpgradeCost(): number {
    if (this.level >= UPGRADE_CONFIG.MAX_LEVEL) return 0;
    return Math.floor(this.config.baseCost * UPGRADE_CONFIG.COST_MULTIPLIER * this.level);
  }

  public update(enemies: Enemy[]): void {
    const now = Date.now();
    const attackInterval = 1000 / this.attackSpeed;

    if (now - this.lastAttackTime < attackInterval) return;

    // 找到射程内的敌人
    const enemiesInRange = enemies.filter((enemy) => {
      if (enemy.isDead) return false;
      const dist = Phaser.Math.Distance.Between(this.x, this.y, enemy.x, enemy.y);
      return dist <= this.range;
    });

    if (enemiesInRange.length === 0) {
      this.target = null;
      return;
    }

    // 选择最近的敌人
    if (!this.target || this.target.isDead || !enemiesInRange.includes(this.target)) {
      this.target = enemiesInRange.reduce((closest, enemy) => {
        const distToEnemy = Phaser.Math.Distance.Between(this.x, this.y, enemy.x, enemy.y);
        const distToClosest = Phaser.Math.Distance.Between(this.x, this.y, closest.x, closest.y);
        return distToEnemy < distToClosest ? enemy : closest;
      });
    }

    if (this.target) {
      this.attack(this.target);
      this.lastAttackTime = now;
    }
  }

  private attack(target: Enemy): void {
    // 创建子弹
    const bullet = this.scene.add.circle(this.x, this.y, 5, this.getTowerColor());

    this.scene.tweens.add({
      targets: bullet,
      x: target.x,
      y: target.y,
      duration: Phaser.Math.Distance.Between(this.x, this.y, target.x, target.y) / PHYSICS_CONFIG.PROJECTILE_SPEED * 1000,
      onComplete: () => {
        bullet.destroy();
        if (!target.isDead) {
          this.hitTarget(target);
        }
      },
    });
  }

  private hitTarget(target: Enemy): void {
    // 根据塔类型应用效果
    if (this.towerType === 'slow') {
      target.applySlow(this.id, this.config.special?.slowPercent || 0.5, 2);
    }

    target.takeDamage(this.damage);

    // AOE伤害
    if (this.towerType === 'aoe' && this.config.special?.aoeRadius) {
      const aoeRadius = this.config.special.aoeRadius;
      const splash = this.config.special.aoeSplash || 0.5;

      // 创建AOE视觉效果
      const aoeCircle = this.scene.add.circle(target.x, target.y, aoeRadius, 0xff6347, 0.3);
      this.scene.tweens.add({
        targets: aoeCircle,
        alpha: 0,
        scale: 1.5,
        duration: 300,
        onComplete: () => aoeCircle.destroy(),
      });

      // 对范围内其他敌人造成溅射伤害
      this.scene.children.list.forEach((child) => {
        if (child instanceof Enemy && child !== target && !child.isDead) {
          const dist = Phaser.Math.Distance.Between(target.x, target.y, child.x, child.y);
          if (dist <= aoeRadius) {
            child.takeDamage(this.damage * splash);
          }
        }
      });
    }
  }

  private showRange(): void {
    this.rangeCircle.setVisible(true);
    this.emit('select', this);
  }

  private hideRange(): void {
    this.rangeCircle.setVisible(false);
  }

  public select(): void {
    this.showRange();
  }

  public deselect(): void {
    this.hideRange();
  }
}
