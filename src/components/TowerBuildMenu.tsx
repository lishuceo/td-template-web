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

  // Calculate menu position to keep it on screen
  const menuStyle = useMemo(() => {
    const menuWidth = 180;
    const menuHeight = 180;
    const padding = 20;
    const offset = 10; // Much closer to the slot

    let left = x + offset; // Position very close to the right of slot
    let top = y - menuHeight / 2; // Center vertically

    // Keep menu on screen
    if (left + menuWidth > window.innerWidth - padding) {
      left = x - menuWidth - offset; // Position to the left instead
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
