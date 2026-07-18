import type { DragEvent, TouchEvent } from 'react';
import { getSmallCharColor } from '../data/hiragana';

interface SmallCharCellProps {
  char: string;
  row: number;
  col: number;
  isHidden: boolean;
  isTarget: boolean;
  isFilled: boolean;
  isRevealed: boolean; // 間違いで一時的に表示されるセル
  isDisabled: boolean;
  onDrop: (row: number, col: number, droppedChar: string, charIndex: number) => void;
  onTapDrop: (row: number, col: number) => void;
  onCellTap: (char: string) => void;
}

export function SmallCharCell({
  char,
  row,
  col,
  isHidden,
  isTarget,
  isFilled,
  isRevealed,
  isDisabled,
  onDrop,
  onTapDrop,
  onCellTap,
}: SmallCharCellProps) {
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
    if (isHidden || isTarget) {
      onTapDrop(row, col);
      if (char !== '') {
        onCellTap(char);
      }
      return;
    }
    if (char !== '') {
      onCellTap(char);
    }
  };

  const handleTouchEnd = (e: TouchEvent<HTMLDivElement>) => {
    e.preventDefault();
    handleClick();
  };

  // 文字の色を取得
  const charColor = getSmallCharColor(char);
  const colorStyle = charColor ? { color: charColor } : {};
  // hiddenの場合はデフォルト色（青系）をフォールバックとして使用
  const hiddenStyle = { backgroundColor: charColor || '#0984e3', color: '#fff' };

  // 空のセル
  if (char === '') {
    return <div className="hiragana-cell small-cell empty" />;
  }

  // 無効化されたセル（小さい文字が問題に含まれていない場合）
  if (isDisabled) {
    return (
      <div className="hiragana-cell small-cell disabled" style={colorStyle}>
        {char}
      </div>
    );
  }

  // 状態判定:
  // - hidden: isHidden && !isFilled && !isRevealed（背景色＋白テキスト「？」）
  // - active: isTarget && (isFilled || isRevealed)（背景色＋白テキスト「文字」）
  // - plain: それ以外（通常表示）

  // hidden状態: 隠れていて未正解、かつrevealされていない
  // 「ー」は見つけにくいので、hiddenでも文字を表示する
  if (isHidden && !isFilled && !isRevealed) {
    const displayChar = char === 'ー' ? char : '?';
    return (
      <div
        className={`hiragana-cell small-cell hidden ${isTarget ? 'target' : ''}`}
        style={hiddenStyle}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={handleClick}
        onTouchEnd={handleTouchEnd}
      >
        {displayChar}
      </div>
    );
  }

  // active状態: 問題に含まれていて、正解済みまたはrevealされた
  if (isTarget && (isFilled || isRevealed)) {
    return (
      <div
        className={`hiragana-cell small-cell active ${isFilled ? 'filled' : 'revealed'}`}
        style={hiddenStyle}
        onClick={handleClick}
        onTouchEnd={handleTouchEnd}
      >
        {char}
      </div>
    );
  }

  // plain状態: 通常のセル
  return (
    <div
      className="hiragana-cell small-cell"
      style={colorStyle}
      onClick={handleClick}
      onTouchEnd={handleTouchEnd}
    >
      {char}
    </div>
  );
}
