import { ReactNode } from "react";
import ChatNavbar from "@/components/ChatNavbar";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <ChatNavbar />

      {/* Page content */}
      <main className="flex-1 bg-gradient-soft">{children}</main>
    </div>
  );
}
