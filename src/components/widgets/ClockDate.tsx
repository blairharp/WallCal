import { useState, useEffect } from 'react'
import { formatClockTime, formatAmPm, formatFullDate } from '../../utils/dateHelpers'

export function ClockDate() {
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="flex flex-col items-center py-6 select-none" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '1.5rem 0', userSelect: 'none' }}>
      <div className="flex items-end leading-none" style={{ display: 'flex', alignItems: 'flex-end', lineHeight: 1 }}>
        <span className="text-7xl font-thin text-slate-50 tabular-nums" style={{ fontSize: '4.5rem', fontWeight: 100, color: '#f8fafc', fontVariantNumeric: 'tabular-nums' }}>
          {formatClockTime(now)}
        </span>
        <span className="text-2xl font-thin text-slate-400 mb-2 ml-1" style={{ fontSize: '1.5rem', fontWeight: 100, color: '#94a3b8', marginBottom: '0.5rem', marginLeft: '0.25rem' }}>
          {formatAmPm(now)}
        </span>
      </div>
      <p className="text-lg text-slate-400 mt-2 font-light" style={{ fontSize: '1.125rem', color: '#94a3b8', marginTop: '0.5rem', fontWeight: 300, margin: '0.5rem 0 0 0' }}>
        {formatFullDate(now)}
      </p>
    </div>
  )
}
