import { useCalendarStore } from '../../store/calendarStore'
import { isAfter, isSameDay } from 'date-fns'
import { formatEventTime, formatShortDate } from '../../utils/dateHelpers'

export function UpcomingList() {
  const events = useCalendarStore(s => s.events)
  const now = new Date()

  const upcoming = events
    .filter(e => isAfter(e.end, now))
    .sort((a, b) => a.start.getTime() - b.start.getTime())
    .slice(0, 5)

  if (upcoming.length === 0) {
    return (
      <div className="px-4 py-3">
        <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Upcoming</p>
        <p className="text-sm text-slate-600">No upcoming events</p>
      </div>
    )
  }

  return (
    <div className="px-4 py-3 flex-1 overflow-y-auto">
      <p className="text-xs text-slate-500 uppercase tracking-wider mb-3">Upcoming</p>
      <div className="flex flex-col gap-3">
        {upcoming.map(event => {
          const isToday = isSameDay(event.start, now)
          const dateLabel = isToday ? 'Today' : formatShortDate(event.start)
          return (
            <div key={event.id} className="flex gap-2">
              <div
                className="w-1 rounded-full flex-shrink-0 mt-1"
                style={{ backgroundColor: event.color, minHeight: '2rem' }}
              />
              <div className="min-w-0">
                <p className="text-sm text-slate-200 font-medium truncate">{event.title}</p>
                <p className="text-xs text-slate-500">
                  {dateLabel}
                  {!event.allDay && ` · ${formatEventTime(event.start)}`}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
