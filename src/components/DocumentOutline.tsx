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
  onHeadingClick?: (id: string) => void;
}

const DocumentOutline = ({ content, isOpen, onClose, onHeadingClick }: DocumentOutlineProps) => {
  const headings = useMemo<OutlineItem[]>(() => {
    return content
      .split("\n")
      .filter((line) => /^#{1,6}\s/.test(line))
      .map((line, i) => {
        const match = line.match(/^(#{1,6})\s+(.+)/);
        if (!match) return null;
        const text = match[2].replace(/[*_`~\[\]()#]/g, "").trim();
        return {
          level: match[1].length,
          text,
          id: `heading-${text.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "")}-${i}`,
        };
      })
      .filter(Boolean) as OutlineItem[];
  }, [content]);

  const handleClick = (h: OutlineItem) => {
    onHeadingClick?.(h.id);
  };

  return (
    <aside
      className="sidebar-panel relative top-0 right-0 h-full border-l border-border overflow-hidden flex-shrink-0"
      style={{
        background: "hsl(var(--card))",
        width: isOpen ? "200px" : "0px",
        opacity: isOpen ? 1 : 0,
      }}
    >
      <div style={{ minWidth: "200px" }}>
        <div className="px-3 py-2 border-b border-border">
          <span
            className="text-[11px] font-semibold text-muted-foreground tracking-widest uppercase"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Outline
          </span>
        </div>
        <div className="py-1 overflow-y-auto custom-scroll" style={{ maxHeight: "calc(100vh - 120px)" }}>
          {headings.length === 0 ? (
            <p className="px-3 py-4 text-[10px] text-muted-foreground">Tidak ada heading</p>
          ) : (
            headings.map((h) => (
              <button
                key={h.id}
                onClick={() => handleClick(h)}
                className="w-full text-left py-1 hover:bg-accent/50 transition-colors truncate block"
                style={{
                  paddingLeft: `${(h.level - 1) * 10 + 12}px`,
                  paddingRight: "12px",
                  color: h.level <= 2 ? "hsl(var(--foreground))" : "hsl(var(--muted-foreground))",
                  fontWeight: h.level <= 2 ? 600 : 400,
                  fontSize: h.level === 1 ? "0.75rem" : "0.7rem",
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                {h.text}
              </button>
            ))
          )}
        </div>
      </div>
    </aside>
  );
};

export default DocumentOutline;
