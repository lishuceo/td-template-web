import { useState, useCallback, useRef } from 'react';
import GameCanvas from '@components/GameCanvas';
import HUD from '@components/HUD';
import ControlPanel from '@components/ControlPanel';
import LevelSelect from '@components/LevelSelect';
import GameOverScreen from '@components/GameOverScreen';
import { getLevelById } from '@game/config/levels';
import { useGameStore } from '@store/gameStore';
import type { LevelConfig, TowerType } from '@/types/game';
import type { GameScene } from '@game/scenes/GameScene';

function App() {
  const [currentLevel, setCurrentLevel] = useState<LevelConfig | null>(null);
  const gameSceneRef = useRef<GameScene | null>(null);
  const { gameStatus, togglePause, setGameSpeed, gameSpeed, reset } = useGameStore();

  const handleSelectLevel = useCallback((levelId: number) => {
    const level = getLevelById(levelId);
    if (level) {
      reset();
      setCurrentLevel(level);
    }
  }, [reset]);

  const handleGameReady = useCallback((scene: GameScene) => {
    gameSceneRef.current = scene;
  }, []);

  const handleBuildTower = useCallback((type: TowerType) => {
    gameSceneRef.current?.setBuildMode(type);
  }, []);

  const handleStartWave = useCallback(() => {
    gameSceneRef.current?.startNextWave();
  }, []);

  const handleTogglePause = useCallback(() => {
    togglePause();
  }, [togglePause]);

  const handleToggleSpeed = useCallback(() => {
    setGameSpeed(gameSpeed === 1 ? 2 : 1);
  }, [gameSpeed, setGameSpeed]);

  const handleRestart = useCallback(() => {
    if (currentLevel) {
      reset();
      setCurrentLevel({ ...currentLevel });
    }
  }, [currentLevel, reset]);

  const handleBackToMenu = useCallback(() => {
    reset();
    setCurrentLevel(null);
  }, [reset]);

  // 关卡选择界面
  if (!currentLevel) {
    return <LevelSelect onSelectLevel={handleSelectLevel} />;
  }

  return (
    <div className="relative w-screen h-screen bg-game-bg overflow-hidden">
      <HUD />

      <div className="flex items-center justify-center h-full">
        <GameCanvas levelConfig={currentLevel} onGameReady={handleGameReady} />
      </div>

      <ControlPanel
        onBuildTower={handleBuildTower}
        onStartWave={handleStartWave}
        onTogglePause={handleTogglePause}
        onToggleSpeed={handleToggleSpeed}
      />

      {(gameStatus === 'victory' || gameStatus === 'defeat') && (
        <GameOverScreen
          victory={gameStatus === 'victory'}
          onRestart={handleRestart}
          onBackToMenu={handleBackToMenu}
        />
      )}
    </div>
  );
}

export default App;
