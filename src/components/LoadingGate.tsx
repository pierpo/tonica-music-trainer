interface Props {
  ready: boolean
  children: React.ReactNode
}

export function LoadingGate({ ready, children }: Props) {
  if (ready) return <>{children}</>
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 text-slate-300">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-600 border-t-indigo-400" />
      <p className="text-sm">Chargement du piano…</p>
    </div>
  )
}
