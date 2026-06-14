import { format, addDays, startOfWeek } from 'date-fns'
import { useCalendarStore } from '../../store/calendarStore'
import { CalendarEvent } from '../../types/calendar'
import { isToday, isSameDay } from '../../utils/dateHelpers'

const START_HOUR = 6   // 6 AM
const END_HOUR = 22    // 10 PM
const HOUR_HEIGHT = 64 // px per hour

interface LayoutEvent extends CalendarEvent {
  col: number
  totalCols: number
}

function layoutTimedEvents(events: CalendarEvent[]): LayoutEvent[] {
  const sorted = [...events].sort((a, b) => a.start.getTime() - b.start.getTime())
  const colEnds: number[] = []

  const withCols: LayoutEvent[] = sorted.map(event => {
    let col = colEnds.findIndex(end => end <= event.start.getTime())
    if (col === -1) {
      col = colEnds.length
      colEnds.push(event.end.getTime())
    } else {
      colEnds[col] = event.end.getTime()
    }
    return { ...event, col, totalCols: 0 }
  })

  withCols.forEach(event => {
    let maxCol = event.col
    withCols.forEach(other => {
      if (other !== event && other.start < event.end && other.end > event.start) {
        maxCol = Math.max(maxCol, other.col)
      }
    })
    event.totalCols = maxCol + 1
  })

  return withCols
}

interface WeekStripProps {
  week: Date
}

export function WeekStrip({ week }: WeekStripProps) {
  const events = useCalendarStore(s => s.events)
  const setSelectedEvent = useCalendarStore(s => s.setSelectedEvent)

  const weekStart = startOfWeek(week, { weekStartsOn: 0 })
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))

  const hours = Array.from({ length: END_HOUR - START_HOUR }, (_, i) => START_HOUR + i)
  const gridHeight = hours.length * HOUR_HEIGHT

  function allDayEventsForDay(day: Date): CalendarEvent[] {
    return events.filter(e => e.allDay && isSameDay(e.start, day))
  }

  function timedEventsForDay(day: Date): CalendarEvent[] {
    return events.filter(e => !e.allDay && isSameDay(e.start, day))
  }

  function eventTop(event: CalendarEvent): number {
    const h = event.start.getHours()
    const m = event.start.getMinutes()
    return Math.max(0, (h - START_HOUR + m / 60) * HOUR_HEIGHT)
  }

  function eventHeight(event: CalendarEvent): number {
    const durationMs = event.end.getTime() - event.start.getTime()
    const durationHours = durationMs / (1000 * 60 * 60)
    const top = eventTop(event)
    const rawHeight = durationHours * HOUR_HEIGHT
    return Math.max(Math.min(rawHeight, gridHeight - top), 28)
  }

  const hasAnyAllDay = days.some(d => allDayEventsForDay(d).length > 0)

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-950">
      {/* Day header row — scrolls horizontally with the grid on small screens */}
      <div className="overflow-x-auto flex-shrink-0">
        <div className="flex border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-gray-950 min-w-[560px]">
          <div className="w-10 flex-shrink-0" />
          {days.map((day, i) => {
            const today = isToday(day)
            return (
              <div
                key={i}
                className="flex-1 min-w-[72px] flex flex-col items-center py-2 border-l border-slate-100 dark:border-slate-800 first:border-l-0"
              >
                <span className="text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wide">
                  {format(day, 'EEE')}
                </span>
                <span
                  className={`mt-1 w-8 h-8 flex items-center justify-center rounded-full text-sm font-semibold ${
                    today ? 'bg-blue-500 text-white' : 'text-slate-700 dark:text-slate-200'
                  }`}
                >
                  {day.getDate()}
                </span>
              </div>
            )
          })}
        </div>

        {/* All-day strip */}
        {hasAnyAllDay && (
          <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 min-h-[36px] min-w-[560px]">
            <div className="w-10 flex-shrink-0 flex items-center justify-end pr-1.5">
              <span className="text-xs text-slate-400 dark:text-slate-500">all day</span>
            </div>
            {days.map((day, i) => {
              const allDay = allDayEventsForDay(day)
              return (
                <div key={i} className="flex-1 min-w-[72px] border-l border-slate-100 dark:border-slate-800 first:border-l-0 p-1 flex flex-col gap-0.5">
                  {allDay.map(event => (
                    <button
                      key={event.id}
                      onClick={() => setSelectedEvent(event)}
                      className="w-full text-left rounded-md px-2 py-0.5 text-xs font-semibold truncate"
                      style={{ backgroundColor: event.color + '28', color: event.color }}
                    >
                      {event.title}
                    </button>
                  ))}
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Scrollable time grid */}
      <div className="flex-1 overflow-y-auto overflow-x-auto">
        <div className="flex min-w-[560px]" style={{ height: gridHeight }}>
          {/* Time labels column */}
          <div className="w-10 flex-shrink-0 relative">
            {hours.map((h, i) => (
              <div
                key={h}
                className="absolute right-1.5 text-xs text-slate-400 dark:text-slate-600 font-medium"
                style={{ top: i * HOUR_HEIGHT - 8 }}
              >
                {h === 12 ? '12p' : h < 12 ? `${h}a` : `${h - 12}p`}
              </div>
            ))}
          </div>

          {/* Day columns */}
          {days.map((day, di) => {
            const timed = layoutTimedEvents(timedEventsForDay(day))

            return (
              <div
                key={di}
                className="flex-1 min-w-[72px] border-l border-slate-100 dark:border-slate-800 first:border-l-0 relative"
                style={{ height: gridHeight }}
              >
                {/* Hour grid lines */}
                {hours.map((_, i) => (
                  <div
                    key={i}
                    className="absolute left-0 right-0 border-t border-slate-100 dark:border-slate-800"
                    style={{ top: i * HOUR_HEIGHT }}
                  />
                ))}
                {/* Half-hour lines */}
                {hours.map((_, i) => (
                  <div
                    key={`h${i}`}
                    className="absolute left-0 right-0 border-t border-slate-50 dark:border-slate-900"
                    style={{ top: i * HOUR_HEIGHT + HOUR_HEIGHT / 2 }}
                  />
                ))}

                {/* Events */}
                {timed.map(event => {
                  const top = eventTop(event)
                  const height = eventHeight(event)
                  const widthPct = 100 / event.totalCols
                  const leftPct = event.col * widthPct
                  const tall = height >= 44

                  return (
                    <button
                      key={event.id}
                      onClick={() => setSelectedEvent(event)}
                      className="absolute rounded-lg text-left overflow-hidden transition-opacity hover:opacity-90 active:opacity-75 shadow-sm"
                      style={{
                        top: top + 2,
                        height: height - 4,
                        left: `calc(${leftPct}% + 2px)`,
                        width: `calc(${widthPct}% - 4px)`,
                        backgroundColor: event.color + '30',
                        borderLeft: `3px solid ${event.color}`,
                      }}
                    >
                      <div className="px-1.5 py-1">
                        <p
                          className="font-semibold leading-tight"
                          style={{
                            color: event.color,
                            fontSize: tall ? '0.8rem' : '0.68rem',
                            lineHeight: 1.2,
                          }}
                        >
                          {event.title}
                        </p>
                        {tall && (
                          <p
                            className="mt-0.5 leading-tight truncate"
                            style={{ color: event.color + 'cc', fontSize: '0.68rem' }}
                          >
                            {format(event.start, 'h:mm')}–{format(event.end, 'h:mm a')}
                          </p>
                        )}
                      </div>
                    </button>
                  )
                })}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
