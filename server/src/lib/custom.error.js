export class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = "ValidationError";
    this.statusCode = 400;
  }
}

export class AuthenticationError extends Error {
  constructor(message = "unautenticated") {
    super(message);
    this.name = "AuthenticationError";
    this.statusCode = 401;
  }
}

export class AuthorizationError extends Error {
  constructor(message = "Forbidden") {
    super(message);
    this.name = "AuthorizationError";
    this.statusCode = 403;
  }
}

export class ConflictError extends Error {
  // throw new ConflictError("Email already exists", {
  //   conflictingField: "email",
  //   suggestedAlternatives: generateEmailSuggestions(userData.email)
  // });
  //
  // details = {}
  constructor(message, details = {}) {
    super(message);
    this.name = "ConflictError";
    this.details = details;
    this.statusCode = 409;
  }
}

export class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = "NotFoundError";
    this.statusCode = 404;
  }
}

export class ServerError extends Error {
  constructor(message) {
    super(message);
    this.name = "ServerError";
    this.statusCode = 500;
  }
}

export class BadRequestError extends Error {
  constructor(message) {
    super(message);
    this.name = "BadRequestError";
    this.statusCode = 400;
  }
}
