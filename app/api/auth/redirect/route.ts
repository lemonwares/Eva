import { auth } from "@/auth";
import { redirect } from "next/navigation";

export async function GET() {
  const session = await auth();

  if (!session?.user) {
    // Not authenticated, redirect to login
    redirect("/auth");
  }

  const role = session.user.role;

  // Redirect based on user role
  switch (role) {
    case "ADMINISTRATOR":
      redirect("/admin");
    case "PROFESSIONAL":
      redirect("/vendor");
    case "CLIENT":
    case "VISITOR":
    default:
      redirect("/dashboard");
  }
}
