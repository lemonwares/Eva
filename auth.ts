import NextAuth, { CredentialsSignin } from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { emailTemplates, sendTemplatedEmail } from "@/lib/email";

// Custom error classes so NextAuth can relay specific codes to the client
class EmailNotVerifiedError extends CredentialsSignin {
  code = "EMAIL_NOT_VERIFIED";
}

class InvalidCredentialsError extends CredentialsSignin {
  code = "INVALID_CREDENTIALS";
}

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
          throw new InvalidCredentialsError();
        }

        // Block login if email is not verified
        if (!user.emailVerifiedAt) {
          throw new EmailNotVerifiedError();
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
          throw new InvalidCredentialsError();
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
              const template = emailTemplates.welcome(dbUser.name);
              await sendTemplatedEmail(dbUser.email, template);
            } catch (emailErr) {
              console.error(
                "Failed to send welcome email after Google sign in:",
                emailErr,
              );
            }
          }

          // Update user info in token for later use
          user.id = dbUser.id;
          user.role = dbUser.role;
          user.image = dbUser.avatar || user.image;

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
        token.image = user.image || null;
        console.log(`[AUTH] JWT Callback - Created token for ${user.email}, role: ${user.role}`);
      }
      return token;
    },
    async session({ session, token }: any) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.image = token.image as string | null;
        console.log(`[AUTH] Session Callback - Session for ${session.user.email}, role: ${session.user.role}`);
      }
      return session;
    },
    async redirect({ url, baseUrl }: { url: string; baseUrl: string }) {
      // debug logs for production issues
      console.log(`[AUTH] Redirect Callback - url: ${url}, baseUrl: ${baseUrl}`);

      // Handle relative URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      
      // Handle same-origin URLs
      try {
        const urlOrigin = new URL(url).origin;
        if (urlOrigin === baseUrl) return url;
      } catch (err) {
        // Fallback for invalid URLs
      }

      // Default to baseUrl (ensures we stay on our domain)
      return baseUrl;
    },
  },
});
