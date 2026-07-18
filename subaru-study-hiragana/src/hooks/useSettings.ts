import { useState, useCallback, useEffect } from 'react';

export interface Settings {
  voiceURI: string | null; // 選択中のVoice URI (nullはデフォルト)
}

const STORAGE_KEY = 'hiragana-settings';

const DEFAULT_SETTINGS: Settings = {
  voiceURI: null,
};

function loadSettings(): Settings {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(data) };
    }
    return DEFAULT_SETTINGS;
  } catch {
    return DEFAULT_SETTINGS;
  }
}

function saveSettings(settings: Settings): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
}

export function useSettings() {
  const [settings, setSettings] = useState<Settings>(loadSettings);

  // 初回読み込み
  useEffect(() => {
    setSettings(loadSettings());
  }, []);

  // Voice URIを設定
  const setVoiceURI = useCallback((voiceURI: string | null) => {
    setSettings(prev => {
      const newSettings = { ...prev, voiceURI };
      saveSettings(newSettings);
      return newSettings;
    });
  }, []);

  return { settings, setVoiceURI };
}
