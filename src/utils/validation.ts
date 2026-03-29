import type { InvoiceFormData } from '../types/invoice';

export interface ValidationResult {
  ok: boolean;
  errors: string[];
}

export function validateInvoiceForm(form: InvoiceFormData): ValidationResult {
  const errors: string[] = [];

  if (!form.className.trim()) errors.push('Vui lòng nhập tên lớp.');
  if (!form.month.trim()) errors.push('Vui lòng chọn tháng.');
  if (!form.studentName.trim()) errors.push('Vui lòng nhập tên học sinh.');

  if (!Number.isFinite(form.feePerSession) || form.feePerSession < 0) {
    errors.push('Học phí / buổi phải là số ≥ 0.');
  }
  if (!Number.isInteger(form.sessionCount) || form.sessionCount < 1) {
    errors.push('Số buổi học phải là số nguyên ≥ 1.');
  }
  if (form.attendanceDates.length === 0) {
    errors.push('Cần ít nhất một ngày đi học.');
  }

  return { ok: errors.length === 0, errors };
}
