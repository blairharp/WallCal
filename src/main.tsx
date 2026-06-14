import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'

function injectCSS() {
  if (document.querySelector('[data-wallcal-css]')) return
  const link = document.createElement('link')
  link.rel = 'stylesheet'
  // Resolves relative to main.js → /local/wallcal/index.css in production
  link.href = new URL('index.css', import.meta.url).href
  link.setAttribute('data-wallcal-css', '')
  document.head.appendChild(link)
}

class WallCalPanel extends HTMLElement {
  private _root: ReturnType<typeof createRoot> | null = null

  connectedCallback() {
    injectCSS()
    if (this._root) return
    this.style.cssText = 'display:block;width:100%;height:100%;overflow:hidden;'
    const mount = document.createElement('div')
    this.appendChild(mount)
    this._root = createRoot(mount)
    this._root.render(
      <StrictMode>
        <App />
      </StrictMode>
    )
  }

  disconnectedCallback() {
    this._root?.unmount()
    this._root = null
  }
}

customElements.define('wallcal-panel', WallCalPanel)

// Local dev only: index.html provides <div id="root">
const devRoot = document.getElementById('root')
if (devRoot) {
  createRoot(devRoot).render(
    <StrictMode>
      <App />
    </StrictMode>
  )
}
