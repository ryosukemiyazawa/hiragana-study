import { useState, useCallback } from 'react';
import { HIRAGANA_TABLE, SMALL_CHARS, getCharPosition, getCellKey } from '../data/hiragana';
import { WORD_LIST as ALL_WORDS } from '../data/words';
import { generateDummies, getActiveSmallCharRows } from '../utils/dummyGenerator';
import type { StatsData } from './useStats';

// デバッグ確認用
const DUMMY_WORD = ['ぱとかー'];

// 本番: ALL_WORDS, デバッグ: DUMMY_WORD
// const WORD_LIST = DUMMY_WORD; void ALL_WORDS;
const WORD_LIST = ALL_WORDS; void DUMMY_WORD;

type HidingMode = 'char_only' | 'dan' | 'gyo' | 'random';

interface GameState {
  isStarted: boolean;
  currentWord: string;
  placedChars: boolean[];
  hiddenCells: Set<string>;
  filledCells: Set<string>;
  isComplete: boolean;
  problemCount: number;       // 問題回答数
  wrongCountInProblem: number; // 現在の問題での間違い回数
  activeSmallCharRows: Set<number>; // アクティブな小さい文字の行
}

function createInitialGameState(): GameState {
  return {
    isStarted: false,
    currentWord: '',
    placedChars: [],
    hiddenCells: new Set<string>(),
    filledCells: new Set<string>(),
    isComplete: false,
    problemCount: 0,
    wrongCountInProblem: 0,
    activeSmallCharRows: new Set<number>(),
  };
}

function getRandomWord(): string {
  return WORD_LIST[Math.floor(Math.random() * WORD_LIST.length)];
}

// 文字が苦手かどうか判定（未回答、正解率50%未満、または間違い3回以上）
function isWeakChar(char: string, stats: StatsData): boolean {
  const charStats = stats[char];
  // 未回答の文字も苦手として扱う
  if (!charStats) return true;

  const total = charStats.correct + charStats.wrong;
  if (total === 0) return true;

  const correctRate = charStats.correct / total;
  return correctRate < 0.5 || charStats.wrong >= 3;
}

// 問題に苦手な文字が多いかチェック
function hasMultipleWeakChars(word: string, stats: StatsData): boolean {
  const chars = [...new Set(word.split(''))];
  const weakCount = chars.filter(char => isWeakChar(char, stats)).length;
  return weakCount >= 2; // 2つ以上苦手な文字がある
}

function getHidingMode(word: string, stats: StatsData): HidingMode {
  // 苦手な文字が多い場合は、段・行を消すモードを避ける
  if (hasMultipleWeakChars(word, stats)) {
    const modes: HidingMode[] = ['char_only', 'random'];
    return modes[Math.floor(Math.random() * modes.length)];
  }

  const modes: HidingMode[] = ['char_only', 'dan', 'gyo', 'random'];
  return modes[Math.floor(Math.random() * modes.length)];
}

interface GenerateHiddenCellsParams {
  word: string;
  mode: HidingMode;
  problemCount: number;
  wrongCount: number;
}

function generateHiddenCells(params: GenerateHiddenCellsParams): Set<string> {
  const { word, mode, problemCount, wrongCount } = params;
  const hidden = new Set<string>();
  const chars = [...new Set(word.split(''))]; // ユニークな文字

  // ダミー生成ロジックを使用
  const { dummyCells, targetCellKeys } = generateDummies({
    word,
    problemCount,
    wrongCount,
  });

  // 問題の文字を隠す
  for (let i = 0; i < chars.length; i++) {
    const char = chars[i];
    const pos = getCharPosition(char);
    if (!pos) continue;

    const cellKey = getCellKey(pos);

    // 小さい文字は常にその文字だけ隠す（段・行モードは通常文字のみ）
    if (pos.type === 'small') {
      hidden.add(cellKey);
      continue;
    }

    switch (mode) {
      case 'char_only':
        // その文字だけ隠す
        hidden.add(cellKey);
        break;

      case 'dan':
        // 最初の1文字だけ段（横一列：あいうえお）を全部隠す、それ以外はその文字だけ
        // ただし問題に含まれる文字は除外
        if (i === 0) {
          for (let col = 0; col < HIRAGANA_TABLE[pos.row].length; col++) {
            const key = `${pos.row}-${col}`;
            if (HIRAGANA_TABLE[pos.row][col] !== '' && !targetCellKeys.has(key)) {
              hidden.add(key);
            }
          }
        }
        // 問題の文字自体は必ず隠す
        hidden.add(cellKey);
        break;

      case 'gyo':
        // 最初の1文字だけ行（縦一列：あかさたな...）を全部隠す、それ以外はその文字だけ
        // ただし問題に含まれる文字は除外
        if (i === 0) {
          for (let row = 0; row < HIRAGANA_TABLE.length; row++) {
            const key = `${row}-${pos.col}`;
            if (HIRAGANA_TABLE[row][pos.col] !== '' && !targetCellKeys.has(key)) {
              hidden.add(key);
            }
          }
        }
        // 問題の文字自体は必ず隠す
        hidden.add(cellKey);
        break;

      case 'random':
        // その文字だけ隠す（ダミーは別途追加）
        hidden.add(cellKey);
        break;
    }
  }

  // ダミー文字を追加（randomモードでも新しいダミー生成ロジックを使用）
  for (const dummyKey of dummyCells) {
    hidden.add(dummyKey);
  }

  return hidden;
}

export function useGame(stats: StatsData = {}) {
  const [gameState, setGameState] = useState<GameState>(createInitialGameState);

  const startGame = useCallback(() => {
    const word = getRandomWord();
    const mode = getHidingMode(word, stats);
    setGameState((prev) => {
      const newProblemCount = prev.problemCount;
      return {
        isStarted: true,
        currentWord: word,
        placedChars: new Array(word.length).fill(false),
        hiddenCells: generateHiddenCells({
          word,
          mode,
          problemCount: newProblemCount,
          wrongCount: 0,
        }),
        filledCells: new Set<string>(),
        isComplete: false,
        problemCount: newProblemCount,
        wrongCountInProblem: 0,
        activeSmallCharRows: getActiveSmallCharRows(word),
      };
    });
  }, [stats]);

  // 通常の50音表へのドロップ
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

  // 小さい文字へのドロップ
  const handleSmallDrop = useCallback(
    (row: number, col: number, droppedChar: string, charIndex: number) => {
      const expectedChar = SMALL_CHARS[row]?.[col] || '';

      if (droppedChar === expectedChar) {
        // 正解
        setGameState((prev) => {
          const newPlacedChars = [...prev.placedChars];
          newPlacedChars[charIndex] = true;

          const newFilledCells = new Set(prev.filledCells);
          newFilledCells.add(`small-${row}-${col}`);

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
      const pos = getCharPosition(char);
      if (!pos) return prev;

      const newPlacedChars = [...prev.placedChars];
      newPlacedChars[charIndex] = true;

      const newFilledCells = new Set(prev.filledCells);
      newFilledCells.add(getCellKey(pos));

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
    const mode = getHidingMode(word, stats);
    setGameState((prev) => {
      const newProblemCount = prev.problemCount + 1;
      return {
        isStarted: true,
        currentWord: word,
        placedChars: new Array(word.length).fill(false),
        hiddenCells: generateHiddenCells({
          word,
          mode,
          problemCount: newProblemCount,
          wrongCount: 0,
        }),
        filledCells: new Set<string>(),
        isComplete: false,
        problemCount: newProblemCount,
        wrongCountInProblem: 0,
        activeSmallCharRows: getActiveSmallCharRows(word),
      };
    });
  }, [stats]);

  const resetGame = useCallback(() => {
    setGameState(createInitialGameState());
  }, []);

  // 間違いをカウント
  const incrementWrongCount = useCallback(() => {
    setGameState((prev) => ({
      ...prev,
      wrongCountInProblem: prev.wrongCountInProblem + 1,
    }));
  }, []);

  return {
    ...gameState,
    handleDrop,
    handleSmallDrop,
    skipChar,
    nextWord,
    startGame,
    resetGame,
    incrementWrongCount,
  };
}
