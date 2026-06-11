import { useStorage } from '../../hooks/useStorage'
import { TopicList } from '../../options/components/TopicList'

import { PRESET_ADULT } from "../../presets/adult"
import { PRESET_ENTERTAINMENT } from "../../presets/entertainment"
import { PRESET_GAMBLING } from "../../presets/gambling"
import { PRESET_SOCIAL } from "../../presets/social"


export const Topics = () => {
  const [blockedPresets, setBlockedPresets] = useStorage<string[]>('blockedPresets', []);

  const isChecked = (key: string) => blockedPresets.includes(key);

  const handleToggle = (key: string) => {
    if (isChecked(key)) {
      setBlockedPresets(blockedPresets.filter(k => k !== key));
    } else {
      setBlockedPresets([...blockedPresets, key]);
    }
  };

  return (
    <div className="container flex flex-row flex-wrap">
      <TopicList title="Adult Content" topic={PRESET_ADULT} checked={isChecked('adult')} onToggle={() => handleToggle('adult')} />
      <TopicList title="Entertainment" topic={PRESET_ENTERTAINMENT} checked={isChecked('entertainment')} onToggle={() => handleToggle('entertainment')} />
      <TopicList title="Gambling" topic={PRESET_GAMBLING} checked={isChecked('gambling')} onToggle={() => handleToggle('gambling')} />
      <TopicList title="Social Media" topic={PRESET_SOCIAL} checked={isChecked('social')} onToggle={() => handleToggle('social')} />
    </div>
  )
}
