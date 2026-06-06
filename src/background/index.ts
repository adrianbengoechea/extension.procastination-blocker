console.log("> background worker: init");

const BLOCKED_PAGE = "/src/blocked-site/index.html";
const RULE_ID_BASE = 1;

function normalize(site: string) {
  console.log("> background worker: normalize", site);
  return site
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .trim();
}

function updateRules() {
  console.log("> background worker: updateRules");
  chrome.storage.sync.get("blockedSites", ({ blockedSites = [] }) => {
    console.log("> background worker: blockedSites: ", blockedSites);

    chrome.declarativeNetRequest.getDynamicRules((existingRules) => {
      const removeRuleIds = existingRules.map((r) => r.id);

      const addRules = blockedSites.map((site, index) => {
        const clean = normalize(site);

        console.log(
          "> background worker: addRules: ",
          site,
          index,
          existingRules,
          RULE_ID_BASE + index,
        );

        return {
          id: RULE_ID_BASE + index,
          priority: 1,
          action: {
            type: "redirect",
            redirect: {
              extensionPath: BLOCKED_PAGE,
            },
          },
          condition: {
            regexFilter: `^https?:\\/\\/([^\\/]+\\.)?${clean}(/|$)`,
            resourceTypes: ["main_frame", "sub_frame"],
          },
        };
      });

      const updateDynamicRules =
        chrome.declarativeNetRequest.updateDynamicRules({
          removeRuleIds,
          addRules,
        });

      updateDynamicRules.then((r) => {
        console.log(
          "> background worker: updateDynamicRules",
          updateDynamicRules,
          r,
        );
      });
    });
  });
}

chrome.runtime.onInstalled.addListener(updateRules);
chrome.storage.onChanged.addListener(updateRules);
