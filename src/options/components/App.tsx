import { useState } from "preact/hooks";
import { useStorage } from "../../hooks/useStorage";
import ListItem from "./ListItem.tsx";

export default function App() {
  const [siteInput, setSiteInput] = useState("");
  const [sites, setSites] = useStorage<string[]>("blockedSites", []);

  const addSite = () => {
    const site = siteInput.trim().toLowerCase().replace(/^(https?:\/\/)?(www\.)?/, "");
    if (!site || sites.includes(site)) return;
    setSites([...sites, site]);
    setSiteInput("");
  };

  const removeSite = (index: number) => {
    setSites(sites.filter((_, i) => i !== index));
  };

  return (
    <div>
      <h2>Blocked Sites</h2>
      <input
        type="text"
        placeholder="e.g., youtube.com"
        value={siteInput}
        onInput={(e) => setSiteInput(e.target.value)}
      />
      <button onClick={addSite}>Add</button>

      <ul>
        {sites.map((site, index) => (
          <ListItem key={site} site={site} onRemove={() => removeSite(index)} />
        ))}
      </ul>
    </div>
  );
}
