import { CacheStorage, SplendidGrandPiano } from 'smplr'
import type { Chord } from '../music/progression'
import { buildChord, type Mode } from '../music/theory'

/** Repère joué avant la suite pour poser la tonalité. */
export type ReferenceMode = 'cadence' | 'tonic' | 'none'

// Singleton : un seul AudioContext + un seul piano échantillonné pour toute l'app.

let context: AudioContext | null = null
let piano: SplendidGrandPiano | null = null
let ready: Promise<void> | null = null

function getContext(): AudioContext {
  if (!context) {
    context = new AudioContext()
  }
  return context
}

// Nom versionné du cache des samples. La clé de cache est l'URL du sample et smplr ne
// revalide jamais : pour forcer tous les clients à retélécharger (changement de piano,
// de baseUrl, etc.), il suffit d'incrémenter ce numéro de version.
const PIANO_CACHE_NAME = 'tonica-piano-v1'

/** Démarre le chargement des samples. Idempotent : renvoie toujours la même promesse. */
export function loadPiano(): Promise<void> {
  if (!ready) {
    const ctx = getContext()
    // CacheStorage met les samples en cache (Cache API du navigateur) : le premier
    // chargement passe par le réseau, les refreshs suivants lisent depuis le cache.
    piano = new SplendidGrandPiano(ctx, { storage: new CacheStorage(PIANO_CACHE_NAME) })
    // Nettoyage best-effort des anciennes versions du cache (évite le poids mort).
    void purgeOldPianoCaches()
    ready = piano.load.then(() => undefined)
  }
  return ready
}

/** Supprime les caches piano d'anciennes versions (garde uniquement PIANO_CACHE_NAME). */
async function purgeOldPianoCaches(): Promise<void> {
  if (typeof caches === 'undefined') return
  try {
    const keys = await caches.keys()
    await Promise.all(
      keys
        .filter((k) => k.startsWith('tonica-piano-') && k !== PIANO_CACHE_NAME)
        .map((k) => caches.delete(k)),
    )
  } catch {
    // Nettoyage non critique : on ignore toute erreur.
  }
}

/** À appeler sur le 1er geste utilisateur pour lever le blocage autoplay du navigateur. */
export async function resume(): Promise<void> {
  const ctx = getContext()
  if (ctx.state !== 'running') {
    try {
      await ctx.resume()
    } catch {
      // Un resume rejeté (hors geste utilisateur, ou contexte déjà clos) ne doit
      // pas faire échouer le handler de clic ; la prochaine interaction réessaiera.
    }
  }
}

const NOTE_DURATION = 1.6 // secondes, un accord tenu
const CHORD_GAP = 1.1 // secondes entre le début de deux accords d'une suite

/** Rappels facultatifs pour synchroniser l'UI (surbrillance) sur la lecture audio. */
export interface SequenceHandlers {
  /** Appelé au moment exact où l'accord d'index `index` de la suite commence. */
  onChordStart?: (index: number) => void
  /** Appelé une fois toute la lecture (résolution comprise) terminée. */
  onDone?: () => void
}

// setTimeout planifiés pour les rappels UI, annulés dès qu'une nouvelle lecture démarre
// (évite qu'un rappel obsolète d'une lecture précédente ne déclenche une surbrillance erronée).
let pendingTimers: ReturnType<typeof setTimeout>[] = []

function clearPendingTimers(): void {
  pendingTimers.forEach(clearTimeout)
  pendingTimers = []
}

/** Planifie l'appel de `cb` à l'instant (horloge audio) `atTime`. */
function scheduleCallback(atTime: number, cb: () => void): void {
  const delayMs = Math.max(0, (atTime - getContext().currentTime) * 1000)
  pendingTimers.push(setTimeout(cb, delayMs))
}

/** Coupe toutes les notes en cours ET planifiées (évite les lectures qui se superposent). */
export function stopAll(): void {
  piano?.stop()
  clearPendingTimers()
}

/** Joue un accord (notes MIDI) à un instant absolu de l'horloge audio. */
export function playChord(notes: number[], atTime: number, duration = NOTE_DURATION): void {
  if (!piano) return
  for (const note of notes) {
    piano.start({ note, time: atTime, duration, velocity: 80 })
  }
}

/** Joue un accord immédiatement (léger délai pour une attaque nette). */
export function playChordNow(notes: number[], duration = NOTE_DURATION, onDone?: () => void): void {
  stopAll()
  const at = getContext().currentTime + 0.05
  playChord(notes, at, duration)
  if (onDone) scheduleCallback(at + duration, onDone)
}

/**
 * Planifie une suite d'accords SANS couper le son en cours (usage interne). Rejoue le
 * 1er accord (toujours la tonique, cf. `generateRound`) à la fin pour boucler dessus et
 * faire entendre la résolution (ex. I–IV–V devient I–IV–V–I).
 */
function scheduleSequence(
  chords: Chord[],
  opts: { gap?: number; startAt?: number } & SequenceHandlers = {},
): number {
  const ctx = getContext()
  const gap = opts.gap ?? CHORD_GAP
  const start = opts.startAt ?? ctx.currentTime + 0.1
  const withResolution = chords.length > 0 ? [...chords, chords[0]] : chords
  withResolution.forEach((chord, i) => {
    const at = start + i * gap
    playChord(chord.notes, at)
    if (i < chords.length && opts.onChordStart) {
      const index = i
      scheduleCallback(at, () => opts.onChordStart!(index))
    }
  })
  const totalDuration = withResolution.length * gap
  if (opts.onDone) scheduleCallback(start + totalDuration, opts.onDone)
  return totalDuration
}

/** Joue une suite d'accords en coupant d'abord toute lecture en cours. */
export function playSequence(
  chords: Chord[],
  opts: { gap?: number; startAt?: number } & SequenceHandlers = {},
): number {
  stopAll()
  return scheduleSequence(chords, opts)
}

const CADENCE_DEGREES = [0, 3, 4, 0]
const CADENCE_GAP = 0.6

/**
 * Joue le repère de tonalité à partir de `startAt` et renvoie l'instant où il se termine.
 * - `cadence` : I–IV–V–I
 * - `tonic`   : uniquement l'accord de tonique
 * - `none`    : rien
 */
function scheduleReference(
  tonicMidi: number,
  mode: Mode,
  reference: ReferenceMode,
  startAt: number,
): number {
  if (reference === 'none') return startAt
  if (reference === 'tonic') {
    playChord(buildChord(tonicMidi, mode, 0), startAt, 1.1)
    return startAt + 1.1
  }
  CADENCE_DEGREES.forEach((degree, i) => {
    playChord(buildChord(tonicMidi, mode, degree), startAt + i * CADENCE_GAP, 0.9)
  })
  return startAt + CADENCE_DEGREES.length * CADENCE_GAP
}

/** Joue le repère de tonalité seul (bouton de rappel). */
export function playReference(tonicMidi: number, mode: Mode, reference: ReferenceMode): void {
  stopAll()
  scheduleReference(tonicMidi, mode, reference, getContext().currentTime + 0.1)
}

/** Joue le repère de tonalité puis la suite à deviner, enchaînés proprement. */
export function playRound(
  tonicMidi: number,
  mode: Mode,
  chords: Chord[],
  reference: ReferenceMode = 'cadence',
  handlers: SequenceHandlers = {},
): void {
  stopAll()
  const ctx = getContext()
  let cursor = ctx.currentTime + 0.1
  const refEnd = scheduleReference(tonicMidi, mode, reference, cursor)
  cursor = refEnd + (reference === 'none' ? 0 : 0.7) // respiration avant la suite
  scheduleSequence(chords, { startAt: cursor, ...handlers })
}
