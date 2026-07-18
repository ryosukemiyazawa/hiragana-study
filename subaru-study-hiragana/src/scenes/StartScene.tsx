import { useState, useCallback, useEffect } from 'react';
import { useSpeech } from '../hooks/useSpeech';
import { StartHiraganaTable } from '../components/StartHiraganaTable';
import { EmojiKeyboard } from '../components/EmojiKeyboard';

interface StartSceneProps {
  onStart: () => void;
}

// 隠しメッセージ
const SECRET_MESSAGES: Record<string, string> = {
  'すばる': 'かわいい',
  'まま': 'だいすき',
  'かわいい': 'ありがとう',
};

export function StartScene({ onStart }: StartSceneProps) {
  const { speak } = useSpeech();
  const [inputChars, setInputChars] = useState<string[]>([]);
  const [showEmojiKeyboard, setShowEmojiKeyboard] = useState(false);

  // 「えもじ」と入力したら絵文字キーボードを表示
  useEffect(() => {
    const inputText = inputChars.join('');
    if (inputText === 'えもじ') {
      setShowEmojiKeyboard(true);
      setInputChars([]);
    }
  }, [inputChars]);

  const handleStartGame = useCallback(() => {
    const inputText = inputChars.join('');
    const secretMessage = SECRET_MESSAGES[inputText];

    if (secretMessage) {
      // 隠しメッセージを読み上げ
      speak(secretMessage);
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
    if (inputChars.length > 0) {
      speak(inputChars.join(''));
    }
  }, [inputChars, speak]);

  const handleClearInputChars = useCallback(() => {
    setInputChars([]);
  }, []);

  return (
    <div className="game-container">
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
        <StartHiraganaTable onCharTap={handleStartCharTap} />
      )}
    </div>
  );
}
