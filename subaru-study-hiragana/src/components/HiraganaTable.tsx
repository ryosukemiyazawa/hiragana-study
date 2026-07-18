import React from 'react';
import { HIRAGANA_TABLE, DAN_LABELS, GYO_LABELS, SMALL_CHARS, SMALL_CHAR_LABELS } from '../data/hiragana';
import { HiraganaCell } from './HiraganaCell';

interface HiraganaTableProps {
  hiddenCells: Set<string>; // "row-col" 形式
  targetChars: string[];
  filledCells: Set<string>;
  activeRows: Set<number>; // 問題に含まれる段
  activeCols: Set<number>; // 問題に含まれる行
  onDrop: (row: number, col: number, droppedChar: string, charIndex: number) => void;
  onTapDrop: (row: number, col: number) => void;
  onCellTap: (char: string) => void;
}

// 濁点・半濁点行と清音行の境界（わ行の前に余白を入れる）
const DAKUTEN_BOUNDARY = 5; // わ行のインデックス

export function HiraganaTable({
  hiddenCells,
  targetChars,
  filledCells,
  activeRows,
  activeCols,
  onDrop,
  onTapDrop,
  onCellTap,
}: HiraganaTableProps) {
  return (
    <div className="hiragana-table">
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

      {/* 50音表（縦書き形式） */}
      {HIRAGANA_TABLE.map((row, rowIndex) => (
        <div key={rowIndex} className="table-row">
          {/* 小さい文字パネル */}
          {SMALL_CHARS.map((smallRow, smallColIndex) => {
            const smallChar = smallRow[rowIndex] || '';
            const key = `small-${smallColIndex}-${rowIndex}`;
            return (
              <div
                key={key}
                className={`hiragana-cell small-cell ${smallChar === '' ? 'empty' : ''}`}
                onClick={() => smallChar && onCellTap(smallChar)}
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
                <HiraganaCell
                  char={char}
                  row={rowIndex}
                  col={colIndex}
                  isHidden={hiddenCells.has(key)}
                  isTarget={targetChars.includes(char)}
                  isFilled={filledCells.has(key)}
                  isInactive={!activeRows.has(rowIndex) && !activeCols.has(colIndex)}
                  onDrop={onDrop}
                  onTapDrop={onTapDrop}
                  onCellTap={onCellTap}
                />
              </React.Fragment>
            );
          })}
          <div className="dan-label">{DAN_LABELS[rowIndex]}</div>
        </div>
      ))}
    </div>
  );
}
