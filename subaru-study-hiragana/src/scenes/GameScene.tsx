import { useState, useCallback, useEffect, useRef } from 'react';
import { useSpeech } from '../hooks/useSpeech';
import { HiraganaTable } from '../components/HiraganaTable';
import { DraggableChar } from '../components/DraggableChar';
import Celebration from '../components/effect/Celebration';
import { HIRAGANA_TABLE, getHiraganaPosition } from '../data/hiragana';

interface GameSceneProps {
  currentWord: string;
  placedChars: boolean[];
  hiddenCells: Set<string>;
  filledCells: Set<string>;
  isComplete: boolean;
  handleDrop: (row: number, col: number, char: string, charIndex: number) => boolean;
  skipChar: (index: number) => void;
  nextWord: () => void;
  onBack: () => void;
}

export function GameScene({
  currentWord,
  placedChars,
  hiddenCells,
  filledCells,
  isComplete,
  handleDrop,
  skipChar,
  nextWord,
  onBack,
}: GameSceneProps) {
  const { speak } = useSpeech();

  const [showSkipButton, setShowSkipButton] = useState(false);
  const prevWordRef = useRef<string | null>(null);
  const skipTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const targetChars = currentWord.split('');

  // 最初の未配置文字を自動選択
  const selectedCharIndex = placedChars.findIndex((placed) => !placed);
  const autoSelectedIndex = selectedCharIndex === -1 ? null : selectedCharIndex;

  // 問題に含まれる行と段を計算
  const activeRows = new Set<number>();
  const activeCols = new Set<number>();
  for (const char of targetChars) {
    const pos = getHiraganaPosition(char);
    if (pos) {
      activeRows.add(pos.row);
      activeCols.add(pos.col);
    }
  }

  // 問題が変わったら読み上げる
  useEffect(() => {
    if (currentWord && currentWord !== prevWordRef.current) {
      speak(currentWord);
      prevWordRef.current = currentWord;
    }
  }, [currentWord, speak]);

  const handlePlayWord = useCallback(() => {
    speak(currentWord);
  }, [currentWord, speak]);

  // 文字タップ時は読み上げのみ（選択は自動）
  const handleSelectChar = useCallback(
    (index: number) => {
      const char = currentWord[index];
      speak(char);
    },
    [currentWord, speak]
  );

  // 自動選択時に3秒後わからないボタンを表示
  useEffect(() => {
    if (autoSelectedIndex !== null) {
      skipTimerRef.current = setTimeout(() => {
        setShowSkipButton(true);
      }, 3000);
    } else {
      setShowSkipButton(false);
    }
    return () => {
      if (skipTimerRef.current) {
        clearTimeout(skipTimerRef.current);
      }
    };
  }, [autoSelectedIndex]);

  const handleTapDrop = useCallback(
    (row: number, col: number) => {
      if (autoSelectedIndex === null) return;

      const char = currentWord[autoSelectedIndex];
      const expectedChar = HIRAGANA_TABLE[row][col];

      if (char === expectedChar) {
        handleDrop(row, col, char, autoSelectedIndex);
        // 読み上げはHiraganaCell側のonCellTapで行う
        // 選択は自動で次に移動するのでsetSelectedCharIndexは不要
        setShowSkipButton(false);
      }
    },
    [autoSelectedIndex, currentWord, handleDrop]
  );

  const handleSkipChar = useCallback(
    (index: number) => {
      const char = currentWord[index];
      speak(char);
      skipChar(index);
      // 選択は自動で次に移動する
      setShowSkipButton(false);
    },
    [currentWord, skipChar, speak]
  );

  const handleNextWord = useCallback(() => {
    setShowSkipButton(false);
    nextWord();
  }, [nextWord]);

  const handleCellTap = useCallback(
    (char: string) => {
      speak(char);
    },
    [speak]
  );

  // ドラッグ＆ドロップ時の処理（正解なら読み上げる）
  const handleDropWithSpeak = useCallback(
    (row: number, col: number, droppedChar: string, charIndex: number) => {
      const success = handleDrop(row, col, droppedChar, charIndex);
      if (success) {
        speak(droppedChar);
      }
    },
    [handleDrop, speak]
  );

  return (
    <div className="game-container">
      <button className="back-button" onClick={onBack} title="もどる">
        ←
      </button>
      <h1>ひらがながくしゅう</h1>

      {/* 問題の単語表示 */}
      <div className="word-display">
        <div className="word-header">
          <p className="word-label">
            {isComplete ? 'せいかい！🎉' : 'もんだい'}
          </p>
          <button className="play-button" onClick={handlePlayWord} title="もういちど読む">
            🔊
          </button>
        </div>
        <div className="word-chars">
          {targetChars.map((char, index) => (
            <DraggableChar
              key={index}
              char={char}
              index={index}
              isPlaced={placedChars[index]}
              isSelected={autoSelectedIndex === index}
              onSelect={handleSelectChar}
            />
          ))}
        </div>
      </div>

      {/* 次へボタン（正解時に画面中央に表示） */}
      {isComplete && (
        <button className="next-button-center" onClick={handleNextWord} title="つぎのもんだい">
          →
        </button>
      )}

      {/* わからないボタン（選択後3秒で右上に表示） */}
      {showSkipButton && autoSelectedIndex !== null && (
        <button
          className="skip-button-floating"
          onClick={() => handleSkipChar(autoSelectedIndex)}
        >
          わからない
        </button>
      )}

      {/* 50音表 */}
      <HiraganaTable
        hiddenCells={hiddenCells}
        targetChars={targetChars}
        filledCells={filledCells}
        activeRows={activeRows}
        activeCols={activeCols}
        onDrop={handleDropWithSpeak}
        onTapDrop={handleTapDrop}
        onCellTap={handleCellTap}
      />

      {/* 正解時の花火エフェクト */}
      {isComplete && <Celebration />}
    </div>
  );
}
