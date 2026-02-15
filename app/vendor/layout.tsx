import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { VendorThemeProvider } from "@/components/vendor/VendorThemeContext";

export default async function VendorLayout({
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

  // Server-side guard: only authenticated vendors can access /vendor routes
  if (!session?.user || session.user.role !== "PROFESSIONAL") {
    redirect("/auth?callbackUrl=/vendor");
  }

  return <VendorThemeProvider>{children}</VendorThemeProvider>;
}
