# Online Educator Platform - Comprehensive API Documentation

## Table of Contents
1. [Overview](#overview)
2. [Server API Endpoints](#server-api-endpoints)
3. [Client API Services](#client-api-services)
4. [React Components](#react-components)
5. [Hooks and Utilities](#hooks-and-utilities)
6. [State Management](#state-management)
7. [Authentication Flow](#authentication-flow)
8. [Error Handling](#error-handling)

---

## Overview

The Online Educator Platform is a full-stack application built with:
- **Backend**: Node.js + Express + Prisma
- **Frontend**: React + TypeScript + Ant Design
- **State Management**: Zustand
- **Data Fetching**: React Query

### Base URL
- **API Base URL**: `/api`
- **Development**: `http://localhost:3000/api`

### Authentication
All authenticated endpoints require a JWT token stored in an HTTP-only cookie named `token`.

---

## Server API Endpoints

### Standard Response Format

#### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... },
  "pagination": {  // Optional, for paginated endpoints
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  }
}
```

#### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "data": null,
  "error": {
    "type": "error_type",
    "message": "Detailed error message",
    "stack": "..." // Only in development
  }
}
```

---

## 1. Admin API

### Base Path: `/api/admin`

#### Register Admin
```http
POST /api/admin/register
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "admin@example.com",
  "password": "SecurePassword123!",
  "profilePicture": "https://example.com/avatar.jpg", // Optional
  "isEmailVerified": false // Optional
}
```

**Response:**
```json
{
  "success": true,
  "message": "Admin created Successfully",
  "data": {
    "id": "admin_id_123",
    "name": "John Doe",
    "email": "admin@example.com",
    "profilePicture": "https://example.com/avatar.jpg",
    "isEmailVerified": false
  }
}
```

**Notes:**
- Only one admin can be created in the system
- Password is automatically hashed before storage

---

#### Login Admin
```http
POST /api/admin/login
```

**Request Body:**
```json
{
  "email": "admin@example.com",
  "password": "SecurePassword123!"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Admin logged in Successfully",
  "data": {
    "accessToken": "jwt_token_here",
    "user": {
      "id": "admin_id_123",
      "name": "John Doe",
      "email": "admin@example.com",
      "role": "ADMIN",
      "profilePicture": "https://example.com/avatar.jpg"
    }
  }
}
```

**Notes:**
- Sets HTTP-only cookie with JWT token
- Token expires based on `JWT_SECRET_EXPIRY` config

---

#### Get Admin Profile
```http
GET /api/admin/me
Authorization: Required (Cookie: token)
```

**Response:**
```json
{
  "success": true,
  "message": "Admin fetched Successfully",
  "data": {
    "id": "admin_id_123",
    "name": "John Doe",
    "email": "admin@example.com",
    "role": "ADMIN",
    "profilePicture": "https://example.com/avatar.jpg",
    "isEmailVerified": true
  }
}
```

---

#### Update Admin Profile (Full Update)
```http
PUT /api/admin/update
Authorization: Required (Admin only)
```

**Request Body:**
```json
{
  "name": "John Updated",
  "email": "newemail@example.com",
  "profilePicture": "https://example.com/new-avatar.jpg"
}
```

---

#### Patch Admin Profile (Single Field Update)
```http
PATCH /api/admin/me
Authorization: Required (Admin only)
```

**Request Body:**
```json
{
  "name": "John Updated"
}
```

**Notes:**
- Only one field can be updated at a time
- Email uniqueness is validated

---

#### Update Password
```http
PUT /api/admin/update-password
Authorization: Required (Admin only)
```

**Request Body:**
```json
{
  "oldPassword": "CurrentPassword123!",
  "password": "NewPassword123!"
}
```

**Notes:**
- Requires old password verification via middleware

---

#### Verify Email
```http
PUT /api/admin/verify-email
Authorization: Required (Admin only)
```

**Response:**
```json
{
  "success": true,
  "message": "Email verified Successfully",
  "data": {
    "id": "admin_id_123",
    "isEmailVerified": true
  }
}
```

---

#### Logout Admin
```http
GET /api/admin/logout
Authorization: Required
```

**Response:**
```json
{
  "success": true,
  "message": "Logged out successfully",
  "data": null
}
```

---

## 2. Student API

### Base Path: `/api/student`

#### Register Student
```http
POST /api/student/register
```

**Request Body:**
```json
{
  "name": "Jane Student",
  "email": "student@example.com",
  "password": "StudentPass123!",
  "phone": "+1234567890", // Optional
  "address": "123 Main St", // Optional
  "dateOfBirth": "2000-01-01" // Optional
}
```

**Response:**
```json
{
  "success": true,
  "message": "Student registered successfully",
  "data": {
    "id": "student_id_123",
    "name": "Jane Student",
    "email": "student@example.com",
    "role": "STUDENT"
  }
}
```

---

#### Login Student
```http
POST /api/student/login
```

**Request Body:**
```json
{
  "email": "student@example.com",
  "password": "StudentPass123!"
}
```

---

#### Get All Students (Admin/Moderator/Teacher)
```http
GET /api/student?page=1&limit=10&search=john&status=ACTIVE
Authorization: Required (Admin/Moderator/Teacher)
```

**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 10)
- `search` (string): Search by name or email
- `status` (string): Filter by status (ACTIVE, INACTIVE)
- `orderBy` (string): Sort field (e.g., "name", "createdAt")
- `order` (string): Sort direction ("asc" or "desc")

**Response:**
```json
{
  "success": true,
  "message": "Students fetched successfully",
  "data": [
    {
      "id": "student_id_123",
      "name": "Jane Student",
      "email": "student@example.com",
      "phone": "+1234567890",
      "status": "ACTIVE",
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "totalPages": 5
  }
}
```

---

#### Get Students with Class Count
```http
GET /api/student/class-count?page=1&limit=10
Authorization: Required (Admin/Moderator)
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "student_id_123",
      "name": "Jane Student",
      "email": "student@example.com",
      "classCount": 5
    }
  ]
}
```

---

#### Get Students with Classes
```http
GET /api/student/classes?page=1&limit=10
Authorization: Required (Admin/Moderator)
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "student_id_123",
      "name": "Jane Student",
      "classes": [
        {
          "id": "class_id_1",
          "title": "Math 101",
          "status": "SCHEDULED"
        }
      ]
    }
  ]
}
```

---

#### Get Student by ID
```http
GET /api/student/:id
Authorization: Required (Admin/Teacher/Moderator or self)
```

**Example:**
```http
GET /api/student/student_id_123
```

---

#### Get Current Student Profile
```http
GET /api/student/me
Authorization: Required (Student)
```

---

#### Update Student (By Admin/Moderator/Teacher)
```http
PUT /api/student/:id
Authorization: Required (Admin/Teacher/Moderator)
```

**Request Body:**
```json
{
  "name": "Jane Updated",
  "email": "newemail@example.com",
  "phone": "+1234567890",
  "address": "456 New St"
}
```

---

#### Update Own Profile (By Student)
```http
PUT /api/student/me
Authorization: Required (Student)
```

---

#### Patch Student Profile
```http
PATCH /api/student/me
Authorization: Required (Student)
```

**Request Body:**
```json
{
  "name": "Jane Updated"
}
```

---

#### Delete Student
```http
DELETE /api/student/:id
Authorization: Required (Admin/Moderator)
```

---

#### Get Students for Selection (Dropdown)
```http
GET /api/student/select?page=1&limit=50&search=jane
Authorization: Required (Admin/Moderator/Teacher)
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "student_id_123",
      "name": "Jane Student",
      "email": "student@example.com"
    }
  ]
}
```

---

#### Logout Student
```http
POST /api/student/logout
Authorization: Required (Student)
```

---

## 3. Teacher API

### Base Path: `/api/teacher`

#### Register Teacher
```http
POST /api/teacher/register
```

**Request Body:**
```json
{
  "name": "Bob Teacher",
  "email": "teacher@example.com",
  "password": "TeacherPass123!",
  "phone": "+1234567890",
  "subjects": ["Math", "Physics"],
  "qualification": "PhD in Mathematics"
}
```

---

#### Login Teacher
```http
POST /api/teacher/login
```

**Request Body:**
```json
{
  "email": "teacher@example.com",
  "password": "TeacherPass123!"
}
```

---

#### Get All Teachers
```http
GET /api/teacher?page=1&limit=10&search=bob
Authorization: Required (Admin/Moderator)
```

**Query Parameters:**
- `page` (number): Page number
- `limit` (number): Items per page
- `search` (string): Search by name or email
- `status` (string): Filter by status
- `subject` (string): Filter by subject

---

#### Get Teachers with Classes
```http
GET /api/teacher/classes?page=1&limit=10
Authorization: Required (Admin/Moderator)
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "teacher_id_123",
      "name": "Bob Teacher",
      "classes": [
        {
          "id": "class_id_1",
          "title": "Math 101",
          "studentsCount": 25
        }
      ]
    }
  ]
}
```

---

#### Get Teachers with Class Count
```http
GET /api/teacher/class-count?page=1&limit=10
Authorization: Required (Admin/Moderator)
```

---

#### Get Teacher Class Count by Day
```http
POST /api/teacher/class-day-count?page=1&limit=10
Authorization: Required (Admin/Moderator)
```

**Request Body:**
```json
{
  "startDate": "2024-01-01",
  "endDate": "2024-01-31"
}
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "teacherId": "teacher_id_123",
      "teacherName": "Bob Teacher",
      "classesByDay": {
        "2024-01-01": 3,
        "2024-01-02": 2
      }
    }
  ]
}
```

---

#### Get Teacher by ID
```http
GET /api/teacher/:id
Authorization: Required (Admin/Moderator or self)
```

---

#### Get Current Teacher Profile
```http
GET /api/teacher/me
Authorization: Required (Teacher)
```

---

#### Update Teacher
```http
PUT /api/teacher/:id
Authorization: Required (Admin/Moderator)
```

**Request Body:**
```json
{
  "name": "Bob Updated",
  "subjects": ["Math", "Physics", "Chemistry"],
  "qualification": "PhD in Physics"
}
```

---

#### Update Own Profile (By Teacher)
```http
PUT /api/teacher/me
Authorization: Required (Teacher)
```

---

#### Patch Teacher Profile
```http
PATCH /api/teacher/me
Authorization: Required (Teacher)
```

---

#### Modify Access Control
```http
PUT /api/teacher/:id/access-control
Authorization: Required (Admin)
```

**Request Body:**
```json
{
  "canCreateClass": true,
  "canUpdateClass": true,
  "canDeleteClass": false
}
```

---

#### Delete Teacher
```http
DELETE /api/teacher/:id
Authorization: Required (Admin/Moderator)
```

---

#### Get Teachers for Selection
```http
GET /api/teacher/select?page=1&limit=50
Authorization: Required (Admin/Moderator)
```

---

#### Logout Teacher
```http
POST /api/teacher/logout
Authorization: Required (Teacher)
```

---

## 4. Class API

### Base Path: `/api/class`

#### Create Class
```http
POST /api/class/create
Authorization: Required (Admin/Moderator/Teacher)
```

**Request Body:**
```json
{
  "title": "Mathematics 101",
  "description": "Introduction to Calculus",
  "subject": "Mathematics",
  "teacherId": "teacher_id_123",
  "studentIds": ["student_id_1", "student_id_2"],
  "schedule": {
    "day": "MONDAY",
    "startTime": "09:00",
    "endTime": "10:30"
  },
  "startDate": "2024-01-01",
  "endDate": "2024-06-30",
  "fee": 500,
  "maxStudents": 30,
  "location": "Room 101"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Class created successfully",
  "data": {
    "id": "class_id_123",
    "title": "Mathematics 101",
    "subject": "Mathematics",
    "status": "SCHEDULED",
    "teacher": {
      "id": "teacher_id_123",
      "name": "Bob Teacher"
    },
    "studentsCount": 2
  }
}
```

---

#### Get All Classes
```http
GET /api/class?page=1&limit=10&status=SCHEDULED&subject=Math
Authorization: Required (All roles)
```

**Query Parameters:**
- `page` (number): Page number
- `limit` (number): Items per page
- `search` (string): Search by title or description
- `status` (string): SCHEDULED, IN_PROGRESS, COMPLETED, CANCELLED
- `subject` (string): Filter by subject
- `teacherId` (string): Filter by teacher
- `studentId` (string): Filter by student (shows classes student is enrolled in)
- `startDate` (string): Filter classes starting from this date
- `endDate` (string): Filter classes ending before this date
- `orderBy` (string): Sort field
- `order` (string): "asc" or "desc"

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "class_id_123",
      "title": "Mathematics 101",
      "description": "Introduction to Calculus",
      "subject": "Mathematics",
      "status": "SCHEDULED",
      "teacher": {
        "id": "teacher_id_123",
        "name": "Bob Teacher"
      },
      "studentsCount": 25,
      "maxStudents": 30,
      "schedule": {
        "day": "MONDAY",
        "startTime": "09:00",
        "endTime": "10:30"
      },
      "startDate": "2024-01-01",
      "endDate": "2024-06-30",
      "fee": 500,
      "location": "Room 101"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  }
}
```

---

#### Get Classes for Selection (Dropdown)
```http
GET /api/class/select?page=1&limit=50
Authorization: Required (Admin/Moderator/Teacher)
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "class_id_123",
      "title": "Mathematics 101",
      "subject": "Mathematics"
    }
  ]
}
```

---

#### Get Classes Count by Group
```http
GET /api/class/count-by-group?groupBy=status
Authorization: Required (All roles)
```

**Query Parameters:**
- `groupBy` (string): "status", "subject", "teacher", "day"

**Response:**
```json
{
  "success": true,
  "data": {
    "SCHEDULED": 45,
    "IN_PROGRESS": 12,
    "COMPLETED": 103,
    "CANCELLED": 5
  }
}
```

---

#### Get Grouped Classes
```http
GET /api/class/group?groupBy=subject
Authorization: Required (All roles)
```

**Response:**
```json
{
  "success": true,
  "data": {
    "Mathematics": [
      {
        "id": "class_id_123",
        "title": "Mathematics 101"
      }
    ],
    "Physics": [
      {
        "id": "class_id_456",
        "title": "Physics 101"
      }
    ]
  }
}
```

---

#### Get Calendar View Classes
```http
GET /api/class/calander-view?startDate=2024-01-01&endDate=2024-01-31
Authorization: Required (All roles)
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "class_id_123",
      "title": "Mathematics 101",
      "start": "2024-01-01T09:00:00Z",
      "end": "2024-01-01T10:30:00Z",
      "teacher": "Bob Teacher",
      "location": "Room 101"
    }
  ]
}
```

---

#### Get Classes Count
```http
GET /api/class/count?status=SCHEDULED
Authorization: Required (All roles)
```

**Response:**
```json
{
  "success": true,
  "data": 45
}
```

---

#### Get Class by ID
```http
GET /api/class/:id
Authorization: Required (All roles)
```

**Example:**
```http
GET /api/class/class_id_123
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "class_id_123",
    "title": "Mathematics 101",
    "description": "Introduction to Calculus",
    "subject": "Mathematics",
    "status": "SCHEDULED",
    "teacher": {
      "id": "teacher_id_123",
      "name": "Bob Teacher",
      "email": "teacher@example.com"
    },
    "students": [
      {
        "id": "student_id_1",
        "name": "Jane Student",
        "email": "student@example.com"
      }
    ],
    "schedule": {
      "day": "MONDAY",
      "startTime": "09:00",
      "endTime": "10:30"
    },
    "startDate": "2024-01-01",
    "endDate": "2024-06-30",
    "fee": 500,
    "maxStudents": 30,
    "location": "Room 101",
    "createdAt": "2023-12-01T00:00:00Z",
    "updatedAt": "2023-12-01T00:00:00Z"
  }
}
```

---

#### Update Class
```http
PUT /api/class/:id
Authorization: Required (Admin/Moderator/Teacher)
```

**Request Body:**
```json
{
  "title": "Mathematics 101 - Advanced",
  "description": "Advanced Calculus Topics",
  "status": "IN_PROGRESS",
  "maxStudents": 35
}
```

---

#### Delete Class
```http
DELETE /api/class/:id
Authorization: Required (Admin/Moderator/Teacher)
```

**Response:**
```json
{
  "success": true,
  "message": "Class deleted successfully",
  "data": null
}
```

---

## Client API Services

The client-side API services are TypeScript classes that wrap the backend API endpoints with type safety and error handling.

### Base Service

All service classes extend `BaseService<T>` which provides common CRUD operations.

```typescript
import { BaseService } from '@/services/api/base.service';

// Usage example
const service = new BaseService<YourType>('/your-endpoint');

// Available methods:
await service.getAll(params);         // GET /your-endpoint
await service.getById(id);            // GET /your-endpoint/:id
await service.create(data);           // POST /your-endpoint
await service.update(id, data);       // PUT /your-endpoint/:id
await service.patch(id, data);        // PATCH /your-endpoint/:id
await service.delete(id);             // DELETE /your-endpoint/:id
```

---

### Authentication Service

**Location**: `client/src/module/authentication/services/auth.service.ts`

```typescript
import { authService } from '@/module/authentication';

// Login
const response = await authService.login({
  email: 'user@example.com',
  password: 'password123'
});

// Response structure:
// {
//   success: true,
//   data: {
//     user: { id, name, email, role },
//     accessToken: 'jwt_token'
//   }
// }

// Register
await authService.register({
  name: 'John Doe',
  email: 'john@example.com',
  password: 'password123',
  role: 'STUDENT'
});

// Get current user profile
const profile = await authService.getProfile();

// Update profile
await authService.patchProfile({
  name: 'Updated Name'
});

// Logout
await authService.logout();

// Forgot password
await authService.forgotPassword('user@example.com');

// Reset password
await authService.resetPassword('reset_token', 'new_password');
```

**Methods:**
- `setRole(role)`: Switch endpoint based on user role (ADMIN, TEACHER, STUDENT, MODERATOR)
- `login(credentials)`: Authenticate user
- `register(data)`: Register new user
- `logout()`: End user session
- `getProfile()`: Get current user profile
- `patchProfile(data)`: Update user profile (single field)
- `forgotPassword(email)`: Request password reset
- `resetPassword(token, password)`: Reset password with token

---

### Student Service

**Location**: `client/src/module/student/services/student.service.ts`

```typescript
import { studentService } from '@/module/student';

// Get all students with filters
const students = await studentService.getAllStudents({
  page: 1,
  limit: 10,
  search: 'john',
  status: 'ACTIVE',
  orderBy: 'name',
  order: 'asc'
});

// Get student by ID
const student = await studentService.getStudentById('student_id_123');

// Create student (Admin/Moderator only)
await studentService.createStudent({
  name: 'Jane Doe',
  email: 'jane@example.com',
  password: 'password123',
  phone: '+1234567890'
});

// Update student (Admin/Moderator/Teacher)
await studentService.updateStudent('student_id_123', {
  name: 'Jane Updated'
});

// Update own profile (Student)
await studentService.updateOwnProfile({
  name: 'Jane Updated',
  phone: '+0987654321'
});

// Delete student (Admin/Moderator only)
await studentService.deleteStudent('student_id_123');

// Get students for dropdown selection
const studentsForSelect = await studentService.getStudentsForSelection({
  page: 1,
  limit: 50,
  search: 'jane'
});

// Get students with their enrolled classes
const studentsWithClasses = await studentService.getStudentsWithClasses({
  page: 1,
  limit: 10
});

// Get student count statistics
const count = await studentService.getStudentCount({
  status: 'ACTIVE'
});

// Get current student profile (authenticated student)
const myProfile = await studentService.getCurrentStudentProfile();
```

**Filter Options:**
```typescript
interface StudentFilters {
  page?: number;
  limit?: number;
  search?: string;
  status?: 'ACTIVE' | 'INACTIVE';
  orderBy?: string;
  order?: 'asc' | 'desc';
}
```

---

### Teacher Service

**Location**: `client/src/module/teacher/services/teacher.service.ts`

```typescript
import teacherService from '@/module/teacher';

// Get all teachers
const teachers = await teacherService.getAllTeachers({
  page: 1,
  limit: 10,
  search: 'bob',
  status: 'ACTIVE'
});

// Get teacher by ID
const teacher = await teacherService.getTeacherById('teacher_id_123');

// Create teacher (Admin/Moderator only)
await teacherService.createTeacher({
  name: 'Bob Smith',
  email: 'bob@example.com',
  password: 'password123',
  subjects: ['Math', 'Physics'],
  qualification: 'PhD'
});

// Update teacher (Admin/Moderator)
await teacherService.updateTeacher('teacher_id_123', {
  subjects: ['Math', 'Physics', 'Chemistry']
});

// Update own profile (Teacher)
await teacherService.updateOwnProfile({
  qualification: 'PhD in Mathematics'
});

// Delete teacher (Admin/Moderator only)
await teacherService.deleteTeacher('teacher_id_123');

// Get teachers for dropdown
const teachersForSelect = await teacherService.getTeachersForSelection({
  page: 1,
  limit: 50
});

// Get teachers with their classes
const teachersWithClasses = await teacherService.getTeachersWithClasses({
  page: 1,
  limit: 10
});

// Get current teacher profile
const myProfile = await teacherService.getCurrentTeacherProfile();
```

---

### Class Service

**Location**: `client/src/module/classes/services/class.service.ts`

```typescript
import { classService } from '@/module/classes';

// Create class
const newClass = await classService.createClass({
  title: 'Mathematics 101',
  description: 'Introduction to Calculus',
  subject: 'Mathematics',
  teacherId: 'teacher_id_123',
  studentIds: ['student_id_1', 'student_id_2'],
  schedule: {
    day: 'MONDAY',
    startTime: '09:00',
    endTime: '10:30'
  },
  startDate: '2024-01-01',
  endDate: '2024-06-30',
  fee: 500,
  maxStudents: 30,
  location: 'Room 101'
});

// Get all classes with filters
const classes = await classService.getAllClasses({
  page: 1,
  limit: 10,
  status: 'SCHEDULED',
  subject: 'Mathematics',
  teacherId: 'teacher_id_123'
});

// Get class by ID
const classDetail = await classService.getClassById('class_id_123');

// Update class
await classService.updateClass('class_id_123', {
  title: 'Mathematics 101 - Advanced',
  maxStudents: 35
});

// Delete class
await classService.deleteClass('class_id_123');

// Get classes for dropdown
const classesForSelect = await classService.getClassesForSelection({
  page: 1,
  limit: 50
});

// Get class count by group (status, subject, etc.)
const countByStatus = await classService.getClassesCountByGroup({
  groupBy: 'status'
});

// Get grouped classes
const groupedClasses = await classService.getGroupedClasses({
  groupBy: 'subject'
});

// Get classes for calendar view
const calendarClasses = await classService.getCalendarClasses({
  startDate: '2024-01-01',
  endDate: '2024-01-31'
});

// Get total classes count
const totalCount = await classService.getClassesCount({
  status: 'SCHEDULED'
});
```

**Class Filters:**
```typescript
interface ClassFilters {
  page?: number;
  limit?: number;
  search?: string;
  status?: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  subject?: string;
  teacherId?: string;
  studentId?: string;
  startDate?: string;
  endDate?: string;
  orderBy?: string;
  order?: 'asc' | 'desc';
  groupBy?: 'status' | 'subject' | 'teacher' | 'day';
}
```

---

## React Components

### Layout Components

#### Header Component

**Location**: `client/src/components/layout/header/Header.tsx`

```typescript
import AppHeader from '@/components/layout/header/Header';

<AppHeader 
  collapsed={boolean}
  setCollapsed={(collapsed: boolean) => void}
/>
```

**Props:**
```typescript
interface HeaderProps {
  collapsed: boolean;        // Sidebar collapse state
  setCollapsed: (collapsed: boolean) => void;  // Toggle sidebar
}
```

**Features:**
- Toggle sidebar collapse
- Search functionality
- Notifications badge
- Theme switcher (light/dark)
- User profile dropdown with logout

**Usage Example:**
```tsx
function Layout() {
  const [collapsed, setCollapsed] = useState(false);
  
  return (
    <>
      <AppHeader collapsed={collapsed} setCollapsed={setCollapsed} />
      {/* Rest of layout */}
    </>
  );
}
```

---

#### Sidebar Component

**Location**: `client/src/components/layout/sideBar/Sidebar.tsx`

```typescript
import Sidebar from '@/components/layout/sideBar/Sidebar';

<Sidebar collapsed={boolean} />
```

**Props:**
```typescript
interface SidebarProps {
  collapsed: boolean;  // Controls sidebar width
}
```

**Features:**
- Role-based menu items (Admin, Teacher, Student, Moderator)
- Active route highlighting
- Submenu support
- Logout functionality
- Responsive collapsible design

**Menu Configuration:**
```typescript
// Menu items are defined in: client/src/constants/menu.ts
const SIDEBAR_MENU = {
  ADMIN: [...],
  TEACHER: [...],
  STUDENT: [...],
  MODERATOR: [...]
};
```

**Usage Example:**
```tsx
function Layout() {
  const [collapsed, setCollapsed] = useState(false);
  
  return (
    <Layout>
      <Sidebar collapsed={collapsed} />
      <Layout>
        <Header collapsed={collapsed} setCollapsed={setCollapsed} />
        <Content>{/* Page content */}</Content>
      </Layout>
    </Layout>
  );
}
```

---

#### Main Content Component

**Location**: `client/src/components/layout/MainContent.tsx`

```typescript
import MainContent from '@/components/layout/MainContent';

<MainContent>
  {/* Your page content */}
</MainContent>
```

**Props:**
```typescript
interface MainContentProps {
  children: React.ReactNode;
}
```

---

### Page Components

#### Dashboard Components

**StatCard Component**

**Location**: `client/src/pages/dashboard/StatCard.tsx`

```tsx
import StatCard from '@/pages/dashboard/StatCard';

<StatCard
  title="Total Students"
  value={250}
  icon={<UserOutlined />}
  trend={{ value: 12, isPositive: true }}
  color="#1890ff"
/>
```

**Props:**
```typescript
interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: string;
  loading?: boolean;
}
```

---

**RecentActivities Component**

**Location**: `client/src/pages/dashboard/RecentActivities.tsx`

```tsx
import RecentActivities from '@/pages/dashboard/RecentActivities';

<RecentActivities
  activities={[
    {
      id: '1',
      type: 'class_created',
      description: 'New class "Math 101" created',
      timestamp: '2024-01-01T10:00:00Z',
      user: 'Bob Teacher'
    }
  ]}
/>
```

---

**Charts**

**Location**: `client/src/pages/dashboard/charts/`

```tsx
import StudentsPieChart from '@/pages/dashboard/charts/StudentsPieChart';
import ClassesBarChart from '@/pages/dashboard/charts/ClassesBarChart';
import RevenueLineChart from '@/pages/dashboard/charts/RevenueLineChart';

// Students distribution pie chart
<StudentsPieChart data={studentsData} />

// Classes statistics bar chart
<ClassesBarChart data={classesData} />

// Revenue over time line chart
<RevenueLineChart data={revenueData} />
```

---

#### Class Management Components

**ClassListPage**

**Location**: `client/src/pages/class/ClassListPage.tsx`

```tsx
import ClassListPage from '@/pages/class/ClassListPage';

// Automatically handles fetching and displaying classes
<ClassListPage />
```

**Features:**
- List all classes with filters
- Search by title/subject
- Filter by status, teacher, date range
- Pagination
- Quick actions (view, edit, delete)

---

**ClassCreatePage**

**Location**: `client/src/pages/class/ClassCreatePage.tsx`

```tsx
import ClassCreatePage from '@/pages/class/ClassCreatePage';

<ClassCreatePage />
```

**Features:**
- Form to create new class
- Teacher selection dropdown
- Student selection (multi-select)
- Schedule configuration
- Form validation

---

**ClassUpdatePage**

**Location**: `client/src/pages/class/ClassUpdatePage.tsx`

```tsx
import ClassUpdatePage from '@/pages/class/ClassUpdatePage';

<ClassUpdatePage />
```

**Features:**
- Pre-populated form with existing class data
- Update class details
- Manage enrolled students

---

**ClassOverviewPage**

**Location**: `client/src/pages/class/ClassOverviewPage.tsx`

```tsx
import ClassOverviewPage from '@/pages/class/ClassOverviewPage';

<ClassOverviewPage />
```

**Features:**
- View detailed class information
- Student list
- Teacher details
- Schedule information
- Class statistics

---

#### Student Management Components

**StudentsPage**

**Location**: `client/src/pages/Students/StudentsPage.tsx`

```tsx
import StudentsPage from '@/pages/Students/StudentsPage';

<StudentsPage />
```

**Features:**
- List all students with pagination
- Search and filter
- Summary cards (total, active, inactive)
- Export functionality

**Sub-components:**
- `FiltersBar`: Search and filter controls
- `StudentList`: Paginated student table
- `SummaryCards`: Statistics cards

---

#### Authentication Components

**Login Page**

**Location**: `client/src/pages/Login/Login.tsx`

```tsx
import Login from '@/pages/Login/Login';

<Login />
```

**Features:**
- Email and password login
- Role selection (Admin, Teacher, Student)
- Remember me checkbox
- Link to forgot password
- Form validation

---

**ForgotPassword Page**

**Location**: `client/src/pages/ForgotPassword/ForgotPassword.tsx`

```tsx
import ForgotPassword from '@/pages/ForgotPassword/ForgotPassword';

<ForgotPassword />
```

**Features:**
- Email input for password reset
- Back to login link
- Success/error messages

---

#### Profile Page

**Location**: `client/src/pages/Profile/Profile.tsx`

```tsx
import Profile from '@/pages/Profile/Profile';

<Profile />
```

**Features:**
- View current user profile
- Edit profile information
- Update password
- Upload profile picture

---

## Hooks and Utilities

### Custom Hooks

#### useDebounce

**Location**: `client/src/hooks/useDebounce.ts`

```typescript
import { useDebounce } from '@/hooks/useDebounce';

function SearchComponent() {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  
  useEffect(() => {
    // This effect runs only when debounced value changes
    if (debouncedSearchTerm) {
      performSearch(debouncedSearchTerm);
    }
  }, [debouncedSearchTerm]);
  
  return (
    <input 
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
    />
  );
}
```

**Signature:**
```typescript
function useDebounce<T>(value: T, delay?: number): T
```

**Parameters:**
- `value`: The value to debounce
- `delay`: Delay in milliseconds (default: 400ms)

**Returns:**
- Debounced value that updates only after the delay period

**Use Cases:**
- Search input fields
- API calls triggered by user input
- Expensive computations
- Window resize handlers

---

#### useAuth

**Location**: `client/src/module/authentication/hooks/useAuth.ts`

```typescript
import { useAuth, useAuthState, useLogin, useLogout } from '@/module/authentication/hooks/useAuth';

function LoginComponent() {
  const { mutate: login, isLoading } = useLogin();
  const { mutate: logout } = useLogout();
  const { user, isAuthenticated } = useAuthState();
  
  const handleLogin = () => {
    login({
      email: 'user@example.com',
      password: 'password123'
    }, {
      onSuccess: () => {
        console.log('Logged in successfully');
      },
      onError: (error) => {
        console.error('Login failed:', error);
      }
    });
  };
  
  return (
    <div>
      {isAuthenticated ? (
        <>
          <p>Welcome, {user?.name}</p>
          <button onClick={() => logout()}>Logout</button>
        </>
      ) : (
        <button onClick={handleLogin} disabled={isLoading}>
          Login
        </button>
      )}
    </div>
  );
}
```

**Available Hooks:**
- `useAuthState()`: Get current auth state (user, isAuthenticated, role)
- `useLogin()`: React Query mutation for login
- `useLogout()`: React Query mutation for logout
- `useRegister()`: React Query mutation for registration

---

#### useStudents

**Location**: `client/src/module/student/hooks/useStudents.ts`

```typescript
import { useStudents, useStudent, useCreateStudent, useUpdateStudent, useDeleteStudent } from '@/module/student/hooks/useStudents';

function StudentsList() {
  const { data, isLoading, error } = useStudents({
    page: 1,
    limit: 10,
    search: 'john'
  });
  
  const { mutate: createStudent } = useCreateStudent();
  const { mutate: updateStudent } = useUpdateStudent();
  const { mutate: deleteStudent } = useDeleteStudent();
  
  const handleCreate = () => {
    createStudent({
      name: 'New Student',
      email: 'new@example.com',
      password: 'password123'
    }, {
      onSuccess: () => {
        // Refetch students list
      }
    });
  };
  
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  
  return (
    <div>
      {data?.data.map(student => (
        <div key={student.id}>
          <h3>{student.name}</h3>
          <button onClick={() => updateStudent({ id: student.id, name: 'Updated' })}>
            Edit
          </button>
          <button onClick={() => deleteStudent(student.id)}>
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}
```

**Available Hooks:**
- `useStudents(filters)`: Query all students
- `useStudent(id)`: Query single student
- `useCreateStudent()`: Mutation to create student
- `useUpdateStudent()`: Mutation to update student
- `useDeleteStudent()`: Mutation to delete student
- `useStudentsForSelection()`: Query students for dropdowns

---

#### useTeachers

**Location**: `client/src/module/teacher/hooks/useTeachers.ts`

```typescript
import { useTeachers, useTeacher, useCreateTeacher, useUpdateTeacher, useDeleteTeacher } from '@/module/teacher/hooks/useTeachers';

// Similar usage to useStudents
const { data: teachers } = useTeachers({ page: 1, limit: 10 });
const { data: teacher } = useTeacher('teacher_id_123');
```

---

#### useClasses

**Location**: `client/src/module/classes/hooks/useClasses.ts`

```typescript
import { 
  useClasses, 
  useClass, 
  useCreateClass, 
  useUpdateClass, 
  useDeleteClass,
  useCalendarClasses,
  useClassesCount
} from '@/module/classes/hooks/useClasses';

function ClassesCalendar() {
  const { data: calendarClasses } = useCalendarClasses({
    startDate: '2024-01-01',
    endDate: '2024-01-31'
  });
  
  const { data: classesCount } = useClassesCount({
    status: 'SCHEDULED'
  });
  
  return (
    <div>
      <p>Total classes: {classesCount}</p>
      <Calendar events={calendarClasses} />
    </div>
  );
}
```

**Available Hooks:**
- `useClasses(filters)`: Query all classes
- `useClass(id)`: Query single class
- `useCreateClass()`: Mutation to create class
- `useUpdateClass()`: Mutation to update class
- `useDeleteClass()`: Mutation to delete class
- `useClassesForSelection()`: Query for dropdowns
- `useCalendarClasses(dateRange)`: Query for calendar view
- `useClassesCount(filters)`: Get count statistics
- `useGroupedClasses(groupBy)`: Get grouped classes

---

### Utility Functions

#### asyncWrapper

**Location**: `server/src/utils/asyncWrapper.js`

```javascript
import { asyncWrapper } from '../utils';

// Wraps async route handlers to catch errors
export const getUser = asyncWrapper(async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.params.id }
  });
  sendSuccess(res, { data: user });
});
```

**Purpose:**
- Automatically catches async errors
- Forwards errors to error middleware
- Eliminates try-catch boilerplate

---

#### sendSuccess / sendError

**Location**: `server/src/utils/api.response.js`

```javascript
import { sendSuccess, sendError } from '../utils';

// Success response
sendSuccess(res, {
  statusCode: 200,
  message: 'Operation successful',
  data: { id: '123', name: 'John' },
  pagination: {
    page: 1,
    limit: 10,
    total: 100
  }
});

// Error response
sendError(res, new BadRequestError('Invalid input'));
```

**sendSuccess Options:**
```javascript
{
  statusCode: number,    // HTTP status code (default: 200)
  message: string,       // Success message
  data: any,            // Response data
  pagination?: object   // Optional pagination info
}
```

---

#### Custom Error Classes

**Location**: `server/src/utils/custom.error.js`

```javascript
import { BadRequestError, NotFoundError, AuthenticationError, AuthorizationError, ConflictError } from '../utils';

// Usage in controllers
throw new BadRequestError('Email is required');
throw new NotFoundError('User not found');
throw new AuthenticationError('Invalid credentials');
throw new AuthorizationError('Access denied');
throw new ConflictError('Email already exists');
```

**Available Error Classes:**
- `BadRequestError` (400): Invalid request data
- `AuthenticationError` (401): Authentication failed
- `AuthorizationError` (403): Insufficient permissions
- `NotFoundError` (404): Resource not found
- `ConflictError` (409): Data conflict (e.g., duplicate email)
- `ServerError` (500): Internal server error

---

#### Password Utilities

**Location**: `server/src/utils/bcrypt.js`

```javascript
import { hashPassword, comparePassword } from '../utils';

// Hash password before saving
const hashedPassword = await hashPassword('userPassword123');

// Verify password during login
const isMatch = await comparePassword('userPassword123', hashedPassword);
```

---

#### JWT Utilities

**Location**: `server/src/utils/jwt.user.js`

```javascript
import { generateToken } from '../utils';

// Generate JWT token for user
const token = generateToken({
  id: user.id,
  role: user.role,
  email: user.email
});

// Token is automatically verified by auth middleware
```

---

#### Pagination Helper

**Location**: `server/src/utils/pagination.js`

```javascript
import { getPaginationParams, formatPaginationResponse } from '../utils';

// In controller
export const getAllUsers = asyncWrapper(async (req, res) => {
  const { skip, take, page, limit } = getPaginationParams(req.query);
  
  const [users, total] = await Promise.all([
    prisma.user.findMany({ skip, take }),
    prisma.user.count()
  ]);
  
  const pagination = formatPaginationResponse(total, page, limit);
  
  sendSuccess(res, {
    data: users,
    pagination
  });
});
```

---

## State Management

### Zustand Stores

#### Theme Store

**Location**: `client/src/store/themeStore.ts`

```typescript
import useThemeStore from '@/store/themeStore';

function ThemeToggle() {
  const { mode, toggleTheme, setTheme } = useThemeStore();
  
  return (
    <div>
      <p>Current theme: {mode}</p>
      <button onClick={toggleTheme}>Toggle Theme</button>
      <button onClick={() => setTheme('dark')}>Dark Mode</button>
      <button onClick={() => setTheme('light')}>Light Mode</button>
    </div>
  );
}
```

**State:**
```typescript
interface ThemeState {
  mode: 'light' | 'dark';
  toggleTheme: () => void;
  setTheme: (mode: 'light' | 'dark') => void;
}
```

**Features:**
- Persisted in localStorage
- Toggle between light and dark modes
- Set specific theme mode

---

#### Auth Store

**Location**: `client/src/module/authentication/store/authStore.ts`

```typescript
import useAuthStore from '@/module/authentication/store/authStore';

function UserProfile() {
  const { user, isAuthenticated, setUser, clearUser } = useAuthStore();
  
  if (!isAuthenticated) {
    return <div>Please login</div>;
  }
  
  return (
    <div>
      <h1>Welcome, {user.name}</h1>
      <p>Email: {user.email}</p>
      <p>Role: {user.role}</p>
    </div>
  );
}
```

**State:**
```typescript
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User) => void;
  clearUser: () => void;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'TEACHER' | 'STUDENT' | 'MODERATOR';
  profilePicture?: string;
}
```

**Features:**
- Persisted in localStorage
- User authentication state
- Role-based access control

---

#### Student Store

**Location**: `client/src/module/student/store/useStudentStore.ts`

```typescript
import useStudentStore from '@/module/student/store/useStudentStore';

function StudentsList() {
  const { 
    students, 
    selectedStudent, 
    setStudents, 
    setSelectedStudent 
  } = useStudentStore();
  
  return (
    <div>
      {students.map(student => (
        <div 
          key={student.id}
          onClick={() => setSelectedStudent(student)}
        >
          {student.name}
        </div>
      ))}
    </div>
  );
}
```

---

#### Teacher Store

**Location**: `client/src/module/teacher/store/useTeacherStore.ts`

```typescript
import useTeacherStore from '@/module/teacher/store/useTeacherStore';

// Similar usage to Student Store
```

---

#### Class Store

**Location**: `client/src/module/classes/store/useClassStore.ts`

```typescript
import useClassStore from '@/module/classes/store/useClassStore';

// Similar usage to Student Store
```

---

## Authentication Flow

### Complete Authentication Example

```typescript
// 1. Login Flow
import { authService } from '@/module/authentication';
import useAuthStore from '@/module/authentication/store/authStore';

async function handleLogin() {
  try {
    // Call login API
    const response = await authService.login({
      email: 'user@example.com',
      password: 'password123'
    });
    
    // Update auth store
    const { setUser } = useAuthStore.getState();
    setUser(response.data.user);
    
    // Token is automatically stored in HTTP-only cookie
    // by the backend
    
    // Redirect to dashboard
    navigate('/dashboard');
  } catch (error) {
    console.error('Login failed:', error);
  }
}

// 2. Protected Routes
import { Navigate } from 'react-router-dom';
import useAuthStore from '@/module/authentication/store/authStore';

function ProtectedRoute({ children, allowedRoles }) {
  const { isAuthenticated, user } = useAuthStore();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" />;
  }
  
  return children;
}

// Usage
<Route 
  path="/admin" 
  element={
    <ProtectedRoute allowedRoles={['ADMIN']}>
      <AdminDashboard />
    </ProtectedRoute>
  } 
/>

// 3. Auto-authentication on App Load
import { useEffect } from 'react';
import { authService } from '@/module/authentication';
import useAuthStore from '@/module/authentication/store/authStore';

function App() {
  const { setUser, clearUser } = useAuthStore();
  
  useEffect(() => {
    async function checkAuth() {
      try {
        // Attempt to get current user profile
        // If token exists and is valid, this will succeed
        const response = await authService.getProfile();
        setUser(response.data);
      } catch (error) {
        // Token invalid or expired
        clearUser();
      }
    }
    
    checkAuth();
  }, []);
  
  return <AppRouter />;
}

// 4. Logout Flow
async function handleLogout() {
  try {
    await authService.logout();
    
    const { clearUser } = useAuthStore.getState();
    clearUser();
    
    navigate('/login');
  } catch (error) {
    console.error('Logout failed:', error);
  }
}
```

---

## Error Handling

### Client-Side Error Handling

```typescript
// 1. Using React Query
import { useQuery } from '@tanstack/react-query';
import { studentService } from '@/module/student';

function StudentsList() {
  const { data, error, isLoading, isError } = useQuery({
    queryKey: ['students'],
    queryFn: () => studentService.getAllStudents(),
    retry: 2,
    onError: (error) => {
      console.error('Failed to fetch students:', error);
      // Show toast notification
    }
  });
  
  if (isLoading) return <Spin />;
  
  if (isError) {
    return (
      <Alert 
        type="error" 
        message="Error" 
        description={error.message} 
      />
    );
  }
  
  return <div>{/* Render students */}</div>;
}

// 2. Using Try-Catch with Async/Await
async function createStudent(data) {
  try {
    const response = await studentService.createStudent(data);
    
    // Success notification
    message.success('Student created successfully');
    
    return response.data;
  } catch (error) {
    // Error is automatically structured by the API
    if (error.response?.data?.error) {
      const { type, message: errorMessage } = error.response.data.error;
      
      switch (type) {
        case 'validation_error':
          message.error('Please check your input');
          break;
        case 'conflict_error':
          message.error('Student already exists');
          break;
        default:
          message.error(errorMessage || 'An error occurred');
      }
    } else {
      message.error('Network error. Please try again.');
    }
    
    throw error;
  }
}

// 3. Global Error Handler (Axios Interceptor)
import axios from 'axios';
import { message } from 'antd';

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status, data } = error.response;
      
      // Handle common error statuses
      switch (status) {
        case 401:
          message.error('Please login to continue');
          // Redirect to login
          break;
        case 403:
          message.error('You do not have permission');
          break;
        case 404:
          message.error('Resource not found');
          break;
        case 500:
          message.error('Server error. Please try again later.');
          break;
        default:
          message.error(data?.error?.message || 'An error occurred');
      }
    } else if (error.request) {
      message.error('Network error. Please check your connection.');
    } else {
      message.error('An unexpected error occurred');
    }
    
    return Promise.reject(error);
  }
);
```

---

### Server-Side Error Handling

```javascript
// 1. Controller Error Handling (with asyncWrapper)
import { asyncWrapper, BadRequestError, NotFoundError } from '../utils';

export const getStudent = asyncWrapper(async (req, res) => {
  const { id } = req.params;
  
  // Validation errors
  if (!id) {
    throw new BadRequestError('Student ID is required');
  }
  
  const student = await prisma.student.findUnique({
    where: { id }
  });
  
  // Not found errors
  if (!student) {
    throw new NotFoundError('Student not found');
  }
  
  sendSuccess(res, {
    message: 'Student fetched successfully',
    data: student
  });
});

// 2. Validation Middleware
import { validate } from '../middleware/validate.middleware';
import { studentSchema } from '../validation';

router.post(
  '/create',
  validate(studentSchema, (req) => req.body),
  createStudent
);

// If validation fails, middleware throws ValidationError
// which is caught by error middleware

// 3. Authentication Middleware
import auth from '../middleware/auth';

// If token is missing or invalid, throws AuthenticationError
router.get('/me', auth, getProfile);

// 4. Role-Based Authorization Middleware
import { hasRole } from '../middleware/roleCheck';

// If user doesn't have required role, throws AuthorizationError
router.get('/admin-only', auth, hasRole(['ADMIN']), adminOnlyRoute);

// 5. Global Error Middleware
// Location: server/src/middleware/error.middleware.js

export default function errorHandler(err, req, res, next) {
  // All errors are caught here and formatted consistently
  sendError(res, err);
}
```

---

## Best Practices

### API Usage

1. **Always use React Query for data fetching:**
```typescript
// Good
const { data } = useQuery({
  queryKey: ['students', filters],
  queryFn: () => studentService.getAllStudents(filters)
});

// Avoid
useEffect(() => {
  studentService.getAllStudents().then(setStudents);
}, []);
```

2. **Use optimistic updates for better UX:**
```typescript
const { mutate } = useMutation({
  mutationFn: studentService.updateStudent,
  onMutate: async (newData) => {
    // Optimistically update the cache
    queryClient.setQueryData(['student', id], newData);
  },
  onError: (err, newData, context) => {
    // Rollback on error
    queryClient.setQueryData(['student', id], context.previousData);
  }
});
```

3. **Implement proper loading and error states:**
```typescript
if (isLoading) return <Spin size="large" />;
if (isError) return <Alert type="error" message={error.message} />;
return <div>{/* Render data */}</div>;
```

4. **Use debouncing for search inputs:**
```typescript
const [search, setSearch] = useState('');
const debouncedSearch = useDebounce(search, 500);

const { data } = useQuery({
  queryKey: ['students', debouncedSearch],
  queryFn: () => studentService.getAllStudents({ search: debouncedSearch })
});
```

5. **Implement pagination consistently:**
```typescript
const [page, setPage] = useState(1);
const [limit, setLimit] = useState(10);

const { data } = useQuery({
  queryKey: ['students', page, limit],
  queryFn: () => studentService.getAllStudents({ page, limit }),
  keepPreviousData: true // Smooth pagination
});
```

---

## Appendix

### Common Query Parameters

| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| page | number | Page number (1-indexed) | `?page=1` |
| limit | number | Items per page | `?limit=10` |
| search | string | Search term | `?search=john` |
| orderBy | string | Sort field | `?orderBy=name` |
| order | string | Sort direction (asc/desc) | `?order=asc` |
| status | string | Filter by status | `?status=ACTIVE` |
| startDate | string | Filter from date (ISO 8601) | `?startDate=2024-01-01` |
| endDate | string | Filter to date (ISO 8601) | `?endDate=2024-12-31` |

### HTTP Status Codes

| Code | Meaning | When Used |
|------|---------|-----------|
| 200 | OK | Successful GET, PUT, PATCH |
| 201 | Created | Successful POST |
| 400 | Bad Request | Validation errors, invalid input |
| 401 | Unauthorized | Missing or invalid authentication |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource doesn't exist |
| 409 | Conflict | Duplicate resource (e.g., email) |
| 500 | Internal Server Error | Server-side error |

### User Roles and Permissions

| Role | Permissions |
|------|-------------|
| ADMIN | Full access to all resources |
| MODERATOR | Manage students, teachers, and classes |
| TEACHER | Manage own classes, view students |
| STUDENT | View own profile, view enrolled classes |

---

## Support

For questions or issues:
- Check the error message and type in the API response
- Review the example code in this documentation
- Verify authentication and role permissions
- Check network requests in browser DevTools

---

**Last Updated**: 2024-01-01
**Version**: 1.0.0
