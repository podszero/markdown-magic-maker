export interface MarkdownFile {
  id: string;
  title: string;
  content: string;
  createdAt: number;
  updatedAt: number;
}

export const DEFAULT_CONTENT = `# Selamat Datang di Markdown Editor ✍️

Editor ini mendukung **GitHub Flavored Markdown**, **Syntax Highlighting**, **Mermaid Diagram**, dan **LaTeX Math**.

## Fitur Utama

- 📁 **File Manager** — Buat, buka, rename, dan hapus file
- 🔍 **Search** — Cari file berdasarkan judul atau isi
- 🎨 **Syntax Highlighting** — Highlight kode otomatis
- 📐 **LaTeX Math** — Rumus matematika inline dan block
- 📊 **Mermaid Diagram** — Flowchart, sequence, dll
- 🌙 **Dark Mode** — Toggle tema gelap/terang

---

## Syntax Highlighting

\`\`\`javascript
// JavaScript dengan syntax highlighting
const greet = (name) => {
  console.log(\`Hello, \${name}!\`);
  return { message: \`Welcome, \${name}\` };
};

greet("World");
\`\`\`

\`\`\`python
# Python
def fibonacci(n: int) -> list[int]:
    fib = [0, 1]
    for i in range(2, n):
        fib.append(fib[i-1] + fib[i-2])
    return fib

print(fibonacci(10))
\`\`\`

\`\`\`css
/* CSS */
.container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  padding: 2rem;
}
\`\`\`

---

## LaTeX Math

### Inline Math

Rumus Einstein: $E = mc^2$, dan integral $\\int_0^\\infty e^{-x} dx = 1$.

### Block Math

Rumus kuadrat:

$$x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$$

Identitas Euler:

$$e^{i\\pi} + 1 = 0$$

Deret Taylor:

$$f(x) = \\sum_{n=0}^{\\infty} \\frac{f^{(n)}(a)}{n!}(x-a)^n$$

Matriks:

$$A = \\begin{pmatrix} 1 & 2 & 3 \\\\ 4 & 5 & 6 \\\\ 7 & 8 & 9 \\end{pmatrix}$$

---

## Mermaid Diagrams

### Flowchart

\`\`\`mermaid
graph TD
    A[Start] --> B{Apakah valid?}
    B -->|Ya| C[Proses Data]
    B -->|Tidak| D[Tampilkan Error]
    C --> E[Simpan ke DB]
    D --> F[Kembali ke Form]
    E --> G[Selesai]
    F --> A
\`\`\`

### Sequence Diagram

\`\`\`mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant A as API
    participant D as Database

    U->>F: Klik Submit
    F->>A: POST /data
    A->>D: INSERT query
    D-->>A: Success
    A-->>F: 200 OK
    F-->>U: Tampilkan sukses
\`\`\`

---

## Tabel

| Fitur | Status | Shortcut |
| ----- | ------ | -------- |
| Bold | ✅ | Ctrl+B |
| Italic | ✅ | Ctrl+I |
| LaTeX | ✅ | — |
| Mermaid | ✅ | — |
| Highlight | ✅ | — |

---

Selamat menulis! 🚀
`;
