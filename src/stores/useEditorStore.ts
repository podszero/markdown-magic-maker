import { create } from "zustand";

interface EditorSettings {
  showLineNumbers: boolean;
  syncScroll: boolean;
  viewMode: "split" | "editor" | "preview";
  sidebarOpen: boolean;
  outlineOpen: boolean;
  focusMode: boolean;
  toolbarVisible: boolean;
}

interface EditorStore extends EditorSettings {
  setShowLineNumbers: (v: boolean) => void;
  setSyncScroll: (v: boolean) => void;
  setViewMode: (v: "split" | "editor" | "preview") => void;
  setSidebarOpen: (v: boolean) => void;
  setOutlineOpen: (v: boolean) => void;
  setFocusMode: (v: boolean) => void;
  setToolbarVisible: (v: boolean) => void;
  toggleSidebar: () => void;
  toggleOutline: () => void;
  toggleFocusMode: () => void;
  toggleToolbar: () => void;
  enterFocusMode: () => void;
  exitFocusMode: () => void;
}

const SETTINGS_KEY = "md-editor-settings";

function loadSettings(): Partial<EditorSettings> {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return {};
}

function persistSettings(state: EditorSettings) {
  localStorage.setItem(
    SETTINGS_KEY,
    JSON.stringify({
      showLineNumbers: state.showLineNumbers,
      syncScroll: state.syncScroll,
      toolbarVisible: state.toolbarVisible,
    })
  );
}

const saved = loadSettings();

export const useEditorStore = create<EditorStore>((set, get) => ({
  showLineNumbers: saved.showLineNumbers ?? false,
  syncScroll: saved.syncScroll ?? true,
  viewMode: "split",
  sidebarOpen: true,
  outlineOpen: false,
  focusMode: false,
  toolbarVisible: saved.toolbarVisible ?? true,

  setShowLineNumbers: (v) => {
    set({ showLineNumbers: v });
    persistSettings({ ...get(), showLineNumbers: v });
  },
  setSyncScroll: (v) => {
    set({ syncScroll: v });
    persistSettings({ ...get(), syncScroll: v });
  },
  setViewMode: (v) => set({ viewMode: v }),
  setSidebarOpen: (v) => set({ sidebarOpen: v }),
  setOutlineOpen: (v) => set({ outlineOpen: v }),
  setFocusMode: (v) => set({ focusMode: v }),
  setToolbarVisible: (v) => {
    set({ toolbarVisible: v });
    persistSettings({ ...get(), toolbarVisible: v });
  },
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  toggleOutline: () => set((s) => ({ outlineOpen: !s.outlineOpen })),
  toggleFocusMode: () => {
    const current = get().focusMode;
    if (!current) {
      set({ focusMode: true, sidebarOpen: false, outlineOpen: false });
    } else {
      set({ focusMode: false });
    }
  },
  toggleToolbar: () => {
    const next = !get().toolbarVisible;
    set({ toolbarVisible: next });
    persistSettings({ ...get(), toolbarVisible: next });
  },
  enterFocusMode: () => set({ focusMode: true, sidebarOpen: false, outlineOpen: false }),
  exitFocusMode: () => set({ focusMode: false }),
}));
