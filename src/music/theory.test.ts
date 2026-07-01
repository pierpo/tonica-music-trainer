import { describe, expect, it } from 'vitest'
import { buildChord, chordSymbol, noteName } from './theory'

// Do majeur : tonique = C4 (MIDI 60).
const C4 = 60

describe('buildChord — triades diatoniques en Do majeur', () => {
  it('I = C E G', () => {
    expect(buildChord(C4, 'major', 0)).toEqual([60, 64, 67])
  })
  it('IV = F A C', () => {
    expect(buildChord(C4, 'major', 3)).toEqual([65, 69, 72])
  })
  it('V = G B D', () => {
    expect(buildChord(C4, 'major', 4)).toEqual([67, 71, 74])
  })
  it('vii° = B D F', () => {
    expect(buildChord(C4, 'major', 6)).toEqual([71, 74, 77])
  })
})

describe('buildChord — renversements', () => {
  it('I 1er renversement = E G C', () => {
    expect(buildChord(C4, 'major', 0, { inversion: 1 })).toEqual([64, 67, 72])
  })
  it('I 2e renversement = G C E', () => {
    expect(buildChord(C4, 'major', 0, { inversion: 2 })).toEqual([67, 72, 76])
  })
})

describe('buildChord — La mineur (relatif)', () => {
  const A3 = 57
  it('i = A C E', () => {
    expect(buildChord(A3, 'minor', 0)).toEqual([57, 60, 64])
  })
})

describe('noteName', () => {
  it('mappe MIDI → nom', () => {
    expect(noteName(60)).toBe('C4')
    expect(noteName(69)).toBe('A4')
    expect(noteName(61)).toBe('C#4')
  })
})

describe('chordSymbol — Do majeur', () => {
  it('I = C, IV = F, V = G (majeurs, pas de suffixe)', () => {
    expect(chordSymbol(C4, 'major', 0)).toBe('C')
    expect(chordSymbol(C4, 'major', 3)).toBe('F')
    expect(chordSymbol(C4, 'major', 4)).toBe('G')
  })
  it('ii = Dm, vi = Am (mineurs, suffixe m)', () => {
    expect(chordSymbol(C4, 'major', 1)).toBe('Dm')
    expect(chordSymbol(C4, 'major', 5)).toBe('Am')
  })
  it('vii° = B° (diminué, suffixe °)', () => {
    expect(chordSymbol(C4, 'major', 6)).toBe('B°')
  })
})

describe('chordSymbol — La mineur', () => {
  const A3 = 57
  it('i = Am, VI = F, ii° = B°', () => {
    expect(chordSymbol(A3, 'minor', 0)).toBe('Am')
    expect(chordSymbol(A3, 'minor', 5)).toBe('F')
    expect(chordSymbol(A3, 'minor', 1)).toBe('B°')
  })
})

describe('chordSymbol — indépendant du renversement / octave de la tonique', () => {
  it('reste basé sur la fondamentale réelle quelle que soit l’octave de départ', () => {
    expect(chordSymbol(C4 + 12, 'major', 3)).toBe('F')
  })
})
