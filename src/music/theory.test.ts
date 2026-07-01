import { describe, expect, it } from 'vitest'
import { buildChord, noteName } from './theory'

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
