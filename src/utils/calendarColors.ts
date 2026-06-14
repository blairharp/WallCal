export const CALENDAR_COLORS: Record<string, string> = {
  'calendar.family_shared':              '#3b82f6',
  'calendar.mom':                        '#ec4899',
  'calendar.dad':                        '#f97316',
  'calendar.kids':                       '#22c55e',
  'calendar.work':                       '#8b5cf6',
  'calendar.school':                     '#eab308',
  'calendar.holidays_in_united_states':  '#ef4444',
}

export const DEFAULT_COLOR = '#6366f1'

const AUTO_COLORS = [
  '#3b82f6', '#ec4899', '#f97316', '#22c55e',
  '#8b5cf6', '#eab308', '#ef4444', '#14b8a6',
  '#f43f5e', '#06b6d4',
]

const assignedColors: Record<string, string> = {}
let autoIndex = 0

export function getCalendarColor(entityId: string): string {
  if (CALENDAR_COLORS[entityId]) return CALENDAR_COLORS[entityId]
  if (assignedColors[entityId]) return assignedColors[entityId]
  const color = AUTO_COLORS[autoIndex % AUTO_COLORS.length]
  assignedColors[entityId] = color
  autoIndex++
  return color
}
