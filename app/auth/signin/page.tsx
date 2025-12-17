"use client";

import { redirect } from "next/navigation";

export default async function SignInPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  // Await the promise if needed (Next.js dynamic API)
  const params =
    typeof searchParams.then === "function" ? await searchParams : searchParams;
  const callbackUrl: any = params?.callbackUrl;
  if (callbackUrl) {
    redirect(`/auth?callbackUrl=${encodeURIComponent(callbackUrl)}`);
  }
  redirect("/auth");
}
