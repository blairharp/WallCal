import { CalendarEvent } from '../../types/calendar'
import { formatEventTime } from '../../utils/dateHelpers'
import { useCalendarStore } from '../../store/calendarStore'

interface EventPillProps {
  event: CalendarEvent
  compact?: boolean
}

export function EventPill({ event, compact = false }: EventPillProps) {
  const setSelectedEvent = useCalendarStore(s => s.setSelectedEvent)

  return (
    <button
      onClick={(e) => { e.stopPropagation(); setSelectedEvent(event) }}
      className="w-full text-left rounded-md px-2 py-1 text-xs font-semibold truncate transition-opacity hover:opacity-90 active:opacity-75"
      style={{
        backgroundColor: event.color + '28',
        color: event.color,
        borderLeft: `3px solid ${event.color}`,
      }}
      title={event.title}
    >
      {!compact && !event.allDay && (
        <span className="mr-1 opacity-75">{formatEventTime(event.start)}</span>
      )}
      {event.title}
    </button>
  )
}
