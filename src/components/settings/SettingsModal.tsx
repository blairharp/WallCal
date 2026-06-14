import { useHAStore } from '../../store/haStore'
import { useSettingsStore } from '../../store/settingsStore'
import { getCalendarColor } from '../../utils/calendarColors'

interface SettingsModalProps {
  onClose: () => void
}

interface ToggleProps {
  value: boolean
  onChange: (v: boolean) => void
}

function Toggle({ value, onChange }: ToggleProps) {
  return (
    <div
      onClick={() => onChange(!value)}
      role="switch"
      aria-checked={value}
      style={{
        width: '44px',
        height: '24px',
        borderRadius: '12px',
        background: value ? '#3b82f6' : '#475569',
        position: 'relative',
        cursor: 'pointer',
        transition: 'background 0.2s ease',
        flexShrink: 0,
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: '2px',
          left: value ? '22px' : '2px',
          width: '20px',
          height: '20px',
          borderRadius: '50%',
          background: '#f8fafc',
          transition: 'left 0.2s ease',
          boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
        }}
      />
    </div>
  )
}

interface SectionDividerProps {
  title: string
}

function SectionTitle({ title }: SectionDividerProps) {
  return (
    <p
      style={{
        fontSize: '0.75rem',
        fontWeight: 600,
        color: '#94a3b8',
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
        margin: '0 0 0.75rem 0',
      }}
    >
      {title}
    </p>
  )
}

function ToggleRow({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0.5rem 0',
      }}
    >
      <span style={{ fontSize: '0.9375rem', color: '#e2e8f0' }}>{label}</span>
      <Toggle value={value} onChange={onChange} />
    </div>
  )
}

export function SettingsModal({ onClose }: SettingsModalProps) {
  const entities = useHAStore(s => s.entities)

  const showWeather = useSettingsStore(s => s.showWeather)
  const showFamily = useSettingsStore(s => s.showFamily)
  const showUpcoming = useSettingsStore(s => s.showUpcoming)
  const weatherEntity = useSettingsStore(s => s.weatherEntity)
  const calendarColors = useSettingsStore(s => s.calendarColors)

  const setShowWeather = useSettingsStore(s => s.setShowWeather)
  const setShowFamily = useSettingsStore(s => s.setShowFamily)
  const setShowUpcoming = useSettingsStore(s => s.setShowUpcoming)
  const setWeatherEntity = useSettingsStore(s => s.setWeatherEntity)
  const setCalendarColor = useSettingsStore(s => s.setCalendarColor)
  const resetCalendarColors = useSettingsStore(s => s.resetCalendarColors)

  const calendarEntityIds = Object.keys(entities).filter(id => id.startsWith('calendar.'))

  function friendlyName(entityId: string): string {
    const entity = entities[entityId]
    const friendly = entity?.attributes?.friendly_name as string | undefined
    if (friendly) return friendly
    return entityId.replace('calendar.', '').replace(/_/g, ' ')
  }

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        background: 'rgba(0,0,0,0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '640px',
          background: '#1e293b',
          borderRadius: '1rem',
          padding: '1.5rem',
          boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
          maxHeight: '85vh',
          overflowY: 'auto',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1.5rem',
          }}
        >
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#f8fafc', margin: 0 }}>
            Settings
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#94a3b8',
              cursor: 'pointer',
              fontSize: '1.5rem',
              lineHeight: 1,
              padding: '0.25rem',
              borderRadius: '0.375rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            aria-label="Close settings"
          >
            ✕
          </button>
        </div>

        {/* Section 1: Display */}
        <div style={{ marginBottom: '1.5rem' }}>
          <SectionTitle title="Display" />
          <ToggleRow label="Show Weather" value={showWeather} onChange={setShowWeather} />
          <ToggleRow label="Show Family" value={showFamily} onChange={setShowFamily} />
          <ToggleRow label="Show Upcoming Events" value={showUpcoming} onChange={setShowUpcoming} />
        </div>

        {/* Divider */}
        <div style={{ borderTop: '1px solid #334155', marginBottom: '1.5rem' }} />

        {/* Section 2: Calendars */}
        <div style={{ marginBottom: '1.5rem' }}>
          <SectionTitle title="Calendars" />
          {calendarEntityIds.length === 0 && (
            <p style={{ fontSize: '0.875rem', color: '#64748b' }}>No calendar entities found.</p>
          )}
          {calendarEntityIds.map((entityId) => {
            const currentColor = calendarColors[entityId] ?? getCalendarColor(entityId)
            return (
              <div
                key={entityId}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.5rem 0',
                }}
              >
                <span
                  style={{
                    fontSize: '0.9375rem',
                    color: '#e2e8f0',
                    textTransform: 'capitalize',
                  }}
                >
                  {friendlyName(entityId)}
                </span>
                <input
                  type="color"
                  value={currentColor}
                  onChange={(e) => setCalendarColor(entityId, e.target.value)}
                  style={{
                    width: '2.5rem',
                    height: '2rem',
                    border: 'none',
                    borderRadius: '0.375rem',
                    cursor: 'pointer',
                    background: 'transparent',
                    padding: 0,
                  }}
                  title={`Color for ${friendlyName(entityId)}`}
                />
              </div>
            )
          })}
          <button
            onClick={resetCalendarColors}
            style={{
              marginTop: '0.75rem',
              background: 'none',
              border: '1px solid #475569',
              borderRadius: '0.5rem',
              color: '#94a3b8',
              fontSize: '0.875rem',
              padding: '0.375rem 0.875rem',
              cursor: 'pointer',
            }}
          >
            Reset to defaults
          </button>
        </div>

        {/* Divider */}
        <div style={{ borderTop: '1px solid #334155', marginBottom: '1.5rem' }} />

        {/* Section 3: Weather */}
        <div>
          <SectionTitle title="Weather" />
          <label
            style={{
              display: 'block',
              fontSize: '0.9375rem',
              color: '#e2e8f0',
              marginBottom: '0.5rem',
            }}
          >
            Weather Entity
          </label>
          <input
            type="text"
            value={weatherEntity}
            onChange={(e) => setWeatherEntity(e.target.value)}
            style={{
              width: '100%',
              background: '#0f172a',
              border: '1px solid #334155',
              borderRadius: '0.5rem',
              color: '#f8fafc',
              fontSize: '0.9375rem',
              padding: '0.5rem 0.75rem',
              boxSizing: 'border-box',
              outline: 'none',
            }}
            placeholder="weather.home"
          />
          <p
            style={{
              fontSize: '0.8125rem',
              color: '#64748b',
              marginTop: '0.375rem',
              margin: '0.375rem 0 0 0',
            }}
          >
            Enter the HA entity ID (e.g. weather.home)
          </p>
        </div>
      </div>
    </div>
  )
}
