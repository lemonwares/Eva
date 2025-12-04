import { NextResponse } from "next/server";
import { ZodError } from "zod";

// Standard API response types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  errors?: Record<string, string>;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}

// Success responses
export function successResponse<T>(
  data: T,
  message?: string,
  status: number = 200
): NextResponse<ApiResponse<T>> {
  return NextResponse.json(
    {
      success: true,
      data,
      message,
    },
    { status }
  );
}

export function createdResponse<T>(
  data: T,
  message: string = "Resource created successfully"
): NextResponse<ApiResponse<T>> {
  return successResponse(data, message, 201);
}

export function paginatedResponse<T>(
  data: T[],
  meta: {
    page: number;
    limit: number;
    total: number;
  },
  message?: string
): NextResponse<ApiResponse<T[]>> {
  return NextResponse.json(
    {
      success: true,
      data,
      meta: {
        ...meta,
        totalPages: Math.ceil(meta.total / meta.limit),
      },
      message,
    },
    { status: 200 }
  );
}

export function noContentResponse(): NextResponse {
  return new NextResponse(null, { status: 204 });
}

// Error responses
export function errorResponse(
  message: string,
  status: number = 400,
  errors?: Record<string, string>
): NextResponse<ApiResponse> {
  return NextResponse.json(
    {
      success: false,
      error: message,
      errors,
    },
    { status }
  );
}

export function badRequestResponse(
  message: string = "Bad request",
  errors?: Record<string, string>
): NextResponse<ApiResponse> {
  return errorResponse(message, 400, errors);
}

export function unauthorizedResponse(
  message: string = "Unauthorized"
): NextResponse<ApiResponse> {
  return errorResponse(message, 401);
}

export function forbiddenResponse(
  message: string = "Forbidden"
): NextResponse<ApiResponse> {
  return errorResponse(message, 403);
}

export function notFoundResponse(
  message: string = "Resource not found"
): NextResponse<ApiResponse> {
  return errorResponse(message, 404);
}

export function conflictResponse(
  message: string = "Resource already exists"
): NextResponse<ApiResponse> {
  return errorResponse(message, 409);
}

export function validationErrorResponse(
  errors: ZodError | Record<string, string>
): NextResponse<ApiResponse> {
  let formattedErrors: Record<string, string>;

  if (errors instanceof ZodError) {
    formattedErrors = {};
    for (const error of errors.issues) {
      const path = error.path.join(".");
      if (!formattedErrors[path]) {
        formattedErrors[path] = error.message;
      }
    }
  } else {
    formattedErrors = errors;
  }

  return NextResponse.json(
    {
      success: false,
      error: "Validation failed",
      errors: formattedErrors,
    },
    { status: 422 }
  );
}

export function serverErrorResponse(
  message: string = "Internal server error"
): NextResponse<ApiResponse> {
  return errorResponse(message, 500);
}

export function serviceUnavailableResponse(
  message: string = "Service temporarily unavailable"
): NextResponse<ApiResponse> {
  return errorResponse(message, 503);
}

export function rateLimitResponse(
  retryAfter: number = 60
): NextResponse<ApiResponse> {
  return NextResponse.json(
    {
      success: false,
      error: "Too many requests",
      message: `Please try again in ${retryAfter} seconds`,
    },
    {
      status: 429,
      headers: {
        "Retry-After": String(retryAfter),
      },
    }
  );
}

// Helper to handle async route handlers with error catching
export function withErrorHandler<T>(
  handler: () => Promise<NextResponse<ApiResponse<T>>>
): Promise<NextResponse<ApiResponse<T>>> {
  return handler().catch((error) => {
    console.error("API Error:", error);

    if (error instanceof ZodError) {
      return validationErrorResponse(error) as NextResponse<ApiResponse<T>>;
    }

    // Prisma errors
    if (error.code === "P2002") {
      return conflictResponse(
        "A record with this value already exists"
      ) as NextResponse<ApiResponse<T>>;
    }

    if (error.code === "P2025") {
      return notFoundResponse("Record not found") as NextResponse<
        ApiResponse<T>
      >;
    }

    return serverErrorResponse(
      process.env.NODE_ENV === "development"
        ? error.message
        : "Internal server error"
    ) as NextResponse<ApiResponse<T>>;
  });
}

// Wrapper for API routes with authentication check
export async function withAuth<T>(
  userId: string | undefined,
  handler: () => Promise<NextResponse<ApiResponse<T>>>
): Promise<NextResponse<ApiResponse<T>>> {
  if (!userId) {
    return unauthorizedResponse() as NextResponse<ApiResponse<T>>;
  }
  return withErrorHandler(handler);
}

// Wrapper for admin-only routes
export async function withAdminAuth<T>(
  role: string | undefined,
  handler: () => Promise<NextResponse<ApiResponse<T>>>
): Promise<NextResponse<ApiResponse<T>>> {
  if (role !== "ADMIN") {
    return forbiddenResponse("Admin access required") as NextResponse<
      ApiResponse<T>
    >;
  }
  return withErrorHandler(handler);
}

// Parse request body safely
export async function parseBody<T>(request: Request): Promise<T | null> {
  try {
    return await request.json();
  } catch {
    return null;
  }
}

// Get pagination params from URL
export function getPaginationParams(searchParams: URLSearchParams) {
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
  const limit = Math.min(
    100,
    Math.max(1, parseInt(searchParams.get("limit") || "20", 10))
  );
  const skip = (page - 1) * limit;

  return { page, limit, skip };
}

// Build Prisma orderBy from URL params
export function getOrderByParams(
  searchParams: URLSearchParams,
  allowedFields: string[],
  defaultField: string = "createdAt"
) {
  const sortBy = searchParams.get("sortBy") || defaultField;
  const sortOrder = searchParams.get("sortOrder") === "asc" ? "asc" : "desc";

  if (!allowedFields.includes(sortBy)) {
    return { [defaultField]: sortOrder };
  }

  return { [sortBy]: sortOrder };
}
