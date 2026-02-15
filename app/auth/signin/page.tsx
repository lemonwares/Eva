import { redirect } from "next/navigation";

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const callbackUrl = params?.callbackUrl;
  if (callbackUrl) {
    const cb = Array.isArray(callbackUrl) ? callbackUrl[0] : callbackUrl;
    redirect(`/auth?callbackUrl=${encodeURIComponent(cb || "/")}`);
  }
  redirect("/auth");
}
