import { useCallback, useState, useMemo } from 'react';
import type { StatsData } from '../hooks/useStats';
import { HIRAGANA_TABLE, SMALL_CHARS } from '../data/hiragana';

interface StatsSceneProps {
  stats: StatsData;
  onBack: () => void;
  onReset: () => void;
}

type SortMode = 'weak' | 'strong' | 'gojuon';

// 全ひらがな文字を取得
function getAllChars(): string[] {
  const chars: string[] = [];
  for (const row of HIRAGANA_TABLE) {
    for (const char of row) {
      if (char) chars.push(char);
    }
  }
  for (const row of SMALL_CHARS) {
    for (const char of row) {
      if (char) chars.push(char);
    }
  }
  return chars;
}

export function StatsScene({ stats, onBack, onReset }: StatsSceneProps) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [sortMode, setSortMode] = useState<SortMode>('weak');

  const allChars = useMemo(() => getAllChars(), []);

  // 全体の統計
  const totalCorrect = Object.values(stats).reduce((sum, data) => sum + (data.correct || 0), 0);
  const totalWrong = Object.values(stats).reduce((sum, data) => sum + (data.wrong || 0), 0);

  // 並び順に応じたリスト
  const sortedCharList = useMemo(() => {
    const charList = allChars.map(char => ({
      char,
      correct: stats[char]?.correct || 0,
      wrong: stats[char]?.wrong || 0,
      total: (stats[char]?.correct || 0) + (stats[char]?.wrong || 0),
      accuracy: stats[char]?.correct && stats[char]?.wrong !== undefined
        ? (stats[char].correct / ((stats[char].correct || 0) + (stats[char].wrong || 0))) * 100
        : stats[char]?.correct ? 100 : 0,
    }));

    switch (sortMode) {
      case 'weak':
        // 苦手順: 間違い回数が多い順、同じなら正解率が低い順
        return charList
          .filter(c => c.total > 0)
          .sort((a, b) => {
            if (b.wrong !== a.wrong) return b.wrong - a.wrong;
            return a.accuracy - b.accuracy;
          });
      case 'strong':
        // 得意順: 正解率が高い順、同じなら回答数が多い順
        return charList
          .filter(c => c.total > 0)
          .sort((a, b) => {
            if (b.accuracy !== a.accuracy) return b.accuracy - a.accuracy;
            return b.total - a.total;
          });
      case 'gojuon':
        // 50音順: 元の順番
        return charList;
    }
  }, [allChars, stats, sortMode]);

  const handleResetClick = useCallback(() => {
    setShowConfirm(true);
  }, []);

  const handleConfirmReset = useCallback(() => {
    onReset();
    setShowConfirm(false);
  }, [onReset]);

  const handleCancelReset = useCallback(() => {
    setShowConfirm(false);
  }, []);

  const handleSortChange = useCallback((mode: SortMode) => {
    setSortMode(mode);
  }, []);

  return (
    <div className="game-container">
      <h1>統計</h1>

      <button className="back-button" onClick={onBack}>
        ←
      </button>

      <div className="stats-summary">
        <p>正解: {totalCorrect}回 / 不正解: {totalWrong}回</p>
      </div>

      {/* 並び順切り替え */}
      <div className="sort-buttons">
        <button
          className={`sort-button ${sortMode === 'weak' ? 'active' : ''}`}
          onClick={() => handleSortChange('weak')}
        >
          苦手
        </button>
        <button
          className={`sort-button ${sortMode === 'strong' ? 'active' : ''}`}
          onClick={() => handleSortChange('strong')}
        >
          得意
        </button>
        <button
          className={`sort-button ${sortMode === 'gojuon' ? 'active' : ''}`}
          onClick={() => handleSortChange('gojuon')}
        >
          50音
        </button>
      </div>

      {sortedCharList.length === 0 ? (
        <div className="stats-empty">
          <p>統計データがありません</p>
        </div>
      ) : (
        <div className="stats-list">
          {sortedCharList.map(({ char, correct, wrong, accuracy }) => (
            <div key={char} className="stats-item">
              <span className="stats-char">{char}</span>
              <div className="stats-bar-container">
                <div
                  className="stats-bar correct"
                  style={{ width: `${correct + wrong > 0 ? (correct / (correct + wrong)) * 100 : 0}%` }}
                />
              </div>
              <span className="stats-numbers">
                {correct}/{correct + wrong}
                {correct + wrong > 0 && (
                  <span className="stats-percent">({accuracy.toFixed(0)}%)</span>
                )}
              </span>
            </div>
          ))}
        </div>
      )}

      <div className="stats-actions">
        <button className="reset-button" onClick={handleResetClick}>
          リセット
        </button>
      </div>

      {showConfirm && (
        <div className="confirm-overlay">
          <div className="confirm-dialog">
            <p>統計をリセットしますか？</p>
            <div className="confirm-buttons">
              <button className="confirm-yes" onClick={handleConfirmReset}>
                はい
              </button>
              <button className="confirm-no" onClick={handleCancelReset}>
                いいえ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
