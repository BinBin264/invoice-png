import { forwardRef, type ReactNode } from 'react';
import type { InvoiceComputedData, InvoiceFormData } from '../types/invoice';
import { formatVnd } from '../utils/format';
import { DateBadges } from './DateBadges';
import { PaymentQrBox } from './PaymentQrBox';
import { RemarkBox } from './RemarkBox';
import { SummaryBox } from './SummaryBox';

interface InvoicePreviewProps {
  form: InvoiceFormData;
  computed: InvoiceComputedData;
}

function DetailRow({
  icon,
  label,
  children,
}: {
  icon: string;
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-stone-100/90 py-2.5 last:border-0">
      <span className="flex items-center gap-2 text-sm text-stone-600">
        <span className="select-none text-base opacity-90" aria-hidden>
          {icon}
        </span>
        {label}
      </span>
      <span className="text-right text-sm font-semibold tabular-nums text-stone-900">{children}</span>
    </div>
  );
}

export const InvoicePreview = forwardRef<HTMLDivElement, InvoicePreviewProps>(
  function InvoicePreview({ form, computed }, ref) {
    return (
      <div ref={ref} className="invoice-export-root mx-auto w-full max-w-md">
        {/* Khung ngoài: nền gradient nhẹ + viền sáng — PNG xuất ra có “khung” đẹp */}
        <div className="rounded-[1.25rem] bg-gradient-to-br from-teal-100/90 via-violet-50/40 to-stone-100 p-[10px] shadow-[0_20px_50px_-12px_rgba(15,118,110,0.28)] ring-1 ring-teal-900/5">
          <div className="overflow-hidden rounded-2xl border border-white/90 bg-white shadow-inner shadow-stone-200/40 ring-1 ring-black/[0.03]">
            <header className="relative bg-gradient-to-br from-[#0f766e] via-[#0d9488] to-[#115e59] px-5 pb-8 pt-7 text-center text-white">
              <div
                className="pointer-events-none absolute inset-0 opacity-[0.12]"
                style={{
                  backgroundImage:
                    'radial-gradient(circle at 20% 0%, white 0%, transparent 45%), radial-gradient(circle at 80% 100%, white 0%, transparent 40%)',
                }}
              />
              <div className="relative">
                <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 px-0.5 sm:gap-x-2.5">
                  <span className="shrink-0 text-lg leading-none sm:text-xl" aria-hidden>
                    🌈
                  </span>
                  <p className="max-w-[16rem] text-balance text-center text-[0.8125rem] font-semibold leading-snug tracking-wide text-white/95 drop-shadow-sm sm:max-w-none sm:text-[0.875rem]">
                    {form.className}
                  </p>
                  <span className="shrink-0 text-lg leading-none sm:text-xl" aria-hidden>
                    🌈
                  </span>
                </div>
                <div className="mx-auto mt-3 h-px w-12 bg-white/35 sm:mt-4" aria-hidden />
                <h1 className="mt-3 text-[22px] font-bold leading-tight tracking-tight text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.12)] sm:mt-4 sm:text-[1.65rem]">
                  PHIẾU HỌC PHÍ
                </h1>
                <p className="mt-2.5 text-sm font-medium text-teal-100/95">{form.month}</p>
              </div>
            </header>

            <div className="space-y-5 bg-gradient-to-b from-white to-stone-50/30 px-5 pb-8 pt-6">
              <div className="text-center">
                <p className="flex items-center justify-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-stone-500">
                  Học sinh <span aria-hidden>🧸</span>
                </p>
                <p className="mt-2 text-balance text-2xl font-bold tracking-tight text-stone-900 sm:text-[1.65rem]">
                  {form.studentName}
                </p>
              </div>

              <div className="rounded-xl bg-gradient-to-b from-stone-50 to-stone-50/50 px-3 ring-1 ring-stone-100/90">
                <DetailRow icon="💎" label="Học phí / buổi">
                  {formatVnd(form.feePerSession)}
                </DetailRow>
                <DetailRow icon="📝" label="Số buổi học">
                  {form.sessionCount} buổi
                </DetailRow>
              </div>

              <SummaryBox computed={computed} />

              <div>
                <p className="mb-2.5 text-center text-[11px] font-bold tracking-[0.2em] text-teal-800">
                  NGÀY ĐI HỌC
                </p>
                <DateBadges dates={form.attendanceDates} />
              </div>

              <RemarkBox points={form.remarkPoints} />

              <PaymentQrBox show={form.showPaymentQr} />
            </div>
          </div>
        </div>
      </div>
    );
  },
);
