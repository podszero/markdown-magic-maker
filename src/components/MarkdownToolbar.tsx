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
  type LucideIcon,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ToolItem {
  icon: LucideIcon;
  action: string;
  after?: string;
  title: string;
  shortcut?: string;
}

interface DividerItem {
  divider: true;
}

type Tool = ToolItem | DividerItem;

interface ToolbarProps {
  onInsert: (before: string, after?: string) => void;
  isVisible: boolean;
}

const tools: Tool[] = [
  { icon: Bold, action: "**", after: "**", title: "Bold", shortcut: "Ctrl+B" },
  { icon: Italic, action: "*", after: "*", title: "Italic", shortcut: "Ctrl+I" },
  { icon: Strikethrough, action: "~~", after: "~~", title: "Strikethrough" },
  { divider: true },
  { icon: Heading1, action: "# ", title: "Heading 1" },
  { icon: Heading2, action: "## ", title: "Heading 2" },
  { icon: Heading3, action: "### ", title: "Heading 3" },
  { divider: true },
  { icon: List, action: "- ", title: "Bullet List" },
  { icon: ListOrdered, action: "1. ", title: "Numbered List" },
  { icon: ListChecks, action: "- [ ] ", title: "Checklist" },
  { divider: true },
  { icon: Quote, action: "> ", title: "Blockquote" },
  { icon: Code, action: "`", after: "`", title: "Inline Code" },
  { icon: CodeSquare, action: "\n```\n", after: "\n```\n", title: "Code Block" },
  { divider: true },
  { icon: Link, action: "[", after: "](url)", title: "Link" },
  { icon: Image, action: "![alt](", after: ")", title: "Image" },
  { icon: Minus, action: "\n---\n", title: "Horizontal Rule" },
  {
    icon: Table,
    action: "\n| Header | Header |\n| ------ | ------ |\n| Cell   | Cell   |\n",
    title: "Table",
  },
];

const MarkdownToolbar = ({ onInsert, isVisible }: ToolbarProps) => {
  return (
    <div
      className="overflow-hidden transition-all duration-200 ease-in-out border-b flex-shrink-0"
      style={{
        maxHeight: isVisible ? "36px" : "0px",
        opacity: isVisible ? 1 : 0,
        borderColor: isVisible ? "hsl(var(--toolbar-border))" : "transparent",
        background: "hsl(var(--toolbar-bg))",
      }}
    >
      <div className="flex items-center gap-px px-2 py-1 overflow-x-auto custom-scroll">
        {tools.map((tool, i) =>
          "divider" in tool ? (
            <div
              key={i}
              className="w-px h-4 mx-1 flex-shrink-0"
              style={{ background: "hsl(var(--toolbar-border))" }}
            />
          ) : (
            <Tooltip key={i}>
              <TooltipTrigger asChild>
                <button
                  onClick={() => onInsert(tool.action, tool.after)}
                  className="toolbar-btn"
                >
                  <tool.icon size={14} />
                </button>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="text-[11px] flex items-center gap-2 py-1 px-2">
                <span>{tool.title}</span>
                {tool.shortcut && (
                  <kbd className="text-[10px] px-1 py-px rounded bg-muted text-muted-foreground font-mono">
                    {tool.shortcut}
                  </kbd>
                )}
              </TooltipContent>
            </Tooltip>
          )
        )}
      </div>
    </div>
  );
};

export default MarkdownToolbar;
