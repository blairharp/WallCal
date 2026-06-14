import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'

function injectCSS() {
  if (document.querySelector('[data-wallcal-css]')) return
  const link = document.createElement('link')
  link.rel = 'stylesheet'
  // Hardcoded to match the Vite base path /local/wallcal/
  link.href = '/local/wallcal/index.css'
  link.setAttribute('data-wallcal-css', '')
  document.head.appendChild(link)
  console.log('[WallCal] CSS injected from /local/wallcal/index.css')
}

class WallCalPanel extends HTMLElement {
  private _root: ReturnType<typeof createRoot> | null = null

  connectedCallback() {
    console.log('[WallCal] custom element connected, mounting React app')
    injectCSS()
    if (this._root) return

    // Use position:fixed so we fill the viewport regardless of HA's panel
    // container height. The sidebar/topbar sit above us in z-order via HA.
    this.style.cssText = 'display:block;position:fixed;inset:0;z-index:0;'

    const mount = document.createElement('div')
    mount.style.cssText = 'width:100%;height:100%;'
    this.appendChild(mount)

    this._root = createRoot(mount)
    this._root.render(
      <StrictMode>
        <App />
      </StrictMode>
    )
    console.log('[WallCal] React app mounted')
  }

  disconnectedCallback() {
    console.log('[WallCal] custom element disconnected')
    this._root?.unmount()
    this._root = null
  }
}

customElements.define('wallcal-panel', WallCalPanel)
console.log('[WallCal] wallcal-panel custom element registered')

// Local dev only: index.html provides <div id="root">
const devRoot = document.getElementById('root')
if (devRoot) {
  createRoot(devRoot).render(
    <StrictMode>
      <App />
    </StrictMode>
  )
}
