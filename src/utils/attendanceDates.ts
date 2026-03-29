/** Chuỗi dd/mm — dùng để sắp xếp trong cùng một tháng */
export function compareDdMm(a: string, b: string): number {
  const pa = a.split('/').map((x) => parseInt(x, 10));
  const pb = b.split('/').map((x) => parseInt(x, 10));
  if (pa.length < 2 || pb.length < 2) return 0;
  const [da, ma] = pa;
  const [db, mb] = pb;
  if (Number.isNaN(da) || Number.isNaN(ma) || Number.isNaN(db) || Number.isNaN(mb)) return 0;
  if (ma !== mb) return ma - mb;
  return da - db;
}

export function sortDdMmStrings(dates: string[]): string[] {
  return [...dates].sort(compareDdMm);
}
