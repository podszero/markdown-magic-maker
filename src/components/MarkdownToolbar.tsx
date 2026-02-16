import { Bold, Italic, Heading1, Heading2, Heading3, List, ListOrdered, Quote, Code, Link, Image, Minus, Table } from "lucide-react";

interface ToolbarProps {
  onInsert: (before: string, after?: string) => void;
}

const MarkdownToolbar = ({ onInsert }: ToolbarProps) => {
  const tools = [
    { icon: Bold, action: () => onInsert("**", "**"), title: "Bold" },
    { icon: Italic, action: () => onInsert("*", "*"), title: "Italic" },
    { divider: true },
    { icon: Heading1, action: () => onInsert("# "), title: "Heading 1" },
    { icon: Heading2, action: () => onInsert("## "), title: "Heading 2" },
    { icon: Heading3, action: () => onInsert("### "), title: "Heading 3" },
    { divider: true },
    { icon: List, action: () => onInsert("- "), title: "Unordered List" },
    { icon: ListOrdered, action: () => onInsert("1. "), title: "Ordered List" },
    { icon: Quote, action: () => onInsert("> "), title: "Blockquote" },
    { icon: Code, action: () => onInsert("`", "`"), title: "Inline Code" },
    { divider: true },
    { icon: Link, action: () => onInsert("[", "](url)"), title: "Link" },
    { icon: Image, action: () => onInsert("![alt](", ")"), title: "Image" },
    { icon: Minus, action: () => onInsert("\n---\n"), title: "Divider" },
    { icon: Table, action: () => onInsert("\n| Header | Header |\n| ------ | ------ |\n| Cell   | Cell   |\n"), title: "Table" },
  ];

  return (
    <div
      className="flex items-center gap-0.5 px-3 py-2 border-b overflow-x-auto"
      style={{
        background: "hsl(var(--toolbar-bg))",
        borderColor: "hsl(var(--toolbar-border))",
      }}
    >
      {tools.map((tool, i) =>
        "divider" in tool ? (
          <div key={i} className="w-px h-5 mx-1" style={{ background: "hsl(var(--toolbar-border))" }} />
        ) : (
          <button
            key={i}
            onClick={tool.action}
            className="toolbar-btn"
            title={tool.title}
          >
            <tool.icon size={16} />
          </button>
        )
      )}
    </div>
  );
};

export default MarkdownToolbar;
