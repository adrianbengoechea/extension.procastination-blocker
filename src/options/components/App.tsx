import { useState } from "preact/hooks";

import { useStorage } from "../../hooks/useStorage";
import { useSites } from "../../hooks/useSites.tsx";

import ListItem from "./ListItem.tsx";

import type { Site } from "../../interfaces/site.ts";

export default function App() {
  const [siteInput, setSiteInput] = useState("");
  const { sites, handleAdd, handleToggle, handleRemove, handleReset } =
    useSites();

  // const toggleSite = (index: number) => {
  //   setSites(sites.filter((_, i) => i !== index));
  // }

  return (
    <div>
      <h2>Blocked Sites</h2>
      <input
        type="text"
        placeholder="e.g., youtube.com"
        value={siteInput}
        onInput={(e) => setSiteInput(e.target.value)}
      />
      <button onClick={() => handleAdd(siteInput)}>Add</button>

      <ul>
        {sites.map((site, index) => (
          <ListItem
            key={site}
            site={site}
            onToggle={() => handleToggle(index)}
            onRemove={() => handleRemove(index)}
          />
        ))}
      </ul>
      <br />
      <button
        onClick={() => {
          if (confirm(`Confirm sites reset?`)) {
            handleReset();
          }
        }}
      >
        Reset
      </button>
    </div>
  );
}
