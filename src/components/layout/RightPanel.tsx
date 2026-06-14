import { useState } from 'react'
import { addMonths, subMonths, addWeeks, subWeeks } from 'date-fns'
import { ChevronLeft, ChevronRight, Grid3x3, Columns, Calendar, Plus } from 'lucide-react'
import { useDrag } from '@use-gesture/react'
import { MonthGrid } from '../calendar/MonthGrid'
import { WeekStrip } from '../calendar/WeekStrip'
import { DayView } from '../calendar/DayView'
import { EventDetail } from '../calendar/EventDetail'
import { CreateEventModal } from '../calendar/CreateEventModal'
import { formatMonthYear, formatFullDate } from '../../utils/dateHelpers'
import { useCalendarStore } from '../../store/calendarStore'

type ViewMode = 'month' | 'week' | 'day'
type NavDir = 'prev' | 'next' | null

const SWIPE_THRESHOLD = 60

interface RightPanelProps {
  currentMonth: Date
  onMonthChange: (month: Date) => void
}

export function RightPanel({ currentMonth, onMonthChange }: RightPanelProps) {
  const [view, setView] = useState<ViewMode>('week')
  const [weekDate, setWeekDate] = useState(new Date())
  const [dayDate, setDayDate] = useState(new Date())
  const [navDir, setNavDir] = useState<NavDir>(null)
  const [calendarKey, setCalendarKey] = useState(0)
  const [dragX, setDragX] = useState(0)
  const [creating, setCreating] = useState(false)
  const selectedEvent = useCalendarStore(s => s.selectedEvent)

  function navigate(dir: 'prev' | 'next') {
    setNavDir(dir)
    setCalendarKey(k => k + 1)
    if (dir === 'prev') {
      if (view === 'month') onMonthChange(subMonths(currentMonth, 1))
      else if (view === 'week') setWeekDate(d => subWeeks(d, 1))
      else setDayDate(d => { const n = new Date(d); n.setDate(n.getDate() - 1); return n })
    } else {
      if (view === 'month') onMonthChange(addMonths(currentMonth, 1))
      else if (view === 'week') setWeekDate(d => addWeeks(d, 1))
      else setDayDate(d => { const n = new Date(d); n.setDate(n.getDate() + 1); return n })
    }
  }

  function navToday() {
    const today = new Date()
    setNavDir(null)
    setCalendarKey(k => k + 1)
    onMonthChange(today)
    setWeekDate(today)
    setDayDate(today)
  }

  function switchView(mode: ViewMode) {
    setView(mode)
    setNavDir(null)
    setCalendarKey(k => k + 1)
  }

  const bind = useDrag(({ movement: [mx], last, active }) => {
    if (active) {
      // Resist drag with a rubber-band feel past 120px
      const clamped = Math.max(-120, Math.min(120, mx))
      setDragX(clamped * (1 - Math.abs(clamped) / 300))
    }
    if (last) {
      setDragX(0)
      if (mx < -SWIPE_THRESHOLD) navigate('next')
      else if (mx > SWIPE_THRESHOLD) navigate('prev')
    }
  }, {
    filterTaps: true,
    axis: 'x',
    threshold: 10,
  })

  const title =
    view === 'month' ? formatMonthYear(currentMonth)
    : view === 'week' ? formatMonthYear(weekDate)
    : formatFullDate(dayDate)

  const animClass =
    navDir === 'next' ? 'animate-slide-in-left'
    : navDir === 'prev' ? 'animate-slide-in-right'
    : 'animate-fade-in'

  return (
    <div className="flex flex-col h-full" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Nav bar */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-800 flex-shrink-0" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1rem', borderBottom: '1px solid #1e293b', flexShrink: 0 }}>
        <button
          onClick={navToday}
          className="text-sm px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors"
        >
          Today
        </button>
        <button
          onClick={() => navigate('prev')}
          className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={() => navigate('next')}
          className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        <h2 className="flex-1 text-lg font-semibold text-slate-100 ml-1">{title}</h2>

        {/* Add event */}
        <button
          onClick={() => setCreating(true)}
          className="p-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition-colors"
          title="New event"
        >
          <Plus className="w-5 h-5" />
        </button>

        {/* View toggles */}
        <div className="flex bg-slate-800 rounded-lg p-0.5 gap-0.5" style={{ display: 'flex', background: '#1e293b', borderRadius: '0.5rem', padding: '0.125rem', gap: '0.125rem' }}>
          {([
            { mode: 'month' as ViewMode, icon: <Grid3x3 className="w-4 h-4" />, label: 'Month' },
            { mode: 'week'  as ViewMode, icon: <Columns  className="w-4 h-4" />, label: 'Week'  },
            { mode: 'day'   as ViewMode, icon: <Calendar className="w-4 h-4" />, label: 'Day'   },
          ]).map(({ mode, icon, label }) => (
            <button
              key={mode}
              onClick={() => switchView(mode)}
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

      {/* Swipeable calendar area */}
      <div
        {...bind()}
        className="flex-1 overflow-hidden touch-pan-y select-none"
        style={{
          flex: 1,
          overflow: 'hidden',
          transform: `translateX(${dragX}px)`,
          transition: dragX === 0 ? 'transform 0.18s ease' : 'none',
        }}
      >
        <div key={calendarKey} className={`h-full ${animClass}`} style={{ height: '100%' }}>
          {view === 'month' && <MonthGrid month={currentMonth} />}
          {view === 'week'  && <WeekStrip week={weekDate} />}
          {view === 'day'   && <DayView day={dayDate} />}
        </div>
      </div>

      {selectedEvent && <EventDetail />}
      {creating && (
        <CreateEventModal
          initialDate={view === 'day' ? dayDate : view === 'week' ? weekDate : currentMonth}
          onClose={() => setCreating(false)}
        />
      )}
    </div>
  )
}
