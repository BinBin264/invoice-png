/** Mật khẩu bật QR — đặt trong `.env`: `VITE_PAYMENT_QR_PASSWORD=...` */
const fromEnv = import.meta.env.VITE_PAYMENT_QR_PASSWORD;
export const PAYMENT_QR_PASSWORD =
  typeof fromEnv === 'string' && fromEnv.trim() !== '' ? fromEnv.trim() : '20/12';

/** Ảnh chỉ còn khối QR (đặt trong public/) */
export const PAYMENT_QR_IMAGE_SRC = '/payment-qr-only.png';
