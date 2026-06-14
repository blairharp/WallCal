import { useState } from 'react'
import { useCalendarEvents } from '../../hooks/useCalendarEvents'
import { useIdleTimer } from '../../hooks/useIdleTimer'
import { LeftPanel } from './LeftPanel'
import { RightPanel } from './RightPanel'
import { Screensaver } from '../screensaver/Screensaver'
import { useCallback } from 'react'

const IDLE_TIMEOUT_MS = 5 * 60 * 1000 // 5 minutes

export function CalendarLayout() {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [isIdle, setIsIdle] = useState(false)

  useCalendarEvents(currentMonth)

  const handleIdle = useCallback(() => setIsIdle(true), [])
  const handleActive = useCallback(() => {}, [])

  useIdleTimer(IDLE_TIMEOUT_MS, handleIdle, handleActive)

  return (
    <>
      <div className="flex h-full w-full bg-gray-950 text-white overflow-hidden font-sans">
        <aside className="w-72 flex-shrink-0 border-r border-slate-800 flex flex-col">
          <LeftPanel />
        </aside>
        <main className="flex-1 flex flex-col overflow-hidden">
          <RightPanel
            currentMonth={currentMonth}
            onMonthChange={setCurrentMonth}
          />
        </main>
      </div>
      {isIdle && <Screensaver onInteraction={() => setIsIdle(false)} />}
    </>
  )
}
