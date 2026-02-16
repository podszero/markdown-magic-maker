import { Settings } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useEditorStore } from "@/stores/useEditorStore";

const EditorSettings = () => {
  const showLineNumbers = useEditorStore((s) => s.showLineNumbers);
  const syncScroll = useEditorStore((s) => s.syncScroll);
  const setShowLineNumbers = useEditorStore((s) => s.setShowLineNumbers);
  const setSyncScroll = useEditorStore((s) => s.setSyncScroll);

  return (
    <Popover>
      <Tooltip>
        <TooltipTrigger asChild>
          <PopoverTrigger asChild>
            <button className="toolbar-btn">
              <Settings size={14} />
            </button>
          </PopoverTrigger>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="text-[11px] py-1 px-2">
          Settings
        </TooltipContent>
      </Tooltip>
      <PopoverContent align="end" className="w-56 p-3 space-y-3">
        <p
          className="text-[11px] font-semibold text-muted-foreground tracking-widest uppercase"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          Editor Settings
        </p>
        <div className="flex items-center justify-between">
          <Label htmlFor="line-numbers" className="text-xs cursor-pointer">
            Line Numbers
          </Label>
          <Switch
            id="line-numbers"
            checked={showLineNumbers}
            onCheckedChange={setShowLineNumbers}
            className="scale-75"
          />
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="sync-scroll" className="text-xs cursor-pointer">
            Sync Scroll
          </Label>
          <Switch
            id="sync-scroll"
            checked={syncScroll}
            onCheckedChange={setSyncScroll}
            className="scale-75"
          />
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default EditorSettings;
