import { memo, useMemo, forwardRef } from "react";
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
  onScroll?: (e: React.UIEvent<HTMLDivElement>) => void;
}

const slugify = (text: string) =>
  text.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "");

const MarkdownPreview = memo(
  forwardRef<HTMLDivElement, MarkdownPreviewProps>(({ content, onScroll }, ref) => {
    // Track heading index for unique IDs
    let headingIndex = 0;

    const components = useMemo<Components>(() => {
      let idx = 0;
      return {
        code({ className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || "");
          const lang = match?.[1];
          const codeString = String(children).replace(/\n$/, "");
          if (lang === "mermaid") return <MermaidBlock code={codeString} />;
          const isInline = !className && !String(children).includes("\n");
          if (isInline) return <code className={className} {...props}>{children}</code>;
          return <code className={className} {...props}>{children}</code>;
        },
        h1({ children }) {
          const text = String(children).replace(/[*_`~\[\]()#]/g, "").trim();
          const id = `heading-${slugify(text)}-${idx++}`;
          return <h1 id={id}>{children}</h1>;
        },
        h2({ children }) {
          const text = String(children).replace(/[*_`~\[\]()#]/g, "").trim();
          const id = `heading-${slugify(text)}-${idx++}`;
          return <h2 id={id}>{children}</h2>;
        },
        h3({ children }) {
          const text = String(children).replace(/[*_`~\[\]()#]/g, "").trim();
          const id = `heading-${slugify(text)}-${idx++}`;
          return <h3 id={id}>{children}</h3>;
        },
        h4({ children }) {
          const text = String(children).replace(/[*_`~\[\]()#]/g, "").trim();
          const id = `heading-${slugify(text)}-${idx++}`;
          return <h4 id={id}>{children}</h4>;
        },
        h5({ children }) {
          const text = String(children).replace(/[*_`~\[\]()#]/g, "").trim();
          const id = `heading-${slugify(text)}-${idx++}`;
          return <h5 id={id}>{children}</h5>;
        },
        h6({ children }) {
          const text = String(children).replace(/[*_`~\[\]()#]/g, "").trim();
          const id = `heading-${slugify(text)}-${idx++}`;
          return <h6 id={id}>{children}</h6>;
        },
        table({ children }) {
          return (
            <div className="overflow-x-auto my-4 rounded-lg border" style={{ borderColor: "hsl(var(--border))" }}>
              <table>{children}</table>
            </div>
          );
        },
      };
    }, []);

    return (
      <div ref={ref} onScroll={onScroll} className="flex-1 overflow-y-auto custom-scroll p-4 md:p-8">
        <div className="max-w-3xl mx-auto">
          <div className="markdown-preview">
            <ReactMarkdown
              remarkPlugins={[remarkGfm, remarkMath]}
              rehypePlugins={[rehypeKatex, [rehypeHighlight, { detect: true, ignoreMissing: true }]]}
              components={components}
            >
              {content}
            </ReactMarkdown>
          </div>
        </div>
      </div>
    );
  })
);

MarkdownPreview.displayName = "MarkdownPreview";
export default MarkdownPreview;
