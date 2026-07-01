import type { ReferenceMode } from '../audio/piano'

interface Props {
  value: ReferenceMode
  onChange: (mode: ReferenceMode) => void
}

const OPTIONS: { id: ReferenceMode; label: string }[] = [
  { id: 'cadence', label: 'Cadence' },
  { id: 'tonic', label: 'Tonique' },
  { id: 'none', label: 'Aucun' },
]

export function ReferenceSelect({ value, onChange }: Props) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2 text-sm">
      <span className="text-slate-400">Repère&nbsp;:</span>
      <div className="inline-flex overflow-hidden rounded-lg border border-slate-700">
        {OPTIONS.map((opt) => (
          <button
            key={opt.id}
            onClick={() => onChange(opt.id)}
            className={`touch-manipulation select-none px-3 py-2 transition ${
              value === opt.id
                ? 'bg-indigo-500 text-white'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  )
}
