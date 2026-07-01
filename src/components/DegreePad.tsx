import { chordSymbol, ROMAN_LABELS, type Mode } from '../music/theory'
import type { Level } from '../game/difficulty'

interface Props {
  level: Level
  mode: Mode
  tonicMidi: number
  disabled: boolean
  onPick: (degree: number) => void
}

export function DegreePad({ level, mode, tonicMidi, disabled, onPick }: Props) {
  const labels = ROMAN_LABELS[mode]
  return (
    <div className="flex flex-wrap justify-center gap-2">
      {level.degrees.map((degree, i) => (
        <button
          key={degree}
          disabled={disabled}
          onClick={() => onPick(degree)}
          className="flex min-h-[44px] min-w-[44px] touch-manipulation select-none flex-col items-center justify-center gap-0.5 rounded-xl bg-slate-700 px-3 py-3 text-white shadow transition hover:bg-indigo-500 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 sm:min-w-16 sm:px-4 sm:py-4"
          title={`Touche ${i + 1}`}
        >
          <span className="flex items-baseline gap-1.5">
            <span className="text-lg font-bold sm:text-xl">{labels[degree]}</span>
            <span className="text-sm font-normal text-slate-300">{chordSymbol(tonicMidi, mode, degree)}</span>
          </span>
          <span className="text-xs font-normal text-slate-400">{i + 1}</span>
        </button>
      ))}
    </div>
  )
}
