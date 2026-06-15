import { useHA } from './hooks/useHA'
import { useHAStore } from './store/haStore'
import { CalendarLayout } from './components/layout/CalendarLayout'

export default function App() {
  useHA()
  const connected = useHAStore(s => s.connected)
  const connectionError = useHAStore(s => s.connectionError)

  if (!connected) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-950 text-white">
        <div className="text-center px-6 max-w-sm">
          <div className="text-5xl mb-4">📅</div>
          {connectionError ? (
            <>
              <p className="text-lg font-semibold text-red-400 mb-2">Connection failed</p>
              <p className="text-sm text-slate-400 font-mono break-all">{connectionError}</p>
            </>
          ) : (
            <p className="text-xl text-slate-400">Connecting to Home Assistant…</p>
          )}
        </div>
      </div>
    )
  }

  return <CalendarLayout />
}
