import { useState, useCallback, useEffect } from 'react';
import { useSpeech } from '../hooks/useSpeech';
import { HiraganaTable } from '../components/HiraganaTable';
import { EmojiKeyboard } from '../components/EmojiKeyboard';
import { SECRET_MESSAGES } from "../data/messages";

interface StartSceneProps {
  onStart: () => void;
  onShowStats: () => void;
  onShowSettings: () => void;
  voiceURI: string | null;
  speechRate: number;
}

export function StartScene({ onStart, onShowStats, onShowSettings, voiceURI, speechRate }: StartSceneProps) {
  const { speak } = useSpeech({ voiceURI, speechRate });
  const [inputChars, setInputChars] = useState<string[]>([]);
  const [showEmojiKeyboard, setShowEmojiKeyboard] = useState(false);

  // 特殊入力の処理
  useEffect(() => {
    const inputText = inputChars.join('');
    if (inputText === 'えもじ') {
      setShowEmojiKeyboard(true);
      setInputChars([]);
    } else if (inputText === 'とうけい') {
      setInputChars([]);
      onShowStats();
    } else if (inputText === 'せってい') {
      setInputChars([]);
      onShowSettings();
    }
  }, [inputChars, onShowStats, onShowSettings]);

  const handleStartGame = useCallback(() => {
    const inputText = inputChars.join('');
    const secretMessage = SECRET_MESSAGES[inputText];

    if (secretMessage) {
      // 隠しメッセージを読み上げ
      // SECRET_MESSAGESは配列なのでランダムに1件取り出し
      const secretMessageOne = secretMessage[
        Math.floor(Math.random() * secretMessage.length)
      ];
      speak(secretMessageOne);
    } else {
      const textToSpeak = inputChars.length > 0 ? inputText : 'はじめる';
      speak(textToSpeak);
    }

    setTimeout(() => {
      onStart();
    }, 1000);
  }, [speak, onStart, inputChars]);

  const handleStartCharTap = useCallback((char: string) => {
    speak(char);
    setInputChars(prev => [...prev, char]);
  }, [speak]);

  const handleEmojiTap = useCallback((emoji: string) => {
    speak(emoji);
    setInputChars(prev => [...prev, emoji]);
  }, [speak]);

  const handleBackToHiragana = useCallback(() => {
    setShowEmojiKeyboard(false);
  }, []);

  const handlePlayInputChars = useCallback(() => {
    const inputText = inputChars.join('');
    const secretMessage = SECRET_MESSAGES[inputText];

    if (secretMessage) {
      // 隠しメッセージを読み上げ
      // SECRET_MESSAGESは配列なのでランダムに1件取り出し
      const secretMessageOne = secretMessage[
        Math.floor(Math.random() * secretMessage.length)
      ];
      speak(secretMessageOne);
    }else if (inputChars.length > 0) {

      speak(inputChars.join(''));
    }
  }, [inputChars, speak]);

  const handleClearInputChars = useCallback(() => {
    setInputChars([]);
  }, []);

  return (
    <div className="game-container">
      {/* 右上のメニューボタン */}
      <div className="top-menu">
        <button className="menu-button" onClick={onShowStats} title="統計">
          📊
        </button>
        <button className="menu-button" onClick={onShowSettings} title="設定">
          ⚙️
        </button>
      </div>

      <h1>ひらがながくしゅう</h1>
      <p className="build-time">{__BUILD_TIME__}</p>
      <div className="start-area">
        <div className="input-display">
          {inputChars.length > 0 && (
            <button className="play-button" onClick={handlePlayInputChars} title="よみあげる">
              🔊
            </button>
          )}
          <button className="start-button" onClick={handleStartGame}>
            {inputChars.length > 0 ? inputChars.join('') : 'はじめる'}
          </button>
          {inputChars.length > 0 && (
            <button className="clear-button" onClick={handleClearInputChars} title="けす">
              ✕
            </button>
          )}
        </div>
      </div>
      {showEmojiKeyboard ? (
        <EmojiKeyboard onEmojiTap={handleEmojiTap} onBack={handleBackToHiragana} />
      ) : (
        <HiraganaTable mode="start" onCellTap={handleStartCharTap} />
      )}
    </div>
  );
}
