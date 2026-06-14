import { useEffect, useCallback } from 'react'
import { startOfMonth, endOfMonth, addMonths, subMonths, formatISO } from 'date-fns'
import { useHAStore } from '../store/haStore'
import { useCalendarStore } from '../store/calendarStore'
import { getCalendarColor } from '../utils/calendarColors'
import { CalendarEvent } from '../types/calendar'

export function useCalendarEvents(currentMonth: Date) {
  const connection = useHAStore(s => s.connection)
  const entities = useHAStore(s => s.entities)
  const { setEvents } = useCalendarStore()

  const calendarEntityIds = Object.keys(entities).filter(id =>
    id.startsWith('calendar.')
  )

  const fetchEvents = useCallback(async () => {
    if (!connection || calendarEntityIds.length === 0) return

    const start = startOfMonth(subMonths(currentMonth, 1))
    const end = endOfMonth(addMonths(currentMonth, 1))

    const allEvents: CalendarEvent[] = []

    for (const entityId of calendarEntityIds) {
      try {
        const result = await connection.sendMessagePromise({
          type: 'calendar/get_events',
          entity_id: entityId,
          start_date_time: formatISO(start),
          end_date_time: formatISO(end),
        }) as { events: RawHAEvent[] }

        const color = getCalendarColor(entityId)

        const normalized: CalendarEvent[] = result.events.map((e, i) => ({
          id: `${entityId}-${e.start?.dateTime || e.start?.date}-${e.summary || ''}-${i}`,
          title: e.summary || 'Untitled',
          start: new Date(e.start?.dateTime || e.start?.date || ''),
          end: new Date(e.end?.dateTime || e.end?.date || ''),
          allDay: !e.start?.dateTime,
          calendarEntityId: entityId,
          color,
          description: e.description,
          location: e.location,
        }))

        allEvents.push(...normalized)
      } catch (err) {
        console.warn(`[WallCal] Failed to fetch events for ${entityId}:`, err)
      }
    }

    setEvents(allEvents)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connection, calendarEntityIds.join(','), currentMonth.getMonth(), currentMonth.getFullYear()])

  useEffect(() => {
    fetchEvents()
  }, [fetchEvents])
}

interface RawHAEvent {
  summary?: string
  description?: string
  location?: string
  start?: { dateTime?: string; date?: string }
  end?: { dateTime?: string; date?: string }
}
