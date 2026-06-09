import { useStorage } from "../hooks/useStorage";

import type { Site } from "../interfaces/site.ts";

export const useSites = () => {
  const [sites, setSites] = useStorage<Site[]>("blockedSites", []);

  const handleAdd = (input: string) => {
    const date = new Date();
    const siteUrl = input
      .trim()
      .toLowerCase()
      .replace(/^(https?:\/\/)?(www\.)?/, "");

    const site: Site = {
      url: siteUrl,
      active: true,
      created_at: date.toLocaleString(),
      modified_at: date.toLocaleString(),
    };

    if (!site || sites.some((s) => s.url === site.url) || !site.url) return;
    setSites([...sites, site]);

    console.log(sites);
  };

  const handleRemove = (index: number) => {
    setSites(sites.filter((_, i) => i !== index));
  };

  const handleToggle = (index: number) => {
    sites[index].active = !sites[index].active;
    setSites(sites);
  };

  const handleReset = () => {
    setSites([]);
  };

  return {
    sites,
    handleAdd,
    handleToggle,
    handleRemove,
    handleReset,
  };
};
