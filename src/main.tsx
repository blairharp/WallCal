import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { useHAStore } from './store/haStore'
import { Connection, HassEntities } from 'home-assistant-js-websocket'
import { setHassAuth } from './utils/hassAuth'

function injectCSS() {
  if (document.querySelector('[data-wallcal-css]')) {
    console.log('[WallCal] CSS already present, skipping inject')
    return
  }
  const link = document.createElement('link')
  link.rel = 'stylesheet'
  link.href = '/local/wallcal/index.css'
  link.setAttribute('data-wallcal-css', '')
  link.onload = () => console.log('[WallCal] CSS loaded OK')
  link.onerror = () => console.error('[WallCal] CSS FAILED to load — check /local/wallcal/index.css exists')
  document.head.appendChild(link)
  console.log('[WallCal] CSS link injected')
}

class WallCalPanel extends HTMLElement {
  private _root: ReturnType<typeof createRoot> | null = null

  set hass(value: { connection: Connection; states: HassEntities; auth?: unknown } | undefined) {
    if (!value) return
    const store = useHAStore.getState()

    if (!store.connected && value.connection) {
      store.setConnection(value.connection)
      store.setConnected(true)
      console.log('[WallCal] connected via hass.connection')
      // connection.options.auth is the proper Auth class instance with getValidToken()
      const connAuth = (value.connection as any).options?.auth
      if (connAuth) setHassAuth(connAuth)
    }

    // hass.auth may override with a fresher token (but might be a plain data object)
    if (value.auth) {
      setHassAuth(value.auth)
    }

    if (value.states) {
      store.setEntities(value.states)
    }
  }

  connectedCallback() {
    console.log('[WallCal] panel mounting')
    injectCSS()
    if (this._root) return

    ;(window as any).__wallcalHAPanel = true

    // Fill the HA panel content area naturally (no fixed positioning)
    // Inline background guarantees visibility even before CSS loads
    this.style.cssText = 'display:block;width:100%;min-height:100vh;background:#0f172a;'

    const mount = document.createElement('div')
    mount.style.cssText = 'width:100%;min-height:100vh;'
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
    ;(window as any).__wallcalHAPanel = false
    this._root?.unmount()
    this._root = null
  }
}

if (!customElements.get('wallcal-panel')) {
  customElements.define('wallcal-panel', WallCalPanel)
}
console.log('[WallCal] registered')

// Local dev only: index.html provides <div id="root">
const devRoot = document.getElementById('root')
if (devRoot) {
  createRoot(devRoot).render(
    <StrictMode>
      <App />
    </StrictMode>
  )
}
