import { create } from 'zustand'
import { CalendarEvent } from '../types/calendar'

interface CalendarStore {
  events: CalendarEvent[]
  selectedEvent: CalendarEvent | null
  refreshToken: number
  setEvents: (events: CalendarEvent[]) => void
  setSelectedEvent: (event: CalendarEvent | null) => void
  triggerRefresh: () => void
}

export const useCalendarStore = create<CalendarStore>((set) => ({
  events: [],
  selectedEvent: null,
  refreshToken: 0,
  setEvents: (events) => set({ events }),
  setSelectedEvent: (selectedEvent) => set({ selectedEvent }),
  triggerRefresh: () => set(s => ({ refreshToken: s.refreshToken + 1 })),
}))
