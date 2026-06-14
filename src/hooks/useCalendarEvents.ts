import { useEffect, useCallback } from 'react'
import { startOfMonth, endOfMonth, addMonths, subMonths } from 'date-fns'
import { useHAStore } from '../store/haStore'
import { useCalendarStore } from '../store/calendarStore'
import { getCalendarColor } from '../utils/calendarColors'
import { getAccessToken } from '../utils/hassAuth'
import { CalendarEvent } from '../types/calendar'

export function useCalendarEvents(currentMonth: Date) {
  const connection = useHAStore(s => s.connection)
  const entities = useHAStore(s => s.entities)
  const { setEvents, refreshToken } = useCalendarStore()

  const calendarEntityIds = Object.keys(entities).filter(id =>
    id.startsWith('calendar.')
  )

  const fetchEvents = useCallback(async () => {
    if (!connection || calendarEntityIds.length === 0) return

    const token = await getAccessToken()
    if (!token) {
      console.warn('[WallCal] No access token available yet, skipping fetch')
      return
    }

    const start = startOfMonth(subMonths(currentMonth, 1))
    const end = endOfMonth(addMonths(currentMonth, 1))
    const startISO = start.toISOString()
    const endISO = end.toISOString()

    const allEvents: CalendarEvent[] = []

    for (const entityId of calendarEntityIds) {
      try {
        const response = await fetch(
          `/api/calendars/${entityId}?start=${startISO}&end=${endISO}`,
          { headers: { Authorization: `Bearer ${token}` } }
        )

        if (!response.ok) {
          console.warn(`[WallCal] HTTP ${response.status} fetching ${entityId}`)
          continue
        }

        const rawEvents: RawHAEvent[] = await response.json()
        const color = getCalendarColor(entityId)

        const normalized: CalendarEvent[] = rawEvents.map((e, i) => ({
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
        console.log(`[WallCal] Fetched ${normalized.length} events from ${entityId}`)
      } catch (err) {
        console.warn(`[WallCal] Failed to fetch ${entityId}:`, err)
      }
    }

    setEvents(allEvents)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connection, calendarEntityIds.join(','), currentMonth.getMonth(), currentMonth.getFullYear(), refreshToken])

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
