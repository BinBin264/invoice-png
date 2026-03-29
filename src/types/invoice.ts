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
  /** Từng ý nhận xét — phiếu hiển thị dạng gạch đầu dòng */
  remarkPoints: string[];
  /** Hiện mã QR thanh toán trên phiếu (bật sau khi nhập đúng mật khẩu) */
  showPaymentQr: boolean;
}

/** Kết quả tính toán từ form */
export interface InvoiceComputedData {
  totalTuition: number;
}
