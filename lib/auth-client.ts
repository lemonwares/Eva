/**
 * Client-side authentication utilities
 */

import { signIn, signOut } from "next-auth/react";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: "CLIENT" | "PROFESSIONAL";
}

export interface AuthResponse {
  success: boolean;
  message: string;
  error?: string;
  userId?: string;
  token?: string;
}

/**
 * Login with credentials using NextAuth
 */
export async function login(
  credentials: LoginCredentials,
  callbackUrl?: string
): Promise<AuthResponse> {
  try {
    const result = await signIn("credentials", {
      email: credentials.email,
      password: credentials.password,
      redirect: false,
      callbackUrl: callbackUrl || "/",
    });

    if (result?.error) {
      return {
        success: false,
        message: "Invalid email or password",
        error: result.error,
      };
    }

    return {
      success: true,
      message: "Login successful",
    };
  } catch (error) {
    console.error("Login error:", error);
    return {
      success: false,
      message: "An unexpected error occurred",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Login with Google OAuth
 */
export async function loginWithGoogle(callbackUrl?: string): Promise<void> {
  await signIn("google", {
    callbackUrl: callbackUrl || "/",
  });
}

/**
 * Register a new user
 */
export async function register(data: RegisterData): Promise<AuthResponse> {
  try {
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: result.message || "Registration failed",
        error: result.message,
      };
    }

    return {
      success: true,
      message: result.message,
      userId: result.userId,
      token: result.token,
    };
  } catch (error) {
    console.error("Registration error:", error);
    return {
      success: false,
      message: "An unexpected error occurred",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Request password reset
 */
export async function forgotPassword(email: string): Promise<AuthResponse> {
  try {
    const response = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: result.message || "Failed to send reset email",
        error: result.message,
      };
    }

    return {
      success: true,
      message: result.message,
      token: result.token, // Only returned in dev mode
    };
  } catch (error) {
    console.error("Forgot password error:", error);
    return {
      success: false,
      message: "An unexpected error occurred",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Reset password with token
 */
export async function resetPassword(
  token: string,
  newPassword: string
): Promise<AuthResponse> {
  try {
    const response = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token, newPassword }),
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: result.message || "Failed to reset password",
        error: result.message,
      };
    }

    return {
      success: true,
      message: result.message,
    };
  } catch (error) {
    console.error("Reset password error:", error);
    return {
      success: false,
      message: "An unexpected error occurred",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Verify email with token
 * Uses GET request with query params to match email link format
 */
export async function verifyEmail(token: string): Promise<AuthResponse> {
  try {
    // Use GET with query params since email links pass token in URL
    const response = await fetch(
      `/api/auth/verify-email?token=${encodeURIComponent(token)}`,
      {
        method: "GET",
      }
    );

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: result.message || "Failed to verify email",
        error: result.message,
      };
    }

    return {
      success: true,
      message: result.message,
    };
  } catch (error) {
    console.error("Verify email error:", error);
    return {
      success: false,
      message: "An unexpected error occurred",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Resend verification email
 */
export async function resendVerification(email: string): Promise<AuthResponse> {
  try {
    const response = await fetch("/api/auth/resend-verification", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: result.message || "Failed to resend verification",
        error: result.message,
      };
    }

    return {
      success: true,
      message: result.message,
      token: result.token,
    };
  } catch (error) {
    console.error("Resend verification error:", error);
    return {
      success: false,
      message: "An unexpected error occurred",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Logout
 */
export async function logout(callbackUrl?: string): Promise<void> {
  await signOut({ callbackUrl: callbackUrl || "/auth" });
}

/**
 * Get current user
 */
export async function getCurrentUser() {
  try {
    const response = await fetch("/api/auth/me");

    if (!response.ok) {
      return null;
    }

    const result = await response.json();
    return result.user;
  } catch (error) {
    console.error("Get current user error:", error);
    return null;
  }
}

/**
 * Update profile
 */
export async function updateProfile(data: {
  name?: string;
  phone?: string;
  avatar?: string | null;
  currentPassword?: string;
  newPassword?: string;
}): Promise<AuthResponse> {
  try {
    const response = await fetch("/api/auth/me", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: result.message || "Failed to update profile",
        error: result.message,
      };
    }

    return {
      success: true,
      message: result.message,
    };
  } catch (error) {
    console.error("Update profile error:", error);
    return {
      success: false,
      message: "An unexpected error occurred",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
