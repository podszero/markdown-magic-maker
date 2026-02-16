import { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";

mermaid.initialize({
  startOnLoad: false,
  theme: "default",
  securityLevel: "loose",
  fontFamily: "'Inter', sans-serif",
});

interface MermaidBlockProps {
  code: string;
}

let mermaidCounter = 0;

const MermaidBlock = ({ code }: MermaidBlockProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svg, setSvg] = useState<string>("");
  const [error, setError] = useState<string>("");
  const idRef = useRef(`mermaid-${Date.now()}-${mermaidCounter++}`);

  useEffect(() => {
    let cancelled = false;

    const render = async () => {
      try {
        const { svg: renderedSvg } = await mermaid.render(idRef.current, code.trim());
        if (!cancelled) {
          setSvg(renderedSvg);
          setError("");
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Mermaid render error");
          setSvg("");
        }
        // Clean up any leftover error elements mermaid might create
        const errorEl = document.getElementById("d" + idRef.current);
        if (errorEl) errorEl.remove();
      }
    };

    render();
    return () => { cancelled = true; };
  }, [code]);

  if (error) {
    return (
      <div className="rounded-lg p-4 my-4 text-sm border" style={{
        background: "hsl(var(--destructive) / 0.1)",
        borderColor: "hsl(var(--destructive) / 0.3)",
        color: "hsl(var(--destructive))",
      }}>
        <p className="font-semibold mb-1" style={{ fontFamily: "'Inter', sans-serif" }}>Mermaid Error</p>
        <pre className="text-xs whitespace-pre-wrap font-mono opacity-80">{error}</pre>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="my-4 flex justify-center overflow-x-auto rounded-lg p-4"
      style={{ background: "hsl(var(--muted) / 0.3)" }}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
};

export default MermaidBlock;
