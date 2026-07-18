import type { DragEvent, TouchEvent } from 'react';
import { getCharPosition, getRowColor, getSmallCharColor } from '../data/hiragana';

interface DraggableCharProps {
  char: string;
  index: number;
  isPlaced: boolean;
  isSelected: boolean;
  onSelect: (index: number) => void;
}

export function DraggableChar({
  char,
  index,
  isPlaced,
  isSelected,
  onSelect,
}: DraggableCharProps) {
  const handleDragStart = (e: DragEvent<HTMLDivElement>) => {
    e.dataTransfer.setData('text/plain', JSON.stringify({ char, index }));
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleClick = () => {
    if (!isPlaced) {
      onSelect(index);
    }
  };

  // タッチデバイス用（onClickと重複しないようにpreventDefault）
  const handleTouchEnd = (e: TouchEvent<HTMLDivElement>) => {
    e.preventDefault(); // clickイベントの発火を防ぐ
    if (!isPlaced) {
      onSelect(index);
    }
  };

  // タッチ開始時にスクロールを防止
  const handleTouchStart = (e: TouchEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };

  // 文字の色を取得
  const pos = getCharPosition(char);
  let charColor: string | undefined;
  if (pos) {
    if (pos.type === 'small') {
      charColor = getSmallCharColor(char);
    } else {
      charColor = getRowColor(pos.col);
    }
  }
  const bgStyle = charColor ? { backgroundColor: charColor } : {};

  if (isPlaced) {
    return (
      <div className="draggable-char placed" style={bgStyle}>
        <span className="placed-char">{char}</span>
        <span className="placed-check">✓</span>
      </div>
    );
  }

  return (
    <div
      className={`draggable-char ${isSelected ? 'selected' : ''}`}
      style={bgStyle}
      draggable
      onDragStart={handleDragStart}
      onClick={handleClick}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {char}
    </div>
  );
}
