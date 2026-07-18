import type { DragEvent, TouchEvent } from 'react';

interface HiraganaCellProps {
  char: string;
  row: number;
  col: number;
  isHidden: boolean;
  isTarget: boolean;
  isFilled: boolean;
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

  // 空のセル（やゆよ、わをんの空き）
  if (char === '') {
    return <div className="hiragana-cell empty" />;
  }

  // 隠されているセル（ドロップ対象）
  if (isHidden && !isFilled) {
    return (
      <div
        className={`hiragana-cell hidden ${isTarget ? 'target' : ''}`}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={handleClick}
        onTouchEnd={handleTouchEnd}
      >
        ?
      </div>
    );
  }

  // 正解して埋まったセル（ターゲットなら再度タップ可能）
  if (isFilled) {
    return (
      <div
        className={`hiragana-cell filled ${isTarget ? 'target-filled' : ''}`}
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
      className={`hiragana-cell ${isInactive ? 'inactive' : ''}`}
      onClick={handleClick}
      onTouchEnd={handleTouchEnd}
    >
      {char}
    </div>
  );
}
