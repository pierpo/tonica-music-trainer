// Théorie musicale : gammes, degrés, construction d'accords en notes MIDI.
// Aucune dépendance externe → facilement testable.

export type Mode = 'major' | 'minor'

/** Intervalles (en demi-tons) depuis la tonique pour chaque mode. */
export const SCALE_INTERVALS: Record<Mode, number[]> = {
  major: [0, 2, 4, 5, 7, 9, 11],
  minor: [0, 2, 3, 5, 7, 8, 10], // mineur naturel
}

/** Qualité de la triade diatonique pour chaque degré (0 = I). */
export type ChordQuality = 'maj' | 'min' | 'dim'

export const DIATONIC_QUALITIES: Record<Mode, ChordQuality[]> = {
  major: ['maj', 'min', 'min', 'maj', 'maj', 'min', 'dim'],
  minor: ['min', 'dim', 'maj', 'min', 'min', 'maj', 'maj'],
}

/** Libellés en chiffres romains, indexés par degré (0 = I). */
export const ROMAN_LABELS: Record<Mode, string[]> = {
  major: ['I', 'ii', 'iii', 'IV', 'V', 'vi', 'vii°'],
  minor: ['i', 'ii°', 'III', 'iv', 'v', 'VI', 'VII'],
}

const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']

/**
 * Convertit un numéro MIDI en nom de note (ex. 60 → "C4"), format attendu par smplr.
 * Convention : MIDI 60 = C4.
 */
export function noteName(midi: number): string {
  const octave = Math.floor(midi / 12) - 1
  return NOTE_NAMES[((midi % 12) + 12) % 12] + octave
}

/**
 * Construit les notes MIDI d'un accord diatonique.
 * @param tonicMidi note MIDI de la tonique de la tonalité
 * @param mode      majeur ou mineur
 * @param degree    degré (0 = I ... 6 = vii°)
 * @param opts.seventh   ajoute la 7ème diatonique
 * @param opts.inversion renversement (0 = état fondamental, 1 = 1er renversement, ...)
 */
export function buildChord(
  tonicMidi: number,
  mode: Mode,
  degree: number,
  opts: { seventh?: boolean; inversion?: number } = {},
): number[] {
  const scale = SCALE_INTERVALS[mode]
  // On construit tierces empilées sur la gamme (degré, degré+2, degré+4, ...).
  const degrees = opts.seventh ? [0, 2, 4, 6] : [0, 2, 4]
  const notes = degrees.map((step) => {
    const idx = degree + step
    const octaveShift = Math.floor(idx / 7)
    const interval = scale[idx % 7] + 12 * octaveShift
    return tonicMidi + interval
  })

  // Renversement : on monte d'une octave les `inversion` notes les plus graves.
  const inversion = ((opts.inversion ?? 0) % notes.length + notes.length) % notes.length
  for (let i = 0; i < inversion; i++) {
    notes[i] += 12
  }
  notes.sort((a, b) => a - b)
  return notes
}

export const DEGREE_COUNT = 7
