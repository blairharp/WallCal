import { create } from 'zustand'
import { Connection, HassEntities } from 'home-assistant-js-websocket'

interface HAStore {
  connection: Connection | null
  entities: HassEntities
  connected: boolean
  connectionError: string | null
  setConnection: (conn: Connection) => void
  setEntities: (entities: HassEntities) => void
  setConnected: (connected: boolean) => void
  setConnectionError: (error: string | null) => void
}

export const useHAStore = create<HAStore>((set) => ({
  connection: null,
  entities: {},
  connected: false,
  connectionError: null,
  setConnection: (connection) => set({ connection }),
  setEntities: (entities) => set({ entities }),
  setConnected: (connected) => set({ connected }),
  setConnectionError: (connectionError) => set({ connectionError }),
}))
