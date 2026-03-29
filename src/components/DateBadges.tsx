import { dateChipClassName } from '../constants/branding';

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
        <span key={`${d}-${i}`} className={dateChipClassName}>
          {d}
        </span>
      ))}
    </div>
  );
}
