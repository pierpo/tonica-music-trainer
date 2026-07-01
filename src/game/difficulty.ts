import type { Mode } from '../music/theory'

export interface Level {
  id: number
  name: string
  description: string
  /** Degrés autorisés (0 = I ... 6 = vii°). */
  degrees: number[]
  /** Modes possibles pour un round. */
  modes: Mode[]
  /** Longueur de la suite : [min, max]. */
  length: [number, number]
}

export const LEVELS: Level[] = [
  {
    id: 1,
    name: 'Niveau 1',
    description: 'I · IV · V — majeur',
    degrees: [0, 3, 4],
    modes: ['major'],
    length: [3, 4],
  },
  {
    id: 2,
    name: 'Niveau 2',
    description: '+ ii · vi — majeur',
    degrees: [0, 1, 3, 4, 5],
    modes: ['major'],
    length: [4, 4],
  },
  {
    id: 3,
    name: 'Niveau 3',
    description: 'Tous les degrés — majeur & mineur',
    degrees: [0, 1, 2, 3, 4, 5, 6],
    modes: ['major', 'minor'],
    length: [4, 6],
  },
]
