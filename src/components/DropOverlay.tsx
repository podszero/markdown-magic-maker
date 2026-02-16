import { Upload, FileText } from "lucide-react";

interface DropOverlayProps {
  isDragActive: boolean;
}

const DropOverlay = ({ isDragActive }: DropOverlayProps) => {
  if (!isDragActive) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none animate-fade-in">
      <div
        className="absolute inset-0"
        style={{ background: "hsl(var(--background) / 0.85)", backdropFilter: "blur(8px)" }}
      />
      <div className="relative flex flex-col items-center gap-4 p-10 rounded-2xl border-2 border-dashed border-primary/50 bg-accent/50">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center"
          style={{ background: "hsl(var(--primary) / 0.15)" }}
        >
          <Upload size={28} className="text-primary" />
        </div>
        <div className="text-center">
          <p className="text-lg font-semibold text-foreground" style={{ fontFamily: "'Inter', sans-serif" }}>
            Drop file di sini
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Mendukung file .md, .markdown, dan .txt
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <FileText size={12} />
          <span>Bisa drop banyak file sekaligus</span>
        </div>
      </div>
    </div>
  );
};

export default DropOverlay;
