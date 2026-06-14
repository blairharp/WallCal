import { useState, useEffect } from 'react'
import { formatClockTime, formatAmPm, formatFullDate } from '../../utils/dateHelpers'

interface ScreensaverProps {
  onInteraction: () => void
}

export function Screensaver({ onInteraction }: ScreensaverProps) {
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <div
      className="fixed inset-0 z-50 bg-gray-950 flex flex-col items-center justify-center cursor-none select-none"
      onClick={onInteraction}
      onTouchStart={onInteraction}
    >
      <div className="flex items-end leading-none">
        <span className="text-9xl font-thin text-slate-100 tabular-nums">
          {formatClockTime(now)}
        </span>
        <span className="text-4xl font-thin text-slate-400 mb-3 ml-2">
          {formatAmPm(now)}
        </span>
      </div>
      <p className="text-2xl text-slate-500 font-light mt-4">
        {formatFullDate(now)}
      </p>
    </div>
  )
}
