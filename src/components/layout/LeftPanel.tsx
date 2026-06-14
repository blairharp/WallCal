import { ClockDate } from '../widgets/ClockDate'
import { WeatherWidget } from '../widgets/WeatherWidget'
import { FamilyAvatars } from '../widgets/FamilyAvatars'
import { UpcomingList } from '../widgets/UpcomingList'

export function LeftPanel() {
  return (
    <div className="flex flex-col h-full gap-2 py-2">
      <ClockDate />
      <div className="border-t border-slate-800 pt-2">
        <WeatherWidget />
      </div>
      <div className="border-t border-slate-800 pt-2">
        <FamilyAvatars />
      </div>
      <div className="border-t border-slate-800 pt-2 flex-1 overflow-hidden">
        <UpcomingList />
      </div>
    </div>
  )
}
