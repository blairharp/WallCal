import { useCalendarStore } from '../../store/calendarStore'
import { X, MapPin, Clock, Calendar } from 'lucide-react'
import { format } from 'date-fns'

export function EventDetail() {
  const selectedEvent = useCalendarStore(s => s.selectedEvent)
  const setSelectedEvent = useCalendarStore(s => s.setSelectedEvent)

  if (!selectedEvent) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center"
      onClick={() => setSelectedEvent(null)}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-lg bg-slate-900 border border-slate-700 rounded-t-2xl p-6 pb-10 shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={() => setSelectedEvent(null)}
          className="absolute top-4 right-4 text-slate-500 hover:text-slate-300"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-start gap-3 mb-4">
          <div
            className="w-3 h-3 rounded-full mt-1.5 flex-shrink-0"
            style={{ backgroundColor: selectedEvent.color }}
          />
          <h2 className="text-xl font-semibold text-slate-50 leading-snug">
            {selectedEvent.title}
          </h2>
        </div>

        <div className="flex flex-col gap-2 ml-6">
          <div className="flex items-center gap-2 text-slate-400">
            <Clock className="w-4 h-4 flex-shrink-0" />
            <span className="text-sm">
              {selectedEvent.allDay
                ? `${format(selectedEvent.start, 'MMMM d, yyyy')} · All day`
                : `${format(selectedEvent.start, 'MMMM d, yyyy · h:mm a')} – ${format(selectedEvent.end, 'h:mm a')}`}
            </span>
          </div>

          {selectedEvent.location && (
            <div className="flex items-center gap-2 text-slate-400">
              <MapPin className="w-4 h-4 flex-shrink-0" />
              <span className="text-sm">{selectedEvent.location}</span>
            </div>
          )}

          <div className="flex items-center gap-2 text-slate-400">
            <Calendar className="w-4 h-4 flex-shrink-0" />
            <span className="text-sm text-slate-500">{selectedEvent.calendarEntityId}</span>
          </div>

          {selectedEvent.description && (
            <p className="text-sm text-slate-400 mt-2 whitespace-pre-line">
              {selectedEvent.description}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
