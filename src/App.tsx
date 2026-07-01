import { useEffect } from 'react'
import { useGame } from './game/useGame'
import { LoadingGate } from './components/LoadingGate'
import { LevelSelect } from './components/LevelSelect'
import { Scoreboard } from './components/Scoreboard'
import { DegreePad } from './components/DegreePad'
import { AnswerRow } from './components/AnswerRow'
import { Controls } from './components/Controls'
import { ReferenceSelect } from './components/ReferenceSelect'
import { InversionToggle } from './components/InversionToggle'

export default function App() {
  const game = useGame()
  const { round, level, phase, guesses } = game
  const canSubmit = phase === 'guessing' && guesses.length > 0 && guesses.every((g) => g !== null)

  // Raccourcis clavier : 1–7 = degrés (dans l'ordre du niveau), Espace = rejouer,
  // Entrée = valider / suivant, Backspace = effacer.
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.repeat) return
      if (e.code === 'Space') {
        e.preventDefault()
        game.replaySequence()
        return
      }
      if (e.key === 'Enter') {
        e.preventDefault()
        if (phase === 'guessing' && canSubmit) game.submit()
        else if (phase === 'revealed') game.newRound()
        return
      }
      if (e.key === 'Backspace') {
        e.preventDefault()
        game.undo()
        return
      }
      const n = parseInt(e.key, 10)
      if (n >= 1 && n <= level.degrees.length) {
        game.pickDegree(level.degrees[n - 1])
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [game, level, phase, canSubmit])

  return (
    <div className="min-h-[100dvh] bg-slate-900 text-slate-100">
      <LoadingGate ready={game.ready}>
        <main className="mx-auto flex max-w-2xl flex-col gap-6 px-4 py-6 sm:gap-8 sm:py-8">
          <header className="text-center">
            <h1 className="text-xl font-bold sm:text-2xl">🎹 Tonica</h1>
            <p className="mt-1 text-sm text-slate-400">
              Reconnais les degrés d'une suite d'accords à l'oreille.
            </p>
          </header>

          <LevelSelect current={level} onSelect={game.setLevel} />
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            <ReferenceSelect value={game.reference} onChange={game.setReference} />
            <InversionToggle value={game.inversions} onChange={game.setInversions} />
          </div>
          <Scoreboard score={game.score} streak={game.streak} bestStreak={game.bestStreak} />

          {!round ? (
            <div className="flex flex-col items-center gap-3">
              <p className="text-slate-400">Choisis un niveau pour commencer.</p>
              <button
                onClick={game.newRound}
                className="rounded-lg bg-indigo-500 px-6 py-3 font-semibold text-white transition hover:bg-indigo-400 active:scale-95"
              >
                ▶ Commencer
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-8">
              <AnswerRow
                round={round}
                guesses={guesses}
                phase={phase}
                mode={round.mode}
                onReplayChord={game.replayChord}
              />
              <Controls
                phase={phase}
                canSubmit={canSubmit}
                reference={game.reference}
                onReplaySequence={game.replaySequence}
                onReplayReference={game.replayReference}
                onUndo={game.undo}
                onSubmit={game.submit}
                onNext={game.newRound}
              />
              <DegreePad
                level={level}
                mode={round.mode}
                disabled={phase !== 'guessing'}
                onPick={game.pickDegree}
              />
            </div>
          )}

          <footer className="hidden text-center text-xs text-slate-500 sm:block">
            Raccourcis : {level.degrees.map((_, i) => i + 1).join('/')} = degrés · Espace =
            rejouer · Entrée = valider/suivant · ⌫ = effacer
          </footer>
        </main>
      </LoadingGate>
    </div>
  )
}
