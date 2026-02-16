import { useState, useRef, useCallback, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import MarkdownToolbar from "./MarkdownToolbar";
import FileSidebar from "./FileSidebar";
import DocumentOutline from "./DocumentOutline";
import { useMarkdownFiles } from "@/hooks/useMarkdownFiles";
import {
  FileText,
  Eye,
  Columns,
  PanelLeft,
  ListTree,
  Maximize,
  Minimize,
  Save,
  Wrench,
} from "lucide-react";
import { toast } from "sonner";

type ViewMode = "split" | "editor" | "preview";

const MarkdownEditor = () => {
  const {
    files,
    activeFile,
    activeFileId,
    setActiveFileId,
    createFile,
    updateFileContent,
    renameFile,
    deleteFile,
    duplicateFile,
    exportFile,
    importFile,
    searchFiles,
  } = useMarkdownFiles();

  const [viewMode, setViewMode] = useState<ViewMode>("split");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [outlineOpen, setOutlineOpen] = useState(false);
  const [focusMode, setFocusMode] = useState(false);
  const [toolbarVisible, setToolbarVisible] = useState(true);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const content = activeFile?.content || "";

  const handleContentChange = useCallback(
    (newContent: string) => {
      if (activeFile) updateFileContent(activeFile.id, newContent);
    },
    [activeFile, updateFileContent]
  );

  const handleInsert = useCallback(
    (before: string, after?: string) => {
      const textarea = textareaRef.current;
      if (!textarea) return;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selected = content.substring(start, end);
      const replacement = before + selected + (after || "");
      const newContent = content.substring(0, start) + replacement + content.substring(end);
      handleContentChange(newContent);
      requestAnimationFrame(() => {
        textarea.focus();
        const cursorPos = start + before.length + selected.length + (after?.length || 0);
        textarea.setSelectionRange(cursorPos, cursorPos);
      });
    },
    [content, handleContentChange]
  );

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key.toLowerCase()) {
          case "b": e.preventDefault(); handleInsert("**", "**"); break;
          case "i": e.preventDefault(); handleInsert("*", "*"); break;
          case "s": e.preventDefault(); toast.success("Tersimpan otomatis!"); break;
          case "n": e.preventDefault(); createFile(); break;
        }
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handleInsert, createFile]);

  const wordCount = content.trim().split(/\s+/).filter(Boolean).length;
  const charCount = content.length;
  const readTime = Math.max(1, Math.ceil(wordCount / 200));

  useEffect(() => {
    if (window.matchMedia("(max-width: 768px)").matches) {
      setSidebarOpen(false);
      setViewMode("editor");
    }
  }, []);

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar */}
      {!focusMode && (
        <FileSidebar
          files={files}
          activeFileId={activeFileId}
          onSelectFile={setActiveFileId}
          onCreateFile={() => createFile()}
          onDeleteFile={deleteFile}
          onRenameFile={renameFile}
          onDuplicateFile={duplicateFile}
          onExportFile={exportFile}
          onImportFile={importFile}
          searchFiles={searchFiles}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
      )}

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="flex items-center justify-between px-2 md:px-3 py-1.5 border-b border-border flex-shrink-0 gap-2">
          {/* Left: sidebar toggle + file name */}
          <div className="flex items-center gap-1.5 min-w-0">
            {!focusMode && (
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className={`toolbar-btn ${sidebarOpen ? "active" : ""}`}
                title="Toggle sidebar (Files)"
              >
                <PanelLeft size={16} />
              </button>
            )}
            <FileText size={14} className="text-primary flex-shrink-0" />
            <span className="text-xs font-medium text-foreground truncate" style={{ fontFamily: "'Inter', sans-serif" }}>
              {activeFile?.title || "Untitled"}
            </span>
            <span
              className="text-[9px] px-1 py-px rounded bg-secondary text-muted-foreground flex-shrink-0 flex items-center gap-0.5"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              <Save size={8} />auto
            </span>
          </div>

          {/* Right: controls */}
          <div className="flex items-center gap-0.5">
            {/* View toggle */}
            <div className="flex items-center p-px rounded-md bg-secondary">
              {([
                { mode: "editor" as ViewMode, icon: FileText, label: "Editor" },
                { mode: "split" as ViewMode, icon: Columns, label: "Split" },
                { mode: "preview" as ViewMode, icon: Eye, label: "Preview" },
              ]).map(({ mode, icon: Icon, label }) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={`flex items-center gap-1 px-1.5 py-1 rounded text-[11px] font-medium transition-all duration-200 ${
                    viewMode === mode
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  title={label}
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  <Icon size={12} />
                  <span className="hidden lg:inline">{label}</span>
                </button>
              ))}
            </div>

            {/* Toolbar toggle - in header */}
            <button
              onClick={() => setToolbarVisible(!toolbarVisible)}
              className={`toolbar-btn ${toolbarVisible ? "active" : ""}`}
              title={toolbarVisible ? "Sembunyikan toolbar" : "Tampilkan toolbar"}
            >
              <Wrench size={14} />
            </button>

            <button
              onClick={() => setOutlineOpen(!outlineOpen)}
              className={`toolbar-btn ${outlineOpen ? "active" : ""}`}
              title="Outline"
            >
              <ListTree size={14} />
            </button>

            <button
              onClick={() => {
                setFocusMode(!focusMode);
                if (!focusMode) { setSidebarOpen(false); setOutlineOpen(false); }
              }}
              className={`toolbar-btn ${focusMode ? "active" : ""}`}
              title="Focus mode"
            >
              {focusMode ? <Minimize size={14} /> : <Maximize size={14} />}
            </button>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 flex overflow-hidden">
          <div className="flex-1 flex min-w-0">
            {/* Editor panel */}
            {viewMode !== "preview" && (
              <div className={`flex flex-col ${viewMode === "split" ? "w-1/2 border-r border-border" : "w-full"}`}>
                <MarkdownToolbar onInsert={handleInsert} isVisible={toolbarVisible} />
                <textarea
                  ref={textareaRef}
                  value={content}
                  onChange={(e) => handleContentChange(e.target.value)}
                  className="editor-textarea flex-1 custom-scroll"
                  placeholder="Tulis Markdown di sini..."
                  spellCheck={false}
                />
              </div>
            )}

            {/* Preview panel */}
            {viewMode !== "editor" && (
              <div
                className={`flex flex-col ${viewMode === "split" ? "w-1/2" : "w-full"}`}
                style={{ background: "hsl(var(--preview-bg))" }}
              >
                <div className="flex-1 overflow-y-auto custom-scroll p-4 md:p-8">
                  <div className="max-w-3xl mx-auto markdown-preview">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Outline */}
          {!focusMode && (
            <DocumentOutline content={content} isOpen={outlineOpen} onClose={() => setOutlineOpen(false)} />
          )}
        </div>

        {/* Footer */}
        <footer
          className="flex items-center justify-between px-3 py-1 border-t border-border text-[10px] text-muted-foreground flex-shrink-0"
          style={{ fontFamily: "'JetBrains Mono', monospace" }}
        >
          <div className="flex items-center gap-2.5">
            <span>{wordCount} kata</span>
            <span>{charCount} chr</span>
            <span>~{readTime}m baca</span>
          </div>
          <div className="flex items-center gap-2.5">
            <span>GFM</span>
            <span>UTF-8</span>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default MarkdownEditor;
