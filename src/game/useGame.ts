import { useCallback, useEffect, useRef, useState } from 'react'
import { generateRound, type Round } from '../music/progression'
import { LEVELS, type Level } from './difficulty'
import {
  loadPiano,
  playChordNow,
  playReference,
  playRound,
  playSequence,
  resume,
  type ReferenceMode,
} from '../audio/piano'

export type Phase = 'guessing' | 'revealed'

const BEST_STREAK_KEY = 'music-trainer:best-streak'
const REFERENCE_KEY = 'music-trainer:reference'
const INVERSIONS_KEY = 'music-trainer:inversions'

function loadBestStreak(): number {
  const raw = localStorage.getItem(BEST_STREAK_KEY)
  const n = raw ? parseInt(raw, 10) : 0
  return Number.isFinite(n) ? n : 0
}

function loadReference(): ReferenceMode {
  const raw = localStorage.getItem(REFERENCE_KEY)
  return raw === 'cadence' || raw === 'tonic' || raw === 'none' ? raw : 'cadence'
}

function loadInversions(): boolean {
  return localStorage.getItem(INVERSIONS_KEY) === 'true'
}

export function useGame() {
  const [ready, setReady] = useState(false)
  const [level, setLevelState] = useState<Level>(LEVELS[0])
  const [round, setRound] = useState<Round | null>(null)
  const [guesses, setGuesses] = useState<(number | null)[]>([])
  const [phase, setPhase] = useState<Phase>('guessing')
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [bestStreak, setBestStreak] = useState(loadBestStreak)
  const [reference, setReferenceState] = useState<ReferenceMode>(loadReference)
  const [inversions, setInversionsState] = useState<boolean>(loadInversions)

  // Réfs pour lire les valeurs courantes dans les callbacks sans les recréer.
  const roundRef = useRef<Round | null>(null)
  roundRef.current = round
  const referenceRef = useRef(reference)
  referenceRef.current = reference
  const inversionsRef = useRef(inversions)
  inversionsRef.current = inversions

  useEffect(() => {
    loadPiano().then(() => setReady(true))
  }, [])

  const startRound = useCallback((lvl: Level) => {
    const r = generateRound(lvl, { inversions: inversionsRef.current })
    setRound(r)
    setGuesses(new Array(r.chords.length).fill(null))
    setPhase('guessing')
    resume().then(() => playRound(r.tonicMidi, r.mode, r.chords, referenceRef.current))
  }, [])

  const setReference = useCallback((mode: ReferenceMode) => {
    setReferenceState(mode)
    referenceRef.current = mode
    localStorage.setItem(REFERENCE_KEY, mode)
  }, [])

  const setInversions = useCallback((value: boolean) => {
    setInversionsState(value)
    inversionsRef.current = value
    localStorage.setItem(INVERSIONS_KEY, String(value))
  }, [])

  const newRound = useCallback(() => startRound(level), [level, startRound])

  const setLevel = useCallback(
    (lvl: Level) => {
      setLevelState(lvl)
      startRound(lvl)
    },
    [startRound],
  )

  const pickDegree = useCallback(
    (degree: number) => {
      if (phase !== 'guessing') return
      setGuesses((prev) => {
        const next = [...prev]
        const idx = next.findIndex((g) => g === null)
        if (idx === -1) return prev
        next[idx] = degree
        return next
      })
    },
    [phase],
  )

  const undo = useCallback(() => {
    if (phase !== 'guessing') return
    setGuesses((prev) => {
      const next = [...prev]
      // Vide la dernière case remplie.
      for (let i = next.length - 1; i >= 0; i--) {
        if (next[i] !== null) {
          next[i] = null
          break
        }
      }
      return next
    })
  }, [phase])

  const submit = useCallback(() => {
    const r = roundRef.current
    if (!r || phase !== 'guessing') return
    if (guesses.some((g) => g === null)) return // pas encore complet

    const correctCount = r.chords.reduce(
      (acc, chord, i) => acc + (chord.degree === guesses[i] ? 1 : 0),
      0,
    )
    const allCorrect = correctCount === r.chords.length

    setScore((s) => s + correctCount)
    setStreak((prev) => {
      const nextStreak = allCorrect ? prev + 1 : 0
      if (nextStreak > bestStreak) {
        setBestStreak(nextStreak)
        localStorage.setItem(BEST_STREAK_KEY, String(nextStreak))
      }
      return nextStreak
    })
    setPhase('revealed')
  }, [guesses, phase, bestStreak])

  // --- Replay ---
  const replaySequence = useCallback(() => {
    const r = roundRef.current
    if (!r) return
    resume().then(() => playSequence(r.chords))
  }, [])

  const replayReference = useCallback(() => {
    const r = roundRef.current
    if (!r || referenceRef.current === 'none') return
    resume().then(() => playReference(r.tonicMidi, r.mode, referenceRef.current))
  }, [])

  const replayChord = useCallback((index: number) => {
    const r = roundRef.current
    if (!r || !r.chords[index]) return
    resume().then(() => playChordNow(r.chords[index].notes))
  }, [])

  return {
    ready,
    level,
    round,
    guesses,
    phase,
    score,
    streak,
    bestStreak,
    reference,
    inversions,
    newRound,
    setLevel,
    setReference,
    setInversions,
    pickDegree,
    undo,
    submit,
    replaySequence,
    replayReference,
    replayChord,
  }
}
