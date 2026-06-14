import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'

function mountApp(container: HTMLElement) {
  createRoot(container).render(
    <StrictMode><App /></StrictMode>
  )
}

// Standalone mode: index.html provides #root
const standaloneRoot = document.getElementById('root')
if (standaloneRoot) {
  mountApp(standaloneRoot)
} else {
  // HA panel mode (module_url): register as a custom element.
  //
  // HA creates document.createElement(name) where `name` is the panel's name
  // field in configuration.yaml, then appends it to the panel shadow DOM.
  // The URL path when viewing a panel is /<name>, so we derive the element
  // name from the current path — this avoids hard-coding a name that must
  // match configuration.yaml.
  const panelName = window.location.pathname.split('/').filter(Boolean)[0] ?? ''
  const candidates = panelName.includes('-')
    ? [panelName, 'wallcal-panel']
    : ['wallcal-panel', 'wall-cal']

  class WallCalElement extends HTMLElement {
    connectedCallback() {
      if (this.dataset.mounted) return
      this.dataset.mounted = '1'
      const root = document.createElement('div')
      root.style.cssText = 'width:100%;height:100%;overflow:hidden;'
      this.appendChild(root)
      mountApp(root)
    }
  }

  let registered = false
  for (const name of candidates) {
    if (!customElements.get(name)) {
      try {
        customElements.define(name, WallCalElement)
        console.log(`[WallCal] registered custom element <${name}>`)
        registered = true
        break
      } catch (e) {
        console.warn(`[WallCal] could not register <${name}>:`, e)
      }
    } else {
      registered = true // already registered from a previous navigation
      break
    }
  }

  // Last resort: if no custom element slot was found, mount directly to body.
  // This happens when the panel name has no hyphen (e.g. name: wallcal) and
  // the HA version doesn't upgrade unknown elements.
  if (!registered) {
    const root = document.createElement('div')
    root.style.cssText = 'width:100%;height:100%;overflow:hidden;'
    document.body.appendChild(root)
    mountApp(root)
  }
}
