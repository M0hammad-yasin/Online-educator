# Hooks and Utilities Guide

## Table of Contents
1. [Custom Hooks](#custom-hooks)
2. [React Query Hooks](#react-query-hooks)
3. [Utility Functions](#utility-functions)
4. [State Management](#state-management)
5. [Validation Schemas](#validation-schemas)

---

## Custom Hooks

### useDebounce

**File**: `client/src/hooks/useDebounce.ts`

Delays updating a value until after a specified delay has elapsed since the last change.

#### Signature

```typescript
function useDebounce<T>(value: T, delay?: number): T
```

#### Parameters

- `value` (T): The value to debounce
- `delay` (number, optional): Delay in milliseconds (default: 400)

#### Returns

- (T): The debounced value

#### Usage Examples

**Basic Search Implementation:**

```typescript
import { useDebounce } from '@/hooks/useDebounce';
import { useState, useEffect } from 'react';

function SearchComponent() {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    if (debouncedSearchTerm) {
      // This will only trigger 500ms after user stops typing
      performSearch(debouncedSearchTerm);
    }
  }, [debouncedSearchTerm]);

  return (
    <Input
      placeholder="Search..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
    />
  );
}
```

**With React Query:**

```typescript
function StudentSearch() {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 500);

  const { data, isLoading } = useQuery({
    queryKey: ['students', debouncedSearch],
    queryFn: () => studentService.getAllStudents({ search: debouncedSearch }),
    enabled: debouncedSearch.length > 0
  });

  return (
    <div>
      <Input value={search} onChange={(e) => setSearch(e.target.value)} />
      {isLoading && <Spin />}
      {data && <StudentList students={data.data} />}
    </div>
  );
}
```

**Window Resize Handler:**

```typescript
function ResponsiveComponent() {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const debouncedWidth = useDebounce(windowWidth, 200);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    // This only runs 200ms after user stops resizing
    console.log('Width stabilized at:', debouncedWidth);
  }, [debouncedWidth]);

  return <div>Window width: {debouncedWidth}px</div>;
}
```

---

## React Query Hooks

### Authentication Hooks

**File**: `client/src/module/authentication/hooks/useAuth.ts`

#### useAuthState

Get current authentication state.

```typescript
function useAuthState() {
  const { user, isAuthenticated } = useAuthStore();
  return { user, isAuthenticated };
}

// Usage
function MyComponent() {
  const { user, isAuthenticated } = useAuthState();
  
  if (!isAuthenticated) {
    return <div>Please log in</div>;
  }
  
  return <div>Welcome, {user.name}!</div>;
}
```

---

#### useLogin

React Query mutation for user login.

```typescript
function useLogin() {
  return useMutation({
    mutationFn: (credentials) => authService.login(credentials),
    onSuccess: (data) => {
      // Automatically updates auth store
      useAuthStore.getState().setUser(data.data.user);
    }
  });
}

// Usage
function LoginForm() {
  const { mutate: login, isLoading, error } = useLogin();

  const handleSubmit = (values) => {
    login(
      {
        email: values.email,
        password: values.password
      },
      {
        onSuccess: () => {
          message.success('Login successful!');
          navigate('/dashboard');
        },
        onError: (error) => {
          message.error(error.message);
        }
      }
    );
  };

  return (
    <Form onFinish={handleSubmit}>
      <Form.Item name="email">
        <Input placeholder="Email" />
      </Form.Item>
      <Form.Item name="password">
        <Input.Password placeholder="Password" />
      </Form.Item>
      <Button type="primary" htmlType="submit" loading={isLoading}>
        Login
      </Button>
      {error && <Alert type="error" message={error.message} />}
    </Form>
  );
}
```

---

#### useLogout

React Query mutation for user logout.

```typescript
function useLogout() {
  return useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      useAuthStore.getState().clearUser();
    }
  });
}

// Usage
function LogoutButton() {
  const { mutate: logout, isLoading } = useLogout();

  const handleLogout = () => {
    logout(undefined, {
      onSuccess: () => {
        message.success('Logged out successfully');
        navigate('/login');
      }
    });
  };

  return (
    <Button onClick={handleLogout} loading={isLoading}>
      Logout
    </Button>
  );
}
```

---

#### useRegister

React Query mutation for user registration.

```typescript
// Usage
function RegisterForm() {
  const { mutate: register, isLoading } = useRegister();

  const handleSubmit = (values) => {
    register(values, {
      onSuccess: () => {
        message.success('Registration successful!');
        navigate('/login');
      }
    });
  };

  return <Form onFinish={handleSubmit}>{/* Form fields */}</Form>;
}
```

---

### Student Hooks

**File**: `client/src/module/student/hooks/useStudents.ts`

#### useStudents

Query all students with filters.

```typescript
function useStudents(filters?: StudentFilters) {
  return useQuery({
    queryKey: ['students', filters],
    queryFn: () => studentService.getAllStudents(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Usage
function StudentsList() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 500);

  const { data, isLoading, error } = useStudents({
    page,
    limit: 10,
    search: debouncedSearch,
    status: 'ACTIVE',
    orderBy: 'name',
    order: 'asc'
  });

  if (isLoading) return <Spin />;
  if (error) return <Alert type="error" message={error.message} />;

  return (
    <div>
      <Input 
        placeholder="Search students..." 
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <Table 
        dataSource={data.data}
        pagination={{
          current: page,
          total: data.pagination.total,
          onChange: setPage
        }}
      />
    </div>
  );
}
```

---

#### useStudent

Query a single student by ID.

```typescript
function useStudent(id: string) {
  return useQuery({
    queryKey: ['student', id],
    queryFn: () => studentService.getStudentById(id),
    enabled: !!id,
  });
}

// Usage
function StudentDetail() {
  const { id } = useParams();
  const { data: student, isLoading } = useStudent(id);

  if (isLoading) return <Spin />;

  return (
    <Card>
      <h2>{student.data.name}</h2>
      <p>Email: {student.data.email}</p>
      <p>Status: {student.data.status}</p>
    </Card>
  );
}
```

---

#### useCreateStudent

Mutation to create a new student.

```typescript
function useCreateStudent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => studentService.createStudent(data),
    onSuccess: () => {
      // Invalidate and refetch students list
      queryClient.invalidateQueries({ queryKey: ['students'] });
    }
  });
}

// Usage
function CreateStudentForm() {
  const { mutate: createStudent, isLoading } = useCreateStudent();

  const handleSubmit = (values) => {
    createStudent(values, {
      onSuccess: (data) => {
        message.success('Student created successfully');
        navigate(`/students/${data.data.id}`);
      },
      onError: (error) => {
        message.error(error.message);
      }
    });
  };

  return (
    <Form onFinish={handleSubmit}>
      <Form.Item name="name" label="Name" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
        <Input />
      </Form.Item>
      <Form.Item name="password" label="Password" rules={[{ required: true, min: 6 }]}>
        <Input.Password />
      </Form.Item>
      <Button type="primary" htmlType="submit" loading={isLoading}>
        Create Student
      </Button>
    </Form>
  );
}
```

---

#### useUpdateStudent

Mutation to update a student.

```typescript
function useUpdateStudent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => studentService.updateStudent(id, data),
    onMutate: async ({ id, data }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['student', id] });

      // Snapshot previous value
      const previousStudent = queryClient.getQueryData(['student', id]);

      // Optimistically update
      queryClient.setQueryData(['student', id], (old) => ({
        ...old,
        data: { ...old.data, ...data }
      }));

      return { previousStudent };
    },
    onError: (err, { id }, context) => {
      // Rollback on error
      queryClient.setQueryData(['student', id], context.previousStudent);
    },
    onSettled: (data, error, { id }) => {
      // Refetch after error or success
      queryClient.invalidateQueries({ queryKey: ['student', id] });
      queryClient.invalidateQueries({ queryKey: ['students'] });
    }
  });
}

// Usage with optimistic updates
function EditStudentForm({ studentId }) {
  const { data: student } = useStudent(studentId);
  const { mutate: updateStudent, isLoading } = useUpdateStudent();

  const handleSubmit = (values) => {
    updateStudent(
      { id: studentId, data: values },
      {
        onSuccess: () => {
          message.success('Student updated');
        }
      }
    );
  };

  return (
    <Form initialValues={student?.data} onFinish={handleSubmit}>
      {/* Form fields */}
    </Form>
  );
}
```

---

#### useDeleteStudent

Mutation to delete a student.

```typescript
function useDeleteStudent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => studentService.deleteStudent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
    }
  });
}

// Usage with confirmation
function DeleteStudentButton({ studentId, studentName }) {
  const { mutate: deleteStudent, isLoading } = useDeleteStudent();

  const handleDelete = () => {
    Modal.confirm({
      title: 'Delete Student',
      content: `Are you sure you want to delete ${studentName}?`,
      okText: 'Delete',
      okType: 'danger',
      onOk: () => {
        deleteStudent(studentId, {
          onSuccess: () => {
            message.success('Student deleted successfully');
          },
          onError: (error) => {
            message.error(error.message);
          }
        });
      }
    });
  };

  return (
    <Button danger onClick={handleDelete} loading={isLoading}>
      Delete
    </Button>
  );
}
```

---

#### useStudentsForSelection

Query students for dropdown/select components.

```typescript
function useStudentsForSelection(filters?: StudentFilters) {
  return useQuery({
    queryKey: ['students', 'selection', filters],
    queryFn: () => studentService.getStudentsForSelection(filters),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Usage
function StudentSelect({ value, onChange }) {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);

  const { data, isLoading } = useStudentsForSelection({
    search: debouncedSearch,
    limit: 50
  });

  return (
    <Select
      showSearch
      value={value}
      onChange={onChange}
      loading={isLoading}
      onSearch={setSearch}
      filterOption={false}
      options={data?.data.map(student => ({
        label: student.name,
        value: student.id
      }))}
    />
  );
}
```

---

### Teacher Hooks

**File**: `client/src/module/teacher/hooks/useTeachers.ts`

Similar to Student Hooks:

- `useTeachers(filters)`: Query all teachers
- `useTeacher(id)`: Query single teacher
- `useCreateTeacher()`: Create teacher mutation
- `useUpdateTeacher()`: Update teacher mutation
- `useDeleteTeacher()`: Delete teacher mutation
- `useTeachersForSelection()`: Query for dropdowns

**Example:**

```typescript
function TeachersList() {
  const { data, isLoading } = useTeachers({ page: 1, limit: 10 });
  
  return (
    <Table 
      dataSource={data?.data}
      loading={isLoading}
      columns={teacherColumns}
    />
  );
}
```

---

### Class Hooks

**File**: `client/src/module/classes/hooks/useClasses.ts`

#### useClasses

Query all classes with filters.

```typescript
function useClasses(filters?: ClassFilters) {
  return useQuery({
    queryKey: ['classes', filters],
    queryFn: () => classService.getAllClasses(filters)
  });
}

// Usage
function ClassesList() {
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    status: 'SCHEDULED'
  });

  const { data, isLoading } = useClasses(filters);

  return (
    <div>
      <Select 
        value={filters.status}
        onChange={(status) => setFilters({ ...filters, status })}
      >
        <Option value="SCHEDULED">Scheduled</Option>
        <Option value="IN_PROGRESS">In Progress</Option>
        <Option value="COMPLETED">Completed</Option>
        <Option value="CANCELLED">Cancelled</Option>
      </Select>
      <Table dataSource={data?.data} loading={isLoading} />
    </div>
  );
}
```

---

#### useCalendarClasses

Query classes for calendar view.

```typescript
function useCalendarClasses(dateRange: { startDate: string; endDate: string }) {
  return useQuery({
    queryKey: ['classes', 'calendar', dateRange],
    queryFn: () => classService.getCalendarClasses(dateRange),
    enabled: !!dateRange.startDate && !!dateRange.endDate
  });
}

// Usage
function ClassCalendar() {
  const [dateRange, setDateRange] = useState({
    startDate: '2024-01-01',
    endDate: '2024-01-31'
  });

  const { data: classes, isLoading } = useCalendarClasses(dateRange);

  return (
    <Calendar
      events={classes?.data.map(cls => ({
        id: cls.id,
        title: cls.title,
        start: cls.start,
        end: cls.end,
        resource: cls
      }))}
      onNavigate={(date) => {
        // Update date range when calendar navigates
      }}
    />
  );
}
```

---

#### useClassesCount

Get total count of classes with filters.

```typescript
function useClassesCount(filters?: ClassFilters) {
  return useQuery({
    queryKey: ['classes', 'count', filters],
    queryFn: () => classService.getClassesCount(filters)
  });
}

// Usage
function ClassStatistics() {
  const { data: scheduledCount } = useClassesCount({ status: 'SCHEDULED' });
  const { data: completedCount } = useClassesCount({ status: 'COMPLETED' });
  const { data: totalCount } = useClassesCount();

  return (
    <div>
      <StatCard title="Scheduled" value={scheduledCount?.data || 0} />
      <StatCard title="Completed" value={completedCount?.data || 0} />
      <StatCard title="Total" value={totalCount?.data || 0} />
    </div>
  );
}
```

---

#### useGroupedClasses

Get classes grouped by a field.

```typescript
function useGroupedClasses(groupBy: 'status' | 'subject' | 'teacher') {
  return useQuery({
    queryKey: ['classes', 'grouped', groupBy],
    queryFn: () => classService.getGroupedClasses({ groupBy })
  });
}

// Usage
function ClassesBySubject() {
  const { data: groupedClasses } = useGroupedClasses('subject');

  return (
    <div>
      {Object.entries(groupedClasses?.data || {}).map(([subject, classes]) => (
        <div key={subject}>
          <h3>{subject}</h3>
          <List
            dataSource={classes}
            renderItem={(cls) => (
              <List.Item>
                <a href={`/classes/${cls.id}`}>{cls.title}</a>
              </List.Item>
            )}
          />
        </div>
      ))}
    </div>
  );
}
```

---

## Utility Functions

### Server-Side Utilities

#### asyncWrapper

**File**: `server/src/utils/asyncWrapper.js`

Wraps async route handlers to automatically catch errors.

```javascript
import { asyncWrapper } from '../utils';

// Without asyncWrapper
export const getUser = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.params.id } });
    sendSuccess(res, { data: user });
  } catch (error) {
    next(error);
  }
};

// With asyncWrapper (cleaner)
export const getUser = asyncWrapper(async (req, res) => {
  const user = await prisma.user.findUnique({ where: { id: req.params.id } });
  sendSuccess(res, { data: user });
});
```

---

#### sendSuccess / sendError

**File**: `server/src/utils/api.response.js`

Standardized response formatters.

```javascript
import { sendSuccess, sendError } from '../utils';

// Success response
export const getUsers = asyncWrapper(async (req, res) => {
  const users = await prisma.user.findMany();
  
  sendSuccess(res, {
    statusCode: 200,
    message: 'Users fetched successfully',
    data: users,
    pagination: {
      page: 1,
      limit: 10,
      total: users.length,
      totalPages: Math.ceil(users.length / 10)
    }
  });
});

// Error response (usually in error middleware)
export default function errorHandler(err, req, res, next) {
  sendError(res, err);
}
```

---

#### Custom Error Classes

**File**: `server/src/utils/custom.error.js`

```javascript
import { 
  BadRequestError, 
  NotFoundError, 
  AuthenticationError,
  AuthorizationError,
  ConflictError 
} from '../utils';

export const getUser = asyncWrapper(async (req, res) => {
  const { id } = req.params;
  
  if (!id) {
    throw new BadRequestError('User ID is required');
  }
  
  const user = await prisma.user.findUnique({ where: { id } });
  
  if (!user) {
    throw new NotFoundError('User not found');
  }
  
  sendSuccess(res, { data: user });
});

export const updateUser = asyncWrapper(async (req, res) => {
  const { email } = req.body;
  
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new ConflictError('Email already exists');
  }
  
  // Update user...
});
```

---

#### Password Utilities

**File**: `server/src/utils/bcrypt.js`

```javascript
import { hashPassword, comparePassword } from '../utils';

// Hash password before storing
export const registerUser = asyncWrapper(async (req, res) => {
  const hashedPassword = await hashPassword(req.body.password);
  
  const user = await prisma.user.create({
    data: {
      ...req.body,
      passwordHash: hashedPassword
    }
  });
  
  sendSuccess(res, { data: user });
});

// Compare password during login
export const loginUser = asyncWrapper(async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { email: req.body.email }
  });
  
  if (!user) {
    throw new BadRequestError('Invalid credentials');
  }
  
  const isMatch = await comparePassword(req.body.password, user.passwordHash);
  
  if (!isMatch) {
    throw new BadRequestError('Invalid credentials');
  }
  
  // Generate token and send response...
});
```

---

#### JWT Utilities

**File**: `server/src/utils/jwt.user.js`

```javascript
import { generateToken } from '../utils';

export const loginUser = asyncWrapper(async (req, res) => {
  const user = await authenticateUser(req.body);
  
  const token = generateToken({
    userId: user.id,
    role: user.role,
    email: user.email
  });
  
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  });
  
  sendSuccess(res, {
    data: {
      user,
      accessToken: token
    }
  });
});
```

---

#### Pagination Helpers

**File**: `server/src/utils/pagination.js`

```javascript
import { getPaginationParams, formatPaginationResponse } from '../utils';

export const getUsers = asyncWrapper(async (req, res) => {
  // Extract pagination params from query
  const { skip, take, page, limit } = getPaginationParams(req.query);
  
  // Fetch data and count
  const [users, total] = await Promise.all([
    prisma.user.findMany({
      skip,
      take,
      orderBy: { createdAt: 'desc' }
    }),
    prisma.user.count()
  ]);
  
  // Format pagination response
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

**File**: `client/src/store/themeStore.ts`

```typescript
import useThemeStore from '@/store/themeStore';

// Get current theme
const theme = useThemeStore(state => state.mode);

// Toggle theme
const toggleTheme = useThemeStore(state => state.toggleTheme);

// Set specific theme
const setTheme = useThemeStore(state => state.setTheme);

// Usage in component
function ThemeToggle() {
  const { mode, toggleTheme, setTheme } = useThemeStore();
  
  return (
    <div>
      <p>Current: {mode}</p>
      <Button onClick={toggleTheme}>Toggle</Button>
      <Button onClick={() => setTheme('dark')}>Dark</Button>
      <Button onClick={() => setTheme('light')}>Light</Button>
    </div>
  );
}
```

---

#### Auth Store

**File**: `client/src/module/authentication/store/authStore.ts`

```typescript
import useAuthStore from '@/module/authentication/store/authStore';

// Get auth state
const { user, isAuthenticated } = useAuthStore();

// Set user (after login)
useAuthStore.getState().setUser(userData);

// Clear user (after logout)
useAuthStore.getState().clearUser();

// Usage in component
function UserProfile() {
  const { user, isAuthenticated, setUser, clearUser } = useAuthStore();
  
  if (!isAuthenticated) {
    return <Redirect to="/login" />;
  }
  
  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
      <p>Role: {user.role}</p>
      <Button onClick={clearUser}>Logout</Button>
    </div>
  );
}

// Selector pattern (re-renders only when user changes)
function UserName() {
  const userName = useAuthStore(state => state.user?.name);
  return <span>{userName}</span>;
}
```

---

#### Module Stores

**Student Store** (`client/src/module/student/store/useStudentStore.ts`)

```typescript
import useStudentStore from '@/module/student/store/useStudentStore';

function StudentsList() {
  const { students, selectedStudent, setStudents, setSelectedStudent } = useStudentStore();
  
  return (
    <div>
      {students.map(student => (
        <Card 
          key={student.id}
          onClick={() => setSelectedStudent(student)}
          style={{ 
            border: selectedStudent?.id === student.id ? '2px solid blue' : 'none' 
          }}
        >
          {student.name}
        </Card>
      ))}
    </div>
  );
}
```

---

## Validation Schemas

### Server-Side Validation (Zod)

**Files**: `server/src/validation/*.js`

```javascript
// Student validation schema
import { z } from 'zod';

export const studentSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  phone: z.string().optional(),
  address: z.string().optional(),
  dateOfBirth: z.string().optional()
});

export const studentUpdateSchema = studentSchema.partial();

// Usage in route
import { validate } from '../middleware/validate.middleware';
import { studentSchema } from '../validation';

router.post(
  '/create',
  validate(studentSchema, (req) => req.body),
  createStudent
);
```

**Available Schemas:**
- `emailSchema`: Email validation
- `passwordSchema`: Password validation
- `paginationSchema`: Pagination params
- `mongoIdSchema`: MongoDB ObjectId validation
- `loginSchema`: Login credentials
- `studentSchema`: Student data validation
- `teacherSchema`: Teacher data validation
- `classSchema`: Class data validation
- `adminSchema`: Admin data validation
- `accessControlSchema`: Access control settings

---

### Client-Side Validation (Ant Design Form)

```typescript
import { Form, Input, Button } from 'antd';

function CreateStudentForm() {
  const [form] = Form.useForm();

  const handleSubmit = (values) => {
    createStudent(values);
  };

  return (
    <Form form={form} onFinish={handleSubmit}>
      <Form.Item
        name="name"
        label="Name"
        rules={[
          { required: true, message: 'Name is required' },
          { min: 2, message: 'Name must be at least 2 characters' }
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="email"
        label="Email"
        rules={[
          { required: true, message: 'Email is required' },
          { type: 'email', message: 'Invalid email address' }
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="password"
        label="Password"
        rules={[
          { required: true, message: 'Password is required' },
          { min: 6, message: 'Password must be at least 6 characters' }
        ]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item
        name="confirmPassword"
        label="Confirm Password"
        dependencies={['password']}
        rules={[
          { required: true, message: 'Please confirm password' },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('password') === value) {
                return Promise.resolve();
              }
              return Promise.reject('Passwords do not match');
            }
          })
        ]}
      >
        <Input.Password />
      </Form.Item>

      <Button type="primary" htmlType="submit">
        Create
      </Button>
    </Form>
  );
}
```

---

## Best Practices

### 1. Hook Composition

```typescript
// Custom hook that combines multiple hooks
function useStudentManagement() {
  const [filters, setFilters] = useState({ page: 1, limit: 10 });
  const { data, isLoading } = useStudents(filters);
  const { mutate: createStudent } = useCreateStudent();
  const { mutate: updateStudent } = useUpdateStudent();
  const { mutate: deleteStudent } = useDeleteStudent();

  return {
    students: data?.data,
    pagination: data?.pagination,
    isLoading,
    filters,
    setFilters,
    createStudent,
    updateStudent,
    deleteStudent
  };
}

// Usage
function StudentsPage() {
  const {
    students,
    pagination,
    isLoading,
    filters,
    setFilters,
    createStudent,
    updateStudent,
    deleteStudent
  } = useStudentManagement();

  return <div>{/* Use all the exposed values and functions */}</div>;
}
```

---

### 2. Optimistic Updates

```typescript
function useOptimisticUpdate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateFunction,
    onMutate: async (newData) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['data'] });
      
      // Snapshot previous value
      const previous = queryClient.getQueryData(['data']);
      
      // Optimistically update
      queryClient.setQueryData(['data'], (old) => ({
        ...old,
        ...newData
      }));
      
      return { previous };
    },
    onError: (err, newData, context) => {
      // Rollback on error
      queryClient.setQueryData(['data'], context.previous);
    },
    onSettled: () => {
      // Refetch after error or success
      queryClient.invalidateQueries({ queryKey: ['data'] });
    }
  });
}
```

---

### 3. Parallel Queries

```typescript
function useStudentDetails(studentId: string) {
  const studentQuery = useStudent(studentId);
  const classesQuery = useQuery({
    queryKey: ['student', studentId, 'classes'],
    queryFn: () => getStudentClasses(studentId)
  });
  const gradesQuery = useQuery({
    queryKey: ['student', studentId, 'grades'],
    queryFn: () => getStudentGrades(studentId)
  });

  return {
    student: studentQuery.data,
    classes: classesQuery.data,
    grades: gradesQuery.data,
    isLoading: studentQuery.isLoading || classesQuery.isLoading || gradesQuery.isLoading
  };
}
```

---

### 4. Error Handling

```typescript
function useStudentWithErrorHandling(id: string) {
  return useQuery({
    queryKey: ['student', id],
    queryFn: () => studentService.getStudentById(id),
    retry: 2,
    onError: (error) => {
      if (error.response?.status === 404) {
        message.error('Student not found');
      } else {
        message.error('Failed to load student');
      }
    }
  });
}
```

---

**Last Updated**: 2024-01-01
**Version**: 1.0.0
