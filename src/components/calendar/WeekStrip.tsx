import { getWeekDays, isToday, isSameDay } from '../../utils/dateHelpers'
import { useCalendarStore } from '../../store/calendarStore'
import { CalendarEvent } from '../../types/calendar'
import { EventPill } from './EventPill'
import { format } from 'date-fns'

interface WeekStripProps {
  week: Date
}

export function WeekStrip({ week }: WeekStripProps) {
  const events = useCalendarStore(s => s.events)
  const days = getWeekDays(week)

  function eventsForDay(day: Date): CalendarEvent[] {
    return events
      .filter(e => isSameDay(e.start, day))
      .sort((a, b) => {
        if (a.allDay && !b.allDay) return -1
        if (!a.allDay && b.allDay) return 1
        return a.start.getTime() - b.start.getTime()
      })
  }

  return (
    <div className="grid grid-cols-7 h-full" style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', height: '100%' }}>
      {days.map((day, i) => {
        const dayEvents = eventsForDay(day)
        const today = isToday(day)

        return (
          <div key={i} className="border-r border-slate-800 last:border-0 flex flex-col" style={{ borderRight: '1px solid #1e293b', display: 'flex', flexDirection: 'column' }}>
            {/* Day header */}
            <div className="flex flex-col items-center py-3 border-b border-slate-800">
              <span className="text-xs text-slate-500 uppercase tracking-wider">
                {format(day, 'EEE')}
              </span>
              <span
                className={`mt-1 w-9 h-9 flex items-center justify-center rounded-full text-lg font-light ${
                  today ? 'bg-blue-500 text-white' : 'text-slate-200'
                }`}
              >
                {day.getDate()}
              </span>
            </div>

            {/* Events */}
            <div className="flex-1 p-1 flex flex-col gap-1 overflow-y-auto" style={{ flex: 1, padding: '0.25rem', display: 'flex', flexDirection: 'column', gap: '0.25rem', overflowY: 'auto' }}>
              {dayEvents.map(event => (
                <EventPill key={event.id} event={event} />
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
