/** Dữ liệu người dùng nhập trên form */
export interface InvoiceFormData {
  className: string;
  /** Một trong "Tháng 1" … "Tháng 12" */
  month: string;
  studentName: string;
  /** Học phí mỗi buổi (VND) */
  feePerSession: number;
  /** Số buổi học */
  sessionCount: number;
  /** Danh sách ngày đi học (chuỗi hiển thị) */
  attendanceDates: string[];
  /** Đoạn mở đầu nhận xét (chủ đề / tổng quan) */
  remarkTopic: string;
  /** Từng ý chi tiết — trên phiếu hiển thị dạng gạch đầu dòng, không cần gõ "-" */
  remarkPoints: string[];
}

/** Kết quả tính toán từ form */
export interface InvoiceComputedData {
  totalTuition: number;
}
