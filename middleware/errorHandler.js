const errorHandler = (err, req, res, next) => {
  console.error("Error:", err);

  // Handle Prisma errors
  if (err.code === "P2002") {
    return res.status(409).json({
      error: "Conflict",
      message: "A record with this information already exists",
    });
  }

  if (err.code === "P2025") {
    return res.status(404).json({
      error: "Not Found",
      message: "The requested record was not found",
    });
  }

  // Handle database timeout errors
  if (err.code === "P1008") {
    return res.status(504).json({
      error: "Database Timeout",
      message: "The database operation timed out. Please try again later.",
    });
  }

  // Handle database connection errors
  if (err.code === "P1001") {
    return res.status(503).json({
      error: "Database Connection Error",
      message: "Unable to connect to the database. Please try again later.",
    });
  }

  // Handle other Prisma client errors
  if (err.code && err.code.startsWith("P")) {
    return res.status(500).json({
      error: "Database Error",
      message: "A database error occurred. Please try again later.",
    });
  }

  // Handle validation errors
  if (err.message && err.message.includes("Missing required fields")) {
    return res.status(400).json({
      error: "Validation Error",
      message: err.message,
    });
  }

  if (err.message && err.message.includes("must be in ISO format")) {
    return res.status(400).json({
      error: "Validation Error",
      message: err.message,
    });
  }

  if (err.message && err.message.includes("eventType must be either")) {
    return res.status(400).json({
      error: "Validation Error",
      message: err.message,
    });
  }

  if (err.message && err.message.includes("must be a valid integer")) {
    return res.status(400).json({
      error: "Validation Error",
      message: err.message,
    });
  }

  if (err.message && err.message.includes("must be an array")) {
    return res.status(400).json({
      error: "Validation Error",
      message: err.message,
    });
  }

  // Handle specific business logic errors
  if (err.message === "Driver not found") {
    return res.status(404).json({
      error: "Not Found",
      message: err.message,
    });
  }

  if (err.message && err.message.includes("Failed to save timeline")) {
    return res.status(500).json({
      error: "Database Error",
      message: "Failed to save timeline data",
    });
  }

  if (err.message && err.message.includes("Failed to get timeline")) {
    return res.status(500).json({
      error: "Database Error",
      message: "Failed to retrieve timeline data",
    });
  }

  // Handle JSON parsing errors
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({
      error: "Invalid JSON",
      message: "The request body contains invalid JSON",
    });
  }

  // Default error response for unhandled errors
  res.status(500).json({
    error: "Internal Server Error",
    message: "An unexpected error occurred",
  });
};

module.exports = errorHandler;
