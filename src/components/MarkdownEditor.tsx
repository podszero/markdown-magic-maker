import { useState, useRef, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import MarkdownToolbar from "./MarkdownToolbar";
import { FileText, Eye, Columns } from "lucide-react";

const DEFAULT_CONTENT = `# Selamat Datang di Markdown Editor ✍️

Editor ini mendukung **GitHub Flavored Markdown** dengan live preview.

## Fitur

- **Bold**, *italic*, dan ~~strikethrough~~
- Heading level 1–6
- Ordered dan unordered list
- Blockquote, code block, dan inline code
- Tabel, link, dan gambar

## Contoh Kode

\`\`\`javascript
function greet(name) {
  return \`Halo, \${name}!\`;
}
\`\`\`

## Blockquote

> "Kesederhanaan adalah kecanggihan tertinggi."
> — Leonardo da Vinci

## Tabel

| Fitur | Status |
| ----- | ------ |
| Bold & Italic | ✅ |
| Code blocks | ✅ |
| Tabel (GFM) | ✅ |
| Live preview | ✅ |

---

Mulai menulis di panel editor sebelah kiri! 🚀
`;

type ViewMode = "split" | "editor" | "preview";

const MarkdownEditor = () => {
  const [content, setContent] = useState(DEFAULT_CONTENT);
  const [viewMode, setViewMode] = useState<ViewMode>("split");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleInsert = useCallback((before: string, after?: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = content.substring(start, end);
    const replacement = before + selected + (after || "");

    const newContent = content.substring(0, start) + replacement + content.substring(end);
    setContent(newContent);

    requestAnimationFrame(() => {
      textarea.focus();
      const cursorPos = start + before.length + selected.length + (after?.length || 0);
      textarea.setSelectionRange(cursorPos, cursorPos);
    });
  }, [content]);

  const wordCount = content.trim().split(/\s+/).filter(Boolean).length;
  const charCount = content.length;

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <header className="flex items-center justify-between px-5 py-3 border-b border-border">
        <div className="flex items-center gap-2.5">
          <FileText size={22} className="text-primary" />
          <h1 className="text-lg font-semibold font-sans tracking-tight text-foreground" style={{ fontFamily: "'Inter', sans-serif" }}>
            Markdown Editor
          </h1>
        </div>
        <div className="flex items-center gap-1 p-0.5 rounded-lg bg-secondary">
          {([
            { mode: "editor" as ViewMode, icon: FileText, label: "Editor" },
            { mode: "split" as ViewMode, icon: Columns, label: "Split" },
            { mode: "preview" as ViewMode, icon: Eye, label: "Preview" },
          ]).map(({ mode, icon: Icon, label }) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${
                viewMode === mode
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              <Icon size={14} />
              <span className="hidden sm:inline">{label}</span>
            </button>
          ))}
        </div>
      </header>

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Editor */}
        {viewMode !== "preview" && (
          <div className={`flex flex-col ${viewMode === "split" ? "w-1/2 border-r border-border" : "w-full"}`}>
            <MarkdownToolbar onInsert={handleInsert} />
            <textarea
              ref={textareaRef}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="editor-textarea flex-1"
              placeholder="Tulis Markdown di sini..."
              spellCheck={false}
            />
          </div>
        )}

        {/* Preview */}
        {viewMode !== "editor" && (
          <div className={`flex flex-col ${viewMode === "split" ? "w-1/2" : "w-full"}`} style={{ background: "hsl(var(--preview-bg))" }}>
            <div className="flex-1 overflow-y-auto p-6 md:p-10 max-w-3xl mx-auto w-full">
              <div className="markdown-preview">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="flex items-center justify-between px-5 py-2 border-t border-border text-xs text-muted-foreground" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
        <span>{wordCount} kata · {charCount} karakter</span>
        <span>Markdown + GFM</span>
      </footer>
    </div>
  );
};

export default MarkdownEditor;
