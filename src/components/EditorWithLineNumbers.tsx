import { forwardRef, useRef, useCallback, useEffect, useState, memo } from "react";
import { Virtuoso } from "react-virtuoso";

interface EditorWithLineNumbersProps {
  value: string;
  onChange: (value: string) => void;
  showLineNumbers: boolean;
  placeholder?: string;
  onScroll?: (e: React.UIEvent<HTMLTextAreaElement>) => void;
}

const LineNumber = memo(({ num }: { num: number }) => (
  <div
    className="text-right pr-2 select-none"
    style={{
      color: "hsl(var(--muted-foreground) / 0.4)",
      fontFamily: "'JetBrains Mono', monospace",
      fontSize: "0.85rem",
      lineHeight: "1.75",
      height: "1.75em",
    }}
  >
    {num}
  </div>
));
LineNumber.displayName = "LineNumber";

const EditorWithLineNumbers = forwardRef<HTMLTextAreaElement, EditorWithLineNumbersProps>(
  ({ value, onChange, showLineNumbers, placeholder, onScroll }, ref) => {
    const lineNumberRef = useRef<HTMLDivElement>(null);
    const internalRef = useRef<HTMLTextAreaElement>(null);
    const lineCount = value.split("\n").length;

    const setRefs = useCallback(
      (node: HTMLTextAreaElement | null) => {
        internalRef.current = node;
        if (typeof ref === "function") ref(node);
        else if (ref) (ref as React.MutableRefObject<HTMLTextAreaElement | null>).current = node;
      },
      [ref]
    );

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
            className="overflow-hidden flex-shrink-0 pt-5 pb-5"
            style={{
              background: "hsl(var(--editor-bg))",
              width: `${Math.max(lineCount.toString().length, 2) * 0.6 + 1.2}rem`,
              minWidth: "2.5rem",
              borderRight: "1px solid hsl(var(--border))",
            }}
          >
            {lineCount <= 5000 ? (
              Array.from({ length: lineCount }, (_, i) => (
                <LineNumber key={i + 1} num={i + 1} />
              ))
            ) : (
              <Virtuoso
                totalCount={lineCount}
                itemContent={(i) => <LineNumber num={i + 1} />}
                style={{ height: "100%" }}
              />
            )}
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
