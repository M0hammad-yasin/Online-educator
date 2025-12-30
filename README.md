# 🎓 Online Educator Platform

> A comprehensive full-stack tuition management system with role-based access control, class scheduling, and real-time analytics.

[![Status](https://img.shields.io/badge/status-active-success.svg)]()
[![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org/)
[![License](https://img.shields.io/badge/license-ISC-blue.svg)]()

---

## 📑 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Installation & Setup](#-installation--setup)
- [API Documentation](#-api-documentation)
- [Database Schema](#-database-schema)
- [Authentication & Authorization](#-authentication--authorization)
- [Development](#-development)
- [Environment Variables](#-environment-variables)
- [API Flow](#-api-flow)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

### 🔐 Role-Based Access Control
- **Admin**: Full system access with user and class management
- **Moderator**: Configurable permissions for teachers, students, and classes
- **Teacher**: Manage own classes and students with customizable permissions
- **Student**: View and manage enrolled classes

### 📚 Class Management
- Create, update, and delete classes
- Schedule classes with date/time management
- Track class status (Scheduled, In Progress, Completed, Cancelled)
- Calendar view for class visualization
- Class filtering and search capabilities

### 📊 Dashboard & Analytics
- Real-time statistics and metrics
- Interactive charts and graphs (Bar, Line, Pie charts)
- Class completion rates
- Student and teacher performance metrics
- Revenue and payout tracking

### 🔍 Advanced Features
- Global search functionality with highlighted results
- Responsive design for mobile and desktop
- Theme support (light/dark mode)
- Real-time updates
- Permission-based field access control
- Pagination and sorting
- Error boundary handling

---

## 🛠 Tech Stack

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 19.0.0 | UI framework |
| **TypeScript** | ~5.7.2 | Type safety |
| **Vite** | ^6.2.0 | Build tool & dev server |
| **Ant Design** | ^5.24.6 | UI component library |
| **Zustand** | ^5.0.3 | State management |
| **React Query** | ^5.81.5 | Server state management |
| **React Router** | ^7.5.3 | Routing |
| **Recharts** | ^2.15.3 | Data visualization |
| **Framer Motion** | ^12.23.22 | Animations |
| **Axios** | ^1.10.0 | HTTP client |

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| **Node.js** | >=18.0.0 | Runtime environment |
| **Express** | ^4.21.2 | Web framework |
| **Prisma** | ^6.4.1 | ORM |
| **MongoDB** | Latest | Database |
| **JWT** | ^9.0.2 | Authentication |
| **Zod** | ^3.24.2 | Schema validation |
| **bcryptjs** | ^3.0.2 | Password hashing |
| **CORS** | ^2.8.5 | Cross-origin support |

### Development Tools
- **Concurrently**: Run client and server simultaneously
- **Nodemon**: Auto-restart server on changes
- **ESLint**: Code linting
- **TypeScript ESLint**: TypeScript linting

---

## 🏗 Architecture

### System Architecture

```mermaid
graph TB
    subgraph Client["Client (React + TypeScript)"]
        UI[User Interface]
        AuthStore["Zustand Store (token + user)"]
        API_Client[API Client]
        Router[React Router]
        ReactQuery["React Query Cache (classes, teachers, students, etc.)"]
    end
    
    subgraph Server["Server (Node.js + Express)"]
        Routes[Express Routes]
        Middleware[Auth & Validation Middleware]
        Controllers[Controllers]
        Services[Business Logic]
    end
    
    subgraph Database["Database (MongoDB)"]
        Prisma[Prisma ORM]
        MongoDB[(MongoDB)]
    end
    
    %% Client Flow
    UI --> Router
    Router --> AuthStore
    UI --> ReactQuery
    AuthStore --> API_Client
    ReactQuery --> API_Client

    %% API Communication
    API_Client -->|HTTP/REST| Routes
    Routes --> Middleware
    Middleware --> Controllers
    Controllers --> Services
    Services --> Prisma
    Prisma --> MongoDB
    MongoDB --> Prisma
    Prisma --> Services
    Services --> Controllers
    Controllers --> Middleware
    Middleware --> Routes
    Routes -->|JSON Response| API_Client
    API_Client --> ReactQuery
    ReactQuery --> UI
```

### Authentication Flow

```mermaid
graph TB
    subgraph Client["Client (React + TypeScript)"]
        UI[User Interface]
        AuthStore["Zustand Store (token + user)"]
        API_Client[API Client]
        Router[React Router]
        ReactQuery["React Query Cache (classes, teachers, students, etc.)"]
    end
    
    subgraph Server["Server (Node.js + Express)"]
        Routes[Express Routes]
        Middleware[Auth & Validation Middleware]
        Controllers[Controllers]
        Services[Business Logic]
    end
    
    subgraph Database["Database (MongoDB)"]
        Prisma[Prisma ORM]
        MongoDB[(MongoDB)]
    end
    
    %% Client Flow
    UI --> Router
    Router --> AuthStore
    UI --> ReactQuery
    AuthStore --> API_Client
    ReactQuery --> API_Client

    %% API Communication
    API_Client -->|HTTP/REST| Routes
    Routes --> Middleware
    Middleware --> Controllers
    Controllers --> Services
    Services --> Prisma
    Prisma --> MongoDB
    MongoDB --> Prisma
    Prisma --> Services
    Services --> Controllers
    Controllers --> Middleware
    Middleware --> Routes
    Routes -->|JSON Response| API_Client
    API_Client --> ReactQuery
    ReactQuery --> UI
```

### API Request Flow

```mermaid
flowchart TD
    %% Client Side
    Start([Client Request]) --> Interceptor{Request Interceptor}
    Interceptor -->|Attach Token from AuthStore| Route[Route Handler]

    %% Server Side
    Route --> Auth{Authentication Middleware}
    Auth -->|Valid Token| Role{Role Check}
    Auth -->|Invalid/No Token| Error401[401 Unauthorized]
    Role -->|Authorized| Validate{Validation Middleware}
    Role -->|Unauthorized| Error403[403 Forbidden]
    Validate -->|Valid| Controller[Controller]
    Validate -->|Invalid| Error400[400 Validation Error]

    %% Business Logic & Database
    Controller --> Service[Service Layer]
    Service --> DB[(Database)]
    DB --> Service
    Service --> Controller

    %% Response Handling
    Controller --> Response[Response Formatter]
    Response --> Success[200/201 Success]

    %% Error Handling
    Error401 --> ErrorHandler[Error Middleware]
    Error403 --> ErrorHandler
    Error400 --> ErrorHandler
    ErrorHandler --> ErrorResponse[Error Response]

    %% Back to Client
    Success --> End([Client])
    ErrorResponse --> End
```

---

## 📁 Project Structure

```
Online-educator/
├── client/                          # Frontend React application
│   ├── src/
│   │   ├── components/              # Reusable UI components
│   │   │   ├── layout/             # Layout components (Header, Sidebar)
│   │   │   ├── widgets/            # Widget components (Search, Stats)
│   │   │   └── wrapper/            # Page wrappers
│   │   ├── module/                 # Feature modules
│   │   │   ├── authentication/     # Auth module (login, register)
│   │   │   ├── classes/            # Class management module
│   │   │   ├── student/            # Student management module
│   │   │   ├── teacher/            # Teacher management module
│   │   │   └── admin/              # Admin module
│   │   ├── pages/                  # Page components
│   │   │   ├── Dashboard/         # Dashboard page
│   │   │   ├── Login/              # Login page
│   │   │   ├── class/              # Class pages
│   │   │   └── Students/           # Student pages
│   │   ├── routes/                 # Routing configuration
│   │   ├── services/               # API services
│   │   ├── store/                  # Zustand stores
│   │   ├── hooks/                  # Custom React hooks
│   │   ├── config/                 # Configuration files
│   │   └── constants/               # Constants and enums
│   ├── public/                     # Static assets
│   └── package.json
│
├── server/                          # Backend Node.js application
│   ├── src/
│   │   ├── controllers/            # Request handlers
│   │   │   ├── adminController/    # Admin controllers
│   │   │   ├── TeacherController/   # Teacher controllers
│   │   │   ├── StudentController/   # Student controllers
│   │   │   └── classController/     # Class controllers
│   │   ├── routes/                 # Express routes
│   │   ├── middleware/             # Express middleware
│   │   │   ├── auth.js             # JWT authentication
│   │   │   ├── roleCheck.js        # Role-based access
│   │   │   └── validate.middleware.js  # Request validation
│   │   ├── Services/               # Business logic layer
│   │   ├── validation/             # Zod validation schemas
│   │   ├── utils/                  # Utility functions
│   │   ├── Prisma/                 # Database configuration
│   │   │   └── tuition.prisma      # Prisma schema
│   │   └── config/                 # Configuration
│   ├── index.js                    # Server entry point
│   └── package.json
│
├── documentations/                  # Project documentation
│   ├── api_contract.md             # API contract
│   ├── api_docs.md                 # API documentation
│   └── folder_structure.md         # Folder structure
│
├── package.json                     # Root package.json
└── README.md                        # This file
```

### Key Directories

- **`client/src/module/`**: Feature-based modules with components, services, hooks, and stores
- **`server/src/controllers/`**: Request handlers organized by entity
- **`server/src/middleware/`**: Authentication, authorization, and validation middleware
- **`server/src/validation/`**: Zod schemas for request validation
- **`server/src/Prisma/`**: Database schema and Prisma client

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** >= 18.0.0 ([Download](https://nodejs.org/))
- **npm** or **yarn** package manager
- **MongoDB** (local or cloud instance like MongoDB Atlas)
- **Git** for version control

### MongoDB Setup

1. **Local MongoDB**:
   ```bash
   # Install MongoDB locally or use Docker
   docker run -d -p 27017:27017 --name mongodb mongo:latest
   ```

2. **MongoDB Atlas** (Cloud):
   - Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Create a cluster and get connection string

---

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/M0hammad-yasin/Online-educator.git
cd Online-educator
```

### 2. Install Dependencies

Install all dependencies (root, client, and server):

```bash
npm run install:all
```

Or install manually:

```bash
# Root dependencies
npm install

# Server dependencies
cd server
npm install

# Client dependencies
cd ../client
npm install
```

### 3. Environment Configuration

#### Server Environment Variables

Create a `.env` file in the `server/` directory:

```env
# Server Configuration
PORT=3000
CLIENT_PORT=5000
NODE_ENV=development

# Database
MONGO_URI=mongodb://localhost:27017/online-educator
# Or for MongoDB Atlas:
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/online-educator

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_SECRET_EXPIRES_IN=7d

# Cloudinary (Optional - for image uploads)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

#### Client Environment Variables

Create a `.env` file in the `client/` directory:

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

### 4. Database Setup

#### Generate Prisma Client

```bash
cd server
npm run prisma:generate
```

#### Run Database Migrations

```bash
# Push schema to database (for development)
npm run prisma:push

# Or create a migration (for production)
npm run prisma:migrate
```

#### Seed Database (Optional)

```bash
# If seed script exists
node server/src/Prisma/seed.js
```

### 5. Run the Application

#### Development Mode (Both Client & Server)

From the root directory:

```bash
npm run dev
```

This will start:
- **Server**: `http://localhost:3000`
- **Client**: `http://localhost:5000`

#### Run Separately

**Server only:**
```bash
npm run dev:server
# or
cd server && npm run dev
```

**Client only:**
```bash
npm run dev:client
# or
cd client && npm run dev
```

#### Production Build

```bash
# Build client
npm run build

# Start server
npm start
```

---

## 📡 API Documentation

### Base URL

```
http://localhost:3000/api
```

### Authentication

The API uses JWT (JSON Web Token) authentication. Include the token in requests:

**Option 1: Authorization Header**
```http
Authorization: Bearer <your-jwt-token>
```

**Option 2: Cookie**
```http
Cookie: token=<your-jwt-token>
```

### Response Format

#### Success Response

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    // Response data
  },
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 42,
    "hasNextPage": true
  }
}
```

#### Error Response

```json
{
  "success": false,
  "message": "Error message",
  "data": null,
  "error": {
    "type": "validation_error",
    "message": "Detailed error message",
    "stack": "Stack trace (development only)"
  }
}
```

### Error Types

| Status Code | Error Type | Description |
|------------|------------|-------------|
| 400 | `validation_error` | Invalid request data |
| 401 | `authentication_error` | Missing or invalid token |
| 403 | `authorization_error` | Insufficient permissions |
| 404 | `not_found_error` | Resource not found |
| 409 | `conflict_error` | Resource conflict (e.g., duplicate email) |
| 500 | `server_error` | Internal server error |

### API Endpoints

#### Admin Endpoints

| Method | Endpoint | Description | Auth Required | Role Required |
|--------|----------|-------------|---------------|---------------|
| POST | `/api/admin/register` | Register admin | No | - |
| POST | `/api/admin/login` | Admin login | No | - |
| GET | `/api/admin/me` | Get admin profile | Yes | ADMIN |
| PATCH | `/api/admin/me` | Update admin profile | Yes | ADMIN |
| PUT | `/api/admin/update` | Full update admin | Yes | ADMIN |
| PUT | `/api/admin/update-password` | Change password | Yes | ADMIN |
| GET | `/api/admin/logout` | Logout | Yes | ADMIN |

#### Teacher Endpoints

| Method | Endpoint | Description | Auth Required | Role Required |
|--------|----------|-------------|---------------|---------------|
| POST | `/api/teacher/register` | Register teacher | No | - |
| POST | `/api/teacher/login` | Teacher login | No | - |
| GET | `/api/teacher/` | List teachers | Yes | ADMIN, MODERATOR |
| GET | `/api/teacher/me` | Get teacher profile | Yes | TEACHER |
| GET | `/api/teacher/:id` | Get teacher by ID | Yes | ADMIN, MODERATOR |
| PUT | `/api/teacher/:id` | Update teacher | Yes | ADMIN, MODERATOR |
| DELETE | `/api/teacher/:id` | Delete teacher | Yes | ADMIN, MODERATOR |
| GET | `/api/teacher/classes` | Get teachers with classes | Yes | ADMIN, MODERATOR |
| PUT | `/api/teacher/:id/access-control` | Modify access control | Yes | ADMIN |

#### Student Endpoints

| Method | Endpoint | Description | Auth Required | Role Required |
|--------|----------|-------------|---------------|---------------|
| POST | `/api/student/register` | Register student | No | - |
| POST | `/api/student/login` | Student login | No | - |
| GET | `/api/student/` | List students | Yes | ADMIN, MODERATOR, TEACHER |
| GET | `/api/student/me` | Get student profile | Yes | STUDENT |
| GET | `/api/student/:id` | Get student by ID | Yes | ADMIN, MODERATOR, TEACHER |
| PUT | `/api/student/:id` | Update student | Yes | ADMIN, MODERATOR, TEACHER |
| DELETE | `/api/student/:id` | Delete student | Yes | ADMIN, MODERATOR |
| GET | `/api/student/classes` | Get students with classes | Yes | ADMIN, MODERATOR |

#### Class Endpoints

| Method | Endpoint | Description | Auth Required | Role Required |
|--------|----------|-------------|---------------|---------------|
| POST | `/api/class/create` | Create class | Yes | ADMIN, MODERATOR, TEACHER |
| GET | `/api/class/` | List classes | Yes | All roles |
| GET | `/api/class/:id` | Get class by ID | Yes | All roles |
| PUT | `/api/class/:id` | Update class | Yes | ADMIN, MODERATOR, TEACHER |
| DELETE | `/api/class/:id` | Delete class | Yes | ADMIN, MODERATOR, TEACHER |
| GET | `/api/class/calander-view/` | Calendar view | Yes | All roles |
| GET | `/api/class/count-by-group` | Count by group | Yes | All roles |
| GET | `/api/class/group` | Grouped classes | Yes | All roles |

### Example API Requests

#### Login

```bash
curl -X POST http://localhost:3000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "Password123!"
  }'
```

#### Get Classes (Authenticated)

```bash
curl -X GET http://localhost:3000/api/class/ \
  -H "Authorization: Bearer <your-jwt-token>" \
  -H "Content-Type: application/json"
```

#### Create Class

```bash
curl -X POST http://localhost:3000/api/class/create \
  -H "Authorization: Bearer <your-jwt-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "subject": "Mathematics",
    "teacherId": "507f1f77bcf86cd799439011",
    "studentId": "507f1f77bcf86cd799439012",
    "scheduledAt": "2024-12-01T10:00:00Z",
    "startTime": "2024-12-01T10:00:00Z",
    "endTime": "2024-12-01T11:00:00Z",
    "duration": 60,
    "status": "SCHEDULED"
  }'
```

For complete API documentation, see [`documentations/api_contract.md`](./documentations/api_contract.md) and [`documentations/api_docs.md`](./documentations/api_docs.md).

---

## 🗄 Database Schema

### Entity Relationship Diagram

```mermaid
erDiagram
    Admin ||--o{ ClassModel : manages
    Teacher ||--o{ ClassModel : teaches
    Student ||--o{ ClassModel : enrolls
    Teacher ||--|| TeacherAccessControl : has
    Moderator ||--|| ModeratorAccessControl : has
    
    Admin {
        string id PK
        string name
        string email UK
        string passwordHash
        Role role
        string profilePicture
        boolean isEmailVerified
        datetime createdAt
        datetime updatedAt
    }
    
    Teacher {
        string id PK
        string name
        string email UK
        string passwordHash
        string qualification
        int classRate
        Role role
        string profilePicture
        string address
        boolean isEmailVerified
        boolean isDeleted
        datetime createdAt
        datetime updatedAt
    }
    
    Student {
        string id PK
        string name
        string email UK
        string passwordHash
        string profilePicture
        string parentEmail
        int grade
        string address
        string region
        Role role
        boolean isEmailVerified
        boolean isDeleted
        datetime createdAt
        datetime updatedAt
    }
    
    Moderator {
        string id PK
        string name
        string email UK
        string passwordHash
        string address
        Role role
        string profilePicture
        boolean isEmailVerified
        datetime createdAt
        datetime updatedAt
    }
    
    ClassModel {
        string id PK
        string subject
        string title
        datetime scheduledAt
        datetime startTime
        datetime endTime
        string teacherId FK
        string studentId FK
        string classLink
        int duration
        ClassStatus status
        datetime createdAt
        datetime updatedAt
    }
    
    TeacherAccessControl {
        string id PK
        string teacherId FK
        boolean canSeeClass
        boolean canAddClass
        boolean canUpdateClass
        boolean canDeleteClass
        boolean canSeeStudent
        boolean canAddStudent
        boolean canUpdateStudent
        boolean canDeleteStudent
        datetime createdAt
        datetime updatedAt
    }
    
    ModeratorAccessControl {
        string id PK
        string moderatorId FK
        boolean canSeeTeacher
        boolean canAddTeacher
        boolean canUpdateTeacher
        boolean canDeleteTeacher
        boolean canSeeStudent
        boolean canAddStudent
        boolean canUpdateStudent
        boolean canDeleteStudent
        boolean canSeeClass
        boolean canAddClass
        boolean canUpdateClass
        boolean canDeleteClass
        datetime createdAt
        datetime updatedAt
    }
```

### Models Overview

#### Admin
- System administrators with full access
- Unique email constraint
- Email verification support

#### Teacher
- Instructors with qualifications and hourly rates
- One-to-many relationship with Classes
- Optional access control for permissions
- Soft delete support (`isDeleted`)

#### Student
- Students with grade and parent information
- One-to-many relationship with Classes
- Soft delete support (`isDeleted`)

#### Moderator
- Limited admin with configurable permissions
- Access control via `ModeratorAccessControl`

#### Class
- Scheduled lessons between teachers and students
- Status tracking (SCHEDULED, IN_PROGRESS, COMPLETED, CANCELLED)
- Links to external class platforms (e.g., Conceptboard)

#### Access Control Models
- **TeacherAccessControl**: Permissions for teachers
- **ModeratorAccessControl**: Permissions for moderators
- Granular control over CRUD operations

### Enums

```typescript
enum Role {
  ADMIN
  TEACHER
  STUDENT
  MODERATOR
}

enum ClassStatus {
  SCHEDULED
  COMPLETED
  IN_PROGRESS
  CANCELLED
}
```

---

## 🔐 Authentication & Authorization

### JWT Authentication Flow

1. **Registration/Login**: User provides credentials
2. **Token Generation**: Server generates JWT with user data and role
3. **Token Storage**: Client stores token in localStorage
4. **Request Authentication**: Token sent via Authorization header or cookie
5. **Token Verification**: Middleware verifies token and extracts user data
6. **Authorization Check**: Role-based middleware checks permissions

### Role-Based Access Control (RBAC)

The system implements four roles with hierarchical permissions:

| Role | Permissions |
|------|-------------|
| **ADMIN** | Full system access, user management, class management |
| **MODERATOR** | Configurable permissions via `ModeratorAccessControl` |
| **TEACHER** | Manage own classes, view assigned students, configurable permissions |
| **STUDENT** | View enrolled classes, update own profile |

### Permission System

#### Teacher Access Control

Teachers can have granular permissions:
- **Classes**: `canSeeClass`, `canAddClass`, `canUpdateClass`, `canDeleteClass`
- **Students**: `canSeeStudent`, `canAddStudent`, `canUpdateStudent`, `canDeleteStudent`

#### Moderator Access Control

Moderators have configurable permissions for:
- **Teachers**: See, Add, Update, Delete
- **Students**: See, Add, Update, Delete
- **Classes**: See, Add, Update, Delete

### Middleware Chain

```javascript
// Authentication middleware
auth → roleCheck → validate → controller
```

1. **`auth.js`**: Verifies JWT token
2. **`roleCheck.js`**: Checks user role against required roles
3. **`validate.middleware.js`**: Validates request data with Zod schemas
4. **Controller**: Handles business logic

### Token Structure

```json
{
  "id": "user-id",
  "email": "user@example.com",
  "role": "ADMIN",
  "iat": 1234567890,
  "exp": 1235172690
}
```

---

## 💻 Development

### Available Scripts

#### Root Scripts

```bash
npm run dev              # Run both client and server
npm run dev:server       # Run server only
npm run dev:client       # Run client only
npm run install:all      # Install all dependencies
npm run build            # Build client for production
npm start                # Start production server
```

#### Server Scripts

```bash
cd server
npm run dev              # Start with nodemon
npm start                # Start production server
npm run prisma:generate  # Generate Prisma client
npm run prisma:migrate   # Run migrations
npm run prisma:push      # Push schema to database
```

#### Client Scripts

```bash
cd client
npm run dev              # Start Vite dev server
npm run build            # Build for production
npm run preview          # Preview production build
npm run lint             # Run ESLint
```

### Development Workflow

1. **Start Development Servers**:
   ```bash
   npm run dev
   ```

2. **Make Changes**:
   - Frontend: Edit files in `client/src/`
   - Backend: Edit files in `server/src/`
   - Database: Update `server/src/Prisma/tuition.prisma` then run `prisma:push`

3. **Code Structure**:
   - **Feature-based modules**: Each feature has its own module with components, services, hooks, and stores
   - **Separation of concerns**: Controllers → Services → Database
   - **Type safety**: TypeScript on frontend, JSDoc on backend

4. **Testing**:
   - API endpoints can be tested with tools like Postman or curl
   - Frontend components can be tested in the browser

### Code Conventions

- **Naming**: 
  - Components: PascalCase (e.g., `DashboardPage.tsx`)
  - Functions/Variables: camelCase (e.g., `getUserData`)
  - Constants: UPPER_SNAKE_CASE (e.g., `API_BASE_URL`)

- **File Organization**:
  - One component per file
  - Related files grouped in feature modules
  - Shared utilities in `utils/` directory

- **State Management**:
  - Global state: Zustand stores
  - Server state: React Query
  - Local state: React hooks

---

## 🔧 Environment Variables

### Server Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `PORT` | No | `3000` | Server port |
| `CLIENT_PORT` | No | `5000` | Client dev server port |
| `NODE_ENV` | No | `development` | Environment mode |
| `MONGO_URI` | **Yes** | - | MongoDB connection string |
| `JWT_SECRET` | **Yes** | - | JWT signing secret |
| `JWT_SECRET_EXPIRES_IN` | No | `7d` | JWT expiration time |
| `CLOUDINARY_CLOUD_NAME` | No | - | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | No | - | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | No | - | Cloudinary API secret |

### Client Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `VITE_API_BASE_URL` | No | `http://localhost:3000/api` | API base URL |

### Example `.env` Files

**`server/.env`**:
```env
PORT=3000
CLIENT_PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/online-educator
JWT_SECRET=your-super-secret-jwt-key-min-32-characters
JWT_SECRET_EXPIRES_IN=7d
```

**`client/.env`**:
```env
VITE_API_BASE_URL=http://localhost:3000/api
```

---

## 🔄 API Flow

### Request Lifecycle

```mermaid
sequenceDiagram
    participant C as Client
    participant AuthStore as AuthStore (Zustand)
    participant I as Interceptor
    participant R as Route
    participant A as Auth Middleware
    participant V as Validation
    participant Ctrl as Controller
    participant S as Service
    participant DB as Database
    participant E as Error Handler
    
    %% Client prepares request
    C->>AuthStore: Read Token
    C->>I: HTTP Request
    I->>I: Add Authorization Header from AuthStore
    I->>R: Forward Request
    
    %% Server authentication & validation
    R->>A: Verify Token
    alt Token Valid
        A->>A: Extract User Data
        A->>R: User Object
        R->>V: Validate Request Body
        alt Valid Data
            V->>Ctrl: Validated Data
            Ctrl->>S: Business Logic
            S->>DB: Database Query
            DB-->>S: Result
            S-->>Ctrl: Processed Data
            Ctrl-->>R: Response Data
            R-->>I: JSON Response
            I-->>C: Success Response
        else Invalid Data
            V->>E: Validation Error
            E-->>C: 400 Error
        end
    else Invalid/No Token
        A->>E: Authentication Error
        E-->>C: 401 Error
    end
```

### Role-Based Routing Flow

```mermaid
flowchart TD
    Request[Incoming Request] --> Auth{Authentication}
    Auth -->|Valid| RoleCheck{Role Check}
    Auth -->|Invalid| Error401[401 Unauthorized]
    
    RoleCheck -->|Admin| Admin_Routes[Admin Routes]
    RoleCheck -->|Moderator| Mod_Routes[Moderator Routes]
    RoleCheck -->|Teacher| Teacher_Routes[Teacher Routes]
    RoleCheck -->|Student| Student_Routes[Student Routes]
    RoleCheck -->|Unauthorized| Error403[403 Forbidden]
    
    Admin_Routes --> Process[Process Request]
    Mod_Routes --> PermCheck{Permission Check}
    PermCheck -->|Allowed| Process
    PermCheck -->|Denied| Error403
    Teacher_Routes --> Process
    Student_Routes --> Process
    
    Process --> Response[Success Response]
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit your changes**: `git commit -m 'Add some amazing feature'`
4. **Push to the branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Development Guidelines

- Follow existing code style and conventions
- Write clear commit messages
- Update documentation for new features
- Test your changes thoroughly
- Ensure TypeScript types are correct

---

## 📄 License

This project is licensed under the ISC License.

---

## 📚 Additional Resources

- [API Contract Documentation](./documentations/api_contract.md)
- [API Documentation](./documentations/api_docs.md)
- [Folder Structure](./documentations/folder_structure.md)
- [Prisma Documentation](https://www.prisma.io/docs)
- [React Documentation](https://react.dev/)
- [Ant Design Documentation](https://ant.design/)

---

## 👥 Support

For questions, issues, or contributions, please open an issue on the repository.

---

**Built with ❤️ using React, Node.js, and MongoDB**
