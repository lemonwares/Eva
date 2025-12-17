import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { emailTemplates } from "@/templates/templateLoader";
import { sendEmail } from "@/lib/mail";

export const { handlers, signIn, signOut, auth } = NextAuth({
  // Explicit secret so JWT validation works across API routes
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
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

      async authorize(credentials) {
        const parsedCredentials = z
          .object({
            email: z.string().email(),
            password: z.string().min(6),
          })
          .safeParse(credentials);

        if (!parsedCredentials.success) {
          return null;
        }

        const { email, password } = parsedCredentials.data;

        const user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user || !user.password) {
          // NextAuth expects an Error to show a custom message
          throw new Error("Invalid email or password");
        }

        // Block login if email is not verified
        if (!user.emailVerifiedAt) {
          throw new Error(
            "Your email address is not verified. Please check your inbox for a verification link before logging in."
          );
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
          return null;
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.avatar || null,
          role: user.role,
        };
      },
    }),
  ],
  pages: {
    signIn: "/auth/signin",
  },
  callbacks: {
    async signIn({ user, account, profile }: any) {
      // Handle social login user creation/lookup
      if (account?.provider === "google") {
        try {
          // Check if user exists in database
          let dbUser = await prisma.user.findUnique({
            where: { email: user.email! },
          });

          let isNewUser = false;
          // If user doesn't exist, create them
          if (!dbUser) {
            dbUser = await prisma.user.create({
              data: {
                email: user.email!,
                name: user.name || "Google User",
                avatar: user.image,
                role: "CLIENT",
                emailVerifiedAt: new Date(), // Google emails are verified
                password: "", // Social users don't need password
              },
            });

            // Create Account record for social login
            await prisma.account.create({
              data: {
                userId: dbUser.id,
                type: account.type,
                provider: account.provider,
                providerAccountId: account.providerAccountId,
                access_token: account.access_token,
                expires_at: account.expires_at,
                token_type: account.token_type,
                scope: account.scope,
                id_token: account.id_token,
              },
            });
            isNewUser = true;
          }

          // Send welcome email if new user
          if (isNewUser) {
            try {
              const dashboardUrl = `${
                process.env.AUTH_URL || "http://localhost:3000"
              }/dashboard`;
              const helpUrl = `${
                process.env.AUTH_URL || "http://localhost:3000"
              }/help`;
              const htmlContent = emailTemplates.welcome(
                dbUser.name,
                dashboardUrl,
                helpUrl
              );
              await sendEmail({
                to: dbUser.email,
                subject: "Welcome to Eva Marketplace! 🎉",
                html: htmlContent,
              });
            } catch (emailErr) {
              console.error(
                "Failed to send welcome email after Google sign in:",
                emailErr
              );
            }
          }

          // Update user info in token for later use
          user.id = dbUser.id;
          user.role = dbUser.role;

          return true;
        } catch (error) {
          console.error("Error during social sign in:", error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user }: any) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }: any) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
    async redirect({ url, baseUrl }: { url: string; baseUrl: string }) {
      // Handle role-based redirects after OAuth sign in
      // If the callback URL is the base URL or root, redirect to appropriate dashboard
      if (url === baseUrl || url === baseUrl + "/" || url === "/") {
        // We can't access session here directly, so return a special URL
        // that the client will handle
        return `${baseUrl}/api/auth/redirect`;
      }
      // Default: allow relative URLs and same-origin URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },
});
