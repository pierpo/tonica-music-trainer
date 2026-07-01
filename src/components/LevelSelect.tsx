import { LEVELS, type Level } from '../game/difficulty'

interface Props {
  current: Level
  onSelect: (level: Level) => void
}

export function LevelSelect({ current, onSelect }: Props) {
  return (
    <div className="flex flex-wrap justify-center gap-2">
      {LEVELS.map((lvl) => {
        const active = lvl.id === current.id
        return (
          <button
            key={lvl.id}
            onClick={() => onSelect(lvl)}
            className={`touch-manipulation select-none rounded-lg px-3 py-2 text-left transition ${
              active
                ? 'bg-indigo-500 text-white shadow'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <div className="text-sm font-semibold">{lvl.name}</div>
            <div className="text-xs opacity-80">{lvl.description}</div>
          </button>
        )
      })}
    </div>
  )
}
