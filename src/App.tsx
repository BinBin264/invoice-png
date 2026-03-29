import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { InvoiceForm } from './components/InvoiceForm';
import { InvoicePreview } from './components/InvoicePreview';
import { getDefaultFormData } from './data/defaultForm';
import type { InvoiceFormData } from './types/invoice';
import { computeInvoice } from './utils/computeInvoice';
import { exportPngFromElement } from './utils/exportCapture';
import {
  clearFormStorage,
  loadFormFromStorage,
  saveFormToStorage,
} from './utils/formStorage';
import { validateInvoiceForm } from './utils/validation';
import { BRAND_CLASS_NAME } from './constants/branding';

export default function App() {
  const [form, setForm] = useState<InvoiceFormData>(() => loadFormFromStorage() ?? getDefaultFormData());
  const [previewOpen, setPreviewOpen] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  const computed = useMemo(() => computeInvoice(form), [form]);
  const validation = useMemo(() => validateInvoiceForm(form), [form]);

  useEffect(() => {
    const t = window.setTimeout(() => saveFormToStorage(form), 350);
    return () => window.clearTimeout(t);
  }, [form]);

  useEffect(() => {
    if (!previewOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [previewOpen]);

  useEffect(() => {
    if (!previewOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setPreviewOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [previewOpen]);

  const handleReset = useCallback(() => {
    clearFormStorage();
    setForm(getDefaultFormData());
    setExportError(null);
  }, []);

  const runExportPng = useCallback(async () => {
    setExportError(null);
    const v = validateInvoiceForm(form);
    if (!v.ok) {
      setExportError(v.errors.join(' '));
      return;
    }
    const el = previewRef.current;
    if (!el) {
      setExportError('Không tìm thấy vùng preview.');
      return;
    }
    const safeName = form.studentName.trim().replace(/\s+/g, '-') || 'hoc-sinh';
    setBusy(true);
    try {
      await exportPngFromElement(el, `phieu-hoc-phi-${safeName}.png`);
    } catch (e) {
      setExportError(e instanceof Error ? e.message : 'Xuất file thất bại.');
    } finally {
      setBusy(false);
    }
  }, [form]);

  return (
    <div className="min-h-[100dvh] pt-[max(1.25rem,env(safe-area-inset-top,0px))]">
      <div className="relative z-10 mx-auto max-w-2xl px-4 pb-[calc(6.75rem+env(safe-area-inset-bottom,0px))] sm:px-6 sm:pb-[calc(6.75rem+env(safe-area-inset-bottom,0px))]">
        <header className="mb-5 sm:mb-7">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0f766e] via-[#0d9488] to-[#115e59] px-4 py-5 text-center text-white shadow-[0_10px_32px_-14px_rgba(15,118,110,0.4)] ring-1 ring-white/10 sm:px-6 sm:py-6">
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.14]"
              style={{
                backgroundImage:
                  'radial-gradient(circle at 20% 0%, white 0%, transparent 45%), radial-gradient(circle at 80% 100%, white 0%, transparent 40%)',
              }}
            />
            <div className="relative">
              <h1 className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 sm:gap-x-2.5">
                <span className="shrink-0 select-none text-[clamp(1.2rem,4.5vw,1.65rem)] leading-none" aria-hidden>
                  🌈
                </span>
                <span className="max-w-[min(100%,18ch)] text-balance text-center text-[clamp(1.05rem,3.8vw,1.35rem)] font-bold leading-snug tracking-tight text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.12)] sm:max-w-none">
                  {BRAND_CLASS_NAME}
                </span>
                <span className="shrink-0 select-none text-[clamp(1.2rem,4.5vw,1.65rem)] leading-none" aria-hidden>
                  🌈
                </span>
              </h1>
              <div className="mx-auto mt-3 h-px w-14 bg-white/40" aria-hidden />
              <p className="mt-3 text-base font-bold tracking-tight text-white drop-shadow-sm sm:text-lg">
                Phiếu học phí
              </p>
              <p className="mx-auto mt-2 max-w-md text-pretty text-xs leading-relaxed text-teal-100/95 sm:text-sm">
                Điền form bên dưới — bấm <span className="font-semibold text-white">Xem trước</span> để xem phiếu,
                xuất PNG ở thanh dưới.
              </p>
            </div>
          </div>
        </header>

        <InvoiceForm
          form={form}
          onChange={setForm}
          onReset={handleReset}
          errors={validation.ok ? [] : validation.errors}
        />
      </div>

      {/* Một preview: đóng thì đẩy ra ngoài màn (vẫn render để xuất PNG); mở thì full overlay */}
      <div
        role={previewOpen ? 'dialog' : undefined}
        aria-modal={previewOpen ? true : undefined}
        aria-label={previewOpen ? 'Xem trước phiếu học phí' : undefined}
        className={
          previewOpen
            ? 'fixed inset-0 z-50 flex flex-col bg-stone-900/55 backdrop-blur-[2px]'
            : 'pointer-events-none fixed left-[-9999px] top-0 z-0 w-[min(28rem,100vw)]'
        }
        onClick={previewOpen ? () => setPreviewOpen(false) : undefined}
      >
        <div
          className={
            previewOpen
              ? 'flex min-h-0 min-w-0 flex-1 flex-col'
              : ''
          }
          onClick={previewOpen ? (e) => e.stopPropagation() : undefined}
        >
          {previewOpen && (
            <div className="flex shrink-0 items-center justify-between gap-3 px-4 pb-2 pt-[max(0.75rem,env(safe-area-inset-top))]">
              <span className="text-sm font-semibold text-white">Xem trước</span>
              <button
                type="button"
                onClick={() => setPreviewOpen(false)}
                className="min-h-[44px] rounded-xl bg-white/15 px-4 text-sm font-semibold text-white ring-1 ring-white/30 transition hover:bg-white/25"
              >
                Đóng
              </button>
            </div>
          )}
          <div
            className={
              previewOpen
                ? 'flex min-h-0 flex-1 justify-center overflow-y-auto overscroll-contain px-4 pb-[max(1.5rem,env(safe-area-inset-bottom))]'
                : ''
            }
          >
            <div className={previewOpen ? 'my-auto w-full max-w-md py-2' : ''}>
              <InvoicePreview ref={previewRef} form={form} computed={computed} />
            </div>
          </div>
        </div>
      </div>

      {exportError && (
        <div
          className="fixed bottom-[calc(3.75rem+env(safe-area-inset-bottom,0px))] left-4 right-4 z-[45] rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-center text-sm text-red-800 shadow-lg sm:left-auto sm:right-auto sm:mx-auto sm:max-w-md"
          role="alert"
        >
          {exportError}
        </div>
      )}

      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-stone-200/90 bg-white/95 backdrop-blur-md supports-[backdrop-filter]:bg-white/85">
        <div className="mx-auto flex max-w-lg gap-2 px-3 py-2.5 pb-[max(0.75rem,env(safe-area-inset-bottom,0px))] pt-2 sm:max-w-2xl">
          <button
            type="button"
            onClick={() => {
              setPreviewOpen(true);
              setExportError(null);
            }}
            className="min-h-[48px] flex-1 rounded-xl border-2 border-teal-600 bg-white px-3 text-sm font-semibold text-teal-800 shadow-sm transition hover:bg-teal-50 active:bg-teal-100"
          >
            Xem trước
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={runExportPng}
            className="min-h-[48px] flex-1 rounded-xl bg-teal-600 px-3 text-sm font-semibold text-white shadow-md shadow-teal-900/15 transition hover:bg-teal-700 active:bg-teal-800 disabled:opacity-50"
          >
            {busy ? 'Đang xuất…' : 'Xuất PNG'}
          </button>
        </div>
      </div>
    </div>
  );
}
