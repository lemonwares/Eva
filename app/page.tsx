// app/page.tsx

import { auth } from "@/lib/auth-rsc";

export default async function HomePage() {
  const session = await auth();

  if (!session) {
    return <p>Not signed in</p>;
  }

  return (
    <div>
      <p>Welcome, {session.user?.name}!</p>
      <p>ID: {session.user?.id}</p>
    </div>
  );
}
