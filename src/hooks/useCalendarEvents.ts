import { useEffect, useCallback, useRef } from 'react'
import { startOfMonth, endOfMonth, addMonths, subMonths } from 'date-fns'
import { useHAStore } from '../store/haStore'
import { useCalendarStore } from '../store/calendarStore'
import { getCalendarColor } from '../utils/calendarColors'
import { CalendarEvent } from '../types/calendar'
import { Connection } from 'home-assistant-js-websocket'

export function useCalendarEvents(currentMonth: Date) {
  const connection = useHAStore(s => s.connection)
  const entities = useHAStore(s => s.entities)
  const { setEvents, refreshToken } = useCalendarStore()
  // Track whether the WS command is supported so we skip it after first failure
  const wsUnsupported = useRef(false)

  const calendarEntityIds = Object.keys(entities).filter(id =>
    id.startsWith('calendar.')
  )

  const fetchEvents = useCallback(async () => {
    if (!connection || calendarEntityIds.length === 0) return

    const start = startOfMonth(subMonths(currentMonth, 1))
    const end = endOfMonth(addMonths(currentMonth, 1))
    const allEvents: CalendarEvent[] = []

    for (const entityId of calendarEntityIds) {
      let raw: RawHAEvent[] | null = null

      if (!wsUnsupported.current) {
        try {
          const result = await connection.sendMessagePromise({
            type: 'calendar/get_events',
            entity_id: entityId,
            start_date_time: start.toISOString(),
            end_date_time: end.toISOString(),
          }) as { events: RawHAEvent[] }
          raw = result.events
        } catch (err: any) {
          if (err?.code === 'unknown_command') {
            wsUnsupported.current = true
          } else {
            console.warn(`[WallCal] Failed to fetch events for ${entityId}:`, err)
            continue
          }
        }
      }

      if (raw === null && wsUnsupported.current) {
        raw = await fetchViaREST(connection, entityId, start, end)
      }

      if (raw === null) continue

      const color = getCalendarColor(entityId)
      const normalized: CalendarEvent[] = raw.map((e, i) => ({
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
    }

    setEvents(allEvents)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connection, calendarEntityIds.join(','), currentMonth.getMonth(), currentMonth.getFullYear(), refreshToken])

  useEffect(() => {
    fetchEvents()
  }, [fetchEvents])
}

async function fetchViaREST(
  connection: Connection,
  entityId: string,
  start: Date,
  end: Date,
): Promise<RawHAEvent[] | null> {
  try {
    // Extract HA URL + token from the connection auth object (home-assistant-js-websocket)
    const auth = (connection as any).options?.auth
    const hassUrl: string = auth?.hassUrl ?? ''
    const token: string = auth?.accessToken ?? ''

    const startISO = start.toISOString()
    const endISO = end.toISOString()
    const url = `${hassUrl}/api/calendars/${entityId}?start=${encodeURIComponent(startISO)}&end=${encodeURIComponent(endISO)}`

    const headers: Record<string, string> = {}
    if (token) headers['Authorization'] = `Bearer ${token}`

    const resp = await fetch(url, { headers, credentials: 'include' })
    if (!resp.ok) {
      console.warn(`[WallCal] REST calendar fetch failed for ${entityId}: HTTP ${resp.status}`)
      return null
    }

    const data = await resp.json()
    // Normalise older HA REST response (dtstart/dtend strings) to WS shape
    return (data as RawRestEvent[]).map(e => ({
      summary: e.summary,
      description: e.description,
      location: e.location,
      start: parseRestTime(e.start ?? e.dtstart),
      end: parseRestTime(e.end ?? e.dtend),
    }))
  } catch (err) {
    console.warn(`[WallCal] REST calendar fetch error for ${entityId}:`, err)
    return null
  }
}

function parseRestTime(value: unknown): { dateTime?: string; date?: string } | undefined {
  if (!value) return undefined
  if (typeof value === 'object') return value as { dateTime?: string; date?: string }
  if (typeof value === 'string') {
    // All-day if no time component (YYYYMMDD or YYYY-MM-DD)
    return /^\d{4}-?\d{2}-?\d{2}$/.test(value)
      ? { date: value }
      : { dateTime: value }
  }
  return undefined
}

interface RawHAEvent {
  summary?: string
  description?: string
  location?: string
  start?: { dateTime?: string; date?: string }
  end?: { dateTime?: string; date?: string }
}

interface RawRestEvent {
  summary?: string
  description?: string
  location?: string
  // Newer HA REST format (same structure as WS)
  start?: { dateTime?: string; date?: string } | string
  end?: { dateTime?: string; date?: string } | string
  // Older HA REST format (iCal-like)
  dtstart?: string
  dtend?: string
}
