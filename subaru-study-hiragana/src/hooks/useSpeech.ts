// 音声再生のカスタムフック
// 現在はWeb Speech APIを使用。後でwavファイルに差し替え可能な設計

import { useCallback, useEffect, useRef } from 'react';

export function useSpeech() {
  
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // 音声リストを取得（Chromeでは非同期で読み込まれる）
  useEffect(() => {
    if (!('speechSynthesis' in window)) {
      console.error("speechSynthesisが利用できません");
      return;
    }
  }, []);

  const speak = useCallback(
    (text: string) => {
      if (!('speechSynthesis' in window)) return;

      // 前の発話をキャンセル
      speechSynthesis.cancel();

      // Chromeのバグ回避：
      // cancel() の直後に speak() を呼ぶとキューがロックされて無音化するため、
      // setTimeout で数ミリ秒（50ms）だけ実行タイミングをずらす
      setTimeout(() => {
        console.log("[speech] " + text);

        // 新しい発話インスタンスを生成し、Refへ即座に格納（破棄バグ対策）
        const utterance = new SpeechSynthesisUtterance(text);
        utteranceRef.current = utterance;

        utterance.lang = 'ja-JP';
        utterance.rate = 0.8;
        utterance.pitch = 1.2;

        // その場で最新の音声リストを取得
        const currentVoices = speechSynthesis.getVoices();
        const japaneseVoice = currentVoices.find(
          (voice) => voice.lang === 'ja-JP' || voice.lang.startsWith('ja')
        );
        
        if (japaneseVoice) {
          utterance.voice = japaneseVoice;
        }

        // 念のため完全に停止（解放）されていることを確認してから再生
        if (speechSynthesis.paused) {
          speechSynthesis.resume();
        }

        speechSynthesis.speak(utterance);
      }, 50);

      // WAVファイル版に差し替える場合は以下のようにする:
      // const audio = new Audio(`/sounds/${text}.wav`);
      // audio.play();
    },
    []
  );

  return { speak };
}
