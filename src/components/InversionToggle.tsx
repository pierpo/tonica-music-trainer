interface Props {
  value: boolean
  onChange: (value: boolean) => void
}

export function InversionToggle({ value, onChange }: Props) {
  return (
    <label className="flex cursor-pointer touch-manipulation select-none items-center justify-center gap-2 text-sm text-slate-400">
      <span>Renversements&nbsp;:</span>
      <button
        role="switch"
        aria-checked={value}
        onClick={() => onChange(!value)}
        className={`relative h-6 w-11 shrink-0 touch-manipulation rounded-full transition ${
          value ? 'bg-indigo-500' : 'bg-slate-700'
        }`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition ${
            value ? 'left-[22px]' : 'left-0.5'
          }`}
        />
      </button>
    </label>
  )
}
