import { useState, useEffect, useCallback } from "react";
import { MarkdownFile, DEFAULT_CONTENT } from "@/types/markdown";

const STORAGE_KEY = "markdown-editor-files";
const ACTIVE_FILE_KEY = "markdown-editor-active";

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}

function loadFiles(): MarkdownFile[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  const defaultFile: MarkdownFile = {
    id: generateId(),
    title: "Welcome",
    content: DEFAULT_CONTENT,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
  return [defaultFile];
}

function saveFiles(files: MarkdownFile[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(files));
}

function loadActiveId(): string | null {
  return localStorage.getItem(ACTIVE_FILE_KEY);
}

function saveActiveId(id: string) {
  localStorage.setItem(ACTIVE_FILE_KEY, id);
}

export function useMarkdownFiles() {
  const [files, setFiles] = useState<MarkdownFile[]>(loadFiles);
  const [activeFileId, setActiveFileId] = useState<string>(() => {
    const saved = loadActiveId();
    const loaded = loadFiles();
    if (saved && loaded.find((f) => f.id === saved)) return saved;
    return loaded[0]?.id || "";
  });

  const activeFile = files.find((f) => f.id === activeFileId) || files[0];

  useEffect(() => {
    saveFiles(files);
  }, [files]);

  useEffect(() => {
    if (activeFileId) saveActiveId(activeFileId);
  }, [activeFileId]);

  const createFile = useCallback((title?: string) => {
    const newFile: MarkdownFile = {
      id: generateId(),
      title: title || "Untitled",
      content: `# ${title || "Untitled"}\n\nMulai menulis di sini...\n`,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    setFiles((prev) => [newFile, ...prev]);
    setActiveFileId(newFile.id);
    return newFile;
  }, []);

  const updateFileContent = useCallback((id: string, content: string) => {
    setFiles((prev) =>
      prev.map((f) =>
        f.id === id ? { ...f, content, updatedAt: Date.now() } : f
      )
    );
  }, []);

  const renameFile = useCallback((id: string, title: string) => {
    setFiles((prev) =>
      prev.map((f) =>
        f.id === id ? { ...f, title, updatedAt: Date.now() } : f
      )
    );
  }, []);

  const deleteFile = useCallback(
    (id: string) => {
      setFiles((prev) => {
        const next = prev.filter((f) => f.id !== id);
        if (next.length === 0) {
          const fallback: MarkdownFile = {
            id: generateId(),
            title: "Untitled",
            content: "# Untitled\n\nMulai menulis di sini...\n",
            createdAt: Date.now(),
            updatedAt: Date.now(),
          };
          setActiveFileId(fallback.id);
          return [fallback];
        }
        if (id === activeFileId) {
          setActiveFileId(next[0].id);
        }
        return next;
      });
    },
    [activeFileId]
  );

  const duplicateFile = useCallback(
    (id: string) => {
      const source = files.find((f) => f.id === id);
      if (!source) return;
      const dup: MarkdownFile = {
        id: generateId(),
        title: source.title + " (Copy)",
        content: source.content,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      setFiles((prev) => [dup, ...prev]);
      setActiveFileId(dup.id);
    },
    [files]
  );

  const exportFile = useCallback(
    (id: string) => {
      const file = files.find((f) => f.id === id);
      if (!file) return;
      const blob = new Blob([file.content], { type: "text/markdown" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${file.title}.md`;
      a.click();
      URL.revokeObjectURL(url);
    },
    [files]
  );

  const importFile = useCallback(() => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".md,.markdown,.txt";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        const content = ev.target?.result as string;
        const title = file.name.replace(/\.(md|markdown|txt)$/, "");
        const newFile: MarkdownFile = {
          id: generateId(),
          title,
          content,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };
        setFiles((prev) => [newFile, ...prev]);
        setActiveFileId(newFile.id);
      };
      reader.readAsText(file);
    };
    input.click();
  }, []);

  const searchFiles = useCallback(
    (query: string) => {
      if (!query.trim()) return files;
      const lower = query.toLowerCase();
      return files.filter(
        (f) =>
          f.title.toLowerCase().includes(lower) ||
          f.content.toLowerCase().includes(lower)
      );
    },
    [files]
  );

  return {
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
  };
}
