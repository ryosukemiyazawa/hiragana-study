import type { DragEvent, TouchEvent } from 'react';

interface SmallCharCellProps {
  char: string;
  row: number;
  col: number;
  isHidden: boolean;
  isTarget: boolean;
  isFilled: boolean;
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

  // 空のセル
  if (char === '') {
    return <div className="hiragana-cell small-cell empty" />;
  }

  // 隠されているセル（ドロップ対象）
  // 「ー」は見つけにくいので、隠されていても文字を表示する
  if (isHidden && !isFilled) {
    return (
      <div
        className={`hiragana-cell small-cell hidden ${isTarget ? 'target' : ''}`}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={handleClick}
        onTouchEnd={handleTouchEnd}
      >
        {char === 'ー' ? 'ー' : '?'}
      </div>
    );
  }

  // 正解して埋まったセル
  if (isFilled) {
    return (
      <div
        className={`hiragana-cell small-cell filled ${isTarget ? 'target-filled' : ''}`}
        onClick={handleClick}
        onTouchEnd={handleTouchEnd}
      >
        {char}
      </div>
    );
  }

  // 通常のセル
  return (
    <div
      className="hiragana-cell small-cell"
      onClick={handleClick}
      onTouchEnd={handleTouchEnd}
    >
      {char}
    </div>
  );
}
