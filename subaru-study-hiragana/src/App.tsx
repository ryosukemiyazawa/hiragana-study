import { useState, useCallback } from 'react';
import { useGame } from './hooks/useGame';
import { useStats } from './hooks/useStats';
import { useSettings } from './hooks/useSettings';
import { StartScene } from './scenes/StartScene';
import { GameScene } from './scenes/GameScene';
import { StatsScene } from './scenes/StatsScene';
import { SettingsScene } from './scenes/SettingsScene';
import './App.css';

type Scene = 'start' | 'game' | 'stats' | 'settings';

function App() {
  const [scene, setScene] = useState<Scene>('start');

  const {
    currentWord,
    placedChars,
    hiddenCells,
    filledCells,
    isComplete,
    activeSmallCharRows,
    handleDrop,
    handleSmallDrop,
    skipChar,
    nextWord,
    startGame,
    resetGame,
    incrementWrongCount,
  } = useGame();

  const { stats, recordCorrect, recordWrong, resetStats } = useStats();
  const { settings, setVoiceURI, setSpeechRate } = useSettings();

  const handleStart = useCallback(() => {
    startGame();
    setScene('game');
  }, [startGame]);

  const handleBack = useCallback(() => {
    resetGame();
    setScene('start');
  }, [resetGame]);

  const handleShowStats = useCallback(() => {
    setScene('stats');
  }, []);

  const handleShowSettings = useCallback(() => {
    setScene('settings');
  }, []);

  const handleStatsBack = useCallback(() => {
    setScene('start');
  }, []);

  const handleSettingsBack = useCallback(() => {
    setScene('start');
  }, []);

  if (scene === 'stats') {
    return (
      <StatsScene
        stats={stats}
        onBack={handleStatsBack}
        onReset={resetStats}
      />
    );
  }

  if (scene === 'settings') {
    return (
      <SettingsScene
        currentVoiceURI={settings.voiceURI}
        currentSpeechRate={settings.speechRate}
        onVoiceChange={setVoiceURI}
        onSpeechRateChange={setSpeechRate}
        onBack={handleSettingsBack}
      />
    );
  }

  if (scene === 'start') {
    return (
      <StartScene
        onStart={handleStart}
        onShowStats={handleShowStats}
        onShowSettings={handleShowSettings}
        voiceURI={settings.voiceURI}
        speechRate={settings.speechRate}
      />
    );
  }

  return (
    <GameScene
      currentWord={currentWord}
      placedChars={placedChars}
      hiddenCells={hiddenCells}
      filledCells={filledCells}
      isComplete={isComplete}
      activeSmallCharRows={activeSmallCharRows}
      handleDrop={handleDrop}
      handleSmallDrop={handleSmallDrop}
      skipChar={skipChar}
      nextWord={nextWord}
      onBack={handleBack}
      recordCorrect={recordCorrect}
      recordWrong={recordWrong}
      incrementWrongCount={incrementWrongCount}
      voiceURI={settings.voiceURI}
      speechRate={settings.speechRate}
    />
  );
}

export default App;
