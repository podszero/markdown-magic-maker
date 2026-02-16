export interface MarkdownFile {
  id: string;
  title: string;
  content: string;
  createdAt: number;
  updatedAt: number;
}

export const DEFAULT_CONTENT = `# Selamat Datang di Markdown Editor ✍️

Editor ini mendukung **GitHub Flavored Markdown** dengan live preview, mirip seperti **Typora**.

## Fitur Utama

- 📁 **File Manager** — Buat, buka, rename, dan hapus file
- 🔍 **Search** — Cari file berdasarkan judul atau isi
- ✏️ **Editor** — Toolbar lengkap untuk formatting
- 👁️ **Preview** — Live preview dengan split view
- 📊 **Statistik** — Word count, character count, read time
- 🎯 **Focus Mode** — Mode fokus tanpa gangguan
- 📑 **Outline** — Navigasi heading dokumen

## Markdown Syntax

### Teks Formatting

**Bold text**, *italic text*, ~~strikethrough~~, \`inline code\`

### Daftar

- Item satu
- Item dua
  - Sub item
  - Sub item lagi

1. Langkah pertama
2. Langkah kedua
3. Langkah ketiga

### Blockquote

> "Kesederhanaan adalah kecanggihan tertinggi."
> — Leonardo da Vinci

### Kode

\`\`\`javascript
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log(fibonacci(10)); // 55
\`\`\`

### Tabel

| Fitur | Shortcut | Status |
| ----- | -------- | ------ |
| Bold | Ctrl+B | ✅ |
| Italic | Ctrl+I | ✅ |
| Save | Ctrl+S | ✅ |
| Search | Ctrl+F | ✅ |

### Checklist

- [x] Buat editor
- [x] Tambah file management
- [x] Tambah search
- [ ] Tambah export PDF

### Link & Gambar

[Kunjungi GitHub](https://github.com)

### Horizontal Rule

---

Selamat menulis! 🚀
`;
