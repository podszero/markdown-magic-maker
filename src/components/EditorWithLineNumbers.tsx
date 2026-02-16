import { forwardRef, useRef, useCallback, useEffect, useState } from "react";

interface EditorWithLineNumbersProps {
  value: string;
  onChange: (value: string) => void;
  showLineNumbers: boolean;
  placeholder?: string;
  onScroll?: (e: React.UIEvent<HTMLTextAreaElement>) => void;
}

const EditorWithLineNumbers = forwardRef<HTMLTextAreaElement, EditorWithLineNumbersProps>(
  ({ value, onChange, showLineNumbers, placeholder, onScroll }, ref) => {
    const lineNumberRef = useRef<HTMLDivElement>(null);
    const internalRef = useRef<HTMLTextAreaElement>(null);
    const [lineCount, setLineCount] = useState(1);

    // Merge refs
    const setRefs = useCallback(
      (node: HTMLTextAreaElement | null) => {
        internalRef.current = node;
        if (typeof ref === "function") ref(node);
        else if (ref) (ref as React.MutableRefObject<HTMLTextAreaElement | null>).current = node;
      },
      [ref]
    );

    useEffect(() => {
      setLineCount(value.split("\n").length);
    }, [value]);

    const syncLineNumberScroll = useCallback(() => {
      if (lineNumberRef.current && internalRef.current) {
        lineNumberRef.current.scrollTop = internalRef.current.scrollTop;
      }
    }, []);

    const handleScroll = useCallback(
      (e: React.UIEvent<HTMLTextAreaElement>) => {
        syncLineNumberScroll();
        onScroll?.(e);
      },
      [onScroll, syncLineNumberScroll]
    );

    return (
      <div className="flex flex-1 overflow-hidden">
        {showLineNumbers && (
          <div
            ref={lineNumberRef}
            className="overflow-hidden flex-shrink-0 select-none text-right pr-2 pt-5 pb-5"
            style={{
              background: "hsl(var(--editor-bg))",
              color: "hsl(var(--muted-foreground) / 0.5)",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "0.85rem",
              lineHeight: "1.75",
              width: `${Math.max(lineCount.toString().length, 2) * 0.6 + 1.2}rem`,
              minWidth: "2.5rem",
              borderRight: "1px solid hsl(var(--border))",
            }}
          >
            {Array.from({ length: lineCount }, (_, i) => (
              <div key={i + 1} className="px-1" style={{ height: "1.75em" }}>
                {i + 1}
              </div>
            ))}
          </div>
        )}
        <textarea
          ref={setRefs}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onScroll={handleScroll}
          className="editor-textarea flex-1 custom-scroll"
          placeholder={placeholder}
          spellCheck={false}
          style={showLineNumbers ? { paddingLeft: "0.75rem" } : undefined}
        />
      </div>
    );
  }
);

EditorWithLineNumbers.displayName = "EditorWithLineNumbers";
export default EditorWithLineNumbers;
