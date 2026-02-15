import { auth } from "@/auth";
import { redirect } from "next/navigation";
import DashboardShell from "./DashboardShell";

// Re-export the hook for convenience (used by dashboard sub-pages)
export { useDashboardTheme } from "@/components/dashboard/DashboardThemeContext";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let session = null;
  try {
    session = await auth();
  } catch {
    // Stale/invalid JWT cookie — redirect to auth
  }

  // Server-side guard: unauthenticated users are redirected before any client JS runs
  if (!session?.user) {
    redirect("/auth?callbackUrl=/dashboard");
  }

  return <DashboardShell>{children}</DashboardShell>;
}
