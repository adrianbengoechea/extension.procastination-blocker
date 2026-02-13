const input = document.getElementById("siteInput");
const addBtn = document.getElementById("addBtn");
const list = document.getElementById("siteList");

function refreshList(sites) {
  list.innerHTML = "";
  sites.forEach((site, index) => {
    const li = document.createElement("li");
    li.textContent = site;

    const remove = document.createElement("button");
    remove.textContent = "Remove";
    remove.style.marginLeft = "10px";
    remove.onclick = () => removeSite(index);

    li.appendChild(remove);
    list.appendChild(li);
  });
}

function saveSites(sites) {
  chrome.storage.sync.set({ blockedSites: sites });
  refreshList(sites);
}

function removeSite(index) {
  chrome.storage.sync.get("blockedSites", (data) => {
    const sites = data.blockedSites || [];
    sites.splice(index, 1);
    saveSites(sites);
  });
}

addBtn.addEventListener("click", () => {
  const site = input.value.trim();
  if (!site) return;

  chrome.storage.sync.get("blockedSites", (data) => {
    const sites = data.blockedSites || [];
    if (!sites.includes(site)) {
      sites.push(site);
      saveSites(sites);
    }
    input.value = "";
  });
});

chrome.storage.sync.get("blockedSites", (data) => {
  refreshList(data.blockedSites || []);
});
