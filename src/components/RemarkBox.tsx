interface RemarkBoxProps {
  points: string[];
}

export function RemarkBox({ points }: RemarkBoxProps) {
  const list = points.map((p) => p.trim()).filter(Boolean);

  const shell =
    'rounded-xl border-2 border-amber-200/90 bg-gradient-to-br from-amber-50 via-orange-50/40 to-amber-50/90 p-4 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.85)] ring-1 ring-amber-900/5';

  if (list.length === 0) {
    return (
      <div className={shell}>
        <p className="text-center text-[11px] font-bold tracking-[0.2em] text-amber-900/80">
          NHẬN XÉT
        </p>
        <p className="mt-3 text-center text-sm text-stone-400">—</p>
      </div>
    );
  }

  return (
    <div className={shell}>
      <p className="text-center text-[11px] font-bold tracking-[0.2em] text-amber-900/80">
        NHẬN XÉT
      </p>
      <ul className="mt-3 space-y-2.5 pl-0.5 text-sm leading-relaxed text-stone-800">
        {list.map((line, i) => (
          <li key={i} className="flex gap-2.5">
            <span className="mt-0.5 shrink-0 font-semibold text-teal-700" aria-hidden>
              –
            </span>
            <span className="min-w-0 flex-1 leading-relaxed">{line}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
