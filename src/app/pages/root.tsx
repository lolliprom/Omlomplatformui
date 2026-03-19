import { Outlet } from "react-router";

import { BottomNav } from "../components/bottom-nav";
import { Toaster } from "../components/ui/sonner";

export default function Root() {
  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f8fafc_0%,#eef4ff_40%,#f8fafc_100%)]">
      <div className="pointer-events-none fixed inset-x-0 top-0 h-72 bg-[radial-gradient(circle_at_top,#bfdbfe_0%,rgba(191,219,254,0.15)_35%,transparent_70%)]" />
      <main className="relative mx-auto max-w-lg pb-24">
        <Outlet />
      </main>
      <BottomNav />
      <Toaster richColors />
    </div>
  );
}
