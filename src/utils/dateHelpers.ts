import { format, isToday, isSameMonth, isSameDay, startOfWeek, endOfWeek, eachDayOfInterval, startOfMonth, endOfMonth, addDays } from 'date-fns'

export function formatClockTime(date: Date): string {
  return format(date, 'h:mm')
}

export function formatAmPm(date: Date): string {
  return format(date, 'a')
}

export function formatFullDate(date: Date): string {
  return format(date, 'EEEE, MMMM d')
}

export function formatMonthYear(date: Date): string {
  return format(date, 'MMMM yyyy')
}

export function formatEventTime(date: Date): string {
  return format(date, 'h:mm a')
}

export function formatShortDate(date: Date): string {
  return format(date, 'MMM d')
}

export function getCalendarWeeks(month: Date): Date[][] {
  const start = startOfWeek(startOfMonth(month), { weekStartsOn: 0 })
  const end = endOfWeek(endOfMonth(month), { weekStartsOn: 0 })
  const days = eachDayOfInterval({ start, end })
  const weeks: Date[][] = []
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7))
  }
  return weeks
}

export function getWeekDays(date: Date): Date[] {
  const start = startOfWeek(date, { weekStartsOn: 0 })
  return Array.from({ length: 7 }, (_, i) => addDays(start, i))
}

export { isToday, isSameMonth, isSameDay, format }
