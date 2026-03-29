import type { InvoiceFormData } from '../types/invoice';
import { parseAttendanceDates } from '../utils/parseDates';

export const DEFAULT_DATES_RAW = `08/01
13/01
15/01
20/01
22/01
27/01
29/01
30/01`;

export function getDefaultFormData(): InvoiceFormData {
  return {
    className: '🌈 LỚP TIẾNG ANH CÔ QUỲNH 🌈',
    month: 'Tháng 1',
    studentName: 'Lily Đỗ',
    feePerSession: 300_000,
    sessionCount: 8,
    attendanceDates: parseAttendanceDates(DEFAULT_DATES_RAW),
    remarkTopic: 'Con học về chủ đề: "các bộ phận cơ thể - Body Parts".',
    remarkPoints: [
      'Con nắm được từ vựng, có thể đọc, viết và sử dụng từ được học vào giao tiếp.',
      'Phân biệt được khi nào dùng "this is" / "these are".',
      'Trên lớp con ngoan, luôn năng nổ tham gia vào các hoạt động của lớp.',
      'Kỹ năng nghe con còn yếu, chưa hiểu được một đoạn văn nghe, cần luyện nghe/ shadowing nhiều hơn nữa.',
    ],
  };
}
