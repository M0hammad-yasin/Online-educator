# API Client & Services Documentation

This directory contains a modular, reusable API client and base service classes built with Axios. The architecture is designed to be easily extensible and ready for integration with React Query.

## Architecture Overview

```
api/
├── apiClient.ts          # Core Axios-based API client with interceptors
├── baseApiService.ts     # Abstract base service class with CRUD operations
├── userService.ts        # Example user service implementation
├── classService.ts       # Example class service implementation
├── index.ts             # Main exports
└── README.md            # This documentation
```

## Features

- **Modular Design**: Each service extends a base class for consistency
- **Type Safety**: Full TypeScript support with generic types
- **Error Handling**: Centralized error handling with custom error classes
- **Authentication**: Automatic token management with interceptors
- **Data Transformation**: Built-in request/response transformers
- **Query Parameters**: Flexible query parameter handling
- **File Uploads**: Support for multipart form data
- **React Query Ready**: Designed to work seamlessly with React Query

## Quick Start

### Basic Usage

```typescript
import { apiClient, userService, classService } from '@/services/api';

// Direct API client usage
const response = await apiClient.get('/users');
console.log(response.data);

// Service-based usage
const users = await userService.getAll();
const classes = await classService.getActiveClasses();
```

### Setting Authentication Token

```typescript
import { apiClient } from '@/services/api';

// Set token after login
apiClient.setToken('your-jwt-token');

// Remove token on logout
apiClient.removeToken();
```

## API Client

The `ApiClient` class provides a wrapper around Axios with additional features:

### Configuration

```typescript
import { ApiClient } from '@/services/api';

const customClient = new ApiClient({
  baseURL: 'https://api.example.com',
  timeout: 15000,
  headers: {
    'X-Custom-Header': 'value'
  },
  withCredentials: true
});
```

### Methods

- `get<T>(url, config?)` - GET request
- `post<T>(url, data?, config?)` - POST request
- `put<T>(url, data?, config?)` - PUT request
- `patch<T>(url, data?, config?)` - PATCH request
- `delete<T>(url, config?)` - DELETE request

### Error Handling

```typescript
import { ApiError } from '@/services/api';

try {
  const response = await apiClient.get('/users');
} catch (error) {
  if (error instanceof ApiError) {
    console.log('Status:', error.status);
    console.log('Message:', error.message);
    console.log('Is Network Error:', error.isNetworkError);
  }
}
```

## Base API Service

The `BaseApiService` class provides common CRUD operations that can be extended:

### Creating a Service

```typescript
import { BaseApiService, BaseEntity, ServiceConfig } from '@/services/api';

interface Product extends BaseEntity {
  name: string;
  price: number;
  category: string;
}

class ProductService extends BaseApiService<Product> {
  constructor() {
    super({
      endpoint: '/products',
      transformResponse: (data) => ({
        ...data,
        formattedPrice: `$${data.price.toFixed(2)}`
      }),
      transformRequest: (data) => ({
        ...data,
        // Remove computed properties
        formattedPrice: undefined
      })
    });
  }

  // Custom methods
  async getByCategory(category: string) {
    return this.get(`/category/${category}`);
  }
}
```

### Available Methods

- `getAll(params?)` - Get all items with pagination
- `getById(id)` - Get item by ID
- `create(data)` - Create new item
- `update(id, data)` - Update item
- `patch(id, data)` - Partial update
- `delete(id)` - Delete item
- `get(path, params?)` - Custom GET request
- `post(path, data?)` - Custom POST request
- `put(path, data?)` - Custom PUT request
- `deleteCustom(path)` - Custom DELETE request

## Query Parameters

The `QueryParams` interface supports common query parameters:

```typescript
interface QueryParams {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
  search?: string;
  [key: string]: any; // Custom parameters
}

// Usage
const users = await userService.getAll({
  page: 1,
  limit: 10,
  sort: 'firstName',
  order: 'asc',
  role: 'student'
});
```

## Data Transformation

Services can define custom transformers for request and response data:

```typescript
class UserService extends BaseApiService<User> {
  constructor() {
    super({
      endpoint: '/users',
      transformResponse: (data) => ({
        ...data,
        fullName: `${data.firstName} ${data.lastName}`,
        age: this.calculateAge(data.birthDate)
      }),
      transformRequest: (data) => {
        const { fullName, age, ...requestData } = data;
        return requestData;
      }
    });
  }
}
```

## File Uploads

For file uploads, use the underlying Axios instance:

```typescript
async uploadProfileImage(userId: string, file: File) {
  const formData = new FormData();
  formData.append('image', file);
  
  const response = await apiClient.getAxiosInstance().post(
    `/users/${userId}/profile-image`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
  
  return response.data;
}
```

## React Query Integration

The services are designed to work seamlessly with React Query:

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userService } from '@/services/api';

// Query hook
export const useUsers = (params?: UserQueryParams) => {
  return useQuery({
    queryKey: ['users', params],
    queryFn: () => userService.getAll(params),
  });
};

// Mutation hook
export const useCreateUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateData<User>) => userService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};

// Usage in component
function UserList() {
  const { data: users, isLoading, error } = useUsers({ role: 'student' });
  const createUser = useCreateUser();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {users?.data.map(user => (
        <div key={user.id}>{user.fullName}</div>
      ))}
    </div>
  );
}
```

## Error Handling

The API client provides comprehensive error handling:

```typescript
import { ApiError } from '@/services/api';

// In your service
async createUser(data: CreateData<User>) {
  try {
    return await super.create(data);
  } catch (error) {
    if (error instanceof ApiError) {
      switch (error.status) {
        case 401:
          // Handle unauthorized
          break;
        case 422:
          // Handle validation errors
          break;
        default:
          // Handle other errors
          break;
      }
    }
    throw error;
  }
}
```

## Environment Configuration

Set up your API base URL in your environment variables:

```env
# .env
VITE_API_BASE_URL=http://localhost:5000/api
```

## Best Practices

1. **Service Organization**: Create separate service files for each domain
2. **Type Safety**: Always define interfaces for your entities
3. **Error Handling**: Use try-catch blocks and handle specific error types
4. **Data Transformation**: Use transformers to keep business logic in services
5. **Query Parameters**: Use typed query parameter interfaces
6. **React Query**: Use the services with React Query for caching and state management

## Example Services

### User Service
- User CRUD operations
- Profile management
- Role-based queries
- Password changes
- Profile image uploads

### Class Service
- Class CRUD operations
- Student enrollment
- Schedule management
- Status management
- Material uploads
- Search and filtering

## Migration from Legacy Services

If you have existing services, you can gradually migrate:

1. Create new services extending `BaseApiService`
2. Update components to use new services
3. Remove old service files
4. Update imports

```typescript
// Old way
import { getUser, createUser } from './user.service';

// New way
import { userService } from '@/services/api';
const user = await userService.getById(id);
const newUser = await userService.create(userData);
```

This modular API client provides a solid foundation for your application's data layer and is ready for React Query integration. 