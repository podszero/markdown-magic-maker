import { useState, useRef, useEffect } from "react";
import { format } from "timeago.js";
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

  const formatDate = (timestamp: number) => format(timestamp, "id_ID");

  const getPreview = (content: string) => {
    const lines = content.split("\n").filter((l) => l.trim() && !l.startsWith("#"));
    const text = lines.slice(0, 2).join(" ").replace(/[*_`~\[\]()#>-]/g, "").trim();
    return text.length > 60 ? text.substring(0, 60) + "…" : text || "Dokumen kosong";
  };

  return (
    <>
      {/* Overlay on mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 md:hidden transition-opacity duration-200"
          style={{ background: "hsl(var(--foreground) / 0.15)" }}
          onClick={onClose}
        />
      )}

      <aside
        className="sidebar-panel fixed md:relative z-50 top-0 left-0 h-full flex flex-col border-r border-border overflow-hidden"
        style={{
          background: "hsl(var(--card))",
          width: isOpen ? "260px" : "0px",
          opacity: isOpen ? 1 : 0,
        }}
      >
        <div className="flex-shrink-0" style={{ minWidth: "260px" }}>
          {/* Header */}
          <div className="flex items-center justify-between px-3 py-2 border-b border-border">
            <span
              className="text-[11px] font-semibold text-muted-foreground tracking-widest uppercase"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Files
            </span>
            <div className="flex items-center gap-0.5">
              <button onClick={onImportFile} className="toolbar-btn" title="Import">
                <Upload size={13} />
              </button>
              <button onClick={onCreateFile} className="toolbar-btn" title="New file">
                <FilePlus size={13} />
              </button>
            </div>
          </div>

          {/* Search */}
          <div className="px-2 py-1.5 border-b border-border">
            <div className="relative">
              <Search size={12} className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Cari..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-7 pr-7 py-1 rounded text-xs bg-secondary text-foreground placeholder:text-muted-foreground border-none outline-none focus:ring-1 focus:ring-ring transition-shadow"
                style={{ fontFamily: "'Inter', sans-serif" }}
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X size={12} />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* File list */}
        <div className="flex-1 overflow-y-auto custom-scroll" style={{ minWidth: "260px" }}>
          {displayed.length === 0 ? (
            <div className="px-3 py-6 text-center text-xs text-muted-foreground">
              {search ? "Tidak ditemukan" : "Belum ada file"}
            </div>
          ) : (
            <div className="py-0.5">
              {displayed.map((file, index) => (
                <div
                  key={file.id}
                  onClick={() => {
                    onSelectFile(file.id);
                    if (window.innerWidth < 768) onClose();
                  }}
                  className={`
                    group px-2.5 py-2 mx-1 my-px rounded-md cursor-pointer
                    transition-all duration-150 animate-fade-in
                    ${
                      file.id === activeFileId
                        ? "bg-accent text-accent-foreground"
                        : "hover:bg-secondary/70 text-foreground"
                    }
                  `}
                  style={{ animationDelay: `${index * 20}ms` }}
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
                        className="flex-1 px-1.5 py-0.5 rounded text-xs bg-background text-foreground border border-ring outline-none"
                        onClick={(e) => e.stopPropagation()}
                      />
                      <button
                        onClick={(e) => { e.stopPropagation(); confirmRename(); }}
                        className="text-primary"
                      >
                        <Check size={12} />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-start justify-between gap-1.5">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <FileText size={12} className="flex-shrink-0 text-muted-foreground" />
                          <span className="text-xs font-medium truncate">{file.title}</span>
                          <span className="text-[9px] text-muted-foreground flex-shrink-0">
                            {formatDate(file.updatedAt)}
                          </span>
                        </div>
                        <p className="text-[10px] text-muted-foreground mt-0.5 truncate pl-[18px] leading-relaxed">
                          {getPreview(file.content)}
                        </p>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button
                            onClick={(e) => e.stopPropagation()}
                            className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 rounded hover:bg-muted mt-0.5"
                          >
                            <MoreHorizontal size={12} className="text-muted-foreground" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-36 text-xs">
                          <DropdownMenuItem className="text-xs py-1.5" onClick={() => startRename(file)}>
                            <Pencil size={12} className="mr-1.5" /> Rename
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-xs py-1.5" onClick={() => onDuplicateFile(file.id)}>
                            <Copy size={12} className="mr-1.5" /> Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-xs py-1.5" onClick={() => onExportFile(file.id)}>
                            <Download size={12} className="mr-1.5" /> Export
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-xs py-1.5 text-destructive focus:text-destructive" onClick={() => onDeleteFile(file.id)}>
                            <Trash2 size={12} className="mr-1.5" /> Hapus
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
        <div className="flex-shrink-0 px-3 py-1.5 border-t border-border text-[9px] text-muted-foreground" style={{ fontFamily: "'JetBrains Mono', monospace", minWidth: "260px" }}>
          {files.length} file
        </div>
      </aside>
    </>
  );
};

export default FileSidebar;
