import { CalendarEvent } from '../../types/calendar'
import { formatEventTime } from '../../utils/dateHelpers'
import { useCalendarStore } from '../../store/calendarStore'

interface EventPillProps {
  event: CalendarEvent
  compact?: boolean
}

export function EventPill({ event, compact = false }: EventPillProps) {
  const setSelectedEvent = useCalendarStore(s => s.setSelectedEvent)

  if (compact) {
    return (
      <button
        onClick={(e) => { e.stopPropagation(); setSelectedEvent(event) }}
        title={event.title}
        style={{
          width: '100%',
          textAlign: 'left',
          borderRadius: '4px',
          padding: '1px 6px',
          fontSize: '0.7rem',
          fontWeight: 500,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          background: event.color + '30',
          color: event.color,
          borderLeft: `3px solid ${event.color}`,
          cursor: 'pointer',
          border: 'none',
          display: 'block',
        }}
      >
        {event.title}
      </button>
    )
  }

  return (
    <button
      onClick={(e) => { e.stopPropagation(); setSelectedEvent(event) }}
      title={event.title}
      style={{
        width: '100%',
        textAlign: 'left',
        borderRadius: '6px',
        padding: '4px 8px',
        background: event.color + '25',
        borderLeft: `3px solid ${event.color}`,
        cursor: 'pointer',
        border: 'none',
        overflow: 'hidden',
        display: 'block',
      }}
    >
      {!event.allDay && (
        <div style={{ fontSize: '0.65rem', color: event.color, fontWeight: 600, opacity: 0.9 }}>
          {formatEventTime(event.start)}
        </div>
      )}
      <div style={{ fontSize: '0.75rem', fontWeight: 500, color: '#e2e8f0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {event.title}
      </div>
    </button>
  )
}
