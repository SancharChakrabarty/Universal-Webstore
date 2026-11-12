"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import Sidebar from "./Sidebar";
import AdminSignOutButton from "./AdminSignOutButton";
import ToastHost from "./ToastHost";

export default function AdminShell({
  adminName,
  children,
}: {
  adminName: string;
  children: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#f7f8fa]">
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

      <div className="flex-1">
        <header className="flex items-center justify-between border-b border-line bg-[#f7f8fa] px-5 py-4">
          <button
            onClick={() => setMobileOpen(true)}
            className="text-ink-soft lg:hidden"
            aria-label="Open menu"
          >
            <Menu size={22} />
          </button>
          <span className="hidden text-sm text-ink-soft lg:block">
            Signed in as <strong className="text-ink">{adminName}</strong>
          </span>
          <AdminSignOutButton />
        </header>

        <main className="p-5 lg:p-8">{children}</main>
      </div>

      <ToastHost />
    </div>
  );
}
