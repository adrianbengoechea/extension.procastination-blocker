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

function isBlocked(url: string, blockedSites: string[]): boolean {
  const current = new URL(url);
  const currentDomain = current.hostname.replace(/^www\./, "");
  const currentPath = current.pathname;

  return blockedSites.some((site) => {
    const { domain, path } = parseSite(site);
    const domainMatch =
      currentDomain === domain || currentDomain.endsWith(`.${domain}`);
    if (!domainMatch) return false;
    if (path === null || path === "/") return true; // entire domain blocked
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

// Initial check (handles hard navigations that slip past DNR)
checkAndRedirect();

// Watch SPA navigations via history API
const originalPushState = history.pushState.bind(history);
const originalReplaceState = history.replaceState.bind(history);

history.pushState = (...args) => {
  originalPushState(...args);
  checkAndRedirect();
};

history.replaceState = (...args) => {
  originalReplaceState(...args);
  checkAndRedirect();
};

// Catch popstate (back/forward buttons)
window.addEventListener("popstate", checkAndRedirect);
