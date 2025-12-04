import { redirect } from "next/navigation";

export default function SignInPage() {
  // Redirect to the main auth page which has both login and signup
  redirect("/auth");
}
