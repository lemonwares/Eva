import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";

// Auth configuration for React Server Components (JWT-only, no Prisma)
// This reads sessions created by the main auth.ts but doesn't write to database
export const { auth } = NextAuth({
  session: { strategy: "jwt", maxAge: 30 * 24 * 60 * 60 },
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize() {
        // Authentication is handled by the API route version with Prisma
        // This just validates the JWT token structure
        return null;
      },
    }),
  ],
  pages: {
    signIn: "/auth/signin",
  },
  callbacks: {
    async jwt({ token, user }) {
      // JWT token validation only - no database calls
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.role = user.role || "CLIENT";
        token.image = user.image || null;
      }
      return token;
    },
    async session({ session, token }: any) {
      // Transform JWT token to session object
      if (session.user && token) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        session.user.role = token.role as string;
        session.user.image = token.image as string | null;
      }
      return session;
    },
  },
  // Use the same secret as main auth.ts for JWT compatibility
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
});
