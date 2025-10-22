import { useGameStore } from '@store/gameStore';

export default function HUD() {
  const { gold, baseHP, maxBaseHP, currentWave } = useGameStore((state) => ({
    gold: state.gold,
    baseHP: state.baseHP,
    maxBaseHP: state.maxBaseHP,
    currentWave: state.currentWave,
  }));

  return (
    <div className="fixed top-0 left-0 right-0 bg-gray-900 bg-opacity-90 border-b-4 border-white px-6 py-4 flex justify-between items-center z-10">
      <div className="flex gap-8 items-center">
        {/* 金币 */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-game-gold rounded-full flex items-center justify-center text-black font-bold shadow-long-sm">
            $
          </div>
          <div>
            <div className="text-xs text-gray-400">金币</div>
            <div className="text-xl font-bold text-game-gold long-shadow-text">
              {gold}
            </div>
          </div>
        </div>

        {/* 波次 */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-game-scene rounded-full flex items-center justify-center text-white font-bold shadow-long-sm">
            {currentWave}
          </div>
          <div>
            <div className="text-xs text-gray-400">波次</div>
            <div className="text-xl font-bold text-white long-shadow-text">
              第 {currentWave} 波
            </div>
          </div>
        </div>

        {/* 基地血量 */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-game-base rounded-full flex items-center justify-center text-white font-bold shadow-long-sm">
            ♥
          </div>
          <div>
            <div className="text-xs text-gray-400">基地血量</div>
            <div className="flex items-center gap-2">
              <div className="text-xl font-bold text-game-base long-shadow-text">
                {baseHP} / {maxBaseHP}
              </div>
              <div className="w-32 h-3 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-game-base transition-all duration-300"
                  style={{ width: `${(baseHP / maxBaseHP) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="text-sm text-gray-400">
        ESC - 暂停 | Space - 下一波
      </div>
    </div>
  );
}
