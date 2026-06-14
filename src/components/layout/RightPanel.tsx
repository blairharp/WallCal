import { useState } from 'react'
import { addMonths, subMonths, addWeeks, subWeeks } from 'date-fns'
import { ChevronLeft, ChevronRight, Grid3x3, Columns, Calendar } from 'lucide-react'
import { MonthGrid } from '../calendar/MonthGrid'
import { WeekStrip } from '../calendar/WeekStrip'
import { DayView } from '../calendar/DayView'
import { EventDetail } from '../calendar/EventDetail'
import { formatMonthYear, formatFullDate } from '../../utils/dateHelpers'
import { useCalendarStore } from '../../store/calendarStore'

type ViewMode = 'month' | 'week' | 'day'

interface RightPanelProps {
  currentMonth: Date
  onMonthChange: (month: Date) => void
}

export function RightPanel({ currentMonth, onMonthChange }: RightPanelProps) {
  const [view, setView] = useState<ViewMode>('week')
  const [weekDate, setWeekDate] = useState(new Date())
  const [dayDate, setDayDate] = useState(new Date())
  const selectedEvent = useCalendarStore(s => s.selectedEvent)

  function navPrev() {
    if (view === 'month') onMonthChange(subMonths(currentMonth, 1))
    else if (view === 'week') setWeekDate(d => subWeeks(d, 1))
    else setDayDate(d => { const n = new Date(d); n.setDate(n.getDate() - 1); return n })
  }

  function navNext() {
    if (view === 'month') onMonthChange(addMonths(currentMonth, 1))
    else if (view === 'week') setWeekDate(d => addWeeks(d, 1))
    else setDayDate(d => { const n = new Date(d); n.setDate(n.getDate() + 1); return n })
  }

  function navToday() {
    const today = new Date()
    onMonthChange(today)
    setWeekDate(today)
    setDayDate(today)
  }

  const title =
    view === 'month' ? formatMonthYear(currentMonth)
    : view === 'week' ? formatMonthYear(weekDate)
    : formatFullDate(dayDate)

  return (
    <div className="flex flex-col h-full">
      {/* Nav bar */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-800 flex-shrink-0">
        <button
          onClick={navToday}
          className="text-sm px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors"
        >
          Today
        </button>
        <button
          onClick={navPrev}
          className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={navNext}
          className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        <h2 className="flex-1 text-lg font-semibold text-slate-100 ml-1">{title}</h2>

        {/* View toggles */}
        <div className="flex bg-slate-800 rounded-lg p-0.5 gap-0.5">
          {([
            { mode: 'month' as ViewMode, icon: <Grid3x3 className="w-4 h-4" />, label: 'Month' },
            { mode: 'week' as ViewMode, icon: <Columns className="w-4 h-4" />, label: 'Week' },
            { mode: 'day' as ViewMode, icon: <Calendar className="w-4 h-4" />, label: 'Day' },
          ]).map(({ mode, icon, label }) => (
            <button
              key={mode}
              onClick={() => setView(mode)}
              title={label}
              className={`p-1.5 rounded-md transition-colors ${
                view === mode
                  ? 'bg-slate-600 text-slate-100'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              {icon}
            </button>
          ))}
        </div>
      </div>

      {/* Calendar content */}
      <div className="flex-1 overflow-hidden">
        {view === 'month' && <MonthGrid month={currentMonth} />}
        {view === 'week' && <WeekStrip week={weekDate} />}
        {view === 'day' && <DayView day={dayDate} />}
      </div>

      {selectedEvent && <EventDetail />}
    </div>
  )
}
