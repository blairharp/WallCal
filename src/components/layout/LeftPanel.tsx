import { ClockDate } from '../widgets/ClockDate'
import { WeatherWidget } from '../widgets/WeatherWidget'
import { FamilyAvatars } from '../widgets/FamilyAvatars'
import { UpcomingList } from '../widgets/UpcomingList'
import { useSettingsStore } from '../../store/settingsStore'

export function LeftPanel() {
  const showWeather = useSettingsStore(s => s.showWeather)
  const showFamily = useSettingsStore(s => s.showFamily)
  const showUpcoming = useSettingsStore(s => s.showUpcoming)

  return (
    <div className="flex flex-col h-full gap-2 py-2" style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '0.5rem', padding: '0.5rem 0' }}>
      <ClockDate />
      {showWeather && (
        <div className="border-t border-slate-800 pt-2" style={{ borderTop: '1px solid #1e293b', paddingTop: '0.5rem' }}>
          <WeatherWidget />
        </div>
      )}
      {showFamily && (
        <div className="border-t border-slate-800 pt-2" style={{ borderTop: '1px solid #1e293b', paddingTop: '0.5rem' }}>
          <FamilyAvatars />
        </div>
      )}
      {showUpcoming && (
        <div className="border-t border-slate-800 pt-2 flex-1 overflow-hidden" style={{ borderTop: '1px solid #1e293b', paddingTop: '0.5rem', flex: 1, overflow: 'hidden' }}>
          <UpcomingList />
        </div>
      )}
    </div>
  )
}
