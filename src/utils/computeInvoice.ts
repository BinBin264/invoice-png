import type { InvoiceComputedData, InvoiceFormData } from '../types/invoice';

export function computeInvoice(form: InvoiceFormData): InvoiceComputedData {
  const feePerSession = Number.isFinite(form.feePerSession) ? form.feePerSession : 0;
  const sessionCount = Number.isFinite(form.sessionCount) ? form.sessionCount : 0;
  const totalTuition = feePerSession * sessionCount;

  return { totalTuition };
}
