import { getCalendarWeeks, isToday, isSameMonth, isSameDay } from '../../utils/dateHelpers'
import { useCalendarStore } from '../../store/calendarStore'
import { CalendarEvent } from '../../types/calendar'
import { EventPill } from './EventPill'

interface MonthGridProps {
  month: Date
}

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export function MonthGrid({ month }: MonthGridProps) {
  const events = useCalendarStore(s => s.events)
  const weeks = getCalendarWeeks(month)

  function eventsForDay(day: Date): CalendarEvent[] {
    return events
      .filter(e => isSameDay(e.start, day) || (e.allDay && isSameDay(e.start, day)))
      .sort((a, b) => {
        if (a.allDay && !b.allDay) return -1
        if (!a.allDay && b.allDay) return 1
        return a.start.getTime() - b.start.getTime()
      })
  }

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-950">
      {/* Day name header */}
      <div className="grid grid-cols-7 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
        {DAY_NAMES.map(name => (
          <div key={name} className="py-2 text-center text-xs text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wider">
            {name}
          </div>
        ))}
      </div>

      {/* Weeks */}
      <div className="flex-1 grid" style={{ gridTemplateRows: `repeat(${weeks.length}, 1fr)` }}>
        {weeks.map((week, wi) => (
          <div key={wi} className="grid grid-cols-7 border-b border-slate-100 dark:border-slate-800 last:border-0">
            {week.map((day, di) => {
              const dayEvents = eventsForDay(day)
              const inMonth = isSameMonth(day, month)
              const today = isToday(day)

              return (
                <div
                  key={di}
                  className={`border-r border-slate-100 dark:border-slate-800 last:border-0 p-1 min-h-0 flex flex-col ${
                    !inMonth ? 'opacity-40' : ''
                  }`}
                >
                  <div className="flex justify-center mb-1">
                    <span
                      className={`w-7 h-7 flex items-center justify-center rounded-full text-sm font-medium ${
                        today
                          ? 'bg-blue-500 text-white'
                          : 'text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      {day.getDate()}
                    </span>
                  </div>
                  <div className="flex flex-col gap-0.5 overflow-hidden">
                    {dayEvents.slice(0, 3).map(event => (
                      <EventPill key={event.id} event={event} compact />
                    ))}
                    {dayEvents.length > 3 && (
                      <span className="text-xs text-slate-400 dark:text-slate-500 pl-1">
                        +{dayEvents.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}
