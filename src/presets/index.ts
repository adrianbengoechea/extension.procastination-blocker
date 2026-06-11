import type { Site } from "../interfaces/site";

import { PRESET_ADULT } from "./adult";
import { PRESET_ENTERTAINMENT } from "./entertainment";
import { PRESET_GAMBLING } from "./gambling";
import { PRESET_SOCIAL } from "./social";

export const PRESET_MAP: Record<string, string[]> = {
  adult: PRESET_ADULT,
  entertainment: PRESET_ENTERTAINMENT,
  gambling: PRESET_GAMBLING,
  social: PRESET_SOCIAL,
};

export const PRESET_LABELS: Record<string, string> = {
  adult: "Adult Content",
  entertainment: "Entertainment",
  gambling: "Gambling",
  social: "Social Media",
};

export function getAllBlockedSites(
  blockedSites: Site[],
  blockedPresets: string[],
): Site[] {
  const presetSites: Site[] = [];
  for (const key of blockedPresets) {
    const sites = PRESET_MAP[key];
    if (sites) {
      for (const url of sites) {
        presetSites.push({ url, active: true, created_at: "" });
      }
    }
  }
  return [...presetSites, ...blockedSites];
}
