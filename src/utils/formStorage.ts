import type { InvoiceFormData } from '../types/invoice';
import { getDefaultFormData } from '../data/defaultForm';
import { MONTH_OPTIONS } from '../constants/months';

const STORAGE_KEY = 'phieu-hoc-phi-form-v1';

function isRecord(x: unknown): x is Record<string, unknown> {
  return typeof x === 'object' && x !== null && !Array.isArray(x);
}

function isStringArray(x: unknown): x is string[] {
  return Array.isArray(x) && x.every((i) => typeof i === 'string');
}

/** Đọc form đã lưu; JSON lỗi / thiếu field → null */
export function loadFormFromStorage(): InvoiceFormData | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as unknown;
    if (!isRecord(data)) return null;

    const def = getDefaultFormData();
    const className = typeof data.className === 'string' ? data.className : def.className;
    const month =
      typeof data.month === 'string' && MONTH_OPTIONS.includes(data.month) ? data.month : def.month;
    const studentName = typeof data.studentName === 'string' ? data.studentName : def.studentName;
    const feePerSession =
      typeof data.feePerSession === 'number' && Number.isFinite(data.feePerSession)
        ? Math.max(0, data.feePerSession)
        : def.feePerSession;
    const sessionCount =
      typeof data.sessionCount === 'number' &&
      Number.isInteger(data.sessionCount) &&
      data.sessionCount >= 1
        ? data.sessionCount
        : def.sessionCount;
    const attendanceDates = isStringArray(data.attendanceDates)
      ? data.attendanceDates
      : def.attendanceDates;
    const remarkPoints =
      isStringArray(data.remarkPoints) && data.remarkPoints.length >= 1
        ? data.remarkPoints
        : def.remarkPoints;
    const showPaymentQr = typeof data.showPaymentQr === 'boolean' ? data.showPaymentQr : false;

    return {
      className,
      month,
      studentName,
      feePerSession,
      sessionCount,
      attendanceDates,
      remarkPoints,
      showPaymentQr,
    };
  } catch {
    return null;
  }
}

export function saveFormToStorage(form: InvoiceFormData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(form));
  } catch {
    /* quota / private mode — bỏ qua */
  }
}

export function clearFormStorage(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
}
