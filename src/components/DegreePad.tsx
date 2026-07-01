import { ROMAN_LABELS, type Mode } from '../music/theory'
import type { Level } from '../game/difficulty'

interface Props {
  level: Level
  mode: Mode
  disabled: boolean
  onPick: (degree: number) => void
}

export function DegreePad({ level, mode, disabled, onPick }: Props) {
  const labels = ROMAN_LABELS[mode]
  return (
    <div className="flex flex-wrap justify-center gap-2">
      {level.degrees.map((degree, i) => (
        <button
          key={degree}
          disabled={disabled}
          onClick={() => onPick(degree)}
          className="min-h-[44px] min-w-[44px] touch-manipulation select-none rounded-xl bg-slate-700 px-3 py-3 text-lg font-bold text-white shadow transition hover:bg-indigo-500 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 sm:min-w-16 sm:px-4 sm:py-4 sm:text-xl"
          title={`Touche ${i + 1}`}
        >
          {labels[degree]}
          <span className="ml-1 text-xs font-normal text-slate-400">{i + 1}</span>
        </button>
      ))}
    </div>
  )
}
