import { useHAStore } from '../../store/haStore'

export function FamilyAvatars() {
  const entities = useHAStore(s => s.entities)

  const people = Object.entries(entities)
    .filter(([id]) => id.startsWith('person.'))
    .map(([, entity]) => ({
      name: entity.attributes.friendly_name as string || entity.entity_id,
      state: entity.state,
      picture: entity.attributes.entity_picture as string | undefined,
    }))

  if (people.length === 0) return null

  return (
    <div className="px-4 py-3" style={{ padding: '0.75rem 1rem' }}>
      <p
        className="text-xs text-slate-500 uppercase tracking-wider mb-2"
        style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}
      >
        Family
      </p>
      <div className="flex flex-col gap-2" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {people.map((person) => (
          <div key={person.name} className="flex items-center gap-3" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div className="relative" style={{ position: 'relative', flexShrink: 0 }}>
              {person.picture ? (
                <img
                  src={person.picture}
                  alt={person.name}
                  className="w-9 h-9 rounded-full object-cover border-2 border-slate-700"
                  style={{ width: '2.25rem', height: '2.25rem', borderRadius: '50%', objectFit: 'cover', border: '2px solid #334155' }}
                />
              ) : (
                <div
                  className="w-9 h-9 rounded-full bg-slate-700 flex items-center justify-center text-slate-300 font-medium text-sm"
                  style={{ width: '2.25rem', height: '2.25rem', borderRadius: '50%', background: '#334155', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#cbd5e1', fontWeight: 500, fontSize: '0.875rem' }}
                >
                  {person.name[0]?.toUpperCase()}
                </div>
              )}
              <span
                className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-gray-950 ${
                  person.state === 'home' ? 'bg-green-500' : 'bg-slate-600'
                }`}
                style={{
                  position: 'absolute', bottom: '-2px', right: '-2px',
                  width: '0.75rem', height: '0.75rem', borderRadius: '50%',
                  border: '2px solid #030712',
                  background: person.state === 'home' ? '#22c55e' : '#475569',
                }}
              />
            </div>
            <div>
              <p
                className="text-sm text-slate-200 font-medium leading-tight"
                style={{ fontSize: '0.875rem', color: '#e2e8f0', fontWeight: 500, lineHeight: 1.25, margin: 0 }}
              >
                {person.name}
              </p>
              <p
                className="text-xs text-slate-500 capitalize"
                style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'capitalize', margin: 0 }}
              >
                {person.state.replace(/_/g, ' ')}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
