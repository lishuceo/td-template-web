import { useGameStore } from '@store/gameStore';

interface ControlPanelProps {
  onStartWave: () => void;
  onTogglePause: () => void;
  onToggleSpeed: () => void;
}

export default function ControlPanel({
  onStartWave,
  onTogglePause,
  onToggleSpeed,
}: ControlPanelProps) {
  const { isPaused, gameSpeed } = useGameStore((state) => ({
    isPaused: state.isPaused,
    gameSpeed: state.gameSpeed,
  }));

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900 bg-opacity-90 border-t-4 border-white px-6 py-4 z-10">
      <div className="flex justify-between items-center">
        {/* 左侧：提示信息 */}
        <div className="text-white text-sm">
          点击空槽位建造防御塔
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
