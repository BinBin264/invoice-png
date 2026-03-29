import { useState } from 'react';
import { dateChipClassName } from '../constants/branding';
import { sortDdMmStrings } from '../utils/attendanceDates';

function pad2(n: number) {
  return String(n).padStart(2, '0');
}

function todayIsoLocal(): string {
  const d = new Date();
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

/** yyyy-mm-dd (local) → dd/mm */
function isoDateToDdMm(iso: string): string {
  const [y, m, d] = iso.split('-').map((x) => parseInt(x, 10));
  if (!y || !m || !d || Number.isNaN(y + m + d)) return '';
  return `${pad2(d)}/${pad2(m)}`;
}

interface AttendanceDatesFieldProps {
  dates: string[];
  onChange: (dates: string[]) => void;
}

export function AttendanceDatesField({ dates, onChange }: AttendanceDatesFieldProps) {
  const [pickIso, setPickIso] = useState(todayIsoLocal);

  const addPickedDate = () => {
    const ddmm = isoDateToDdMm(pickIso);
    if (!ddmm) return;
    if (dates.includes(ddmm)) return;
    onChange(sortDdMmStrings([...dates, ddmm]));
  };

  const removeAt = (index: number) => {
    onChange(dates.filter((_, i) => i !== index));
  };

  return (
    <div>
      <span className="mb-2 block text-sm font-medium text-stone-800">Danh sách ngày đi học</span>

      <div className="flex flex-col gap-3 rounded-xl border border-teal-100 bg-teal-50/30 p-3 ring-1 ring-teal-100/50 sm:flex-row sm:items-end sm:gap-2">
        <div className="min-w-0 flex-1">
          <label className="mb-1 block text-xs font-medium text-stone-600" htmlFor="attendance-date-pick">
            Chọn ngày (bấm lịch — đổi tháng/năm trong ô lịch)
          </label>
          <input
            id="attendance-date-pick"
            type="date"
            className="input min-h-[44px] w-full cursor-pointer"
            value={pickIso}
            onChange={(e) => setPickIso(e.target.value)}
          />
        </div>
        <button
          type="button"
          onClick={addPickedDate}
          className="min-h-[44px] shrink-0 rounded-xl bg-teal-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-700 active:bg-teal-800"
        >
          Thêm ngày
        </button>
      </div>

      {dates.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {dates.map((d, i) => (
            <span
              key={`${d}-${i}`}
              className={`${dateChipClassName} gap-0.5 py-1 pl-3 pr-1`}
            >
              <span className="tabular-nums">{d}</span>
              <button
                type="button"
                onClick={() => removeAt(i)}
                className="flex h-7 min-w-[1.75rem] items-center justify-center rounded-lg text-stone-500 transition hover:bg-teal-200/60 hover:text-red-700"
                aria-label={`Xóa ngày ${d}`}
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
