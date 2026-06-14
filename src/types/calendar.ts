export interface CalendarEvent {
  id: string
  title: string
  start: Date
  end: Date
  allDay: boolean
  calendarEntityId: string
  color: string
  description?: string
  location?: string
}
