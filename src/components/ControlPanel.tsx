import { useState } from 'react';
import type { TowerType } from '@/types/game';
import { TOWER_CONFIGS } from '@game/config/constants';
import { useGameStore } from '@store/gameStore';

interface ControlPanelProps {
  onBuildTower: (type: TowerType) => void;
  onStartWave: () => void;
  onTogglePause: () => void;
  onToggleSpeed: () => void;
}

export default function ControlPanel({
  onBuildTower,
  onStartWave,
  onTogglePause,
  onToggleSpeed,
}: ControlPanelProps) {
  const [selectedTower, setSelectedTower] = useState<TowerType | null>(null);
  const { gold, isPaused, gameSpeed, towerBuildCounts } = useGameStore((state) => ({
    gold: state.gold,
    isPaused: state.isPaused,
    gameSpeed: state.gameSpeed,
    towerBuildCounts: state.towerBuildCounts,
  }));

  const getTowerCost = (type: TowerType): number => {
    const baseCost = TOWER_CONFIGS[type].baseCost;
    const buildCount = towerBuildCounts[type];
    const multiplier = Math.pow(1.2, buildCount);
    return Math.floor(baseCost * multiplier);
  };

  const handleTowerClick = (type: TowerType) => {
    const cost = getTowerCost(type);
    if (gold >= cost) {
      setSelectedTower(type);
      onBuildTower(type);
    }
  };

  const getTowerColor = (type: TowerType): string => {
    switch (type) {
      case 'arrow':
        return 'bg-white';
      case 'slow':
        return 'bg-blue-400';
      case 'aoe':
        return 'bg-red-500';
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900 bg-opacity-90 border-t-4 border-white px-6 py-4 z-10">
      <div className="flex justify-between items-center">
        {/* 左侧：建造塔 */}
        <div className="flex gap-4">
          {Object.entries(TOWER_CONFIGS).map(([key, config]) => {
            const type = key as TowerType;
            const cost = getTowerCost(type);
            const canBuy = gold >= cost;
            const isSelected = selectedTower === type;

            return (
              <button
                key={type}
                onClick={() => handleTowerClick(type)}
                disabled={!canBuy}
                className={`
                  relative px-6 py-4 font-bold uppercase transition-all duration-200
                  ${canBuy ? getTowerColor(type) : 'bg-gray-600'}
                  ${canBuy ? 'hover:translate-x-1 hover:translate-y-1' : 'cursor-not-allowed opacity-50'}
                  ${isSelected ? 'ring-4 ring-game-gold' : ''}
                `}
                style={{
                  boxShadow: canBuy ? '4px 4px 0px rgba(0,0,0,0.3)' : 'none',
                }}
              >
                <div className="text-sm text-black">{config.name}</div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-gray-800">{cost}</span>
                  <span className="text-xs text-game-gold">●</span>
                </div>
                {towerBuildCounts[type] > 0 && (
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-game-gold rounded-full flex items-center justify-center text-xs font-bold text-black shadow-long-sm">
                    {towerBuildCounts[type]}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* 右侧：控制按钮 */}
        <div className="flex gap-4">
          <button
            onClick={onStartWave}
            className="flat-button bg-game-scene"
          >
            开始下一波
          </button>

          <button
            onClick={onTogglePause}
            className="flat-button bg-game-danger"
          >
            {isPaused ? '继续' : '暂停'}
          </button>

          <button
            onClick={onToggleSpeed}
            className="flat-button bg-purple-600"
          >
            {gameSpeed === 1 ? '2x 速度' : '1x 速度'}
          </button>
        </div>
      </div>
    </div>
  );
}
