import { Outlet } from "react-router-dom";
import { AppHeader } from "@/components/AppHeader";
import { AppSidebar, MobileNav } from "@/components/AppSidebar";
import { DemoOnboarding } from "@/components/DemoOnboarding";
import { DemoVersionBanner } from "@/components/DemoVersionBanner";
import { LicenseBanner } from "@/components/LicenseBanner";

export function AppLayout() {
  return (
    <div className="presentation-shell flex h-screen overflow-hidden bg-background">
      <AppSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <LicenseBanner />
        <DemoVersionBanner />
        <AppHeader />
        <main className="flex-1 overflow-y-auto pb-[calc(6.25rem+env(safe-area-inset-bottom,0px))] md:pb-0">
          <Outlet />
        </main>
      </div>
      <MobileNav />
      <DemoOnboarding />
    </div>
  );
}
