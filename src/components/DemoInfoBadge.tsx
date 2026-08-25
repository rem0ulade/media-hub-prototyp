import { Info } from "lucide-react";
import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { t } from "@/config/locale";

export function DemoInfoBadge({ className = "" }: { className?: string }) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label={t("demoNumbersHintTitle")}
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() => setOpen(false)}
          className={`inline-flex items-center gap-1 rounded-full border border-blue-500/40 bg-blue-900/25 px-2 py-0.5 text-xs text-blue-200 uppercase tracking-wider hover:bg-blue-900/40 transition-colors ${className}`}
        >
          <Info className="size-3" />
          {t("demoVersionBadge")}
        </button>
      </PopoverTrigger>
      <PopoverContent
        side="bottom"
        align="start"
        className="w-72 border-blue-700/40 bg-burgundy-950/95 text-blue-50 p-3"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
      >
        <p className="text-xs font-semibold text-blue-100 mb-1">
          {t("demoNumbersHintTitle")}
        </p>
        <p className="text-xs text-blue-100/75 leading-relaxed">
          {t("demoNumbersHint")}
        </p>
      </PopoverContent>
    </Popover>
  );
}
