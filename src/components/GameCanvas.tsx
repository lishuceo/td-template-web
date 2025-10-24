import { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import { GameScene } from '@game/scenes/GameScene';
import { GAME_WIDTH, GAME_HEIGHT } from '@game/config/constants';
import type { LevelConfig } from '@/types/game';

interface GameCanvasProps {
  levelConfig: LevelConfig;
  onGameReady?: (scene: GameScene) => void;
}

export default function GameCanvas({ levelConfig, onGameReady }: GameCanvasProps) {
  const gameRef = useRef<Phaser.Game | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || gameRef.current) return;

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: GAME_WIDTH,
      height: GAME_HEIGHT,
      parent: containerRef.current,
      backgroundColor: '#1A1A1A',
      scene: GameScene,
      physics: {
        default: 'arcade',
        arcade: {
          debug: false,
        },
      },
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        zoom: 1 / (window.devicePixelRatio || 1),
      },
      render: {
        pixelArt: false,
        antialias: true,
        antialiasGL: true,
        roundPixels: false,
      },
    };

    gameRef.current = new Phaser.Game(config);

    gameRef.current.events.on('ready', () => {
      const scene = gameRef.current?.scene.getScene('GameScene') as GameScene;
      if (scene) {
        scene.initLevel(levelConfig);
        scene.scene.restart();
        onGameReady?.(scene);
      }
    });

    return () => {
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
  }, [levelConfig, onGameReady]);

  return <div ref={containerRef} className="game-canvas" />;
}
