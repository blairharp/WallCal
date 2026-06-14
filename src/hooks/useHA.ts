import { useEffect } from 'react'
import {
  createConnection,
  createLongLivedTokenAuth,
  subscribeEntities,
  HassEntities,
} from 'home-assistant-js-websocket'
import { useHAStore } from '../store/haStore'

export function useHA() {
  const { setConnection, setEntities, setConnected } = useHAStore()

  useEffect(() => {
    // When running as an HA panel, the hass property setter in main.tsx
    // provides the connection and entities — no need to connect here.
    if ((window as any).__wallcalHAPanel) return

    // Dev mode: connect via long-lived access token
    async function connect() {
      try {
        const auth = createLongLivedTokenAuth(
          import.meta.env.VITE_HA_URL || 'http://homeassistant.local:8123',
          import.meta.env.VITE_HA_TOKEN || ''
        )
        const conn = await createConnection({ auth })
        setConnection(conn)
        setConnected(true)
        console.log('[WallCal] dev mode connected')

        subscribeEntities(conn, (entities: HassEntities) => {
          setEntities(entities)
        })
      } catch (err) {
        console.error('[WallCal] dev connection failed:', err)
        setConnected(false)
      }
    }

    connect()
  }, [setConnection, setEntities, setConnected])
}
