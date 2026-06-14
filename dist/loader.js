// WallCal loader — dynamically imports main.js with a fresh timestamp on every
// load so the HA App's WebView cache is always bypassed. Deploy this file once
// and set module_url to /local/wallcal/loader.js — you never need to touch
// configuration.yaml again after that.
const base = new URL('.', import.meta.url).href
import(base + 'main.js?_t=' + Date.now())
