const VND = new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND',
  maximumFractionDigits: 0,
});

/** Format tiền VND (có ký hiệu ₫) */
export function formatVnd(amount: number): string {
  return VND.format(amount);
}

/** Format số không ký hiệu tiền (dùng khi cần tách phần số) */
export function formatVndNumber(amount: number): string {
  return new Intl.NumberFormat('vi-VN').format(Math.round(amount));
}
