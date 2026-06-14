import type { ReactNode } from 'react'
import { useHAStore } from '../../store/haStore'
import { useSettingsStore } from '../../store/settingsStore'
import { Cloud, Sun, CloudRain, CloudSnow, CloudLightning, Wind, Droplets } from 'lucide-react'

const ICON_STYLE = { width: '2rem', height: '2rem' }

const CONDITION_ICONS: Record<string, ReactNode> = {
  sunny:                 <Sun style={{ ...ICON_STYLE, color: '#facc15' }} />,
  'clear-night':         <Sun style={{ ...ICON_STYLE, color: '#cbd5e1' }} />,
  cloudy:                <Cloud style={{ ...ICON_STYLE, color: '#94a3b8' }} />,
  'partly-cloudy-day':   <Cloud style={{ ...ICON_STYLE, color: '#cbd5e1' }} />,
  'partly-cloudy-night': <Cloud style={{ ...ICON_STYLE, color: '#94a3b8' }} />,
  rainy:                 <CloudRain style={{ ...ICON_STYLE, color: '#60a5fa' }} />,
  snowy:                 <CloudSnow style={{ ...ICON_STYLE, color: '#bfdbfe' }} />,
  lightning:             <CloudLightning style={{ ...ICON_STYLE, color: '#fde047' }} />,
  windy:                 <Wind style={{ ...ICON_STYLE, color: '#cbd5e1' }} />,
}

export function WeatherWidget() {
  const entities = useHAStore(s => s.entities)
  const weatherEntity = useSettingsStore(s => s.weatherEntity)
  const weather = entities[weatherEntity]

  if (!weather) return null

  const temp = weather.attributes.temperature as number | undefined
  const condition = weather.state
  const humidity = weather.attributes.humidity as number | undefined
  const icon = CONDITION_ICONS[condition] ?? <Cloud style={{ ...ICON_STYLE, color: '#94a3b8' }} />

  return (
    <div style={{ padding: '0.75rem 1rem', borderRadius: '0.75rem', background: '#1e293b', margin: '0 1rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        {icon}
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.25rem' }}>
            <span style={{ fontSize: '1.875rem', fontWeight: 300, color: '#f8fafc' }}>
              {temp !== undefined ? Math.round(temp) : '--'}°
            </span>
          </div>
          <p style={{ fontSize: '0.875rem', color: '#94a3b8', textTransform: 'capitalize', margin: 0 }}>
            {condition.replace(/-/g, ' ')}
          </p>
        </div>
        {humidity !== undefined && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#94a3b8' }}>
            <Droplets style={{ width: '1rem', height: '1rem' }} />
            <span style={{ fontSize: '0.875rem' }}>{humidity}%</span>
          </div>
        )}
      </div>
    </div>
  )
}
