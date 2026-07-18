import { useState, useCallback, useEffect } from 'react';

export interface CharStats {
  correct: number;
  wrong: number;
}

export type StatsData = Record<string, CharStats>;

const STORAGE_KEY = 'hiragana-stats';

function loadStats(): StatsData {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : {};
  } catch {
    return {};
  }
}

function saveStats(stats: StatsData): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
}

export function useStats() {
  const [stats, setStats] = useState<StatsData>(loadStats);

  // 初回読み込み
  useEffect(() => {
    setStats(loadStats());
  }, []);

  // 正解を記録
  const recordCorrect = useCallback((char: string) => {
    setStats(prev => {
      const newStats = {
        ...prev,
        [char]: {
          correct: (prev[char]?.correct || 0) + 1,
          wrong: prev[char]?.wrong || 0,
        },
      };
      saveStats(newStats);
      return newStats;
    });
  }, []);

  // 間違いを記録
  const recordWrong = useCallback((char: string) => {
    setStats(prev => {
      const newStats = {
        ...prev,
        [char]: {
          correct: prev[char]?.correct || 0,
          wrong: (prev[char]?.wrong || 0) + 1,
        },
      };
      saveStats(newStats);
      return newStats;
    });
  }, []);

  // 統計をリセット
  const resetStats = useCallback(() => {
    setStats({});
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return { stats, recordCorrect, recordWrong, resetStats };
}
