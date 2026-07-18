import { useState, useCallback } from 'react';
import { HIRAGANA_TABLE, getHiraganaPosition } from '../data/hiragana';
import { WORD_LIST } from '../data/words';

type HidingMode = 'char_only' | 'dan' | 'gyo' | 'random';

interface GameState {
  isStarted: boolean;
  currentWord: string;
  placedChars: boolean[];
  hiddenCells: Set<string>;
  filledCells: Set<string>;
  isComplete: boolean;
}

function createInitialGameState(): GameState {
  return {
    isStarted: false,
    currentWord: '',
    placedChars: [],
    hiddenCells: new Set<string>(),
    filledCells: new Set<string>(),
    isComplete: false,
  };
}

function getRandomWord(): string {
  return WORD_LIST[Math.floor(Math.random() * WORD_LIST.length)];
}

function getHidingMode(): HidingMode {
  const modes: HidingMode[] = ['char_only', 'dan', 'gyo', 'random'];
  return modes[Math.floor(Math.random() * modes.length)];
}

function generateHiddenCells(word: string, mode: HidingMode): Set<string> {
  const hidden = new Set<string>();
  const chars = [...new Set(word.split(''))]; // ユニークな文字

  for (let i = 0; i < chars.length; i++) {
    const char = chars[i];
    const pos = getHiraganaPosition(char);
    if (!pos) continue;

    switch (mode) {
      case 'char_only':
        // その文字だけ隠す
        hidden.add(`${pos.row}-${pos.col}`);
        break;

      case 'dan':
        // 最初の1文字だけ段（横一列：あいうえお）を全部隠す、それ以外はその文字だけ
        if (i === 0) {
          for (let col = 0; col < HIRAGANA_TABLE[pos.row].length; col++) {
            if (HIRAGANA_TABLE[pos.row][col] !== '') {
              hidden.add(`${pos.row}-${col}`);
            }
          }
        } else {
          hidden.add(`${pos.row}-${pos.col}`);
        }
        break;

      case 'gyo':
        // 最初の1文字だけ行（縦一列：あかさたな...）を全部隠す、それ以外はその文字だけ
        if (i === 0) {
          for (let row = 0; row < HIRAGANA_TABLE.length; row++) {
            if (HIRAGANA_TABLE[row][pos.col] !== '') {
              hidden.add(`${row}-${pos.col}`);
            }
          }
        } else {
          hidden.add(`${pos.row}-${pos.col}`);
        }
        break;

      case 'random':
        // その文字を含むランダムな位置を隠す
        hidden.add(`${pos.row}-${pos.col}`);
        // 追加でランダムに2〜5個隠す
        const extraCount = Math.floor(Math.random() * 4) + 2;
        for (let j = 0; j < extraCount; j++) {
          const randomRow = Math.floor(Math.random() * HIRAGANA_TABLE.length);
          const randomCol = Math.floor(Math.random() * HIRAGANA_TABLE[0].length);
          if (HIRAGANA_TABLE[randomRow][randomCol] !== '') {
            hidden.add(`${randomRow}-${randomCol}`);
          }
        }
        break;
    }
  }

  return hidden;
}

export function useGame() {
  const [gameState, setGameState] = useState<GameState>(createInitialGameState);

  const startGame = useCallback(() => {
    const word = getRandomWord();
    const mode = getHidingMode();
    setGameState({
      isStarted: true,
      currentWord: word,
      placedChars: new Array(word.length).fill(false),
      hiddenCells: generateHiddenCells(word, mode),
      filledCells: new Set<string>(),
      isComplete: false,
    });
  }, []);

  const handleDrop = useCallback(
    (row: number, col: number, droppedChar: string, charIndex: number) => {
      const expectedChar = HIRAGANA_TABLE[row][col];

      if (droppedChar === expectedChar) {
        // 正解
        setGameState((prev) => {
          const newPlacedChars = [...prev.placedChars];
          newPlacedChars[charIndex] = true;

          const newFilledCells = new Set(prev.filledCells);
          newFilledCells.add(`${row}-${col}`);

          const isComplete = newPlacedChars.every((placed) => placed);

          return {
            ...prev,
            placedChars: newPlacedChars,
            filledCells: newFilledCells,
            isComplete,
          };
        });
        return true;
      }
      return false;
    },
    []
  );

  const skipChar = useCallback((charIndex: number) => {
    setGameState((prev) => {
      const char = prev.currentWord[charIndex];
      const pos = getHiraganaPosition(char);
      if (!pos) return prev;

      const newPlacedChars = [...prev.placedChars];
      newPlacedChars[charIndex] = true;

      const newFilledCells = new Set(prev.filledCells);
      newFilledCells.add(`${pos.row}-${pos.col}`);

      const isComplete = newPlacedChars.every((placed) => placed);

      return {
        ...prev,
        placedChars: newPlacedChars,
        filledCells: newFilledCells,
        isComplete,
      };
    });
  }, []);

  const nextWord = useCallback(() => {
    const word = getRandomWord();
    const mode = getHidingMode();
    setGameState({
      isStarted: true,
      currentWord: word,
      placedChars: new Array(word.length).fill(false),
      hiddenCells: generateHiddenCells(word, mode),
      filledCells: new Set<string>(),
      isComplete: false,
    });
  }, []);

  const resetGame = useCallback(() => {
    setGameState(createInitialGameState());
  }, []);

  return {
    ...gameState,
    handleDrop,
    skipChar,
    nextWord,
    startGame,
    resetGame,
  };
}
