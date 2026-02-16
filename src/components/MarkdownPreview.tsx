import { memo, useMemo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeHighlight from "rehype-highlight";
import "katex/dist/katex.min.css";
import "highlight.js/styles/github.css";
import MermaidBlock from "./MermaidBlock";
import type { Components } from "react-markdown";

interface MarkdownPreviewProps {
  content: string;
}

const MarkdownPreview = memo(({ content }: MarkdownPreviewProps) => {
  const components = useMemo<Components>(
    () => ({
      code({ className, children, ...props }) {
        const match = /language-(\w+)/.exec(className || "");
        const lang = match?.[1];
        const codeString = String(children).replace(/\n$/, "");

        // Mermaid block
        if (lang === "mermaid") {
          return <MermaidBlock code={codeString} />;
        }

        // Inline code (no language class, no block)
        const isInline = !className && !String(children).includes("\n");
        if (isInline) {
          return <code className={className} {...props}>{children}</code>;
        }

        // Block code with syntax highlighting handled by rehype-highlight
        return (
          <code className={className} {...props}>
            {children}
          </code>
        );
      },
      // Better table rendering
      table({ children }) {
        return (
          <div className="overflow-x-auto my-4 rounded-lg border" style={{ borderColor: "hsl(var(--border))" }}>
            <table>{children}</table>
          </div>
        );
      },
    }),
    []
  );

  return (
    <div className="markdown-preview">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex, [rehypeHighlight, { detect: true, ignoreMissing: true }]]}
        components={components}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
});

MarkdownPreview.displayName = "MarkdownPreview";

export default MarkdownPreview;
