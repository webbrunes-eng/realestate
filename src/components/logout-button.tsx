"use client";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export function LogoutButton({ label }: { label?: string }) {
  const router = useRouter();
  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }
  return (
    <button
      onClick={logout}
      className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-red-50 dark:hover:bg-red-950/30 hover:text-red-600 transition-colors"
    >
      <LogOut className="h-4 w-4" />
      {label ?? "Logout"}
    </button>
  );
}
