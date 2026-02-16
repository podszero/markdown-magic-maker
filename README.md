# ✍️ Markdown Editor

Editor Markdown modern berbasis web dengan fitur lengkap, dibangun menggunakan React, TypeScript, dan Tailwind CSS.

![Markdown Editor](https://img.shields.io/badge/React-18-blue?logo=react) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript) ![Tailwind](https://img.shields.io/badge/Tailwind_CSS-3-blue?logo=tailwindcss) ![Vite](https://img.shields.io/badge/Vite-5-purple?logo=vite)

---

## 🚀 Fitur Utama

### 📝 Editor
- **Split View** — Mode editor, preview, atau split dengan panel yang bisa di-resize (drag handle)
- **Line Numbers** — Nomor baris yang bisa diaktifkan/dinonaktifkan melalui Settings
- **Synchronized Scroll** — Scroll editor & preview tersinkronisasi otomatis di split mode
- **Focus Mode** — Mode fokus tanpa distraksi (sembunyikan sidebar & outline)
- **Auto Save** — Perubahan disimpan otomatis ke localStorage

### 🎨 Rendering & Preview
- **GitHub Flavored Markdown (GFM)** — Tabel, checklist, strikethrough, dan lainnya
- **Syntax Highlighting** — Highlight otomatis untuk 180+ bahasa pemrograman
- **LaTeX Math (KaTeX)** — Rumus matematika inline (`$...$`) dan block (`$$...$$`)
- **Mermaid Diagrams** — Flowchart, sequence diagram, class diagram, dan lainnya
- **Error Boundary** — Preview yang aman dengan fallback jika terjadi error rendering

### 📁 File Manager
- **Multi-file** — Buat, buka, rename, duplikat, dan hapus file markdown
- **Search** — Cari file berdasarkan judul atau isi konten
- **Import / Export** — Import file `.md` / `.txt` dari disk, export file ke `.md`
- **Drag & Drop** — Seret file `.md` atau `.txt` langsung ke editor untuk import

### 🧭 Navigasi & Outline
- **Document Outline** — Panel outline otomatis dari heading dokumen
- **Clickable Headings** — Klik heading di outline untuk scroll ke posisi yang tepat
- **Keyboard Shortcuts** — Shortcut untuk bold, italic, save, dan new file

### ⚙️ Pengaturan
- **Dark / Light Mode** — Toggle tema gelap dan terang
- **Line Numbers Toggle** — Aktifkan/nonaktifkan nomor baris
- **Sync Scroll Toggle** — Aktifkan/nonaktifkan sinkronisasi scroll
- **Responsive** — Tampilan optimal di desktop dan mobile

---

## 🛠️ Tech Stack

| Teknologi | Kegunaan |
| --- | --- |
| [React 18](https://react.dev) | UI library |
| [TypeScript](https://typescriptlang.org) | Type safety |
| [Vite](https://vitejs.dev) | Build tool & dev server |
| [Tailwind CSS](https://tailwindcss.com) | Utility-first styling |
| [shadcn/ui](https://ui.shadcn.com) | Komponen UI |
| [Zustand](https://zustand-demo.pmnd.rs) | State management |
| [react-markdown](https://github.com/remarkjs/react-markdown) | Markdown rendering |
| [remark-gfm](https://github.com/remarkjs/remark-gfm) | GitHub Flavored Markdown |
| [rehype-highlight](https://github.com/rehypejs/rehype-highlight) | Syntax highlighting |
| [KaTeX](https://katex.org) | Rendering rumus matematika |
| [Mermaid](https://mermaid.js.org) | Rendering diagram |
| [hotkeys-js](https://github.com/jaywcjlove/hotkeys) | Keyboard shortcuts |
| [react-dropzone](https://react-dropzone.js.org) | Drag & drop file |
| [react-resizable-panels](https://github.com/bvaughn/react-resizable-panels) | Resizable split view |
| [react-error-boundary](https://github.com/bvaughn/react-error-boundary) | Error handling |
| [react-virtuoso](https://virtuoso.dev) | Virtualized list rendering |
| [timeago.js](https://timeago.org) | Relative timestamp |
| [Sonner](https://sonner.emilkowal.dev) | Toast notifications |

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Aksi |
| --- | --- |
| `Ctrl/⌘ + B` | Bold |
| `Ctrl/⌘ + I` | Italic |
| `Ctrl/⌘ + S` | Save (notifikasi) |
| `Ctrl/⌘ + N` | File baru |

---

## 📦 Instalasi & Pengembangan

```bash
# Clone repository
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>

# Install dependencies
npm install

# Jalankan development server
npm run dev
```

Aplikasi akan berjalan di `http://localhost:5173`.

---

## 📂 Struktur Proyek

```
src/
├── components/
│   ├── MarkdownEditor.tsx      # Komponen utama editor
│   ├── MarkdownPreview.tsx     # Preview markdown dengan rendering
│   ├── MarkdownToolbar.tsx     # Toolbar formatting
│   ├── EditorWithLineNumbers.tsx # Editor textarea dengan line numbers
│   ├── EditorSettings.tsx      # Popover pengaturan editor
│   ├── FileSidebar.tsx         # Sidebar file manager
│   ├── DocumentOutline.tsx     # Panel outline dokumen
│   ├── MermaidBlock.tsx        # Renderer diagram Mermaid
│   ├── DropOverlay.tsx         # Overlay drag & drop
│   └── ui/                    # Komponen shadcn/ui
├── hooks/
│   ├── useMarkdownFiles.ts    # Hook manajemen file markdown
│   └── use-mobile.tsx         # Hook deteksi perangkat mobile
├── stores/
│   └── useEditorStore.ts      # Zustand store untuk state editor
├── types/
│   └── markdown.ts            # TypeScript types & konten default
├── pages/
│   └── Index.tsx              # Halaman utama
└── index.css                  # Global styles & design tokens
```

---

## 🌐 Deployment

Buka [Lovable](https://lovable.dev) dan klik **Share → Publish** untuk deploy aplikasi.

Atau deploy secara mandiri menggunakan platform hosting statis seperti Vercel, Netlify, atau Cloudflare Pages.

---

## 📄 Lisensi

MIT License — Bebas digunakan untuk proyek personal maupun komersial.
