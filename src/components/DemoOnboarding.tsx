import {
  ClipboardCheck,
  LayoutDashboard,
  Network,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { t } from "@/config/locale";

const STEPS = [
  { icon: Sparkles, titleKey: "onboardingTitle1", bodyKey: "onboardingBody1" },
  {
    icon: LayoutDashboard,
    titleKey: "onboardingTitle2",
    bodyKey: "onboardingBody2",
  },
  { icon: Network, titleKey: "onboardingTitle3", bodyKey: "onboardingBody3" },
  {
    icon: ClipboardCheck,
    titleKey: "onboardingTitle4",
    bodyKey: "onboardingBody4",
  },
  {
    icon: TrendingUp,
    titleKey: "onboardingTitle5",
    bodyKey: "onboardingBody5",
  },
] as const;

export function DemoOnboarding() {
  const [open, setOpen] = useState(true);
  const [step, setStep] = useState(0);
  const current = STEPS[step];
  const Icon = current.icon;
  const isLast = step === STEPS.length - 1;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        showCloseButton={false}
        className="glass-card border-white/12 bg-burgundy-950/70 sm:max-w-md"
      >
        <DialogHeader>
          <p className="text-[10px] uppercase tracking-wider text-burgundy-300/70 mb-2">
            {t("onboardingStepLabel")
              .replace("{step}", String(step + 1))
              .replace("{total}", String(STEPS.length))}
          </p>
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-full bg-burgundy-700/40 text-burgundy-200">
              <Icon className="size-5" />
            </span>
            <DialogTitle className="text-white">
              {t(current.titleKey)}
            </DialogTitle>
          </div>
          <DialogDescription className="text-white/60 leading-relaxed pt-2">
            {t(current.bodyKey)}
          </DialogDescription>
        </DialogHeader>
        <div className="flex gap-1.5 px-1">
          {STEPS.map((_, i) => (
            <span
              key={STEPS[i].titleKey}
              className={`h-1 flex-1 rounded-full ${
                i <= step ? "bg-burgundy-400" : "bg-white/10"
              }`}
            />
          ))}
        </div>
        <DialogFooter className="sm:justify-between gap-2">
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="text-xs text-white/45 hover:text-white/75 transition-colors order-2 sm:order-1"
          >
            {t("onboardingSkip")}
          </button>
          <Button
            type="button"
            onClick={() => {
              if (isLast) setOpen(false);
              else setStep(step + 1);
            }}
            className="bg-burgundy-600 hover:bg-burgundy-500 text-white order-1 sm:order-2"
          >
            {isLast ? t("onboardingStart") : t("onboardingNext")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
