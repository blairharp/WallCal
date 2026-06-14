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
    <div className="px-4 py-3">
      <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Family</p>
      <div className="flex flex-col gap-2">
        {people.map((person) => (
          <div key={person.name} className="flex items-center gap-3">
            <div className="relative">
              {person.picture ? (
                <img
                  src={person.picture}
                  alt={person.name}
                  className="w-9 h-9 rounded-full object-cover border-2 border-slate-700"
                />
              ) : (
                <div className="w-9 h-9 rounded-full bg-slate-700 flex items-center justify-center text-slate-300 font-medium text-sm">
                  {person.name[0]?.toUpperCase()}
                </div>
              )}
              <span
                className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-gray-950 ${
                  person.state === 'home' ? 'bg-green-500' : 'bg-slate-600'
                }`}
              />
            </div>
            <div>
              <p className="text-sm text-slate-200 font-medium leading-tight">{person.name}</p>
              <p className="text-xs text-slate-500 capitalize">{person.state.replace(/_/g, ' ')}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
