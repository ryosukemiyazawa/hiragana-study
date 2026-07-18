// 50音表のデータ（縦書き形式: 行が段(あいうえお)、列が行）
// 右から左へ: ぱ行、ば行、だ行、ざ行、が行、わ行、ら行、や行、ま行、は行、な行、た行、さ行、か行、あ行
export const HIRAGANA_TABLE = [
  ['ぱ', 'ば', 'だ', 'ざ', 'が', 'わ', 'ら', 'や', 'ま', 'は', 'な', 'た', 'さ', 'か', 'あ'], // あ段
  ['ぴ', 'び', 'ぢ', 'じ', 'ぎ', '', 'り', '', 'み', 'ひ', 'に', 'ち', 'し', 'き', 'い'],     // い段
  ['ぷ', 'ぶ', 'づ', 'ず', 'ぐ', 'を', 'る', 'ゆ', 'む', 'ふ', 'ぬ', 'つ', 'す', 'く', 'う'], // う段
  ['ぺ', 'べ', 'で', 'ぜ', 'げ', '', 'れ', '', 'め', 'へ', 'ね', 'て', 'せ', 'け', 'え'],     // え段
  ['ぽ', 'ぼ', 'ど', 'ぞ', 'ご', 'ん', 'ろ', 'よ', 'も', 'ほ', 'の', 'と', 'そ', 'こ', 'お'], // お段
];

// 小さい文字（拗音・促音）と長音（右から左へ: っ、ゃ、ぁ）
export const SMALL_CHARS = [
  ['っ', '', '', '', 'ー'],
  ['ゃ', '', 'ゅ', '', 'ょ'],
  ['ぁ', 'ぃ', 'ぅ', 'ぇ', 'ぉ'],
];

// 小さい文字のラベル（右から左）
export const SMALL_CHAR_LABELS = ['っ', 'ゃ', 'ぁ'];

// 段のラベル（縦のラベル）
export const DAN_LABELS = ['あ', 'い', 'う', 'え', 'お'];
// 行のラベル（横のラベル、右から左）
export const GYO_LABELS = ['ぱ', 'ば', 'だ', 'ざ', 'が', 'わ', 'ら', 'や', 'ま', 'は', 'な', 'た', 'さ', 'か', 'あ'];

// ひらがなから位置を取得
export function getHiraganaPosition(char: string): { row: number; col: number } | null {
  for (let row = 0; row < HIRAGANA_TABLE.length; row++) {
    for (let col = 0; col < HIRAGANA_TABLE[row].length; col++) {
      if (HIRAGANA_TABLE[row][col] === char) {
        return { row, col };
      }
    }
  }
  return null;
}

// 小さい文字から位置を取得
export function getSmallCharPosition(char: string): { row: number; col: number } | null {
  for (let row = 0; row < SMALL_CHARS.length; row++) {
    for (let col = 0; col < SMALL_CHARS[row].length; col++) {
      if (SMALL_CHARS[row][col] === char) {
        return { row, col };
      }
    }
  }
  return null;
}

// 文字が小さい文字かどうか判定
export function isSmallChar(char: string): boolean {
  return getSmallCharPosition(char) !== null;
}

// 任意のひらがな（通常 or 小さい文字）の位置を取得
export type CharPosition =
  | { type: 'normal'; row: number; col: number }
  | { type: 'small'; row: number; col: number };

export function getCharPosition(char: string): CharPosition | null {
  const normalPos = getHiraganaPosition(char);
  if (normalPos) {
    return { type: 'normal', ...normalPos };
  }
  const smallPos = getSmallCharPosition(char);
  if (smallPos) {
    return { type: 'small', ...smallPos };
  }
  return null;
}

// セルキーを生成（通常: "row-col", 小さい文字: "small-row-col"）
export function getCellKey(pos: CharPosition): string {
  if (pos.type === 'small') {
    return `small-${pos.row}-${pos.col}`;
  }
  return `${pos.row}-${pos.col}`;
}

