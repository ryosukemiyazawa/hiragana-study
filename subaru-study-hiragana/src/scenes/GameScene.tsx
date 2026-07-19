import { useState, useCallback, useEffect, useRef } from 'react';
import { useSpeech } from '../hooks/useSpeech';
import { HiraganaTable } from '../components/HiraganaTable';
import { DraggableChar } from '../components/DraggableChar';
import Celebration from '../components/effect/Celebration';
import { HIRAGANA_TABLE, SMALL_CHARS, getCharPosition } from '../data/hiragana';

interface GameSceneProps {
  currentWord: string;
  placedChars: boolean[];
  hiddenCells: Set<string>;
  filledCells: Set<string>;
  isComplete: boolean;
  activeSmallCharRows: Set<number>;
  handleDrop: (row: number, col: number, char: string, charIndex: number) => boolean;
  handleSmallDrop: (row: number, col: number, char: string, charIndex: number) => boolean;
  skipChar: (index: number) => void;
  nextWord: () => void;
  onBack: () => void;
  recordCorrect: (char: string) => void;
  recordWrong: (char: string) => void;
  incrementWrongCount: () => void;
  voiceURI: string | null;
  speechRate: number;
}

export function GameScene({
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
  onBack,
  recordCorrect,
  recordWrong,
  incrementWrongCount,
  voiceURI,
  speechRate,
}: GameSceneProps) {
  const { speak } = useSpeech({ voiceURI, speechRate });

  const [showSkipButton, setShowSkipButton] = useState(false);
  const [revealedCells, setRevealedCells] = useState<Set<string>>(new Set());
  const prevWordRef = useRef<string | null>(null);
  const skipTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const allChars = currentWord.split('');

  // まだ配置されていない文字のみをターゲットとして扱う
  const targetChars = allChars.filter((_, index) => !placedChars[index]);

  // 最初の未配置文字を自動選択
  const selectedCharIndex = placedChars.findIndex((placed) => !placed);
  const autoSelectedIndex = selectedCharIndex === -1 ? null : selectedCharIndex;

  // 問題に含まれる行と段を計算（通常文字のみ、小さい文字は別扱い）
  const activeRows = new Set<number>();
  const activeCols = new Set<number>();
  for (const char of targetChars) {
    const pos = getCharPosition(char);
    if (pos && pos.type === 'normal') {
      activeRows.add(pos.row);
      activeCols.add(pos.col);
    }
  }

  // 問題が変わったら読み上げる＆revealedCellsをリセット
  useEffect(() => {
    if (currentWord && currentWord !== prevWordRef.current) {
      speak(currentWord);
      prevWordRef.current = currentWord;
      setRevealedCells(new Set());
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
      const cellKey = `${row}-${col}`;

      if (char === expectedChar) {
        handleDrop(row, col, char, autoSelectedIndex);
        // 読み上げはHiraganaCell側のonCellTapで行う
        // 選択は自動で次に移動するのでsetSelectedCharIndexは不要
        setShowSkipButton(false);
        // 正解を記録
        recordCorrect(char);
      } else {
        // 間違いを記録（探している文字を記録）
        recordWrong(char);
        incrementWrongCount();
        // 間違ったセルを一時的に表示
        setRevealedCells(prev => new Set(prev).add(cellKey));
      }
    },
    [autoSelectedIndex, currentWord, handleDrop, recordCorrect, recordWrong, incrementWrongCount]
  );

  // 小さい文字セルのタップ処理
  const handleSmallTapDrop = useCallback(
    (row: number, col: number) => {
      if (autoSelectedIndex === null) return;

      const char = currentWord[autoSelectedIndex];
      const expectedChar = SMALL_CHARS[row]?.[col] || '';
      const cellKey = `small-${row}-${col}`;

      if (char === expectedChar) {
        handleSmallDrop(row, col, char, autoSelectedIndex);
        setShowSkipButton(false);
        // 正解を記録
        recordCorrect(char);
      } else {
        // 間違いを記録（探している文字を記録）
        recordWrong(char);
        incrementWrongCount();
        // 間違ったセルを一時的に表示
        setRevealedCells(prev => new Set(prev).add(cellKey));
      }
    },
    [autoSelectedIndex, currentWord, handleSmallDrop, recordCorrect, recordWrong, incrementWrongCount]
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

  // 小さい文字へのドラッグ＆ドロップ時の処理
  const handleSmallDropWithSpeak = useCallback(
    (row: number, col: number, droppedChar: string, charIndex: number) => {
      const success = handleSmallDrop(row, col, droppedChar, charIndex);
      if (success) {
        speak(droppedChar);
      }
    },
    [handleSmallDrop, speak]
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
          {allChars.map((char, index) => (
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
        mode="game"
        hiddenCells={hiddenCells}
        targetChars={targetChars}
        filledCells={filledCells}
        revealedCells={revealedCells}
        activeRows={activeRows}
        activeCols={activeCols}
        activeSmallCharRows={activeSmallCharRows}
        onDrop={handleDropWithSpeak}
        onSmallDrop={handleSmallDropWithSpeak}
        onTapDrop={handleTapDrop}
        onSmallTapDrop={handleSmallTapDrop}
        onCellTap={handleCellTap}
      />

      {/* 正解時の花火エフェクト */}
      {isComplete && <Celebration />}
    </div>
  );
}
