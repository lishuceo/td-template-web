import Phaser from 'phaser';
import type { WaveConfig, PathPoint, EnemyType } from '@/types/game';
import { Enemy } from '@game/entities/Enemy';
import { WAVE_CONFIG } from '@game/config/constants';

export class WaveManager {
  private scene: Phaser.Scene;
  private waves: WaveConfig[];
  private path: PathPoint[];
  private currentWaveIndex: number = -1;
  private isWaveActive: boolean = false;
  private preparationTimer: Phaser.Time.TimerEvent | null = null;

  public enemies: Enemy[] = [];

  constructor(scene: Phaser.Scene, waves: WaveConfig[], path: PathPoint[]) {
    this.scene = scene;
    this.waves = waves;
    this.path = path;
  }

  public startNextWave(): void {
    if (this.isWaveActive) return;
    if (this.currentWaveIndex >= this.waves.length - 1) return;

    this.currentWaveIndex++;
    this.isWaveActive = true;

    const wave = this.waves[this.currentWaveIndex];
    this.spawnWave(wave);

    this.scene.events.emit('waveStart', this.currentWaveIndex + 1);
  }

  private spawnWave(wave: WaveConfig): void {
    let totalDelay = 0;

    wave.batches.forEach((batch) => {
      totalDelay += batch.delay * 1000;

      // 为每批怪物创建生成事件
      for (let i = 0; i < batch.count; i++) {
        const spawnDelay = totalDelay + i * WAVE_CONFIG.BATCH_SPAWN_INTERVAL * 1000;

        this.scene.time.delayedCall(spawnDelay, () => {
          this.spawnEnemy(batch.enemyType);
        });
      }
    });

    // 计算波次总时长
    const waveDuration = totalDelay + (wave.batches[wave.batches.length - 1]?.count || 0) * WAVE_CONFIG.BATCH_SPAWN_INTERVAL * 1000;

    // 波次结束检查
    this.scene.time.delayedCall(waveDuration + 5000, () => {
      this.checkWaveComplete();
    });
  }

  private spawnEnemy(type: EnemyType): void {
    const enemy = new Enemy(this.scene, this.path, type);

    enemy.on('death', (goldReward: number) => {
      this.removeEnemy(enemy);
      this.scene.events.emit('enemyKilled', goldReward);
    });

    enemy.on('reachEnd', () => {
      this.removeEnemy(enemy);
      this.scene.events.emit('enemyReachEnd');
    });

    this.enemies.push(enemy);
  }

  private removeEnemy(enemy: Enemy): void {
    const index = this.enemies.indexOf(enemy);
    if (index > -1) {
      this.enemies.splice(index, 1);
    }
  }

  private checkWaveComplete(): void {
    if (this.enemies.length === 0) {
      this.onWaveComplete();
    } else {
      // 如果还有敌人，稍后再检查
      this.scene.time.delayedCall(1000, () => this.checkWaveComplete());
    }
  }

  private onWaveComplete(): void {
    this.isWaveActive = false;
    this.scene.events.emit('waveComplete', this.currentWaveIndex + 1);

    // 检查是否所有波次完成
    if (this.currentWaveIndex >= this.waves.length - 1) {
      this.scene.events.emit('allWavesComplete');
      return;
    }

    // 开始准备时间
    this.startPreparationPhase();
  }

  private startPreparationPhase(): void {
    this.scene.events.emit('preparationStart', WAVE_CONFIG.PREPARATION_TIME);

    this.preparationTimer = this.scene.time.delayedCall(
      WAVE_CONFIG.PREPARATION_TIME * 1000,
      () => {
        this.startNextWave();
      }
    );
  }

  public skipPreparation(): void {
    if (this.preparationTimer) {
      this.preparationTimer.remove();
      this.preparationTimer = null;
      this.startNextWave();
    }
  }

  public getCurrentWave(): number {
    return this.currentWaveIndex + 1;
  }

  public getTotalWaves(): number {
    return this.waves.length;
  }

  public isActive(): boolean {
    return this.isWaveActive;
  }

  public update(delta: number): void {
    this.enemies.forEach((enemy) => {
      enemy.update(delta);
    });
  }

  public destroy(): void {
    this.enemies.forEach((enemy) => enemy.destroy());
    this.enemies = [];

    if (this.preparationTimer) {
      this.preparationTimer.remove();
      this.preparationTimer = null;
    }
  }
}
