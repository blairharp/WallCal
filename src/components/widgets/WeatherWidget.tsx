import { useHAStore } from '../../store/haStore'
import { Cloud, Sun, CloudRain, CloudSnow, CloudLightning, Wind, Droplets } from 'lucide-react'

const CONDITION_ICONS: Record<string, React.ReactNode> = {
  sunny:                <Sun className="w-8 h-8 text-yellow-500" />,
  'clear-night':        <Sun className="w-8 h-8 text-slate-400" />,
  cloudy:               <Cloud className="w-8 h-8 text-slate-400" />,
  'partly-cloudy-day':  <Cloud className="w-8 h-8 text-slate-400" />,
  'partly-cloudy-night':<Cloud className="w-8 h-8 text-slate-500" />,
  rainy:                <CloudRain className="w-8 h-8 text-blue-500" />,
  snowy:                <CloudSnow className="w-8 h-8 text-blue-400" />,
  lightning:            <CloudLightning className="w-8 h-8 text-yellow-500" />,
  windy:                <Wind className="w-8 h-8 text-slate-400" />,
}

export function WeatherWidget() {
  const entities = useHAStore(s => s.entities)
  const weather = entities['weather.home']

  if (!weather) return null

  const temp = weather.attributes.temperature as number | undefined
  const condition = weather.state
  const humidity = weather.attributes.humidity as number | undefined
  const icon = CONDITION_ICONS[condition] ?? <Cloud className="w-8 h-8 text-slate-400" />

  return (
    <div className="px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 mx-4">
      <div className="flex items-center gap-3">
        {icon}
        <div className="flex-1">
          <span className="text-3xl font-light text-slate-800 dark:text-slate-50">
            {temp !== undefined ? Math.round(temp) : '--'}°
          </span>
          <p className="text-sm text-slate-500 dark:text-slate-400 capitalize">{condition.replace(/-/g, ' ')}</p>
        </div>
        {humidity !== undefined && (
          <div className="flex items-center gap-1 text-slate-400 dark:text-slate-500">
            <Droplets className="w-4 h-4" />
            <span className="text-sm">{humidity}%</span>
          </div>
        )}
      </div>
    </div>
  )
}
