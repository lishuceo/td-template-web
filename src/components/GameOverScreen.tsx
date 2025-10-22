interface GameOverScreenProps {
  victory: boolean;
  onRestart: () => void;
  onBackToMenu: () => void;
}

export default function GameOverScreen({
  victory,
  onRestart,
  onBackToMenu,
}: GameOverScreenProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
      <div className="flat-panel p-12 max-w-md w-full text-center">
        <h1
          className={`text-6xl font-bold mb-4 long-shadow-text ${
            victory ? 'text-game-base' : 'text-game-danger'
          }`}
        >
          {victory ? '胜利！' : '失败！'}
        </h1>

        <p className="text-gray-300 mb-8">
          {victory
            ? '恭喜你成功守卫了基地！'
            : '基地被摧毁了，再试一次吧！'}
        </p>

        <div className="flex flex-col gap-4">
          <button onClick={onRestart} className="flat-button bg-game-scene">
            重新开始
          </button>

          <button onClick={onBackToMenu} className="flat-button bg-gray-700">
            返回菜单
          </button>
        </div>
      </div>
    </div>
  );
}
