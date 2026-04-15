import { useState } from "preact/hooks";
import ListItem from "./ListItem.tsx";

// function refreshList(sites) {
//   list.innerHTML = "";
//   sites.forEach((site, index) => {
//     const li = document.createElement("li");
//     li.textContent = site;

//     const remove = document.createElement("button");
//     remove.textContent = "Remove";
//     remove.style.marginLeft = "10px";
//     remove.onclick = () => removeSite(index);

//     li.appendChild(remove);
//     list.appendChild(li);
//   });
// }
function getSites () {
  let sites = []
  chrome.storage.sync.get("blockedSites", (data) => {
    sites = data.blockedSites;
    sites = (typeof sites == 'object') ? [] : sites;
    
  });

  return sites;
}
function saveSites (sites) {
  console.log( 'saving sites: ', sites)
  chrome.storage.sync.set({ blockedSites: sites });
  // refreshList(sites);
}
function removeSite(index) {
  chrome.storage.sync.get("blockedSites", (data) => {
    const sites = data.blockedSites || [];
    sites.splice(index, 1);
    saveSites(sites);
  });
}

export default function App() {

  const [siteInput, setSiteInput] = useState('google.com');

  const getCurrentSites = getSites();
  const { list, setList } = useState(getCurrentSites);

  console.log(getCurrentSites, list);

  const saveSite = () => {
    const site = siteInput.trim();
    if (!site) return;

    console.log( site )

    chrome.storage.sync.get("blockedSites", (data) => {
      let sites = getSites();
      

      console.log( 'current sites:' , sites, typeof sites)
      if (!sites.includes(site)) {

        sites.push(site);
        console.log('afterpush: ', sites)
        saveSites(sites);
      }
      setSiteInput('');
    });
  }

  

  return (
    <div>

      <h2>Blocked Sites</h2>
      <input type="text" id="siteInput" placeholder="e.g., youtube.com" value={siteInput} onInput={e => setSiteInput(e.target.value)} />
      <button id="addBtn" onClick={saveSite}>Add</button>

      <ul id="siteList">
        <li>{ siteInput }</li>
        { list.map( ({ site, index }) => (<ListItem />) ) }
      </ul>

    </div>
  );
}