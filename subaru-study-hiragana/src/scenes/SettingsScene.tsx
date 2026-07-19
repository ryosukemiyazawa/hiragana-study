import { useState, useEffect, useCallback } from 'react';

interface SettingsSceneProps {
  currentVoiceURI: string | null;
  currentSpeechRate: number;
  onVoiceChange: (voiceURI: string | null) => void;
  onSpeechRateChange: (rate: number) => void;
  onBack: () => void;
}

// 速度の選択肢
const SPEECH_RATE_OPTIONS = [
  { value: 0.3, label: 'とてもおそい' },
  { value: 0.5, label: 'おそい' },
  { value: 0.8, label: 'ふつう' },
  { value: 1.0, label: 'はやい' },
];

export function SettingsScene({
  currentVoiceURI,
  currentSpeechRate,
  onVoiceChange,
  onSpeechRateChange,
  onBack,
}: SettingsSceneProps) {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceURI, setSelectedVoiceURI] = useState<string | null>(currentVoiceURI);
  const [selectedRate, setSelectedRate] = useState<number>(currentSpeechRate);

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
    //speechSynthesis.addEventListener('voiceschanged', loadVoices);

    return () => {
      //speechSynthesis.removeEventListener('voiceschanged', loadVoices);
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
      utterance.rate = selectedRate;
      utterance.pitch = 1.2;

      if (voiceURI) {
        const voice = voices.find(v => v.voiceURI === voiceURI);
        if (voice) {
          utterance.voice = voice;
        }
      }

      speechSynthesis.speak(utterance);
    }, 50);
  }, [onVoiceChange, voices, selectedRate]);

  const handleRateSelect = useCallback((rate: number) => {
    setSelectedRate(rate);
    onSpeechRateChange(rate);

    // 選択した速度でテスト再生
    speechSynthesis.cancel();
    setTimeout(() => {
      const utterance = new SpeechSynthesisUtterance('こんにちは');
      utterance.lang = 'ja-JP';
      utterance.rate = rate;
      utterance.pitch = 1.2;

      if (selectedVoiceURI) {
        const voice = voices.find(v => v.voiceURI === selectedVoiceURI);
        if (voice) {
          utterance.voice = voice;
        }
      }

      speechSynthesis.speak(utterance);
    }, 50);
  }, [onSpeechRateChange, voices, selectedVoiceURI]);

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

      <div className="settings-section">
        <h2>読み上げ速度</h2>
        <p className="settings-description">読み上げの速さを選択してください</p>

        <div className="voice-list">
          {SPEECH_RATE_OPTIONS.map(option => (
            <button
              key={option.value}
              className={`voice-item ${selectedRate === option.value ? 'active' : ''}`}
              onClick={() => handleRateSelect(option.value)}
            >
              <span className="voice-name">{option.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
