import { useEffect, useId, useRef, useState } from 'react';

interface PaymentQrPasswordModalProps {
  open: boolean;
  error: string | null;
  onClose: () => void;
  onSubmit: (password: string) => void;
  onClearError: () => void;
}

/** Modal nhập mật khẩu bật mã QR — thay cho window.prompt */
export function PaymentQrPasswordModal({
  open,
  error,
  onClose,
  onSubmit,
  onClearError,
}: PaymentQrPasswordModalProps) {
  const [value, setValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const titleId = useId();

  useEffect(() => {
    if (!open) {
      setValue('');
      return;
    }
    onClearError();
    const t = window.setTimeout(() => inputRef.current?.focus(), 50);
    return () => window.clearTimeout(t);
  }, [open, onClearError]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center p-4 sm:items-center">
      <button
        type="button"
        aria-label="Đóng"
        className="absolute inset-0 bg-stone-900/50 backdrop-blur-[3px] transition-opacity"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative z-10 w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="overflow-hidden rounded-2xl border border-stone-200/80 bg-white shadow-2xl shadow-teal-900/15 ring-1 ring-black/5">
          <div className="bg-gradient-to-r from-teal-600 to-teal-700 px-5 py-4 text-white">
            <p id={titleId} className="text-lg font-semibold tracking-tight">
              Mật khẩu thanh toán
            </p>
            <p className="mt-1 text-sm text-teal-100/95">
              Nhập mật khẩu để hiện mã QR thanh toán trên phiếu.
            </p>
          </div>

          <div className="px-5 py-5">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-stone-700">Mật khẩu</span>
              <input
                ref={inputRef}
                type="password"
                autoComplete="off"
                value={value}
                onChange={(e) => {
                  setValue(e.target.value);
                  if (error) onClearError();
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    onSubmit(value);
                  }
                }}
                className="input min-h-[48px] border-stone-200 text-base tracking-wide"
                placeholder="••••••"
              />
            </label>
            {error && (
              <p className="mt-2 text-sm font-medium text-red-600" role="alert">
                {error}
              </p>
            )}

            <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={onClose}
                className="min-h-[48px] rounded-xl border border-stone-300 bg-white px-4 text-sm font-semibold text-stone-700 transition hover:bg-stone-50"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={() => onSubmit(value)}
                className="min-h-[48px] rounded-xl bg-teal-600 px-5 text-sm font-semibold text-white shadow-md shadow-teal-900/20 transition hover:bg-teal-700"
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
