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
        <header className="mb-6 text-center sm:mb-8">
          <div className="mb-3 flex items-center justify-center gap-2.5">
            <span
              className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-600 shadow-sm ring-1 ring-teal-700/20"
              aria-hidden
            >
              <svg className="h-6 w-6" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="9" y="8" width="6" height="15" rx="1" fill="#ffffff" />
                <rect x="17" y="8" width="6" height="15" rx="1" fill="#ccfbf1" />
                <rect x="15" y="8" width="2" height="15" fill="#99f6e4" />
              </svg>
            </span>
            <h1 className="text-2xl font-bold text-stone-900 sm:text-3xl">Phiếu học phí</h1>
          </div>
          <p className="mt-2 text-pretty text-sm text-stone-600">
            Điền form bên dưới — bấm <span className="font-medium text-teal-800">Xem trước</span> để xem phiếu,
            xuất PNG ở thanh dưới.
          </p>
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
