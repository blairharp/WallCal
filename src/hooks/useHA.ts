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
    hassConnection?: Promise<{ conn: Connection; auth: unknown }>
  }
}

export function useHA() {
  const { setConnection, setEntities, setConnected } = useHAStore()

  useEffect(() => {
    async function connect() {
      try {
        let conn: Connection

        if (window.hassConnection) {
          conn = (await window.hassConnection).conn
        } else {
          const auth = createLongLivedTokenAuth(
            import.meta.env.VITE_HA_URL || 'http://homeassistant.local:8123',
            import.meta.env.VITE_HA_TOKEN || ''
          )
          conn = await createConnection({ auth })
        }

        setConnection(conn)
        setConnected(true)
        console.log('[WallCal] connected')

        subscribeEntities(conn, (entities: HassEntities) => {
          setEntities(entities)
        })
      } catch (err) {
        console.error('[WallCal] Connection failed:', err)
        setConnected(false)
      }
    }

    connect()
  }, [setConnection, setEntities, setConnected])
}
