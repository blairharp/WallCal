import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface SettingsStore {
  showWeather: boolean
  showFamily: boolean
  showUpcoming: boolean
  weatherEntity: string
  calendarColors: Record<string, string>
  personNames: Record<string, string>
  hiddenPersons: string[]

  setShowWeather: (v: boolean) => void
  setShowFamily: (v: boolean) => void
  setShowUpcoming: (v: boolean) => void
  setWeatherEntity: (entity: string) => void
  setCalendarColor: (entityId: string, color: string) => void
  setPersonName: (entityId: string, name: string) => void
  togglePersonVisibility: (entityId: string) => void
  resetCalendarColors: () => void
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      showWeather: true,
      showFamily: true,
      showUpcoming: true,
      weatherEntity: 'weather.home',
      calendarColors: {},
      personNames: {},
      hiddenPersons: [],

      setShowWeather: (v) => set({ showWeather: v }),
      setShowFamily: (v) => set({ showFamily: v }),
      setShowUpcoming: (v) => set({ showUpcoming: v }),
      setWeatherEntity: (entity) => set({ weatherEntity: entity }),
      setCalendarColor: (entityId, color) =>
        set((s) => ({ calendarColors: { ...s.calendarColors, [entityId]: color } })),
      setPersonName: (entityId, name) =>
        set((s) => ({ personNames: { ...s.personNames, [entityId]: name } })),
      togglePersonVisibility: (entityId) =>
        set((s) => ({
          hiddenPersons: s.hiddenPersons.includes(entityId)
            ? s.hiddenPersons.filter((id) => id !== entityId)
            : [...s.hiddenPersons, entityId],
        })),
      resetCalendarColors: () => set({ calendarColors: {} }),
    }),
    {
      name: 'wallcal-settings',
    }
  )
)
