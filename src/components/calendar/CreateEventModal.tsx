import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { X, Loader2, AlertCircle } from 'lucide-react'
import { useHAStore } from '../../store/haStore'
import { useCalendarStore } from '../../store/calendarStore'
import { getCalendarColor } from '../../utils/calendarColors'

interface CreateEventModalProps {
  initialDate?: Date
  onClose: () => void
}

export function CreateEventModal({ initialDate, onClose }: CreateEventModalProps) {
  const connection = useHAStore(s => s.connection)
  const entities = useHAStore(s => s.entities)
  const triggerRefresh = useCalendarStore(s => s.triggerRefresh)

  const calendarIds = Object.keys(entities).filter(id => id.startsWith('calendar.'))

  const [title, setTitle] = useState('')
  const [calendarId, setCalendarId] = useState(calendarIds[0] ?? '')
  const [date, setDate] = useState(format(initialDate ?? new Date(), 'yyyy-MM-dd'))
  const [allDay, setAllDay] = useState(false)
  const [startTime, setStartTime] = useState('09:00')
  const [endTime, setEndTime] = useState('10:00')
  const [description, setDescription] = useState('')
  const [location, setLocation] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!calendarId && calendarIds.length > 0) setCalendarId(calendarIds[0])
  }, [calendarIds.join(',')])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!connection || !calendarId || !title.trim()) return

    setSubmitting(true)
    setError(null)

    try {
      const serviceData = allDay
        ? {
            summary: title.trim(),
            start_date: date,
            end_date: date,
            ...(description && { description }),
            ...(location && { location }),
          }
        : {
            summary: title.trim(),
            start_date_time: `${date}T${startTime}:00`,
            end_date_time: `${date}T${endTime}:00`,
            ...(description && { description }),
            ...(location && { location }),
          }

      await connection.sendMessagePromise({
        type: 'call_service',
        domain: 'calendar',
        service: 'create_event',
        target: { entity_id: calendarId },
        service_data: serviceData,
      })

      triggerRefresh()
      onClose()
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      setError(msg || 'Failed to create event. Check that this calendar supports write access.')
      setSubmitting(false)
    }
  }

  const inputClass = "w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2.5 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 text-base focus:outline-none focus:border-blue-500 transition-colors"
  const labelClass = "block text-xs text-slate-400 dark:text-slate-500 uppercase tracking-wider font-semibold mb-1.5"

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      <div
        className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl animate-scale-in"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-slate-100 dark:border-slate-800">
          <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-50">New Event</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-4">
          <div>
            <input
              autoFocus
              type="text"
              placeholder="Event title"
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
              className={inputClass}
            />
          </div>

          {calendarIds.length > 1 && (
            <div>
              <label className={labelClass}>Calendar</label>
              <div className="flex flex-wrap gap-2">
                {calendarIds.map(id => {
                  const color = getCalendarColor(id)
                  const label = id.replace('calendar.', '').replace(/_/g, ' ')
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setCalendarId(id)}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all border ${
                        calendarId === id
                          ? 'border-transparent'
                          : 'border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 bg-transparent hover:border-slate-300 dark:hover:border-slate-600'
                      }`}
                      style={calendarId === id ? { backgroundColor: color + '28', color, borderColor: color } : {}}
                    >
                      {label}
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          <div>
            <label className={labelClass}>Date</label>
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              required
              className={`${inputClass} [color-scheme:light] dark:[color-scheme:dark]`}
            />
          </div>

          <label className="flex items-center gap-3 cursor-pointer select-none">
            <div className="relative">
              <input
                type="checkbox"
                className="sr-only"
                checked={allDay}
                onChange={e => setAllDay(e.target.checked)}
              />
              <div className={`w-10 h-6 rounded-full transition-colors ${allDay ? 'bg-blue-500' : 'bg-slate-200 dark:bg-slate-700'}`} />
              <div className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${allDay ? 'translate-x-4' : ''}`} />
            </div>
            <span className="text-sm text-slate-600 dark:text-slate-300">All day</span>
          </label>

          {!allDay && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>Start</label>
                <input
                  type="time"
                  value={startTime}
                  onChange={e => {
                    setStartTime(e.target.value)
                    const [sh, sm] = e.target.value.split(':').map(Number)
                    const [eh, em] = endTime.split(':').map(Number)
                    if (sh * 60 + sm >= eh * 60 + em) {
                      const endH = String(Math.min(sh + 1, 23)).padStart(2, '0')
                      setEndTime(`${endH}:${String(sm).padStart(2, '0')}`)
                    }
                  }}
                  required
                  className={`${inputClass} [color-scheme:light] dark:[color-scheme:dark]`}
                />
              </div>
              <div>
                <label className={labelClass}>End</label>
                <input
                  type="time"
                  value={endTime}
                  onChange={e => setEndTime(e.target.value)}
                  required
                  className={`${inputClass} [color-scheme:light] dark:[color-scheme:dark]`}
                />
              </div>
            </div>
          )}

          <div>
            <input
              type="text"
              placeholder="Location (optional)"
              value={location}
              onChange={e => setLocation(e.target.value)}
              className={`${inputClass} text-sm`}
            />
          </div>
          <div>
            <textarea
              placeholder="Description (optional)"
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={2}
              className={`${inputClass} text-sm resize-none`}
            />
          </div>

          {error && (
            <div className="flex items-start gap-2 text-red-500 text-sm bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-lg px-3 py-2.5">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:border-slate-300 dark:hover:border-slate-600 transition-colors text-sm font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || !title.trim() || !calendarId}
              className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold transition-colors flex items-center justify-center gap-2"
            >
              {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
              {submitting ? 'Saving…' : 'Add Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
