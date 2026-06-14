import { useHA } from './hooks/useHA'
import { useHAStore } from './store/haStore'
import { CalendarLayout } from './components/layout/CalendarLayout'

export default function App() {
  useHA()
  const connected = useHAStore(s => s.connected)

  if (!connected) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-950 text-white">
        <div className="text-center">
          <div className="text-5xl mb-4">📅</div>
          <p className="text-xl text-slate-400">Connecting to Home Assistant…</p>
        </div>
      </div>
    )
  }

  return <CalendarLayout />
}
