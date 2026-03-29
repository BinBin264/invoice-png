import type { InvoiceComputedData } from '../types/invoice';
import { formatVnd } from '../utils/format';

interface SummaryBoxProps {
  computed: InvoiceComputedData;
}

/** Ô TỔNG HỌC PHÍ — viền xanh, số lớn màu teal */
export function SummaryBox({ computed }: SummaryBoxProps) {
  return (
    <div className="rounded-xl border-2 border-teal-400/60 bg-gradient-to-b from-sky-50 via-teal-50/50 to-emerald-50/40 px-4 py-5 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.7)] ring-1 ring-teal-600/10">
      <p className="text-center text-[11px] font-bold tracking-[0.18em] text-teal-800/90">
        TỔNG HỌC PHÍ
      </p>
      <p className="mt-2 text-center text-3xl font-bold tracking-tight text-teal-600 tabular-nums sm:text-4xl">
        {formatVnd(computed.totalTuition)}
      </p>
    </div>
  );
}
