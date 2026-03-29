import type { ReactNode } from 'react';
import { MONTH_OPTIONS } from '../constants/months';
import type { InvoiceFormData } from '../types/invoice';
import { parseAttendanceDates } from '../utils/parseDates';

interface InvoiceFormProps {
  form: InvoiceFormData;
  onChange: (next: InvoiceFormData) => void;
  onReset: () => void;
  errors: string[];
}

export function InvoiceForm({ form, onChange, onReset, errors }: InvoiceFormProps) {
  const set = (patch: Partial<InvoiceFormData>) => onChange({ ...form, ...patch });
  const monthValue = MONTH_OPTIONS.includes(form.month) ? form.month : MONTH_OPTIONS[0];

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
        <Field label="Danh sách ngày đi học" className="sm:col-span-2">
          <textarea
            className="input min-h-[120px] resize-y font-mono text-sm"
            value={form.attendanceDates.join('\n')}
            onChange={(e) => set({ attendanceDates: parseAttendanceDates(e.target.value) })}
            placeholder={'Mỗi dòng một ngày, hoặc cách nhau bởi dấu phẩy\nVD: 08/01'}
          />
          <p className="mt-1 text-xs text-stone-500">Mỗi dòng một ngày (hoặc dùng dấu phẩy).</p>
        </Field>

        <div className="sm:col-span-2">
          <div className="rounded-xl border border-teal-100 bg-gradient-to-b from-teal-50/40 to-stone-50/30 p-4 ring-1 ring-teal-100/60 sm:p-5">
            <p className="text-base font-semibold text-stone-900">Nhận xét</p>
            <p className="mt-1 text-xs text-stone-500">
              Viết chủ đề một đoạn; các ý bên dưới — phiếu in sẽ format đẹp, không cần gõ gạch đầu dòng.
            </p>

            <div className="mt-4">
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-stone-700">
                  Chủ đề / tổng quan
                </span>
                <textarea
                  className="input min-h-[88px] resize-y"
                  value={form.remarkTopic}
                  onChange={(e) => set({ remarkTopic: e.target.value })}
                  placeholder='VD: Con học về chủ đề "Body Parts".'
                />
              </label>
            </div>

            <div className="mt-5">
              <span className="text-sm font-medium text-stone-700">Chi tiết từng ý</span>
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
      </div>
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
