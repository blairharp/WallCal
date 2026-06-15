import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// Import the (Tailwind-processed) CSS as a string so we can inject it into the
// element's own root node. HA mounts panels inside a shadow DOM, so a <style>
// in document.head never reaches our app — it must live in the same root.
import appCss from './index.css?inline'
import App from './App'

// Inject the stylesheet into the container's root node (a ShadowRoot when HA
// mounts us in shadow DOM, otherwise document.head). A <style> applies to its
// entire containing tree regardless of where it sits, so this covers both
// shadow-DOM panel mode and standalone document mode.
function injectStyles(container: HTMLElement) {
  const rootNode = container.getRootNode()
  const target: Node = rootNode instanceof ShadowRoot ? rootNode : document.head
  const flag = '__wallcalStyled'
  if ((target as unknown as Record<string, unknown>)[flag]) return
  ;(target as unknown as Record<string, unknown>)[flag] = true
  const style = document.createElement('style')
  style.textContent = appCss
  target.appendChild(style)
}

function mountApp(container: HTMLElement) {
  injectStyles(container)
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
      // height:100% alone doesn't reliably resolve when the HA panel
      // container uses flex without an explicit height. Use the HA CSS
      // custom property to compute the true available height instead.
      this.style.cssText =
        'display:block;width:100%;' +
        'height:calc(100dvh - var(--header-height, 0px));' +
        'overflow:hidden;'
      console.log('[WallCal] element size after mount:',
        this.offsetWidth, 'x', this.offsetHeight)
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
