export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500
  ) {
    super(message);
    this.name = "AppError";
  }
}

export class ProviderError extends AppError {
  constructor(message: string) {
    super(message, "PROVIDER_ERROR", 502);
    this.name = "ProviderError";
  }
}

export class RateLimitError extends AppError {
  constructor(message: string = "Rate limit exceeded") {
    super(message, "RATE_LIMIT", 429);
    this.name = "RateLimitError";
  }
}

export class AIParseError extends AppError {
  constructor(message: string = "Failed to parse AI response") {
    super(message, "AI_PARSE_ERROR", 502);
    this.name = "AIParseError";
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = "Resource not found") {
    super(message, "NOT_FOUND", 404);
    this.name = "NotFoundError";
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = "Unauthorized") {
    super(message, "UNAUTHORIZED", 401);
    this.name = "UnauthorizedError";
  }
}

export function handleApiError(error: unknown): Response {
  if (error instanceof AppError) {
    return Response.json(
      { error: { message: error.message, code: error.code } },
      { status: error.statusCode }
    );
  }

  console.error("Unexpected error:", error);
  return Response.json(
    { error: { message: "Internal server error", code: "INTERNAL_ERROR" } },
    { status: 500 }
  );
}
