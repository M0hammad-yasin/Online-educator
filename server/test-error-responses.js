// Test file to demonstrate the new error response structure
import { sendError,ValidationError, 
  AuthenticationError, 
  AuthorizationError, 
  ConflictError, 
  NotFoundError, 
  BadRequestError, 
  ServerError  } from './src/utils/index.js';
// Mock response object
const mockRes = {
  status: (code) => ({
    json: (data) => {
      console.log(`Status: ${code}`);
      console.log('Response:', JSON.stringify(data, null, 2));
      console.log('---');
    }
  })
};

// Test different error types
console.log('Testing Error Response Structure:\n');

// Test ValidationError
console.log('1. ValidationError:');
const validationError = new ValidationError("Email format is invalid");
validationError.details = [
  { field: "email", message: "Invalid email format" },
  { field: "password", message: "Password must be at least 8 characters" }
];
sendError(mockRes, validationError);

// Test AuthenticationError
console.log('2. AuthenticationError:');
const authError = new AuthenticationError("Invalid credentials");
sendError(mockRes, authError);

// Test AuthorizationError
console.log('3. AuthorizationError:');
const authzError = new AuthorizationError("Insufficient permissions");
sendError(mockRes, authzError);

// Test ConflictError
console.log('4. ConflictError:');
const conflictError = new ConflictError("Email already exists", {
  conflictingField: "email",
  suggestedAlternatives: ["user123@example.com", "user456@example.com"]
});
sendError(mockRes, conflictError);

// Test NotFoundError
console.log('5. NotFoundError:');
const notFoundError = new NotFoundError("User not found");
sendError(mockRes, notFoundError);

// Test BadRequestError
console.log('6. BadRequestError:');
const badRequestError = new BadRequestError("Invalid input parameters");
sendError(mockRes, badRequestError);

// Test ServerError
console.log('7. ServerError:');
const serverError = new ServerError("Database connection failed");
sendError(mockRes, serverError);

// Test generic Error
console.log('8. Generic Error:');
const genericError = new Error("Something went wrong");
sendError(mockRes, genericError); 