import { useEffect } from 'react'
import {
  createConnection,
  createLongLivedTokenAuth,
  subscribeEntities,
  Connection,
  HassEntities,
} from 'home-assistant-js-websocket'
import { useHAStore } from '../store/haStore'

declare global {
  interface Window {
    // HA resolves to { conn, auth } in modern versions; older may resolve to Connection directly.
    hassConnection?: Promise<{ conn: Connection; auth: unknown } | Connection>
  }
}

export function useHA() {
  const { setConnection, setEntities, setConnected, setConnectionError } = useHAStore()

  useEffect(() => {
    async function connect() {
      try {
        let conn: Connection

        if (window.hassConnection) {
          const resolved = await window.hassConnection
          // Handle both API shapes: { conn, auth } or bare Connection
          conn = (resolved as { conn: Connection }).conn ?? (resolved as Connection)
          console.log('[WallCal] hassConnection resolved, conn type:', typeof conn)
        } else {
          const auth = createLongLivedTokenAuth(
            import.meta.env.VITE_HA_URL || 'http://homeassistant.local:8123',
            import.meta.env.VITE_HA_TOKEN || ''
          )
          conn = await createConnection({ auth })
        }

        setConnection(conn)
        setConnected(true)
        setConnectionError(null)
        console.log('[WallCal] connected')

        subscribeEntities(conn, (entities: HassEntities) => {
          setEntities(entities)
        })
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err)
        console.error('[WallCal] Connection failed:', err)
        setConnected(false)
        setConnectionError(msg)
      }
    }

    connect()
  }, [setConnection, setEntities, setConnected, setConnectionError])
}
