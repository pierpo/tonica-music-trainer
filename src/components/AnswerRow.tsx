import { ROMAN_LABELS, type Mode } from '../music/theory'
import type { Round } from '../music/progression'
import type { Phase } from '../game/useGame'

interface Props {
  round: Round
  guesses: (number | null)[]
  phase: Phase
  mode: Mode
  onReplayChord: (index: number) => void
}

export function AnswerRow({ round, guesses, phase, mode, onReplayChord }: Props) {
  const labels = ROMAN_LABELS[mode]
  return (
    <div className="flex flex-wrap justify-center gap-2">
      {round.chords.map((chord, i) => {
        const guess = guesses[i]
        const revealed = phase === 'revealed'
        const correct = guess === chord.degree

        let cls = 'border-slate-600 bg-slate-800 text-slate-200'
        if (revealed) {
          cls = correct
            ? 'border-emerald-500 bg-emerald-500/15 text-emerald-300'
            : 'border-rose-500 bg-rose-500/15 text-rose-300'
        } else if (guess !== null) {
          cls = 'border-indigo-500 bg-indigo-500/15 text-indigo-200'
        }

        return (
          <button
            key={i}
            onClick={() => onReplayChord(i)}
            className={`flex h-20 w-14 touch-manipulation select-none flex-col items-center justify-center rounded-xl border-2 text-xl font-bold transition hover:brightness-125 sm:w-16 ${cls}`}
            title="Réécouter cet accord"
          >
            <span className="text-xs font-normal text-slate-400">#{i + 1}</span>
            <span>{guess !== null ? labels[guess] : '—'}</span>
            {revealed && !correct && (
              <span className="text-xs font-normal text-emerald-400">{labels[chord.degree]}</span>
            )}
          </button>
        )
      })}
    </div>
  )
}
