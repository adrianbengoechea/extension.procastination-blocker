# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Procrastination Blocker — a Chromium extension (Manifest V3) that blocks distracting websites by redirecting them to a custom blocked page. Built with vanilla JavaScript, no frameworks or dependencies.

## Development

There is **no build process, no package.json, and no dependencies**. Development is done by loading the extension directly in the browser.

### Loading the Extension
1. Navigate to `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked" and select this folder
4. After code changes, click the refresh icon on the extension card

### Testing
No test framework is configured. All testing is manual — load the extension, add sites to the block list via the options page, and verify navigation to those sites redirects to `blocked.html`.

## Architecture

The extension has 4 core files plus the manifest:

**Data flow:**
```
options.js saves to chrome.storage.sync
  → chrome.storage.onChanged fires
  → background.js rebuilds declarativeNetRequest rules
  → navigating to a blocked domain redirects to blocked.html
```

**`background.js`** — Service worker. Listens for install and storage-change events, then rebuilds dynamic redirect rules using `chrome.declarativeNetRequest`. The `normalize()` function strips protocols and `www.` prefixes. Rules use regex to match domains including subdomains.

**`options.js`** — Options page logic. Manages the blocked sites list stored in `chrome.storage.sync` as `{ blockedSites: string[] }`. Handles add/remove operations and re-renders the list.

**`options.html`** / **`blocked.html`** — UI pages with inline CSS. Options page has an input + button for adding sites and a dynamic list. Blocked page shows a static "site blocked" message.

**`manifest.json`** — Manifest V3. Permissions: `storage`, `declarativeNetRequest`, `<all_urls>`.

## Code Conventions

- Vanilla JavaScript (no transpilation, no modules)
- Double quotes, 2-space indentation, semicolons
- Chrome API calls use callbacks (not async/await)
- DOM manipulation via `getElementById` / `createElement`
- No linter or formatter configured
