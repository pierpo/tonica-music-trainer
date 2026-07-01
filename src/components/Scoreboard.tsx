interface Props {
  score: number
  streak: number
  bestStreak: number
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex flex-col items-center rounded-lg bg-slate-800 px-4 py-2">
      <span className="text-2xl font-bold text-white tabular-nums">{value}</span>
      <span className="text-xs uppercase tracking-wide text-slate-400">{label}</span>
    </div>
  )
}

export function Scoreboard({ score, streak, bestStreak }: Props) {
  return (
    <div className="flex flex-wrap justify-center gap-3">
      <Stat label="Score" value={score} />
      <Stat label="Série" value={streak} />
      <Stat label="Record" value={bestStreak} />
    </div>
  )
}
