import { HIRAGANA_TABLE, SMALL_CHARS, getCharPosition, getCellKey } from '../data/hiragana';

/**
 * ダミー文字生成ロジック
 *
 * 仕様:
 * 1. ダミー文字数の決定:
 *    - 基本: 問題3問ごとに +1 ダミー文字
 *    - 間違い回数 >= 単語の長さ * 2 の場合: -1 ダミー文字
 *    - 最小0、最大は候補数まで
 *
 * 2. ダミー候補の条件:
 *    - 問題に含まれる文字は除外
 *    - 小さい文字（っ、ゃゅょ、ぁぃぅぇぉ、ー）は除外
 *    - 問題に濁音・半濁音が含まれない場合、濁音・半濁音行からは選ばない
 */

// 濁音・半濁音の列インデックス
const DAKUTEN_COLS = [0, 1, 2, 3, 4]; // ぱ、ば、だ、ざ、が行

interface DummyGeneratorParams {
  word: string;
  problemCount: number;  // 現在の問題数（0始まり）
  wrongCount: number;    // 現在の問題での間違い回数
}

interface DummyGeneratorResult {
  dummyCells: string[];      // ダミーとして隠すセルキー
  dummyCount: number;        // ダミー数
  targetCellKeys: Set<string>; // 問題に含まれる文字のセルキー
}

// 問題に濁音・半濁音が含まれているかチェック
function hasDakutenInWord(word: string): boolean {
  const dakutenChars = new Set([
    'が', 'ぎ', 'ぐ', 'げ', 'ご',
    'ざ', 'じ', 'ず', 'ぜ', 'ぞ',
    'だ', 'ぢ', 'づ', 'で', 'ど',
    'ば', 'び', 'ぶ', 'べ', 'ぼ',
    'ぱ', 'ぴ', 'ぷ', 'ぺ', 'ぽ',
  ]);

  return word.split('').some(char => dakutenChars.has(char));
}

// ダミー数を計算
function calculateDummyCount(params: DummyGeneratorParams): number {
  const { word, problemCount, wrongCount } = params;

  // 基本: 3問ごとに +1
  let count = Math.floor(problemCount / 3);

  // 間違いが多い場合: -1
  if (wrongCount >= word.length * 2) {
    count -= 1;
  }

  // 最小0
  return Math.max(0, count);
}

// ダミー候補セルを収集
function collectDummyCandidates(
  targetCellKeys: Set<string>,
  includeDakuten: boolean
): string[] {
  const candidates: string[] = [];

  for (let row = 0; row < HIRAGANA_TABLE.length; row++) {
    for (let col = 0; col < HIRAGANA_TABLE[row].length; col++) {
      const char = HIRAGANA_TABLE[row][col];
      if (char === '') continue;

      const key = `${row}-${col}`;

      // 問題に含まれる文字は除外
      if (targetCellKeys.has(key)) continue;

      // 濁音・半濁音を除外（問題に含まれない場合）
      if (!includeDakuten && DAKUTEN_COLS.includes(col)) continue;

      candidates.push(key);
    }
  }

  return candidates;
}

// 問題に含まれる文字のセルキーを収集
function collectTargetCellKeys(word: string): Set<string> {
  const targetCellKeys = new Set<string>();
  const chars = [...new Set(word.split(''))];

  for (const char of chars) {
    const pos = getCharPosition(char);
    if (pos) {
      targetCellKeys.add(getCellKey(pos));
    }
  }

  return targetCellKeys;
}

// ダミー文字を生成
export function generateDummies(params: DummyGeneratorParams): DummyGeneratorResult {
  const { word } = params;

  // 問題に含まれる文字のセルキーを収集
  const targetCellKeys = collectTargetCellKeys(word);

  // ダミー数を計算
  const dummyCount = calculateDummyCount(params);

  if (dummyCount === 0) {
    return { dummyCells: [], dummyCount: 0, targetCellKeys };
  }

  // 問題に濁音・半濁音が含まれているか
  const includeDakuten = hasDakutenInWord(word);

  // ダミー候補を収集
  const candidates = collectDummyCandidates(targetCellKeys, includeDakuten);

  // ランダムに選択
  const shuffled = [...candidates].sort(() => Math.random() - 0.5);
  const selectedCount = Math.min(dummyCount, shuffled.length);
  const dummyCells = shuffled.slice(0, selectedCount);

  return {
    dummyCells,
    dummyCount: selectedCount,
    targetCellKeys,
  };
}

// 問題に含まれる小さい文字の行を取得
export function getActiveSmallCharRows(word: string): Set<number> {
  const activeRows = new Set<number>();
  const chars = word.split('');

  for (const char of chars) {
    for (let row = 0; row < SMALL_CHARS.length; row++) {
      if (SMALL_CHARS[row].includes(char)) {
        activeRows.add(row);
        break;
      }
    }
  }

  return activeRows;
}
