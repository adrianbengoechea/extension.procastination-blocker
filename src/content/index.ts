import type { Site } from "../interfaces/site";

const BLOCKED_PAGE = chrome.runtime.getURL("src/blocked-site/index.html");

interface ParsedSite {
  domain: string;
  path: string | null;
}

function parseSite(site: string): ParsedSite {
  const withoutProtocol = site
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "");
  const slashIndex = withoutProtocol.indexOf("/");
  if (slashIndex === -1) return { domain: withoutProtocol.trim(), path: null };
  return {
    domain: withoutProtocol.slice(0, slashIndex).trim(),
    path: withoutProtocol.slice(slashIndex).trim(),
  };
}

function isBlocked(url: string, blockedSites: Site[]): boolean {
  const current = new URL(url);
  const currentDomain = current.hostname.replace(/^www\./, "");
  const currentPath = current.pathname;

  const activeBlockedSites = blockedSites.filter((el, i) => el.active);

  return activeBlockedSites.some((site) => {
    const { domain, path } = parseSite(site.url);
    const domainMatch =
      currentDomain === domain || currentDomain.endsWith(`.${domain}`);
    if (!domainMatch) return false;
    if (path === null || path === "/") return true;
    return (
      currentPath === path ||
      currentPath.startsWith(`${path}/`) ||
      currentPath.startsWith(`${path}?`)
    );
  });
}

function checkAndRedirect() {
  chrome.storage.sync.get("blockedSites", ({ blockedSites = [] }) => {
    if (isBlocked(window.location.href, blockedSites)) {
      window.location.replace(BLOCKED_PAGE);
    }
  });
}

let lastUrl = window.location.href;

function onUrlChange() {
  if (window.location.href === lastUrl) return;
  lastUrl = window.location.href;
  checkAndRedirect();
}

const originalPushState = history.pushState.bind(history);
const originalReplaceState = history.replaceState.bind(history);

history.pushState = (...args) => {
  originalPushState(...args);
  onUrlChange();
};
history.replaceState = (...args) => {
  originalReplaceState(...args);
  onUrlChange();
};

window.addEventListener("popstate", onUrlChange);

setInterval(onUrlChange, 250);

checkAndRedirect();
