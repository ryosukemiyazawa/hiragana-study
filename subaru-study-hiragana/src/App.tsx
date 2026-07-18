import { useGame } from './hooks/useGame';
import { StartScene } from './scenes/StartScene';
import { GameScene } from './scenes/GameScene';
import './App.css';

function App() {
  const {
    isStarted,
    currentWord,
    placedChars,
    hiddenCells,
    filledCells,
    isComplete,
    handleDrop,
    handleSmallDrop,
    skipChar,
    nextWord,
    startGame,
    resetGame,
  } = useGame();

  if (!isStarted) {
    return <StartScene onStart={startGame} />;
  }

  return (
    <GameScene
      currentWord={currentWord}
      placedChars={placedChars}
      hiddenCells={hiddenCells}
      filledCells={filledCells}
      isComplete={isComplete}
      handleDrop={handleDrop}
      handleSmallDrop={handleSmallDrop}
      skipChar={skipChar}
      nextWord={nextWord}
      onBack={resetGame}
    />
  );
}

export default App;
