import { useMemo } from 'react';
import type { TowerType } from '@/types/game';
import { TOWER_CONFIGS } from '@game/config/constants';
import { useGameStore } from '@store/gameStore';

interface TowerBuildMenuProps {
  x: number;
  y: number;
  onSelectTower: (type: TowerType) => void;
  onClose: () => void;
}

export default function TowerBuildMenu({
  x,
  y,
  onSelectTower,
  onClose,
}: TowerBuildMenuProps) {
  const { gold, towerBuildCounts } = useGameStore((state) => ({
    gold: state.gold,
    towerBuildCounts: state.towerBuildCounts,
  }));

  const getTowerCost = (type: TowerType): number => {
    const baseCost = TOWER_CONFIGS[type].baseCost;
    const buildCount = towerBuildCounts[type];
    const multiplier = Math.pow(1.2, buildCount);
    return Math.floor(baseCost * multiplier);
  };

  const getTowerColor = (type: TowerType): string => {
    switch (type) {
      case 'arrow':
        return 'bg-gray-200';  // 浅灰色箭塔
      case 'slow':
        return 'bg-blue-400';  // 蓝色减速塔
      case 'aoe':
        return 'bg-red-400';   // 红色范围塔
    }
  };

  // Calculate menu position - x,y are game canvas coordinates
  const menuStyle = useMemo(() => {
    // Find the game canvas element to get its position and scale
    const canvas = document.querySelector('.game-canvas canvas') as HTMLCanvasElement;
    if (!canvas) {
      return { left: x, top: y }; // Fallback
    }

    const canvasRect = canvas.getBoundingClientRect();
    const scaleX = canvasRect.width / 1200; // GAME_WIDTH
    const scaleY = canvasRect.height / 800; // GAME_HEIGHT

    // Convert game coordinates to screen coordinates
    const screenX = canvasRect.left + x * scaleX;
    const screenY = canvasRect.top + y * scaleY;

    const menuWidth = 160;
    const menuHeight = 140;
    const offset = 30; // Offset from slot center

    let left = screenX + offset;
    let top = screenY - menuHeight / 2;

    // Keep menu on screen
    const padding = 10;
    if (left + menuWidth > window.innerWidth - padding) {
      left = screenX - menuWidth - offset;
    }
    if (top < padding) {
      top = padding;
    }
    if (top + menuHeight > window.innerHeight - padding) {
      top = window.innerHeight - menuHeight - padding;
    }

    return { left, top };
  }, [x, y]);

  return (
    <>
      {/* Backdrop to close menu when clicking outside */}
      <div
        className="fixed inset-0 z-20"
        onClick={onClose}
      />

      {/* Build menu */}
      <div
        className="fixed z-30 bg-gray-900 bg-opacity-95 border-4 border-white p-3 rounded-lg"
        style={{
          left: `${menuStyle.left}px`,
          top: `${menuStyle.top}px`,
          boxShadow: '8px 8px 0px rgba(0,0,0,0.5)',
        }}
      >
        <div className="text-white text-sm font-bold mb-2 text-center">
          选择塔类型
        </div>
        <div className="flex flex-col gap-2">
          {Object.entries(TOWER_CONFIGS).map(([key, config]) => {
            const type = key as TowerType;
            const cost = getTowerCost(type);
            const canBuy = gold >= cost;

            return (
              <button
                key={type}
                onClick={() => {
                  if (canBuy) {
                    onSelectTower(type);
                  }
                }}
                disabled={!canBuy}
                className={`
                  relative px-4 py-3 font-bold text-sm transition-all duration-200
                  ${canBuy ? getTowerColor(type) : 'bg-gray-600'}
                  ${canBuy ? 'hover:translate-x-0.5 hover:translate-y-0.5 cursor-pointer' : 'cursor-not-allowed opacity-50'}
                `}
                style={{
                  boxShadow: canBuy ? '4px 4px 0px rgba(0,0,0,0.3)' : 'none',
                }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-black">{config.name}</span>
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-gray-800">{cost}</span>
                    <span className="text-xs text-game-gold">●</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}
