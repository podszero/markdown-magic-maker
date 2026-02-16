import {
  Bold,
  Italic,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  ListChecks,
  Quote,
  Code,
  CodeSquare,
  Link,
  Image,
  Minus,
  Table,
  ChevronUp,
  ChevronDown,
} from "lucide-react";

interface ToolbarProps {
  onInsert: (before: string, after?: string) => void;
  isVisible: boolean;
  onToggle: () => void;
}

const tools = [
  { icon: Bold, action: "**", after: "**", title: "Bold" },
  { icon: Italic, action: "*", after: "*", title: "Italic" },
  { icon: Strikethrough, action: "~~", after: "~~", title: "Strikethrough" },
  { divider: true },
  { icon: Heading1, action: "# ", title: "H1" },
  { icon: Heading2, action: "## ", title: "H2" },
  { icon: Heading3, action: "### ", title: "H3" },
  { divider: true },
  { icon: List, action: "- ", title: "List" },
  { icon: ListOrdered, action: "1. ", title: "Numbered" },
  { icon: ListChecks, action: "- [ ] ", title: "Checklist" },
  { divider: true },
  { icon: Quote, action: "> ", title: "Quote" },
  { icon: Code, action: "`", after: "`", title: "Code" },
  { icon: CodeSquare, action: "\n```\n", after: "\n```\n", title: "Block" },
  { divider: true },
  { icon: Link, action: "[", after: "](url)", title: "Link" },
  { icon: Image, action: "![alt](", after: ")", title: "Image" },
  { icon: Minus, action: "\n---\n", title: "Rule" },
  {
    icon: Table,
    action: "\n| Header | Header |\n| ------ | ------ |\n| Cell   | Cell   |\n",
    title: "Table",
  },
];

const MarkdownToolbar = ({ onInsert, isVisible, onToggle }: ToolbarProps) => {
  return (
    <div className="flex-shrink-0 border-b" style={{ borderColor: "hsl(var(--toolbar-border))" }}>
      {/* Toggle bar - always visible */}
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-center py-0.5 transition-colors hover:bg-accent/50"
        style={{ background: "hsl(var(--toolbar-bg))" }}
        title={isVisible ? "Sembunyikan toolbar" : "Tampilkan toolbar"}
      >
        {isVisible ? (
          <ChevronUp size={12} className="text-muted-foreground" />
        ) : (
          <ChevronDown size={12} className="text-muted-foreground" />
        )}
      </button>

      {/* Toolbar content */}
      <div
        className="overflow-hidden transition-all duration-200 ease-in-out"
        style={{
          maxHeight: isVisible ? "40px" : "0px",
          opacity: isVisible ? 1 : 0,
          background: "hsl(var(--toolbar-bg))",
        }}
      >
        <div className="flex items-center gap-px px-2 py-1 overflow-x-auto custom-scroll">
          {tools.map((tool, i) =>
            "divider" in tool ? (
              <div
                key={i}
                className="w-px h-4 mx-0.5 flex-shrink-0"
                style={{ background: "hsl(var(--toolbar-border))" }}
              />
            ) : (
              <button
                key={i}
                onClick={() => onInsert(tool.action, tool.after)}
                className="toolbar-btn"
                title={tool.title}
              >
                <tool.icon size={14} />
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default MarkdownToolbar;
