const RULE_ID_BASE = 1;

function normalize(site) {
  return site
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .trim();
}

function updateRules() {
  chrome.storage.sync.get("blockedSites", ({ blockedSites = [] }) => {
    chrome.declarativeNetRequest.getDynamicRules((existingRules) => {
      const removeRuleIds = existingRules.map(r => r.id);

      const addRules = blockedSites.map((site, index) => {
        const clean = normalize(site);

        return {
          id: RULE_ID_BASE + index,
          priority: 1,
          action: {
  type: "redirect",
  redirect: {
    extensionPath: "/blocked.html"
  }
},
          condition: {
            regexFilter: `^https?:\\/\\/([^\\/]+\\.)?${clean}(/|$)`,
            resourceTypes: ["main_frame", "sub_frame"]
          }
        };
      });

      chrome.declarativeNetRequest.updateDynamicRules({
        removeRuleIds,
        addRules
      });
    });
  });
}

chrome.runtime.onInstalled.addListener(updateRules);
chrome.storage.onChanged.addListener(updateRules);
