import { create } from 'zustand'
import { CalendarEvent } from '../types/calendar'

interface CalendarStore {
  events: CalendarEvent[]
  selectedEvent: CalendarEvent | null
  setEvents: (events: CalendarEvent[]) => void
  setSelectedEvent: (event: CalendarEvent | null) => void
}

export const useCalendarStore = create<CalendarStore>((set) => ({
  events: [],
  selectedEvent: null,
  setEvents: (events) => set({ events }),
  setSelectedEvent: (selectedEvent) => set({ selectedEvent }),
}))
