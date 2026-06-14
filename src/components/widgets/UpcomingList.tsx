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
      <div className="px-4 py-3" style={{ padding: '0.75rem 1rem' }}>
        <p className="text-xs text-slate-500 uppercase tracking-wider mb-2" style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Upcoming</p>
        <p className="text-sm text-slate-600" style={{ fontSize: '0.875rem', color: '#475569' }}>No upcoming events</p>
      </div>
    )
  }

  return (
    <div className="px-4 py-3 flex-1 overflow-y-auto" style={{ padding: '0.75rem 1rem', flex: 1, overflowY: 'auto' }}>
      <p className="text-xs text-slate-500 uppercase tracking-wider mb-3" style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>
        Upcoming
      </p>
      <div className="flex flex-col gap-3" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {upcoming.map(event => {
          const isToday = isSameDay(event.start, now)
          const dateLabel = isToday ? 'Today' : formatShortDate(event.start)
          return (
            <div key={event.id} className="flex gap-2" style={{ display: 'flex', gap: '0.5rem' }}>
              <div
                className="w-1 rounded-full flex-shrink-0 mt-1"
                style={{ width: '4px', borderRadius: '9999px', flexShrink: 0, marginTop: '0.25rem', backgroundColor: event.color, minHeight: '2rem' }}
              />
              <div className="min-w-0" style={{ minWidth: 0 }}>
                <p className="text-sm text-slate-200 font-medium truncate" style={{ fontSize: '0.875rem', color: '#e2e8f0', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', margin: 0 }}>
                  {event.title}
                </p>
                <p className="text-xs text-slate-500" style={{ fontSize: '0.75rem', color: '#64748b', margin: 0 }}>
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
