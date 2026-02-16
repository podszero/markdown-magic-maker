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
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface ToolbarProps {
  onInsert: (before: string, after?: string) => void;
}

const MarkdownToolbar = ({ onInsert }: ToolbarProps) => {
  const tools = [
    { icon: Bold, action: () => onInsert("**", "**"), title: "Bold", shortcut: "Ctrl+B" },
    { icon: Italic, action: () => onInsert("*", "*"), title: "Italic", shortcut: "Ctrl+I" },
    { icon: Strikethrough, action: () => onInsert("~~", "~~"), title: "Strikethrough" },
    { divider: true },
    { icon: Heading1, action: () => onInsert("# "), title: "Heading 1" },
    { icon: Heading2, action: () => onInsert("## "), title: "Heading 2" },
    { icon: Heading3, action: () => onInsert("### "), title: "Heading 3" },
    { divider: true },
    { icon: List, action: () => onInsert("- "), title: "Bullet List" },
    { icon: ListOrdered, action: () => onInsert("1. "), title: "Numbered List" },
    { icon: ListChecks, action: () => onInsert("- [ ] "), title: "Checklist" },
    { divider: true },
    { icon: Quote, action: () => onInsert("> "), title: "Blockquote" },
    { icon: Code, action: () => onInsert("`", "`"), title: "Inline Code" },
    { icon: CodeSquare, action: () => onInsert("\n```\n", "\n```\n"), title: "Code Block" },
    { divider: true },
    { icon: Link, action: () => onInsert("[", "](url)"), title: "Link" },
    { icon: Image, action: () => onInsert("![alt](", ")"), title: "Image" },
    { icon: Minus, action: () => onInsert("\n---\n"), title: "Divider" },
    {
      icon: Table,
      action: () =>
        onInsert(
          "\n| Header | Header | Header |\n| ------ | ------ | ------ |\n| Cell   | Cell   | Cell   |\n| Cell   | Cell   | Cell   |\n"
        ),
      title: "Table",
    },
  ];

  return (
    <div
      className="flex items-center gap-0.5 px-3 py-2 border-b overflow-x-auto flex-shrink-0"
      style={{
        background: "hsl(var(--toolbar-bg))",
        borderColor: "hsl(var(--toolbar-border))",
      }}
    >
      {tools.map((tool, i) =>
        "divider" in tool ? (
          <div
            key={i}
            className="w-px h-5 mx-1 flex-shrink-0"
            style={{ background: "hsl(var(--toolbar-border))" }}
          />
        ) : (
          <Tooltip key={i}>
            <TooltipTrigger asChild>
              <button onClick={tool.action} className="toolbar-btn flex-shrink-0" title={tool.title}>
                <tool.icon size={16} />
              </button>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="text-xs">
              {tool.title}
              {"shortcut" in tool && (
                <span className="ml-2 text-muted-foreground">{tool.shortcut}</span>
              )}
            </TooltipContent>
          </Tooltip>
        )
      )}
    </div>
  );
};

export default MarkdownToolbar;
