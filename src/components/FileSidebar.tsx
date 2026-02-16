import { useState, useRef, useEffect } from "react";
import {
  FilePlus,
  Search,
  FileText,
  Trash2,
  Pencil,
  Copy,
  Download,
  Upload,
  X,
  Check,
  MoreHorizontal,
  ChevronLeft,
} from "lucide-react";
import { MarkdownFile } from "@/types/markdown";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface FileSidebarProps {
  files: MarkdownFile[];
  activeFileId: string;
  onSelectFile: (id: string) => void;
  onCreateFile: () => void;
  onDeleteFile: (id: string) => void;
  onRenameFile: (id: string, title: string) => void;
  onDuplicateFile: (id: string) => void;
  onExportFile: (id: string) => void;
  onImportFile: () => void;
  searchFiles: (query: string) => MarkdownFile[];
  isOpen: boolean;
  onClose: () => void;
}

const FileSidebar = ({
  files,
  activeFileId,
  onSelectFile,
  onCreateFile,
  onDeleteFile,
  onRenameFile,
  onDuplicateFile,
  onExportFile,
  onImportFile,
  searchFiles,
  isOpen,
  onClose,
}: FileSidebarProps) => {
  const [search, setSearch] = useState("");
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const renameInputRef = useRef<HTMLInputElement>(null);

  const displayed = search ? searchFiles(search) : files;

  useEffect(() => {
    if (renamingId && renameInputRef.current) {
      renameInputRef.current.focus();
      renameInputRef.current.select();
    }
  }, [renamingId]);

  const startRename = (file: MarkdownFile) => {
    setRenamingId(file.id);
    setRenameValue(file.title);
  };

  const confirmRename = () => {
    if (renamingId && renameValue.trim()) {
      onRenameFile(renamingId, renameValue.trim());
    }
    setRenamingId(null);
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return "Baru saja";
    if (diffMins < 60) return `${diffMins} mnt lalu`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} jam lalu`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `${diffDays} hari lalu`;
    return date.toLocaleDateString("id-ID", { day: "numeric", month: "short" });
  };

  const getPreview = (content: string) => {
    const lines = content.split("\n").filter((l) => l.trim() && !l.startsWith("#"));
    const text = lines.slice(0, 2).join(" ").replace(/[*_`~\[\]()#>-]/g, "").trim();
    return text.length > 80 ? text.substring(0, 80) + "..." : text || "Dokumen kosong";
  };

  return (
    <>
      {/* Overlay on mobile */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/30 z-40 md:hidden" onClick={onClose} />
      )}

      <aside
        className={`
          fixed md:relative z-50 top-0 left-0 h-full
          flex flex-col border-r border-border
          transition-all duration-300 ease-in-out
          ${isOpen ? "w-72 translate-x-0" : "w-0 -translate-x-full md:translate-x-0 md:w-0"}
          overflow-hidden
        `}
        style={{ background: "hsl(var(--card))" }}
      >
        <div className="flex-shrink-0 min-w-[288px]">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <h2
              className="text-sm font-semibold text-foreground tracking-wide uppercase"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Files
            </h2>
            <div className="flex items-center gap-1">
              <button
                onClick={onImportFile}
                className="toolbar-btn"
                title="Import file"
              >
                <Upload size={15} />
              </button>
              <button
                onClick={onCreateFile}
                className="toolbar-btn"
                title="File baru"
              >
                <FilePlus size={15} />
              </button>
              <button
                onClick={onClose}
                className="toolbar-btn md:hidden"
                title="Tutup sidebar"
              >
                <ChevronLeft size={15} />
              </button>
            </div>
          </div>

          {/* Search */}
          <div className="px-3 py-2 border-b border-border">
            <div className="relative">
              <Search
                size={14}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <input
                type="text"
                placeholder="Cari file..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-8 pr-8 py-1.5 rounded-md text-sm bg-secondary text-foreground placeholder:text-muted-foreground border-none outline-none focus:ring-1 focus:ring-ring"
                style={{ fontFamily: "'Inter', sans-serif" }}
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* File list */}
        <div className="flex-1 overflow-y-auto min-w-[288px]">
          {displayed.length === 0 ? (
            <div className="px-4 py-8 text-center text-sm text-muted-foreground">
              {search ? "Tidak ada file ditemukan" : "Belum ada file"}
            </div>
          ) : (
            <div className="py-1">
              {displayed.map((file) => (
                <div
                  key={file.id}
                  onClick={() => {
                    onSelectFile(file.id);
                    if (window.innerWidth < 768) onClose();
                  }}
                  className={`
                    group px-3 py-2.5 mx-1.5 my-0.5 rounded-lg cursor-pointer transition-all duration-150
                    ${
                      file.id === activeFileId
                        ? "bg-accent text-accent-foreground"
                        : "hover:bg-secondary text-foreground"
                    }
                  `}
                >
                  {renamingId === file.id ? (
                    <div className="flex items-center gap-1">
                      <input
                        ref={renameInputRef}
                        value={renameValue}
                        onChange={(e) => setRenameValue(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") confirmRename();
                          if (e.key === "Escape") setRenamingId(null);
                        }}
                        onBlur={confirmRename}
                        className="flex-1 px-1.5 py-0.5 rounded text-sm bg-background text-foreground border border-ring outline-none"
                        onClick={(e) => e.stopPropagation()}
                      />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          confirmRename();
                        }}
                        className="text-primary"
                      >
                        <Check size={14} />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <FileText size={14} className="flex-shrink-0 text-muted-foreground" />
                          <span className="text-sm font-medium truncate">{file.title}</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1 truncate pl-5">
                          {getPreview(file.content)}
                        </p>
                        <p className="text-[10px] text-muted-foreground mt-0.5 pl-5">
                          {formatDate(file.updatedAt)}
                        </p>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button
                            onClick={(e) => e.stopPropagation()}
                            className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 rounded hover:bg-muted"
                          >
                            <MoreHorizontal size={14} className="text-muted-foreground" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40">
                          <DropdownMenuItem onClick={() => startRename(file)}>
                            <Pencil size={14} className="mr-2" /> Rename
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onDuplicateFile(file.id)}>
                            <Copy size={14} className="mr-2" /> Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onExportFile(file.id)}>
                            <Download size={14} className="mr-2" /> Export .md
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => onDeleteFile(file.id)}
                            className="text-destructive focus:text-destructive"
                          >
                            <Trash2 size={14} className="mr-2" /> Hapus
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 px-4 py-2 border-t border-border text-[10px] text-muted-foreground min-w-[288px]" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
          {files.length} file
        </div>
      </aside>
    </>
  );
};

export default FileSidebar;
