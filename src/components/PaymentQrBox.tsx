import { PAYMENT_QR_IMAGE_SRC } from '../constants/paymentQr';

interface PaymentQrBoxProps {
  show: boolean;
}

/** Khung thanh toán — viền gradient, ảnh QR nổi trong thẻ trắng */
export function PaymentQrBox({ show }: PaymentQrBoxProps) {
  if (!show) return null;

  return (
    <div className="relative overflow-hidden rounded-2xl">
      {/* Viền gradient */}
      <div
        className="absolute inset-0 rounded-2xl bg-gradient-to-br from-teal-400 via-teal-500 to-emerald-600 opacity-90"
        aria-hidden
      />
      <div className="relative m-[2px] rounded-[0.9rem] bg-gradient-to-b from-white via-white to-teal-50/40 p-1 shadow-inner">
        <div className="rounded-[0.75rem] px-3 pb-4 pt-3">
          <div className="flex items-center justify-center gap-2">
            <span className="h-px flex-1 bg-gradient-to-r from-transparent to-teal-200" aria-hidden />
            <span className="text-[10px] font-bold uppercase tracking-[0.28em] text-teal-800">
              Thanh toán
            </span>
            <span className="h-px flex-1 bg-gradient-to-l from-transparent to-teal-200" aria-hidden />
          </div>

          <div className="mx-auto mt-3 flex max-w-[240px] justify-center rounded-xl bg-white p-3 shadow-[0_8px_30px_-8px_rgba(15,118,110,0.25)] ring-1 ring-teal-100/90">
            <img
              src={PAYMENT_QR_IMAGE_SRC}
              alt=""
              className="h-auto w-full max-w-[215px] rounded-md object-contain"
              draggable={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
