import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { AdminThemeProvider } from "@/components/admin/AdminThemeContext";

export default async function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // Server-side guard ensures only administrators can render anything under /admin.
  if (!session?.user || session.user.role !== "ADMINISTRATOR") {
    // Preserve intent by sending non-admins or unauthenticated users to auth with a return path.
    redirect("/auth?callbackUrl=/admin");
  }

  return <AdminThemeProvider>{children}</AdminThemeProvider>;
}
