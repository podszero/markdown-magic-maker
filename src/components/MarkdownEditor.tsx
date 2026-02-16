import { useRef, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import hotkeys from "hotkeys-js";
import MarkdownToolbar from "./MarkdownToolbar";
import FileSidebar from "./FileSidebar";
import DocumentOutline from "./DocumentOutline";
import DropOverlay from "./DropOverlay";
import MarkdownPreview from "./MarkdownPreview";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "./ui/resizable";
import EditorWithLineNumbers from "./EditorWithLineNumbers";
import EditorSettings from "./EditorSettings";
import { useMarkdownFiles } from "@/hooks/useMarkdownFiles";
import { useEditorStore } from "@/stores/useEditorStore";
import {
  FileText, Eye, Columns, PanelLeft, ListTree,
  Maximize, Minimize, Save, Wrench, Sun, Moon,
} from "lucide-react";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import {
  Tooltip, TooltipContent, TooltipTrigger,
} from "@/components/ui/tooltip";
import { useIsMobile } from "@/hooks/use-mobile";

type ViewMode = "split" | "editor" | "preview";

const MarkdownEditor = () => {
  const {
    files, activeFile, activeFileId, setActiveFileId,
    createFile, updateFileContent, renameFile, deleteFile,
    duplicateFile, exportFile, importFile, importFromDrop, searchFiles,
  } = useMarkdownFiles();

  const { theme, setTheme } = useTheme();
  const isMobile = useIsMobile();

  // Zustand store
  const viewMode = useEditorStore((s) => s.viewMode);
  const sidebarOpen = useEditorStore((s) => s.sidebarOpen);
  const outlineOpen = useEditorStore((s) => s.outlineOpen);
  const focusMode = useEditorStore((s) => s.focusMode);
  const toolbarVisible = useEditorStore((s) => s.toolbarVisible);
  const showLineNumbers = useEditorStore((s) => s.showLineNumbers);
  const syncScroll = useEditorStore((s) => s.syncScroll);
  const setViewMode = useEditorStore((s) => s.setViewMode);
  const setSidebarOpen = useEditorStore((s) => s.setSidebarOpen);
  const toggleSidebar = useEditorStore((s) => s.toggleSidebar);
  const toggleOutline = useEditorStore((s) => s.toggleOutline);
  const toggleFocusMode = useEditorStore((s) => s.toggleFocusMode);
  const toggleToolbar = useEditorStore((s) => s.toggleToolbar);
  const setOutlineOpen = useEditorStore((s) => s.setOutlineOpen);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const isScrollSyncing = useRef(false);

  const content = activeFile?.content || "";

  // Drag & drop
  const onDrop = useCallback(
    (acceptedFiles: File[]) => importFromDrop(acceptedFiles),
    [importFromDrop]
  );
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "text/markdown": [".md", ".markdown"], "text/plain": [".txt"] },
    noClick: true,
    noKeyboard: true,
  });

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

  // Sync scroll
  const handleEditorScroll = useCallback(
    (e: React.UIEvent<HTMLTextAreaElement>) => {
      if (!syncScroll || viewMode !== "split" || isScrollSyncing.current) return;
      isScrollSyncing.current = true;
      const el = e.currentTarget;
      const ratio = el.scrollTop / (el.scrollHeight - el.clientHeight || 1);
      if (previewRef.current) {
        previewRef.current.scrollTop = ratio * (previewRef.current.scrollHeight - previewRef.current.clientHeight);
      }
      requestAnimationFrame(() => { isScrollSyncing.current = false; });
    },
    [syncScroll, viewMode]
  );

  const handlePreviewScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      if (!syncScroll || viewMode !== "split" || isScrollSyncing.current) return;
      isScrollSyncing.current = true;
      const el = e.currentTarget;
      const ratio = el.scrollTop / (el.scrollHeight - el.clientHeight || 1);
      if (textareaRef.current) {
        textareaRef.current.scrollTop = ratio * (textareaRef.current.scrollHeight - textareaRef.current.clientHeight);
      }
      requestAnimationFrame(() => { isScrollSyncing.current = false; });
    },
    [syncScroll, viewMode]
  );

  // Outline heading click
  const handleOutlineHeadingClick = useCallback((id: string) => {
    if (previewRef.current) {
      const el = previewRef.current.querySelector(`#${CSS.escape(id)}`);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }
    }
    // If preview not visible, try to find heading line in editor
    if (textareaRef.current) {
      const lines = content.split("\n");
      let headingIdx = 0;
      for (let i = 0; i < lines.length; i++) {
        if (/^#{1,6}\s/.test(lines[i])) {
          const text = lines[i].replace(/^#{1,6}\s+/, "").replace(/[*_`~\[\]()#]/g, "").trim();
          const slug = `heading-${text.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "")}-${headingIdx}`;
          if (slug === id) {
            // Scroll textarea to this line
            const linesBefore = lines.slice(0, i).join("\n").length;
            textareaRef.current.focus();
            textareaRef.current.setSelectionRange(linesBefore, linesBefore);
            // Approximate scroll
            const lineHeight = 1.75 * 13.6; // ~rem * px
            textareaRef.current.scrollTop = Math.max(0, i * lineHeight - 100);
            return;
          }
          headingIdx++;
        }
      }
    }
  }, [content]);

  // Keyboard shortcuts with hotkeys-js
  useEffect(() => {
    hotkeys.filter = () => true; // Allow in textareas

    hotkeys("ctrl+b, command+b", (e) => { e.preventDefault(); handleInsert("**", "**"); });
    hotkeys("ctrl+i, command+i", (e) => { e.preventDefault(); handleInsert("*", "*"); });
    hotkeys("ctrl+s, command+s", (e) => { e.preventDefault(); toast.success("Tersimpan otomatis!"); });
    hotkeys("ctrl+n, command+n", (e) => { e.preventDefault(); createFile(); });

    return () => {
      hotkeys.unbind("ctrl+b, command+b");
      hotkeys.unbind("ctrl+i, command+i");
      hotkeys.unbind("ctrl+s, command+s");
      hotkeys.unbind("ctrl+n, command+n");
    };
  }, [handleInsert, createFile]);

  // Responsive handler
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
      setOutlineOpen(false);
      setViewMode("editor");
    }
  }, [isMobile, setSidebarOpen, setOutlineOpen, setViewMode]);

  const wordCount = content.trim().split(/\s+/).filter(Boolean).length;
  const charCount = content.length;
  const readTime = Math.max(1, Math.ceil(wordCount / 200));

  const HeaderButton = ({
    onClick, active, title, children,
  }: { onClick: () => void; active?: boolean; title: string; children: React.ReactNode }) => (
    <Tooltip>
      <TooltipTrigger asChild>
        <button onClick={onClick} className={`toolbar-btn ${active ? "active" : ""}`}>
          {children}
        </button>
      </TooltipTrigger>
      <TooltipContent side="bottom" className="text-[11px] py-1 px-2">{title}</TooltipContent>
    </Tooltip>
  );

  return (
    <div {...getRootProps()} className="flex h-screen bg-background overflow-hidden relative">
      <input {...getInputProps()} />
      <DropOverlay isDragActive={isDragActive} />

      {!focusMode && (
        <FileSidebar
          files={files} activeFileId={activeFileId} onSelectFile={setActiveFileId}
          onCreateFile={() => createFile()} onDeleteFile={deleteFile}
          onRenameFile={renameFile} onDuplicateFile={duplicateFile}
          onExportFile={exportFile} onImportFile={importFile}
          searchFiles={searchFiles} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="flex items-center justify-between px-2 md:px-3 py-1.5 border-b border-border flex-shrink-0 gap-1">
          <div className="flex items-center gap-1 min-w-0">
            {!focusMode && (
              <HeaderButton onClick={toggleSidebar} active={sidebarOpen} title="Toggle Files (Ctrl+\\)">
                <PanelLeft size={isMobile ? 18 : 16} />
              </HeaderButton>
            )}
            <FileText size={14} className="text-primary flex-shrink-0 hidden sm:block" />
            <span className="text-xs font-medium text-foreground truncate max-w-[120px] sm:max-w-[200px]" style={{ fontFamily: "'Inter', sans-serif" }}>
              {activeFile?.title || "Untitled"}
            </span>
            <span className="text-[9px] px-1 py-px rounded bg-secondary text-muted-foreground flex-shrink-0 items-center gap-0.5 hidden sm:flex" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
              <Save size={8} />auto
            </span>
          </div>

          <div className="flex items-center gap-0.5">
            <div className="flex items-center p-px rounded-md bg-secondary">
              {([
                { mode: "editor" as ViewMode, icon: FileText, label: "Editor" },
                { mode: "split" as ViewMode, icon: Columns, label: "Split", hideOnMobile: true },
                { mode: "preview" as ViewMode, icon: Eye, label: "Preview" },
              ]).map(({ mode, icon: Icon, label, hideOnMobile }) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={`flex items-center gap-1 px-1.5 py-1 rounded text-[11px] font-medium transition-all duration-200 ${
                    viewMode === mode ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                  } ${hideOnMobile ? "hidden sm:flex" : "flex"}`}
                  title={label}
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  <Icon size={12} />
                  <span className="hidden lg:inline">{label}</span>
                </button>
              ))}
            </div>

            <HeaderButton onClick={toggleToolbar} active={toolbarVisible} title="Toggle Toolbar">
              <Wrench size={14} />
            </HeaderButton>

            <span className="hidden md:inline-flex">
              <HeaderButton onClick={toggleOutline} active={outlineOpen} title="Outline">
                <ListTree size={14} />
              </HeaderButton>
            </span>

            <EditorSettings />

            <HeaderButton onClick={() => setTheme(theme === "dark" ? "light" : "dark")} title={theme === "dark" ? "Light Mode" : "Dark Mode"}>
              {theme === "dark" ? <Sun size={14} /> : <Moon size={14} />}
            </HeaderButton>

            <HeaderButton onClick={toggleFocusMode} active={focusMode} title="Focus Mode">
              {focusMode ? <Minimize size={14} /> : <Maximize size={14} />}
            </HeaderButton>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 flex overflow-hidden">
          {viewMode === "split" ? (
            <ResizablePanelGroup direction="horizontal" className="flex-1">
              <ResizablePanel defaultSize={50} minSize={25}>
                <div className="flex flex-col h-full">
                  <MarkdownToolbar onInsert={handleInsert} isVisible={toolbarVisible} />
                  <EditorWithLineNumbers
                    ref={textareaRef}
                    value={content}
                    onChange={handleContentChange}
                    showLineNumbers={showLineNumbers}
                    placeholder="Tulis Markdown di sini... (atau drag & drop file .md)"
                    onScroll={handleEditorScroll}
                  />
                </div>
              </ResizablePanel>
              <ResizableHandle withHandle />
              <ResizablePanel defaultSize={50} minSize={25}>
                <div className="flex flex-col h-full" style={{ background: "hsl(var(--preview-bg))" }}>
                  <MarkdownPreview ref={previewRef} content={content} onScroll={handlePreviewScroll} />
                </div>
              </ResizablePanel>
            </ResizablePanelGroup>
          ) : (
            <div className="flex-1 flex min-w-0">
              {viewMode === "editor" && (
                <div className="flex flex-col w-full">
                  <MarkdownToolbar onInsert={handleInsert} isVisible={toolbarVisible} />
                  <EditorWithLineNumbers
                    ref={textareaRef}
                    value={content}
                    onChange={handleContentChange}
                    showLineNumbers={showLineNumbers}
                    placeholder="Tulis Markdown di sini... (atau drag & drop file .md)"
                    onScroll={handleEditorScroll}
                  />
                </div>
              )}
              {viewMode === "preview" && (
                <div className="flex flex-col w-full" style={{ background: "hsl(var(--preview-bg))" }}>
                  <MarkdownPreview ref={previewRef} content={content} onScroll={handlePreviewScroll} />
                </div>
              )}
            </div>
          )}

          {!focusMode && !isMobile && (
            <DocumentOutline
              content={content}
              isOpen={outlineOpen}
              onClose={() => setOutlineOpen(false)}
              onHeadingClick={handleOutlineHeadingClick}
            />
          )}
        </div>

        {/* Footer */}
        <footer
          className="flex items-center justify-between px-3 py-1 border-t border-border text-[10px] text-muted-foreground flex-shrink-0"
          style={{ fontFamily: "'JetBrains Mono', monospace" }}
        >
          <div className="flex items-center gap-2">
            <span>{wordCount} kata</span>
            <span className="hidden sm:inline">{charCount} chr</span>
            <span>~{readTime}m</span>
          </div>
          <div className="flex items-center gap-2">
            <span>{syncScroll && viewMode === "split" ? "⇅ Sync" : ""}</span>
            <span>GFM</span>
            <span className="hidden sm:inline">UTF-8</span>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default MarkdownEditor;
