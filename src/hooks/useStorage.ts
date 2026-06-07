import { useState, useEffect } from 'preact/hooks';

export function useStorage<T>(key: string, defaultValue: T) {
  const [value, setValue] = useState<T>(defaultValue);

  useEffect(() => {
    chrome.storage.sync.get(key, (result) => {
      if (result[key] !== undefined) setValue(result[key]);
    });
  }, [key]);

  const set = (newValue: T) => {
    setValue(newValue);
    chrome.storage.sync.set({ [key]: newValue });
  };

  return [value, set] as const;
}