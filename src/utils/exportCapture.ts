import html2canvas from 'html2canvas';

/** Trong bản clone dùng font hệ thống để tránh canvas bị “tainted” do font/ảnh từ domain khác (Google Fonts, gstatic) — hay gặp khi deploy HTTPS. */
function prepareCloneForSafeCanvas(clonedDoc: Document) {
  clonedDoc.querySelectorAll('link[href*="fonts.googleapis.com"]').forEach((n) => n.remove());
  const style = clonedDoc.createElement('style');
  style.setAttribute('data-html2canvas-fix', '1');
  style.textContent = `
    .invoice-export-root,
    .invoice-export-root * {
      font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
    }
  `;
  clonedDoc.head.appendChild(style);
}

export async function captureElement(el: HTMLElement): Promise<HTMLCanvasElement> {
  await document.fonts.ready.catch(() => undefined);

  return html2canvas(el, {
    scale: 2,
    useCORS: true,
    allowTaint: false,
    logging: false,
    backgroundColor: '#ffffff',
    imageTimeout: 20000,
    windowWidth: el.scrollWidth,
    windowHeight: el.scrollHeight,
    onclone: (clonedDoc) => {
      prepareCloneForSafeCanvas(clonedDoc);
    },
  });
}

function triggerDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.rel = 'noopener';
  a.style.display = 'none';
  document.body.appendChild(a);
  a.click();
  window.setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 0);
}

export async function exportPngFromElement(el: HTMLElement, filename: string): Promise<void> {
  await document.fonts.ready.catch(() => undefined);

  let canvas: HTMLCanvasElement;
  try {
    canvas = await captureElement(el);
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    throw new Error(
      `Không chụp được phiếu (${msg}). Thử tắt khối QR hoặc tải lại trang.`,
    );
  }

  await new Promise<void>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error('Không tạo được file PNG.'));
          return;
        }
        try {
          triggerDownload(blob, filename);
          resolve();
        } catch (err) {
          reject(
            err instanceof Error
              ? err
              : new Error('Trình duyệt chặn tải file. Thử Safari/Chrome bản mới hoặc bật cho phép tải xuống.'),
          );
        }
      },
      'image/png',
      1,
    );
  });
}
