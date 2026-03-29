/** Parse textarea: mỗi dòng hoặc phân tách bởi dấu phẩy/chấm phẩy */
export function parseAttendanceDates(raw: string): string[] {
  const parts = raw
    .split(/[\n,;]+/)
    .map((s) => s.trim())
    .filter(Boolean);
  return parts;
}
