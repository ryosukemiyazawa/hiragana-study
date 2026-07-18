import React from 'react';
import { HIRAGANA_TABLE, SMALL_CHARS } from '../data/hiragana';
import { HiraganaCell } from './HiraganaCell';
import { SmallCharCell } from './SmallCharCell';

// ゲーム用のprops
interface GameModeProps {
  mode: 'game';
  hiddenCells: Set<string>;
  targetChars: string[];
  filledCells: Set<string>;
  revealedCells: Set<string>;
  activeRows: Set<number>;
  activeCols: Set<number>;
  activeSmallCharRows: Set<number>;
  onDrop: (row: number, col: number, droppedChar: string, charIndex: number) => void;
  onSmallDrop: (row: number, col: number, droppedChar: string, charIndex: number) => void;
  onTapDrop: (row: number, col: number) => void;
  onSmallTapDrop: (row: number, col: number) => void;
  onCellTap: (char: string) => void;
}

// スタート画面用のprops
interface StartModeProps {
  mode: 'start';
  onCellTap: (char: string) => void;
}

type HiraganaTableProps = GameModeProps | StartModeProps;

// 濁点・半濁点行と清音行の境界（わ行の前に余白を入れる）
const DAKUTEN_BOUNDARY = 5; // わ行のインデックス

// 空のダミー関数
const noop = () => {};

export function HiraganaTable(props: HiraganaTableProps) {
  const { mode, onCellTap } = props;

  // スタートモード用のデフォルト値
  const isStartMode = mode === 'start';
  const hiddenCells = isStartMode ? new Set<string>() : props.hiddenCells;
  const targetChars = isStartMode ? [] : props.targetChars;
  const filledCells = isStartMode ? new Set<string>() : props.filledCells;
  const revealedCells = isStartMode ? new Set<string>() : props.revealedCells;
  const activeRows = isStartMode ? new Set<number>([0, 1, 2, 3, 4]) : props.activeRows;
  const activeCols = isStartMode ? new Set<number>(Array.from({ length: 15 }, (_, i) => i)) : props.activeCols;
  const activeSmallCharRows = isStartMode ? new Set<number>([0, 1, 2]) : props.activeSmallCharRows;
  const onDrop = isStartMode ? noop : props.onDrop;
  const onSmallDrop = isStartMode ? noop : props.onSmallDrop;
  const onTapDrop = isStartMode ? noop : props.onTapDrop;
  const onSmallTapDrop = isStartMode ? noop : props.onSmallTapDrop;

  return (
    <div className="hiragana-table">
      {/* 50音表（縦書き形式） */}
      {HIRAGANA_TABLE.map((row, rowIndex) => (
        <div key={rowIndex} className="table-row">
          {/* 小さい文字パネル */}
          {SMALL_CHARS.map((smallRow, smallColIndex) => {
            const smallChar = smallRow[rowIndex] || '';
            const key = `small-${smallColIndex}-${rowIndex}`;
            return (
              <SmallCharCell
                key={key}
                char={smallChar}
                row={smallColIndex}
                col={rowIndex}
                isHidden={hiddenCells.has(key)}
                isTarget={targetChars.includes(smallChar)}
                isFilled={filledCells.has(key)}
                isRevealed={revealedCells.has(key)}
                isDisabled={!activeSmallCharRows.has(smallColIndex)}
                onDrop={onSmallDrop}
                onTapDrop={onSmallTapDrop}
                onCellTap={onCellTap}
              />
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
                  isRevealed={revealedCells.has(key)}
                  isInactive={!activeRows.has(rowIndex) && !activeCols.has(colIndex)}
                  onDrop={onDrop}
                  onTapDrop={onTapDrop}
                  onCellTap={onCellTap}
                />
              </React.Fragment>
            );
          })}
        </div>
      ))}
    </div>
  );
}
