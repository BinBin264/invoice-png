# invoice-png

Phiếu học phí

Ứng dụng web (React + Vite + TypeScript + Tailwind) tạo phiếu học phí, xem trước và xuất **PNG** trên trình duyệt — không backend, không database.

## Cài đặt

```bash
npm install
```

## Chạy local

```bash
npm run dev
```

Mở URL hiển thị trong terminal (thường là `http://localhost:5173`).

## Build

```bash
npm run build
```

Thư mục output: `dist/`.

## Deploy Cloudflare Pages

1. Đẩy mã nguồn lên GitHub/GitLab.
2. Trong [Cloudflare Dashboard](https://dash.cloudflare.com/) → **Workers & Pages** → **Create** → **Pages** → kết nối repository.
3. Cấu hình build:
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
   - **Root directory:** (để trống nếu project ở gốc repo)
4. **Environment variables:** không bắt buộc cho app này.
5. Deploy. Cloudflare sẽ phục vụ static site từ `dist`.

Xem trước local sau build:

```bash
npm run preview
```

## Công nghệ

- React 18, Vite 5, TypeScript, Tailwind CSS
- Xuất ảnh: `html2canvas`

## Gợi ý commit (thay vì chỉ `feat`)

Dùng message rõ nghĩa, ví dụ:

- `style(ui): tinh chỉnh phiếu học phí — gradient khung, shadow, typography`
- `feat(form): tách nhận xét chủ đề + từng ý, bỏ gạch tay`
- `chore: thêm remote và push lên GitHub`
