import React from 'react';
import { HIRAGANA_TABLE, GYO_LABELS, DAN_LABELS, SMALL_CHARS, SMALL_CHAR_LABELS } from '../data/hiragana';

interface StartHiraganaTableProps {
  onCharTap: (char: string) => void;
}

const DAKUTEN_BOUNDARY = 5;

export function StartHiraganaTable({ onCharTap }: StartHiraganaTableProps) {
  return (
    <div className="hiragana-table start-table">
      {/* 行ラベル */}
      <div className="table-row header-row">
        {/* 小さい文字のラベル */}
        {SMALL_CHAR_LABELS.map((label, i) => (
          <div key={`small-${i}`} className="gyo-label small-label">{label}</div>
        ))}
        <div className="table-spacer" />
        {GYO_LABELS.map((label, i) => (
          <React.Fragment key={i}>
            {i === DAKUTEN_BOUNDARY && <div className="table-spacer" />}
            <div className="gyo-label">{label}</div>
          </React.Fragment>
        ))}
        <div className="dan-label"></div>
      </div>

      {/* 50音表 */}
      {HIRAGANA_TABLE.map((row, rowIndex) => (
        <div key={rowIndex} className="table-row">
          {/* 小さい文字パネル */}
          {SMALL_CHARS.map((smallRow, smallColIndex) => {
            const smallChar = smallRow[rowIndex] || '';
            const key = `small-${smallColIndex}-${rowIndex}`;
            return smallChar === '' ? (
              <div key={key} className="hiragana-cell small-cell empty" />
            ) : (
              <div
                key={key}
                className="hiragana-cell small-cell start-cell"
                onClick={() => onCharTap(smallChar)}
              >
                {smallChar}
              </div>
            );
          })}
          <div className="table-spacer" />
          {row.map((char, colIndex) => {
            const key = `${rowIndex}-${colIndex}`;
            return (
              <React.Fragment key={key}>
                {colIndex === DAKUTEN_BOUNDARY && <div className="table-spacer" />}
                {char === '' ? (
                  <div className="hiragana-cell empty" />
                ) : (
                  <div
                    className="hiragana-cell start-cell"
                    onClick={() => onCharTap(char)}
                  >
                    {char}
                  </div>
                )}
              </React.Fragment>
            );
          })}
          <div className="dan-label">{DAN_LABELS[rowIndex]}</div>
        </div>
      ))}
    </div>
  );
}
