import { useState } from 'react'
import { useCalendarEvents } from '../../hooks/useCalendarEvents'
import { useIdleTimer } from '../../hooks/useIdleTimer'
import { LeftPanel } from './LeftPanel'
import { RightPanel } from './RightPanel'
import { Screensaver } from '../screensaver/Screensaver'
import { useCallback } from 'react'

const IDLE_TIMEOUT_MS = 5 * 60 * 1000

export function CalendarLayout() {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [isIdle, setIsIdle] = useState(false)

  useCalendarEvents(currentMonth)

  const handleIdle = useCallback(() => setIsIdle(true), [])
  const handleActive = useCallback(() => {}, [])

  useIdleTimer(IDLE_TIMEOUT_MS, handleIdle, handleActive)

  return (
    <>
      <div className="flex w-full bg-slate-50 dark:bg-gray-950 text-slate-800 dark:text-slate-100 overflow-hidden font-sans" style={{ height: 'calc(100dvh - var(--header-height, 0px))' }}>
        <aside className="hidden md:flex w-56 lg:w-64 flex-shrink-0 border-r border-slate-200 dark:border-slate-800 flex-col bg-white dark:bg-gray-950">
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
