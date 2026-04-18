import { auth } from "@/auth";
import { redirect } from "next/navigation";
import DashboardShell from "./DashboardShell";

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

  if (!session?.user) {
    redirect("/auth?callbackUrl=/dashboard");
  }

  const role = (session.user as any).role;
  if (role === "ADMINISTRATOR") redirect("/admin");
  if (role === "PROFESSIONAL") redirect("/vendor");

  return <DashboardShell>{children}</DashboardShell>;
}
