interface DateBadgesProps {
  dates: string[];
}

export function DateBadges({ dates }: DateBadgesProps) {
  if (dates.length === 0) {
    return <p className="text-sm text-stone-400 italic">Chưa có ngày đi học</p>;
  }
  return (
    <div className="flex flex-wrap justify-center gap-2 sm:justify-start">
      {dates.map((d, i) => (
        <span
          key={`${d}-${i}`}
          className="inline-flex min-w-[3.25rem] items-center justify-center rounded-lg border-2 border-teal-500/90 bg-white px-2.5 py-1.5 text-sm font-semibold tabular-nums text-teal-800 shadow-sm ring-1 ring-teal-600/10"
        >
          {d}
        </span>
      ))}
    </div>
  );
}
