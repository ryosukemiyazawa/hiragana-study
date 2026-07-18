import type { DragEvent, TouchEvent } from 'react';
import { getRowColor } from '../data/hiragana';

interface HiraganaCellProps {
  char: string;
  row: number;
  col: number;
  isHidden: boolean;
  isTarget: boolean;
  isFilled: boolean;
  isRevealed: boolean; // 間違いで一時的に表示されるセル
  isInactive: boolean; // 問題に含まれない行・段
  onDrop: (row: number, col: number, droppedChar: string, charIndex: number) => void;
  onTapDrop: (row: number, col: number) => void;
  onCellTap: (char: string) => void;
}

export function HiraganaCell({
  char,
  row,
  col,
  isHidden,
  isTarget,
  isFilled,
  isRevealed,
  isInactive,
  onDrop,
  onTapDrop,
  onCellTap,
}: HiraganaCellProps) {
  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    if (isHidden && !isFilled) {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const data = JSON.parse(e.dataTransfer.getData('text/plain'));
    onDrop(row, col, data.char, data.index);
  };

  const handleClick = () => {
    // 隠れているセル、またはターゲット文字の場合はドロップ処理を試みる
    // （同じ文字が複数回出る場合、filledでも再度正解できる）
    if (isHidden || isTarget) {
      onTapDrop(row, col);
      // 正解でも不正解でも、セルの文字を読み上げる
      if (char !== '') {
        onCellTap(char);
      }
      return;
    }
    // 通常セルのタップは読み上げ
    if (char !== '') {
      onCellTap(char);
    }
  };

  // タッチデバイス用（onClickと重複しないようにpreventDefault）
  const handleTouchEnd = (e: TouchEvent<HTMLDivElement>) => {
    e.preventDefault(); // clickイベントの発火を防ぐ
    handleClick();
  };

  // 行の色を取得
  const rowColor = getRowColor(col);
  const colorStyle = rowColor ? { color: rowColor } : {};
  // hiddenの場合はデフォルト色（青系）をフォールバックとして使用
  const hiddenStyle = { backgroundColor: rowColor || '#0984e3', color: '#fff' };

  // 空のセル（やゆよ、わをんの空き）
  if (char === '') {
    return <div className="hiragana-cell empty" />;
  }

  // 状態判定:
  // - hidden: isHidden && !isFilled && !isRevealed（背景色＋白テキスト「？」）
  // - active: isTarget && (isFilled || isRevealed)（背景色＋白テキスト「文字」）
  // - plain: それ以外（通常表示）

  // hidden状態: 隠れていて未正解、かつrevealされていない
  if (isHidden && !isFilled && !isRevealed) {
    return (
      <div
        className={`hiragana-cell hidden ${isTarget ? 'target' : ''}`}
        style={hiddenStyle}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={handleClick}
        onTouchEnd={handleTouchEnd}
      >
        ?
      </div>
    );
  }

  // active状態: 問題に含まれていて、正解済みまたはrevealされた
  if (isTarget && (isFilled || isRevealed)) {
    return (
      <div
        className={`hiragana-cell active ${isFilled ? 'filled' : 'revealed'}`}
        style={hiddenStyle}
        onClick={handleClick}
        onTouchEnd={handleTouchEnd}
      >
        {char}
      </div>
    );
  }

  // plain状態: 通常のセル（ダミーが開かれた、または問題に含まれない正解済み）
  return (
    <div
      className={`hiragana-cell ${isInactive ? 'inactive' : ''}`}
      style={colorStyle}
      onClick={handleClick}
      onTouchEnd={handleTouchEnd}
    >
      {char}
    </div>
  );
}
