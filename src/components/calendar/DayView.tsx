import { useCalendarStore } from '../../store/calendarStore'
import { isSameDay, formatEventTime } from '../../utils/dateHelpers'

interface DayViewProps {
  day: Date
}

export function DayView({ day }: DayViewProps) {
  const events = useCalendarStore(s => s.events)
  const setSelectedEvent = useCalendarStore(s => s.setSelectedEvent)

  const dayEvents = events
    .filter(e => isSameDay(e.start, day))
    .sort((a, b) => {
      if (a.allDay && !b.allDay) return -1
      if (!a.allDay && b.allDay) return 1
      return a.start.getTime() - b.start.getTime()
    })

  const allDay = dayEvents.filter(e => e.allDay)
  const timed = dayEvents.filter(e => !e.allDay)

  return (
    <div className="flex flex-col h-full overflow-y-auto p-4 gap-4">
      {allDay.length > 0 && (
        <div>
          <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">All Day</p>
          <div className="flex flex-col gap-1">
            {allDay.map(event => (
              <button
                key={event.id}
                onClick={() => setSelectedEvent(event)}
                className="text-left px-3 py-2 rounded-lg text-sm font-medium"
                style={{ backgroundColor: event.color + '33', color: event.color }}
              >
                {event.title}
              </button>
            ))}
          </div>
        </div>
      )}

      {timed.length > 0 && (
        <div className="flex flex-col gap-2">
          {timed.map(event => (
            <button
              key={event.id}
              onClick={() => setSelectedEvent(event)}
              className="text-left flex gap-3 items-start p-3 rounded-lg bg-slate-800/50 hover:bg-slate-800 transition-colors"
            >
              <div
                className="w-1 self-stretch rounded-full flex-shrink-0"
                style={{ backgroundColor: event.color }}
              />
              <div>
                <p className="text-sm font-medium text-slate-100">{event.title}</p>
                <p className="text-xs text-slate-400 mt-0.5">
                  {formatEventTime(event.start)} – {formatEventTime(event.end)}
                </p>
                {event.location && (
                  <p className="text-xs text-slate-500 mt-0.5">{event.location}</p>
                )}
              </div>
            </button>
          ))}
        </div>
      )}

      {dayEvents.length === 0 && (
        <p className="text-slate-600 text-sm">Nothing scheduled</p>
      )}
    </div>
  )
}
