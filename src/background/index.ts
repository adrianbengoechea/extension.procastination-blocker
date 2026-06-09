import type { Site } from "../interfaces/site";

const BLOCKED_PAGE = "/src/blocked-site/index.html";
const RULE_ID_BASE = 1;

interface ParsedSite {
  domain: string;
  path: string | null; // null = block entire domain
}

function parseSite(site: string): ParsedSite {
  // Strip protocol
  const withoutProtocol = site
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "");

  const slashIndex = withoutProtocol.indexOf("/");

  if (slashIndex === -1) {
    return { domain: withoutProtocol.trim(), path: null };
  }

  return {
    domain: withoutProtocol.slice(0, slashIndex).trim(),
    path: withoutProtocol.slice(slashIndex).trim(), // e.g. "/shorts"
  };
}

function escapeForRegex(str: string): string {
  return str.replace(/\./g, "\\.").replace(/\//g, "\\/");
}

function buildRegexFilter({ domain, path }: ParsedSite): string {
  const escapedDomain = escapeForRegex(domain);

  if (path === null || path === "/") {
    // Block domain and everything under it
    return `^https?:\\/\\/([^\\/]+\\.)?${escapedDomain}(\\/.*)?$`;
  }

  const escapedPath = escapeForRegex(path);
  // Block only this path prefix and anything deeper
  // domain.com/other or domain.com alone will NOT match
  return `^https?:\\/\\/([^\\/]+\\.)?${escapedDomain}${escapedPath}(\\/.*|\\?.*)?$`;
}

function updateRules(): void {
  chrome.storage.sync.get("blockedSites", ({ blockedSites = [] }) => {
    chrome.declarativeNetRequest.getDynamicRules((existingRules) => {
      const removeRuleIds = existingRules.map((r) => r.id);

      const activeBlockedSites = blockedSites.filter((el, i) => el.active);

      const addRules = (activeBlockedSites as Site[]).map((site, index) => {
        const parsed = parseSite(site.url);
        return {
          id: RULE_ID_BASE + index,
          priority: 1,

          action: {
            type: "redirect" as const,
            redirect: { extensionPath: BLOCKED_PAGE },
          },
          condition: {
            regexFilter: buildRegexFilter(parsed),
            resourceTypes: ["main_frame" as const],
          },
        };
      });

      console.log(addRules);

      chrome.declarativeNetRequest
        .updateDynamicRules({ removeRuleIds, addRules })
        .then(() => console.log("> rules updated", addRules))
        .catch((err) => console.error("> rules error", err));
    });
  });
}

chrome.runtime.onInstalled.addListener(updateRules);

chrome.storage.onChanged.addListener((changes, area) => {
  if (area === "sync" && changes.blockedSites) {
    updateRules();
  }
});
