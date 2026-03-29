import type { ReactNode } from 'react';
import { useCallback, useState } from 'react';
import { MONTH_OPTIONS } from '../constants/months';
import { PAYMENT_QR_PASSWORD } from '../constants/paymentQr';
import type { InvoiceFormData } from '../types/invoice';
import { AttendanceDatesField } from './AttendanceDatesField';
import { PaymentQrPasswordModal } from './PaymentQrPasswordModal';

interface InvoiceFormProps {
  form: InvoiceFormData;
  onChange: (next: InvoiceFormData) => void;
  onReset: () => void;
  errors: string[];
}

export function InvoiceForm({ form, onChange, onReset, errors }: InvoiceFormProps) {
  const set = (patch: Partial<InvoiceFormData>) => onChange({ ...form, ...patch });
  const monthValue = MONTH_OPTIONS.includes(form.month) ? form.month : MONTH_OPTIONS[0];
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [qrPasswordError, setQrPasswordError] = useState<string | null>(null);
  const clearQrError = useCallback(() => setQrPasswordError(null), []);

  const setPoint = (index: number, value: string) => {
    const next = [...form.remarkPoints];
    next[index] = value;
    set({ remarkPoints: next });
  };

  const addPoint = () => set({ remarkPoints: [...form.remarkPoints, ''] });

  const removePoint = (index: number) => {
    if (form.remarkPoints.length <= 1) {
      setPoint(0, '');
      return;
    }
    set({
      remarkPoints: form.remarkPoints.filter((_, i) => i !== index),
    });
  };

  const handlePaymentQrToggle = (wantOn: boolean) => {
    if (!wantOn) {
      set({ showPaymentQr: false });
      setQrModalOpen(false);
      setQrPasswordError(null);
      return;
    }
    setQrPasswordError(null);
    setQrModalOpen(true);
  };

  const handleQrPasswordSubmit = (password: string) => {
    if (password !== PAYMENT_QR_PASSWORD) {
      setQrPasswordError('Sai mật khẩu. Thử lại.');
      return;
    }
    set({ showPaymentQr: true });
    setQrModalOpen(false);
    setQrPasswordError(null);
  };

  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm sm:p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-stone-900">Nhập thông tin</h2>
        <button
          type="button"
          onClick={onReset}
          className="min-h-[44px] shrink-0 rounded-lg border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-stone-700 transition hover:bg-stone-50 active:bg-stone-100"
        >
          Đặt lại mẫu
        </button>
      </div>

      {errors.length > 0 && (
        <ul className="mb-4 list-inside list-disc rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
          {errors.map((e) => (
            <li key={e}>{e}</li>
          ))}
        </ul>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Tên lớp">
          <input
            className="input"
            value={form.className}
            onChange={(e) => set({ className: e.target.value })}
            placeholder="VD: LỚP TIẾNG ANH CÔ QUỲNH"
            autoComplete="off"
          />
        </Field>
        <Field label="Tháng">
          <select
            className="input min-h-[44px] cursor-pointer appearance-none bg-[length:1rem] bg-[right_0.75rem_center] bg-no-repeat pr-10"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23575352'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`,
            }}
            value={monthValue}
            onChange={(e) => set({ month: e.target.value })}
          >
            {MONTH_OPTIONS.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Tên học sinh" className="sm:col-span-2">
          <input
            className="input"
            value={form.studentName}
            onChange={(e) => set({ studentName: e.target.value })}
            placeholder="Họ và tên"
            autoComplete="name"
          />
        </Field>
        <Field label="Học phí / buổi (VNĐ)">
          <input
            className="input min-h-[44px]"
            type="number"
            inputMode="numeric"
            min={0}
            step={1000}
            value={form.feePerSession}
            onChange={(e) => set({ feePerSession: Number(e.target.value) || 0 })}
          />
        </Field>
        <Field label="Số buổi học">
          <input
            className="input min-h-[44px]"
            type="number"
            inputMode="numeric"
            min={1}
            step={1}
            value={form.sessionCount}
            onChange={(e) => set({ sessionCount: Math.max(1, parseInt(e.target.value, 10) || 1) })}
          />
        </Field>
        <div className="sm:col-span-2">
          <AttendanceDatesField
            dates={form.attendanceDates}
            onChange={(attendanceDates) => set({ attendanceDates })}
          />
        </div>

        <div className="sm:col-span-2">
          <div className="rounded-xl border border-teal-100 bg-gradient-to-b from-teal-50/40 to-stone-50/30 p-4 ring-1 ring-teal-100/60 sm:p-5">
            <p className="text-base font-semibold text-stone-900">Nhận xét</p>
            <p className="mt-1 text-xs text-stone-500">
              Mỗi ô là một ý — trên phiếu tự thêm gạch đầu dòng.
            </p>

            <div className="mt-4">
              <span className="text-sm font-medium text-stone-700">Từng ý nhận xét</span>
              <div className="mt-2 space-y-2">
                {form.remarkPoints.map((line, i) => (
                  <div key={i} className="flex gap-2">
                    <span
                      className="mt-2.5 shrink-0 select-none text-sm font-semibold text-teal-600"
                      aria-hidden
                    >
                      {i + 1}.
                    </span>
                    <textarea
                      className="input min-h-[52px] flex-1 resize-y"
                      rows={2}
                      value={line}
                      onChange={(e) => setPoint(i, e.target.value)}
                      placeholder="Một ý nhận xét (ngữ pháp, thái độ, cần cải thiện…)"
                    />
                    <button
                      type="button"
                      onClick={() => removePoint(i)}
                      className="mt-0.5 h-11 min-w-[2.75rem] shrink-0 rounded-lg border border-stone-200 bg-white text-sm font-medium text-stone-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-700"
                      aria-label={`Xóa ý ${i + 1}`}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={addPoint}
                className="mt-3 text-sm font-semibold text-teal-700 underline decoration-teal-300 underline-offset-2 transition hover:text-teal-900"
              >
                + Thêm ý
              </button>
            </div>
          </div>
        </div>

        <div className="sm:col-span-2">
          <div className="flex items-center justify-between gap-4 rounded-xl border border-emerald-100 bg-gradient-to-r from-emerald-50/60 to-white px-4 py-3 ring-1 ring-emerald-100/70">
            <div>
              <p className="text-sm font-semibold text-stone-900">Hiện mã QR thanh toán</p>
              <p className="mt-0.5 text-xs text-stone-500">Hiện dưới nhận xét trên phiếu. Bật cần mật khẩu.</p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={form.showPaymentQr}
              onClick={() => handlePaymentQrToggle(!form.showPaymentQr)}
              className={`relative h-8 w-14 shrink-0 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 ${
                form.showPaymentQr ? 'bg-teal-600' : 'bg-stone-300'
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 h-7 w-7 rounded-full bg-white shadow transition-transform ${
                  form.showPaymentQr ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      <PaymentQrPasswordModal
        open={qrModalOpen}
        error={qrPasswordError}
        onClose={() => {
          setQrModalOpen(false);
          setQrPasswordError(null);
        }}
        onSubmit={handleQrPasswordSubmit}
        onClearError={clearQrError}
      />
    </div>
  );
}

function Field({
  label,
  className = '',
  children,
}: {
  label: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1.5 block text-sm font-medium text-stone-700">{label}</span>
      {children}
    </label>
  );
}
