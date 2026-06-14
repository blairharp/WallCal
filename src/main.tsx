import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { useHAStore } from './store/haStore'
import { Connection, HassEntities } from 'home-assistant-js-websocket'

function injectCSS() {
  if (document.querySelector('[data-wallcal-css]')) return
  const link = document.createElement('link')
  link.rel = 'stylesheet'
  link.href = '/local/wallcal/index.css'
  link.setAttribute('data-wallcal-css', '')
  document.head.appendChild(link)
}

class WallCalPanel extends HTMLElement {
  private _root: ReturnType<typeof createRoot> | null = null

  // HA calls this setter on mount and on every state change
  set hass(value: { connection: Connection; states: HassEntities } | undefined) {
    if (!value) return
    const store = useHAStore.getState()

    // Grab the connection once for sendMessagePromise (calendar fetching)
    if (!store.connected && value.connection) {
      store.setConnection(value.connection)
      store.setConnected(true)
      console.log('[WallCal] connected via hass.connection')
    }

    // hass.states is the live entity map — update on every HA state change
    if (value.states) {
      store.setEntities(value.states)
    }
  }

  connectedCallback() {
    console.log('[WallCal] panel mounting')
    injectCSS()
    if (this._root) return

    // Signal to useHA.ts that we're inside an HA panel — skip its own connect logic
    ;(window as any).__wallcalHAPanel = true

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
    ;(window as any).__wallcalHAPanel = false
    this._root?.unmount()
    this._root = null
  }
}

customElements.define('wallcal-panel', WallCalPanel)
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
