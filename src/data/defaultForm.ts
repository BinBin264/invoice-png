import { BRAND_CLASS_NAME } from '../constants/branding';
import { MONTH_OPTIONS } from '../constants/months';
import type { InvoiceFormData } from '../types/invoice';

function monthLabelNow(): string {
  return MONTH_OPTIONS[new Date().getMonth()] ?? 'Tháng 1';
}

/** Form trống — không còn nội dung mẫu; người dùng tự điền hoặc dùng bản đã lưu trong trình duyệt. */
export function getDefaultFormData(): InvoiceFormData {
  return {
    className: BRAND_CLASS_NAME,
    month: monthLabelNow(),
    studentName: '',
    feePerSession: 0,
    sessionCount: 1,
    attendanceDates: [],
    remarkPoints: [''],
    showPaymentQr: false,
  };
}
