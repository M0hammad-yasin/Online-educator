# Development Guide

## Table of Contents
1. [Getting Started](#getting-started)
2. [Project Structure](#project-structure)
3. [Development Workflow](#development-workflow)
4. [Adding New Features](#adding-new-features)
5. [Testing](#testing)
6. [Deployment](#deployment)
7. [Troubleshooting](#troubleshooting)

---

## Getting Started

### Prerequisites

- **Node.js**: v16.x or higher
- **npm**: v8.x or higher
- **Database**: MongoDB or PostgreSQL (configured with Prisma)
- **Git**: For version control

### Installation

1. **Clone the repository:**
```bash
git clone <repository-url>
cd online-educator
```

2. **Install dependencies:**
```bash
npm run install:all
```

This will install dependencies for:
- Root package
- Server (`/server`)
- Client (`/client`)

3. **Configure environment variables:**

**Server** (`server/.env`):
```env
# Database
DATABASE_URL="your_database_connection_string"

# JWT
JWT_SECRET="your_jwt_secret_key"
JWT_SECRET_EXPIRY="604800000" # 7 days in milliseconds

# Server
PORT=3000
NODE_ENV="development"

# Client URL (for CORS)
CLIENT_URL="http://localhost:5173"
```

**Client** (`client/.env`):
```env
# API URL
VITE_API_URL="http://localhost:3000/api"
```

4. **Set up the database:**

```bash
cd server
npx prisma generate
npx prisma db push
# Optional: Seed the database
node src/Prisma/seed.js
```

5. **Start development servers:**

From the root directory:
```bash
npm run dev
```

This starts both:
- **Server**: http://localhost:3000
- **Client**: http://localhost:5173

---

## Project Structure

```
online-educator/
├── client/                      # React frontend
│   ├── public/                  # Static assets
│   ├── src/
│   │   ├── assets/              # Images, icons
│   │   ├── components/          # Reusable components
│   │   │   └── layout/          # Layout components (Header, Sidebar)
│   │   ├── constants/           # Constants (roles, menus, status)
│   │   ├── hooks/               # Custom React hooks
│   │   ├── module/              # Feature modules
│   │   │   ├── authentication/  # Auth module
│   │   │   ├── student/         # Student module
│   │   │   ├── teacher/         # Teacher module
│   │   │   ├── classes/         # Class module
│   │   │   ├── admin/           # Admin module
│   │   │   └── moderator/       # Moderator module
│   │   ├── pages/               # Page components
│   │   ├── routes/              # Route configurations
│   │   ├── services/            # API service layer
│   │   │   └── api/             # Base API service
│   │   ├── store/               # Zustand stores
│   │   ├── style/               # Global styles
│   │   ├── theme/               # Theme configuration
│   │   ├── App.tsx              # Root component
│   │   └── main.tsx             # Entry point
│   ├── index.html
│   ├── package.json
│   ├── vite.config.ts           # Vite configuration
│   └── tsconfig.json            # TypeScript configuration
│
├── server/                      # Node.js backend
│   ├── src/
│   │   ├── config/              # Configuration files
│   │   ├── controllers/         # Route controllers
│   │   │   ├── adminController/
│   │   │   ├── StudentController/
│   │   │   ├── TeacherController/
│   │   │   └── classController/
│   │   ├── middleware/          # Express middleware
│   │   │   ├── auth.js          # Authentication
│   │   │   ├── roleCheck.js     # Authorization
│   │   │   ├── validate.middleware.js
│   │   │   └── error.middleware.js
│   │   ├── Prisma/              # Database
│   │   │   ├── prisma.client.js
│   │   │   ├── seed.js
│   │   │   └── tuition.prisma   # Prisma schema
│   │   ├── routes/              # API routes
│   │   │   ├── admin.route.js
│   │   │   ├── student.route.js
│   │   │   ├── teacher.route.js
│   │   │   └── class.route.js
│   │   ├── Services/            # Business logic
│   │   ├── utils/               # Utility functions
│   │   │   ├── api.response.js
│   │   │   ├── asyncWrapper.js
│   │   │   ├── bcrypt.js
│   │   │   ├── custom.error.js
│   │   │   ├── jwt.user.js
│   │   │   └── pagination.js
│   │   ├── validation/          # Zod schemas
│   │   ├── app.js               # Express app setup
│   │   └── route.js             # Route configuration
│   ├── index.js                 # Server entry point
│   └── package.json
│
├── documentations/              # Documentation files
│   ├── API_DOCUMENTATION.md
│   ├── COMPONENTS_GUIDE.md
│   ├── HOOKS_AND_UTILITIES.md
│   ├── DEVELOPMENT_GUIDE.md
│   ├── api_docs.md
│   ├── api_structure.pdf
│   └── folder_structure.md
│
├── package.json                 # Root package.json
└── README.md
```

---

## Development Workflow

### Branch Strategy

```
main/master          # Production-ready code
├── develop          # Integration branch
    ├── feature/*    # New features
    ├── bugfix/*     # Bug fixes
    ├── hotfix/*     # Urgent production fixes
    └── refactor/*   # Code refactoring
```

### Git Workflow

1. **Create a feature branch:**
```bash
git checkout develop
git pull origin develop
git checkout -b feature/new-feature-name
```

2. **Make changes and commit:**
```bash
git add .
git commit -m "feat: add new feature description"
```

**Commit Message Convention:**
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting)
- `refactor:` Code refactoring
- `test:` Adding or updating tests
- `chore:` Build process or auxiliary tool changes

3. **Push and create pull request:**
```bash
git push origin feature/new-feature-name
```

Then create a pull request on GitHub/GitLab.

---

## Adding New Features

### Adding a New API Endpoint

#### 1. Define Validation Schema

**File**: `server/src/validation/yourModel.validate.js`

```javascript
import { z } from 'zod';

export const yourModelSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  // ... other fields
});

export const yourModelUpdateSchema = yourModelSchema.partial();
```

#### 2. Create Controller

**File**: `server/src/controllers/yourModelController/yourModel.controller.js`

```javascript
import { asyncWrapper, sendSuccess, BadRequestError, NotFoundError } from '../../utils/index.js';
import prisma from '../../Prisma/prisma.client.js';

// Get all
export const getAllYourModels = asyncWrapper(async (req, res) => {
  const { skip, take, page, limit } = getPaginationParams(req.query);
  
  const [data, total] = await Promise.all([
    prisma.yourModel.findMany({ skip, take }),
    prisma.yourModel.count()
  ]);
  
  const pagination = formatPaginationResponse(total, page, limit);
  
  sendSuccess(res, {
    message: 'Data fetched successfully',
    data,
    pagination
  });
});

// Get by ID
export const getYourModelById = asyncWrapper(async (req, res) => {
  const { id } = req.params;
  
  const data = await prisma.yourModel.findUnique({ where: { id } });
  
  if (!data) {
    throw new NotFoundError('Resource not found');
  }
  
  sendSuccess(res, { data });
});

// Create
export const createYourModel = asyncWrapper(async (req, res) => {
  const data = await prisma.yourModel.create({
    data: req.body
  });
  
  sendSuccess(res, {
    statusCode: 201,
    message: 'Created successfully',
    data
  });
});

// Update
export const updateYourModel = asyncWrapper(async (req, res) => {
  const { id } = req.params;
  
  const data = await prisma.yourModel.update({
    where: { id },
    data: req.body
  });
  
  sendSuccess(res, {
    message: 'Updated successfully',
    data
  });
});

// Delete
export const deleteYourModel = asyncWrapper(async (req, res) => {
  const { id } = req.params;
  
  await prisma.yourModel.delete({ where: { id } });
  
  sendSuccess(res, {
    message: 'Deleted successfully',
    data: null
  });
});
```

#### 3. Create Routes

**File**: `server/src/routes/yourModel.route.js`

```javascript
import express from 'express';
import { 
  getAllYourModels,
  getYourModelById,
  createYourModel,
  updateYourModel,
  deleteYourModel
} from '../controllers/yourModelController/yourModel.controller.js';
import { validate } from '../middleware/validate.middleware.js';
import { yourModelSchema, yourModelUpdateSchema } from '../validation/yourModel.validate.js';
import auth from '../middleware/auth.js';
import { hasRole } from '../middleware/roleCheck.js';
import { Role } from '../constant.js';

const router = express.Router();

router.get(
  '/',
  auth,
  hasRole([Role.ADMIN, Role.MODERATOR]),
  getAllYourModels
);

router.get(
  '/:id',
  auth,
  hasRole([Role.ADMIN, Role.MODERATOR]),
  getYourModelById
);

router.post(
  '/',
  validate(yourModelSchema, (req) => req.body),
  auth,
  hasRole([Role.ADMIN]),
  createYourModel
);

router.put(
  '/:id',
  validate(yourModelUpdateSchema, (req) => req.body),
  auth,
  hasRole([Role.ADMIN]),
  updateYourModel
);

router.delete(
  '/:id',
  auth,
  hasRole([Role.ADMIN]),
  deleteYourModel
);

export default router;
```

#### 4. Register Routes

**File**: `server/src/route.js`

```javascript
import yourModelRoutes from './routes/yourModel.route.js';

export default function (app) {
  // ... existing routes
  app.use('/api/your-model', yourModelRoutes);
}
```

---

### Adding a Client-Side Feature

#### 1. Define Types

**File**: `client/src/module/yourModule/types/yourModel.types.ts`

```typescript
export interface YourModel {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateYourModelRequest {
  name: string;
  email: string;
}

export interface UpdateYourModelRequest {
  name?: string;
  email?: string;
}

export interface YourModelFilters {
  page?: number;
  limit?: number;
  search?: string;
  orderBy?: string;
  order?: 'asc' | 'desc';
}
```

#### 2. Create Service

**File**: `client/src/module/yourModule/services/yourModel.service.ts`

```typescript
import { BaseService } from '@/services/api/base.service';
import { ApiResponse, PaginatedResponse } from '@/services/api/types';
import {
  YourModel,
  CreateYourModelRequest,
  UpdateYourModelRequest,
  YourModelFilters
} from '../types/yourModel.types';

class YourModelService extends BaseService<YourModel> {
  constructor() {
    super('/your-model');
  }

  async getAllYourModels(filters: YourModelFilters = {}): Promise<PaginatedResponse<YourModel>> {
    return this.getAll(filters);
  }

  async getYourModelById(id: string): Promise<ApiResponse<YourModel>> {
    return this.getById(id);
  }

  async createYourModel(data: CreateYourModelRequest): Promise<ApiResponse<YourModel>> {
    return this.create(data);
  }

  async updateYourModel(id: string, data: UpdateYourModelRequest): Promise<ApiResponse<YourModel>> {
    return this.update(id, data);
  }

  async deleteYourModel(id: string): Promise<ApiResponse<void>> {
    return this.delete(id);
  }
}

export const yourModelService = new YourModelService();
export default yourModelService;
```

#### 3. Create React Query Hooks

**File**: `client/src/module/yourModule/hooks/useYourModels.ts`

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import yourModelService from '../services/yourModel.service';
import { YourModelFilters, CreateYourModelRequest, UpdateYourModelRequest } from '../types/yourModel.types';

export function useYourModels(filters?: YourModelFilters) {
  return useQuery({
    queryKey: ['yourModels', filters],
    queryFn: () => yourModelService.getAllYourModels(filters)
  });
}

export function useYourModel(id: string) {
  return useQuery({
    queryKey: ['yourModel', id],
    queryFn: () => yourModelService.getYourModelById(id),
    enabled: !!id
  });
}

export function useCreateYourModel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateYourModelRequest) => yourModelService.createYourModel(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['yourModels'] });
    }
  });
}

export function useUpdateYourModel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateYourModelRequest }) =>
      yourModelService.updateYourModel(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['yourModel', id] });
      queryClient.invalidateQueries({ queryKey: ['yourModels'] });
    }
  });
}

export function useDeleteYourModel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => yourModelService.deleteYourModel(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['yourModels'] });
    }
  });
}
```

#### 4. Create Page Component

**File**: `client/src/pages/yourModule/YourModelsPage.tsx`

```tsx
import { useState } from 'react';
import { Table, Button, Space, Modal, message } from 'antd';
import { useYourModels, useDeleteYourModel } from '@/module/yourModule/hooks/useYourModels';
import { YourModelFilters } from '@/module/yourModule/types/yourModel.types';

export default function YourModelsPage() {
  const [filters, setFilters] = useState<YourModelFilters>({
    page: 1,
    limit: 10
  });

  const { data, isLoading } = useYourModels(filters);
  const { mutate: deleteYourModel } = useDeleteYourModel();

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: 'Delete Confirmation',
      content: 'Are you sure you want to delete this item?',
      onOk: () => {
        deleteYourModel(id, {
          onSuccess: () => {
            message.success('Deleted successfully');
          },
          onError: (error) => {
            message.error(error.message);
          }
        });
      }
    });
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email'
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button onClick={() => navigate(`/your-models/${record.id}`)}>
            View
          </Button>
          <Button onClick={() => navigate(`/your-models/${record.id}/edit`)}>
            Edit
          </Button>
          <Button danger onClick={() => handleDelete(record.id)}>
            Delete
          </Button>
        </Space>
      )
    }
  ];

  return (
    <div>
      <h1>Your Models</h1>
      <Button type="primary" onClick={() => navigate('/your-models/create')}>
        Create New
      </Button>
      <Table
        dataSource={data?.data}
        columns={columns}
        loading={isLoading}
        pagination={{
          current: filters.page,
          pageSize: filters.limit,
          total: data?.pagination?.total,
          onChange: (page, pageSize) => {
            setFilters({ ...filters, page, limit: pageSize });
          }
        }}
      />
    </div>
  );
}
```

#### 5. Add Routes

**File**: `client/src/routes/routeConfig.tsx`

```tsx
import YourModelsPage from '@/pages/yourModule/YourModelsPage';
import YourModelCreatePage from '@/pages/yourModule/YourModelCreatePage';
import YourModelEditPage from '@/pages/yourModule/YourModelEditPage';

const routes = [
  // ... existing routes
  {
    path: '/your-models',
    element: <YourModelsPage />,
    roles: ['ADMIN', 'MODERATOR']
  },
  {
    path: '/your-models/create',
    element: <YourModelCreatePage />,
    roles: ['ADMIN']
  },
  {
    path: '/your-models/:id/edit',
    element: <YourModelEditPage />,
    roles: ['ADMIN']
  }
];
```

---

## Testing

### Backend Testing

#### Unit Tests

**File**: `server/tests/unit/yourModel.test.js`

```javascript
import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import prisma from '../../src/Prisma/prisma.client.js';
import { createYourModel, getYourModelById } from '../../src/controllers/yourModelController/yourModel.controller.js';

describe('YourModel Controller', () => {
  beforeEach(async () => {
    // Setup test data
  });

  afterEach(async () => {
    // Cleanup test data
  });

  describe('createYourModel', () => {
    it('should create a new model', async () => {
      const req = {
        body: {
          name: 'Test Model',
          email: 'test@example.com'
        }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await createYourModel(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: expect.objectContaining({
            name: 'Test Model'
          })
        })
      );
    });

    it('should return error for invalid data', async () => {
      // Test validation
    });
  });

  describe('getYourModelById', () => {
    it('should return model by id', async () => {
      // Test retrieval
    });

    it('should return 404 for non-existent id', async () => {
      // Test error handling
    });
  });
});
```

#### Integration Tests

```javascript
import request from 'supertest';
import app from '../../src/app.js';

describe('YourModel API', () => {
  it('GET /api/your-model should return all models', async () => {
    const response = await request(app)
      .get('/api/your-model')
      .set('Cookie', `token=${authToken}`)
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(Array.isArray(response.body.data)).toBe(true);
  });

  it('POST /api/your-model should create a model', async () => {
    const response = await request(app)
      .post('/api/your-model')
      .set('Cookie', `token=${authToken}`)
      .send({
        name: 'New Model',
        email: 'new@example.com'
      })
      .expect(201);

    expect(response.body.success).toBe(true);
    expect(response.body.data.name).toBe('New Model');
  });
});
```

---

### Frontend Testing

#### Component Tests

**File**: `client/src/pages/yourModule/__tests__/YourModelsPage.test.tsx`

```tsx
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import YourModelsPage from '../YourModelsPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false }
  }
});

describe('YourModelsPage', () => {
  it('renders loading state', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <YourModelsPage />
      </QueryClientProvider>
    );
    
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('renders data after loading', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <YourModelsPage />
      </QueryClientProvider>
    );
    
    await waitFor(() => {
      expect(screen.getByText('Test Model')).toBeInTheDocument();
    });
  });

  it('handles delete action', async () => {
    // Test delete functionality
  });
});
```

#### Hook Tests

```tsx
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useYourModels } from '../hooks/useYourModels';

describe('useYourModels', () => {
  it('fetches data successfully', async () => {
    const queryClient = new QueryClient();
    const wrapper = ({ children }) => (
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    );

    const { result } = renderHook(() => useYourModels(), { wrapper });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toBeDefined();
  });
});
```

---

## Deployment

### Production Build

#### Backend

```bash
cd server
npm run build  # If using TypeScript
npm start      # Or node index.js
```

#### Frontend

```bash
cd client
npm run build
```

This creates a `dist` folder with optimized production files.

---

### Environment Variables

**Production `.env` files:**

```env
# Server
DATABASE_URL="production_database_url"
JWT_SECRET="strong_production_secret"
NODE_ENV="production"
PORT=3000

# Client
VITE_API_URL="https://api.yourdomain.com"
```

---

### Docker Deployment

**Dockerfile** (root):

```dockerfile
# Server
FROM node:16 AS server
WORKDIR /app/server
COPY server/package*.json ./
RUN npm ci --only=production
COPY server/ ./
EXPOSE 3000
CMD ["node", "index.js"]

# Client
FROM node:16 AS client-build
WORKDIR /app/client
COPY client/package*.json ./
RUN npm ci
COPY client/ ./
RUN npm run build

# Nginx to serve client
FROM nginx:alpine
COPY --from=client-build /app/client/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
```

**docker-compose.yml**:

```yaml
version: '3.8'

services:
  server:
    build:
      context: ./server
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=${DATABASE_URL}
    depends_on:
      - db

  client:
    build:
      context: ./client
    ports:
      - "80:80"
    depends_on:
      - server

  db:
    image: postgres:14
    environment:
      - POSTGRES_PASSWORD=${DB_PASSWORD}
    volumes:
      - db-data:/var/lib/postgresql/data

volumes:
  db-data:
```

---

## Troubleshooting

### Common Issues

#### 1. CORS Errors

**Problem**: Cross-origin requests blocked

**Solution**: Configure CORS in `server/src/app.js`:

```javascript
import cors from 'cors';

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));
```

---

#### 2. Authentication Issues

**Problem**: JWT token not being sent

**Solution**: Ensure cookies are enabled and credentials are included:

```typescript
// In client API configuration
axios.defaults.withCredentials = true;
```

---

#### 3. Database Connection Issues

**Problem**: Can't connect to database

**Solution**: 
1. Check `DATABASE_URL` in `.env`
2. Ensure database server is running
3. Run `npx prisma generate` and `npx prisma db push`

---

#### 4. Port Already in Use

**Problem**: Port 3000 or 5173 already in use

**Solution**:
```bash
# Find process using port
lsof -ti:3000  # Mac/Linux
netstat -ano | findstr :3000  # Windows

# Kill process
kill -9 <PID>  # Mac/Linux
taskkill /PID <PID> /F  # Windows
```

---

#### 5. Build Errors

**Problem**: TypeScript or build errors

**Solution**:
```bash
# Clear caches
rm -rf node_modules package-lock.json
npm install

# Clear build cache
npm run clean  # If available
```

---

## Best Practices

### Code Style

1. **Use ESLint and Prettier**
2. **Follow naming conventions:**
   - Components: PascalCase (`UserProfile`)
   - Functions: camelCase (`getUserData`)
   - Constants: UPPER_SNAKE_CASE (`API_URL`)
3. **Write meaningful comments**
4. **Keep functions small and focused**

### Performance

1. **Use React.memo for expensive components**
2. **Implement pagination for large lists**
3. **Use lazy loading for routes**
4. **Optimize images and assets**
5. **Implement caching strategies**

### Security

1. **Never commit `.env` files**
2. **Use environment variables for secrets**
3. **Validate all user inputs**
4. **Implement rate limiting**
5. **Keep dependencies updated**

---

**Last Updated**: 2024-01-01
**Version**: 1.0.0
