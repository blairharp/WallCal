import { useState, useEffect } from 'react'
import { formatClockTime, formatAmPm, formatFullDate } from '../../utils/dateHelpers'

export function ClockDate() {
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="flex flex-col items-center py-6 select-none">
      <div className="flex items-end leading-none">
        <span className="text-7xl font-thin text-slate-50 tabular-nums">
          {formatClockTime(now)}
        </span>
        <span className="text-2xl font-thin text-slate-400 mb-2 ml-1">
          {formatAmPm(now)}
        </span>
      </div>
      <p className="text-lg text-slate-400 mt-2 font-light">
        {formatFullDate(now)}
      </p>
    </div>
  )
}
