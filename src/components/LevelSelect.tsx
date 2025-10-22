import { LEVELS } from '@game/config/levels';

interface LevelSelectProps {
  onSelectLevel: (levelId: number) => void;
}

export default function LevelSelect({ onSelectLevel }: LevelSelectProps) {
  return (
    <div className="min-h-screen bg-game-bg flex items-center justify-center p-8">
      <div className="max-w-6xl w-full">
        <h1 className="text-6xl font-bold text-white text-center mb-4 long-shadow-text">
          塔防游戏
        </h1>
        <p className="text-center text-gray-400 mb-12">
          选择关卡开始游戏
        </p>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          {LEVELS.map((level) => (
            <button
              key={level.id}
              onClick={() => onSelectLevel(level.id)}
              className="flat-panel p-6 hover:scale-105 transition-transform duration-200"
            >
              <div className="text-4xl font-bold text-game-scene mb-2">
                {level.id}
              </div>
              <div className="text-white font-bold mb-1">{level.name}</div>
              <div className="text-xs text-gray-400">{level.description}</div>

              <div className="mt-4 flex flex-col gap-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-400">初始金币:</span>
                  <span className="text-game-gold">{level.startGold}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">波次:</span>
                  <span className="text-white">{level.waves.length}</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
