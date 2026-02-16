import { useMemo } from "react";

interface OutlineItem {
  level: number;
  text: string;
  id: string;
}

interface DocumentOutlineProps {
  content: string;
  isOpen: boolean;
  onClose: () => void;
}

const DocumentOutline = ({ content, isOpen, onClose }: DocumentOutlineProps) => {
  const headings = useMemo<OutlineItem[]>(() => {
    const lines = content.split("\n");
    return lines
      .filter((line) => /^#{1,6}\s/.test(line))
      .map((line, i) => {
        const match = line.match(/^(#{1,6})\s+(.+)/);
        if (!match) return null;
        return {
          level: match[1].length,
          text: match[2].replace(/[*_`~\[\]()#]/g, "").trim(),
          id: `heading-${i}`,
        };
      })
      .filter(Boolean) as OutlineItem[];
  }, [content]);

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/20 z-40 md:hidden" onClick={onClose} />
      <aside
        className="fixed md:relative right-0 top-0 h-full z-50 w-60 border-l border-border overflow-y-auto flex-shrink-0"
        style={{ background: "hsl(var(--card))" }}
      >
        <div className="px-4 py-3 border-b border-border">
          <h3
            className="text-sm font-semibold text-foreground tracking-wide uppercase"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Outline
          </h3>
        </div>
        <div className="py-2">
          {headings.length === 0 ? (
            <p className="px-4 py-4 text-xs text-muted-foreground">Tidak ada heading ditemukan</p>
          ) : (
            headings.map((h) => (
              <button
                key={h.id}
                className="w-full text-left px-4 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground transition-colors truncate"
                style={{
                  paddingLeft: `${(h.level - 1) * 12 + 16}px`,
                  color: h.level === 1 ? "hsl(var(--foreground))" : "hsl(var(--muted-foreground))",
                  fontWeight: h.level <= 2 ? 600 : 400,
                  fontSize: h.level === 1 ? "0.875rem" : "0.8rem",
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                {h.text}
              </button>
            ))
          )}
        </div>
      </aside>
    </>
  );
};

export default DocumentOutline;
