import { buildChord, type Mode } from './theory'
import type { Level } from '../game/difficulty'

export interface Chord {
  degree: number
  notes: number[]
}

export interface Round {
  tonicMidi: number
  mode: Mode
  chords: Chord[]
}

/** Plage de toniques confortable pour l'écoute (C3 à B3 : MIDI 48–59). */
const TONIC_MIN = 48
const TONIC_MAX = 59

function randInt(min: number, max: number): number {
  return min + Math.floor(Math.random() * (max - min + 1))
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

/**
 * Génère un round aléatoire selon le niveau. Le 1er accord est toujours I/i (ancrage).
 * @param opts.inversions active des renversements aléatoires (voicings variés).
 */
export function generateRound(level: Level, opts: { inversions?: boolean } = {}): Round {
  const tonicMidi = randInt(TONIC_MIN, TONIC_MAX)
  const mode = pick(level.modes)
  const length = randInt(level.length[0], level.length[1])

  const degrees: number[] = [0] // toujours commencer sur la tonique
  for (let i = 1; i < length; i++) {
    // Éviter deux accords identiques consécutifs pour garder de la variété.
    let d = pick(level.degrees)
    let guard = 0
    while (d === degrees[i - 1] && level.degrees.length > 1 && guard++ < 10) {
      d = pick(level.degrees)
    }
    degrees.push(d)
  }

  const chords: Chord[] = degrees.map((degree) => ({
    degree,
    notes: buildChord(tonicMidi, mode, degree, {
      inversion: opts.inversions ? randInt(0, 2) : 0,
    }),
  }))

  return { tonicMidi, mode, chords }
}
