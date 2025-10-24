import Phaser from 'phaser';
import type { TowerType, SlotPosition } from '@/types/game';
import { Tower } from '@game/entities/Tower';
import { TOWER_CONFIGS, UPGRADE_CONFIG, ECONOMY_CONFIG, SLOT_CONFIG, COLORS } from '@game/config/constants';
import type { Enemy } from '@game/entities/Enemy';

export interface TowerSlot {
  x: number;
  y: number;
  tower: Tower | null;
  graphics: Phaser.GameObjects.Graphics;
}

export class TowerManager {
  private scene: Phaser.Scene;
  private slots: TowerSlot[] = [];
  private towers: Tower[] = [];
  private selectedTower: Tower | null = null;
  private towerIdCounter: number = 0;

  constructor(scene: Phaser.Scene, slotPositions: SlotPosition[]) {
    this.scene = scene;

    // 创建槽位
    slotPositions.forEach((pos) => {
      const graphics = scene.add.graphics();
      this.drawSlot(graphics, false);

      const slot: TowerSlot = {
        x: pos.x,
        y: pos.y,
        tower: null,
        graphics,
      };

      graphics.setPosition(pos.x, pos.y);
      graphics.setInteractive(
        new Phaser.Geom.Circle(0, 0, SLOT_CONFIG.SIZE / 2),
        Phaser.Geom.Circle.Contains
      );

      graphics.on('pointerover', () => this.onSlotHover(slot));
      graphics.on('pointerout', () => this.onSlotOut(slot));
      graphics.on('pointerdown', () => this.onSlotClick(slot));

      this.slots.push(slot);
    });
  }

  private drawSlot(graphics: Phaser.GameObjects.Graphics, hover: boolean): void {
    graphics.clear();

    const size = SLOT_CONFIG.SIZE;
    const alpha = hover ? SLOT_CONFIG.HOVER_ALPHA : 0.3;

    // 绘制槽位（虚线圆形）
    graphics.lineStyle(2, COLORS.SLOT, alpha);
    graphics.strokeCircle(0, 0, size / 2);

    // 绘制十字
    graphics.beginPath();
    graphics.moveTo(-size / 4, 0);
    graphics.lineTo(size / 4, 0);
    graphics.moveTo(0, -size / 4);
    graphics.lineTo(0, size / 4);
    graphics.strokePath();
  }

  private onSlotHover(slot: TowerSlot): void {
    if (!slot.tower) {
      this.drawSlot(slot.graphics, true);
    }
  }

  private onSlotOut(slot: TowerSlot): void {
    if (!slot.tower) {
      this.drawSlot(slot.graphics, false);
    }
  }

  private onSlotClick(slot: TowerSlot): void {
    if (slot.tower) {
      // 选中已建造的塔
      this.selectTower(slot.tower);
    } else {
      // 空槽位，显示建造菜单
      this.scene.events.emit('showBuildMenu', slot);
    }
  }


  public buildTower(towerType: TowerType, slot: TowerSlot): Tower | null {
    if (slot.tower) return null;

    const tower = new Tower(
      this.scene,
      slot.x,
      slot.y,
      towerType,
      `tower_${this.towerIdCounter++}`
    );

    slot.tower = tower;
    slot.graphics.setVisible(false);
    this.towers.push(tower);

    tower.on('select', (selectedTower: Tower) => {
      this.selectTower(selectedTower);
    });

    return tower;
  }

  public getTowerCost(towerType: TowerType, buildCount: number): number {
    const baseCost = TOWER_CONFIGS[towerType].baseCost;
    const multiplier = Math.pow(1 + ECONOMY_CONFIG.TOWER_COST_INCREASE, buildCount);
    return Math.floor(baseCost * multiplier);
  }

  public upgradeTower(tower: Tower): boolean {
    if (tower.level >= UPGRADE_CONFIG.MAX_LEVEL) return false;

    const success = tower.upgrade();
    if (success) {
      this.scene.events.emit('towerUpgraded', tower);
    }
    return success;
  }

  public sellTower(tower: Tower): void {
    const slot = this.slots.find((s) => s.tower === tower);
    if (!slot) return;

    slot.tower = null;
    slot.graphics.setVisible(true);

    const index = this.towers.indexOf(tower);
    if (index > -1) {
      this.towers.splice(index, 1);
    }

    tower.destroy();
    this.deselectTower();

    this.scene.events.emit('towerSold', tower);
  }

  private selectTower(tower: Tower): void {
    if (this.selectedTower) {
      this.selectedTower.deselect();
    }

    this.selectedTower = tower;
    tower.select();

    this.scene.events.emit('towerSelected', tower);
  }

  public deselectTower(): void {
    if (this.selectedTower) {
      this.selectedTower.deselect();
      this.selectedTower = null;
      this.scene.events.emit('towerDeselected');
    }
  }

  public getSelectedTower(): Tower | null {
    return this.selectedTower;
  }

  public update(enemies: Enemy[]): void {
    this.towers.forEach((tower) => {
      tower.update(enemies);
    });
  }

  public destroy(): void {
    this.towers.forEach((tower) => tower.destroy());
    this.towers = [];

    this.slots.forEach((slot) => slot.graphics.destroy());
    this.slots = [];
  }
}
