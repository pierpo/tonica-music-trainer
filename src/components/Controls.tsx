import type { Phase } from '../game/useGame'
import type { ReferenceMode } from '../audio/piano'

interface Props {
  phase: Phase
  canSubmit: boolean
  reference: ReferenceMode
  onReplaySequence: () => void
  onReplayReference: () => void
  onUndo: () => void
  onSubmit: () => void
  onNext: () => void
}

const btn =
  'min-h-[44px] touch-manipulation select-none rounded-lg px-4 py-2 text-sm font-semibold transition active:scale-95'

const REFERENCE_LABEL: Record<ReferenceMode, string> = {
  cadence: '♪ Cadence',
  tonic: '♪ Tonique',
  none: '',
}

export function Controls({
  phase,
  canSubmit,
  reference,
  onReplaySequence,
  onReplayReference,
  onUndo,
  onSubmit,
  onNext,
}: Props) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      {reference !== 'none' && (
        <button onClick={onReplayReference} className={`${btn} bg-slate-700 text-slate-200 hover:bg-slate-600`}>
          {REFERENCE_LABEL[reference]}
        </button>
      )}
      <button onClick={onReplaySequence} className={`${btn} bg-slate-700 text-slate-200 hover:bg-slate-600`}>
        ▶ Rejouer la suite
      </button>

      {phase === 'guessing' ? (
        <>
          <button onClick={onUndo} className={`${btn} bg-slate-700 text-slate-200 hover:bg-slate-600`}>
            ⌫ Effacer
          </button>
          <button
            onClick={onSubmit}
            disabled={!canSubmit}
            className={`${btn} bg-indigo-500 text-white hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-40`}
          >
            ✓ Valider
          </button>
        </>
      ) : (
        <button onClick={onNext} className={`${btn} bg-emerald-500 text-white hover:bg-emerald-400`}>
          Suivant →
        </button>
      )}
    </div>
  )
}
