import Phaser from 'phaser';
import { COLORS, BASE_CONFIG } from '@game/config/constants';

export class Base extends Phaser.GameObjects.Container {
  private baseBody: Phaser.GameObjects.Rectangle;
  private shadow: Phaser.GameObjects.Rectangle;
  private icon: Phaser.GameObjects.Graphics;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y);

    const size = BASE_CONFIG.SIZE;

    // 长阴影（增加阴影长度）
    this.shadow = scene.add.rectangle(12, 12, size, size, 0x000000, 0.3);
    this.add(this.shadow);

    // 基地主体（绿色方块）
    this.baseBody = scene.add.rectangle(0, 0, size, size, COLORS.BASE);
    this.add(this.baseBody);

    // 添加图标（简单的房屋形状）
    this.icon = scene.add.graphics();
    this.icon.lineStyle(3, 0xffffff);
    this.icon.beginPath();
    this.icon.moveTo(-size / 4, 0);
    this.icon.lineTo(0, -size / 4);
    this.icon.lineTo(size / 4, 0);
    this.icon.lineTo(size / 4, size / 4);
    this.icon.lineTo(-size / 4, size / 4);
    this.icon.closePath();
    this.icon.strokePath();
    this.add(this.icon);

    scene.add.existing(this);
  }

  public damage(): void {
    // 受伤动画
    this.scene.tweens.add({
      targets: this.baseBody,
      alpha: 0.5,
      yoyo: true,
      duration: 100,
      repeat: 2,
    });

    // 屏幕震动
    this.scene.cameras.main.shake(200, 0.005);
  }
}
