import { useState, useEffect, useCallback } from 'react';

interface SettingsSceneProps {
  currentVoiceURI: string | null;
  onVoiceChange: (voiceURI: string | null) => void;
  onBack: () => void;
}

export function SettingsScene({ currentVoiceURI, onVoiceChange, onBack }: SettingsSceneProps) {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceURI, setSelectedVoiceURI] = useState<string | null>(currentVoiceURI);

  // 利用可能な日本語Voice一覧を取得
  useEffect(() => {
    const loadVoices = () => {
      const allVoices = speechSynthesis.getVoices();
      const japaneseVoices = allVoices.filter(
        voice => voice.lang === 'ja-JP' || voice.lang.startsWith('ja')
      );
      setVoices(japaneseVoices);
    };

    loadVoices();
    speechSynthesis.addEventListener('voiceschanged', loadVoices);

    return () => {
      speechSynthesis.removeEventListener('voiceschanged', loadVoices);
    };
  }, []);

  const handleVoiceSelect = useCallback((voiceURI: string | null) => {
    setSelectedVoiceURI(voiceURI);
    onVoiceChange(voiceURI);

    // 選択したVoiceでテスト再生
    speechSynthesis.cancel();
    setTimeout(() => {
      const utterance = new SpeechSynthesisUtterance('こんにちは');
      utterance.lang = 'ja-JP';
      utterance.rate = 0.8;
      utterance.pitch = 1.2;

      if (voiceURI) {
        const voice = voices.find(v => v.voiceURI === voiceURI);
        if (voice) {
          utterance.voice = voice;
        }
      }

      speechSynthesis.speak(utterance);
    }, 50);
  }, [onVoiceChange, voices]);

  return (
    <div className="game-container">
      <h1>設定</h1>

      <button className="back-button" onClick={onBack}>
        ←
      </button>

      <div className="settings-section">
        <h2>音声選択</h2>
        <p className="settings-description">読み上げに使用する音声を選択してください</p>

        <div className="voice-list">
          {/* デフォルト選択 */}
          <button
            className={`voice-item ${selectedVoiceURI === null ? 'active' : ''}`}
            onClick={() => handleVoiceSelect(null)}
          >
            <span className="voice-name">デフォルト</span>
            <span className="voice-detail">システムの日本語音声</span>
          </button>

          {/* 各Voice */}
          {voices.map(voice => (
            <button
              key={voice.voiceURI}
              className={`voice-item ${selectedVoiceURI === voice.voiceURI ? 'active' : ''}`}
              onClick={() => handleVoiceSelect(voice.voiceURI)}
            >
              <span className="voice-name">{voice.name}</span>
              <span className="voice-detail">
                {voice.localService ? 'ローカル' : 'ネットワーク'}
              </span>
            </button>
          ))}
        </div>

        {voices.length === 0 && (
          <p className="settings-note">
            日本語の音声が見つかりません。デバイスの設定を確認してください。
          </p>
        )}
      </div>
    </div>
  );
}
