# React Components Guide

## Table of Contents
1. [Layout Components](#layout-components)
2. [Page Components](#page-components)
3. [Form Components](#form-components)
4. [Component Patterns](#component-patterns)
5. [Styling Guidelines](#styling-guidelines)

---

## Layout Components

### AppHeader

**File**: `client/src/components/layout/header/Header.tsx`

The main header component that appears at the top of all authenticated pages.

#### Props

```typescript
interface HeaderProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}
```

#### Features

- **Sidebar Toggle**: Controls the collapse/expand state of the sidebar
- **Search Bar**: Global search functionality (placeholder)
- **Notifications**: Bell icon with badge count
- **Theme Switcher**: Toggle between light and dark modes
- **User Menu**: Profile dropdown with logout option

#### Usage Example

```tsx
import AppHeader from '@/components/layout/header/Header';
import { useState } from 'react';

function MainLayout() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Layout>
      <Sidebar collapsed={collapsed} />
      <Layout>
        <AppHeader collapsed={collapsed} setCollapsed={setCollapsed} />
        <Content>
          {/* Your page content */}
        </Content>
      </Layout>
    </Layout>
  );
}
```

#### Customization

**Change notification count:**
```tsx
// In Header.tsx, line 94
<Badge count={5} size="small">  // Change from 1 to your count
  <Button type="text" icon={<BellOutlined />} />
</Badge>
```

**Customize search bar:**
```tsx
// Add onSearch handler
<Input
  prefix={<SearchOutlined />}
  placeholder="Search for something"
  onSearch={(value) => handleSearch(value)}
  style={{ width: 250 }}
/>
```

---

### Sidebar

**File**: `client/src/components/layout/sideBar/Sidebar.tsx`

The navigation sidebar that displays role-based menu items.

#### Props

```typescript
interface SidebarProps {
  collapsed: boolean;
}
```

#### Features

- **Role-Based Menu**: Different menus for Admin, Teacher, Student, Moderator
- **Active Highlighting**: Automatically highlights current route
- **Nested Menus**: Support for submenus
- **Responsive**: Collapsible for mobile views
- **Logout Integration**: Built-in logout functionality

#### Usage Example

```tsx
import Sidebar from '@/components/layout/sideBar/Sidebar';

function MainLayout() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Layout>
      <Sidebar collapsed={collapsed} />
      <Layout>
        {/* Content */}
      </Layout>
    </Layout>
  );
}
```

#### Menu Configuration

Menu items are configured in `client/src/constants/menu.ts`:

```typescript
const SIDEBAR_MENU = {
  ADMIN: [
    {
      key: 1,
      label: 'Dashboard',
      path: '/dashboard',
      icon: 'DashboardOutlined'
    },
    {
      key: 2,
      label: 'Users',
      icon: 'UserOutlined',
      children: [
        {
          key: 21,
          label: 'Students',
          path: '/students'
        },
        {
          key: 22,
          label: 'Teachers',
          path: '/teachers'
        }
      ]
    }
  ],
  TEACHER: [...],
  STUDENT: [...],
  MODERATOR: [...]
};
```

#### Adding New Menu Items

1. Open `client/src/constants/menu.ts`
2. Add to the appropriate role array:

```typescript
{
  key: 3,
  label: 'Reports',
  path: '/reports',
  icon: 'FileOutlined'
}
```

3. Import the icon in `Sidebar.tsx`:

```typescript
import { FileOutlined } from '@ant-design/icons';

const iconMap = {
  // ... existing icons
  FileOutlined
};
```

---

### MainContent

**File**: `client/src/components/layout/MainContent.tsx`

A wrapper component for page content with consistent padding and styling.

#### Props

```typescript
interface MainContentProps {
  children: React.ReactNode;
}
```

#### Usage Example

```tsx
import MainContent from '@/components/layout/MainContent';

function DashboardPage() {
  return (
    <MainContent>
      <h1>Dashboard</h1>
      <StatCards />
      <Charts />
    </MainContent>
  );
}
```

---

## Page Components

### Dashboard Components

#### StatCard

**File**: `client/src/pages/dashboard/StatCard.tsx`

Displays a single statistic with icon, value, and optional trend indicator.

##### Props

```typescript
interface StatCardProps {
  title: string;           // Card title
  value: number | string;  // Main value to display
  icon: React.ReactNode;   // Icon component
  trend?: {                // Optional trend indicator
    value: number;         // Percentage change
    isPositive: boolean;   // Green (true) or red (false)
  };
  color?: string;          // Icon background color
  loading?: boolean;       // Show loading state
}
```

##### Usage Example

```tsx
import StatCard from '@/pages/dashboard/StatCard';
import { UserOutlined, BookOutlined, DollarOutlined } from '@ant-design/icons';

function Dashboard() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
      <StatCard
        title="Total Students"
        value={1234}
        icon={<UserOutlined />}
        trend={{ value: 12, isPositive: true }}
        color="#1890ff"
      />
      
      <StatCard
        title="Active Classes"
        value={56}
        icon={<BookOutlined />}
        trend={{ value: 8, isPositive: true }}
        color="#52c41a"
      />
      
      <StatCard
        title="Revenue"
        value="$45,231"
        icon={<DollarOutlined />}
        trend={{ value: 5, isPositive: false }}
        color="#faad14"
      />
      
      <StatCard
        title="Loading Example"
        value={0}
        icon={<UserOutlined />}
        loading={true}
      />
    </div>
  );
}
```

---

#### RecentActivities

**File**: `client/src/pages/dashboard/RecentActivities.tsx`

Displays a list of recent activities in the system.

##### Props

```typescript
interface Activity {
  id: string;
  type: string;           // Activity type (e.g., 'class_created')
  description: string;    // Activity description
  timestamp: string;      // ISO 8601 timestamp
  user?: string;          // User who performed the action
  icon?: React.ReactNode; // Optional icon
}

interface RecentActivitiesProps {
  activities: Activity[];
  loading?: boolean;
}
```

##### Usage Example

```tsx
import RecentActivities from '@/pages/dashboard/RecentActivities';

function Dashboard() {
  const activities = [
    {
      id: '1',
      type: 'class_created',
      description: 'New class "Mathematics 101" was created',
      timestamp: '2024-01-15T10:30:00Z',
      user: 'Bob Teacher'
    },
    {
      id: '2',
      type: 'student_enrolled',
      description: 'Jane Student enrolled in Physics 101',
      timestamp: '2024-01-15T09:15:00Z',
      user: 'Jane Student'
    }
  ];

  return <RecentActivities activities={activities} />;
}
```

---

#### Chart Components

**Files**: 
- `client/src/pages/dashboard/charts/StudentsPieChart.tsx`
- `client/src/pages/dashboard/charts/ClassesBarChart.tsx`
- `client/src/pages/dashboard/charts/RevenueLineChart.tsx`

##### StudentsPieChart

Displays student distribution by status or category.

```tsx
import StudentsPieChart from '@/pages/dashboard/charts/StudentsPieChart';

function Dashboard() {
  const data = [
    { name: 'Active', value: 450 },
    { name: 'Inactive', value: 50 },
    { name: 'Graduated', value: 200 }
  ];

  return <StudentsPieChart data={data} />;
}
```

##### ClassesBarChart

Displays class statistics in a bar chart format.

```tsx
import ClassesBarChart from '@/pages/dashboard/charts/ClassesBarChart';

function Dashboard() {
  const data = [
    { month: 'Jan', scheduled: 20, completed: 15, cancelled: 2 },
    { month: 'Feb', scheduled: 25, completed: 18, cancelled: 1 },
    { month: 'Mar', scheduled: 30, completed: 22, cancelled: 3 }
  ];

  return <ClassesBarChart data={data} />;
}
```

##### RevenueLineChart

Displays revenue trends over time.

```tsx
import RevenueLineChart from '@/pages/dashboard/charts/RevenueLineChart';

function Dashboard() {
  const data = [
    { month: 'Jan', revenue: 45000 },
    { month: 'Feb', revenue: 52000 },
    { month: 'Mar', revenue: 48000 }
  ];

  return <RevenueLineChart data={data} />;
}
```

---

### Class Management Components

#### ClassListPage

**File**: `client/src/pages/class/ClassListPage.tsx`

Complete page for listing and managing classes.

##### Features

- **Filtering**: By status, subject, teacher, date range
- **Search**: By title or description
- **Pagination**: Server-side pagination
- **Actions**: View, edit, delete classes
- **Responsive**: Mobile-friendly table/cards

##### Usage Example

```tsx
import ClassListPage from '@/pages/class/ClassListPage';
import { Route } from 'react-router-dom';

// In your router
<Route path="/classes" element={<ClassListPage />} />
```

##### Custom Filters

```tsx
function ClassListPage() {
  const [filters, setFilters] = useState({
    status: 'SCHEDULED',
    subject: 'Mathematics',
    page: 1,
    limit: 10
  });

  const { data, isLoading } = useClasses(filters);

  return (
    <div>
      <Filters filters={filters} onChange={setFilters} />
      <ClassTable data={data} loading={isLoading} />
    </div>
  );
}
```

---

#### ClassCreatePage

**File**: `client/src/pages/class/ClassCreatePage.tsx`

Form page for creating new classes.

##### Features

- **Multi-step Form**: Basic info, schedule, students
- **Validation**: Real-time form validation
- **Teacher Selection**: Searchable dropdown
- **Student Selection**: Multi-select with search
- **Schedule Builder**: Visual schedule configuration

##### Usage Example

```tsx
import ClassCreatePage from '@/pages/class/ClassCreatePage';

<Route path="/classes/create" element={<ClassCreatePage />} />
```

##### Custom Form Submission

```tsx
function ClassCreatePage() {
  const { mutate: createClass, isLoading } = useCreateClass();
  const navigate = useNavigate();

  const handleSubmit = (values) => {
    createClass(values, {
      onSuccess: (data) => {
        message.success('Class created successfully');
        navigate(`/classes/${data.id}`);
      },
      onError: (error) => {
        message.error(error.message);
      }
    });
  };

  return (
    <Form onFinish={handleSubmit}>
      {/* Form fields */}
    </Form>
  );
}
```

---

#### ClassUpdatePage

**File**: `client/src/pages/class/ClassUpdatePage.tsx`

Form page for updating existing classes.

##### Features

- **Pre-populated Form**: Loads existing class data
- **All CreatePage Features**: Same as ClassCreatePage
- **Student Management**: Add/remove students from class

##### Usage Example

```tsx
import ClassUpdatePage from '@/pages/class/ClassUpdatePage';

<Route path="/classes/:id/edit" element={<ClassUpdatePage />} />
```

---

#### ClassOverviewPage

**File**: `client/src/pages/class/ClassOverviewPage.tsx`

Detailed view of a single class.

##### Features

- **Class Information**: Title, description, schedule
- **Teacher Details**: Name, subjects, contact
- **Student List**: Enrolled students with actions
- **Statistics**: Attendance, performance metrics
- **Actions**: Edit, delete, manage students

##### Usage Example

```tsx
import ClassOverviewPage from '@/pages/class/ClassOverviewPage';

<Route path="/classes/:id" element={<ClassOverviewPage />} />
```

##### Custom Sections

```tsx
function ClassOverviewPage() {
  const { id } = useParams();
  const { data: classData, isLoading } = useClass(id);

  if (isLoading) return <Spin />;

  return (
    <div>
      <ClassHeader class={classData} />
      <Tabs>
        <TabPane tab="Overview" key="1">
          <ClassInfo class={classData} />
        </TabPane>
        <TabPane tab="Students" key="2">
          <StudentsList students={classData.students} />
        </TabPane>
        <TabPane tab="Schedule" key="3">
          <ScheduleView schedule={classData.schedule} />
        </TabPane>
        <TabPane tab="Attendance" key="4">
          <AttendanceReport classId={id} />
        </TabPane>
      </Tabs>
    </div>
  );
}
```

---

### Student Management Components

#### StudentsPage

**File**: `client/src/pages/Students/StudentsPage.tsx`

Complete page for listing and managing students.

##### Features

- **Summary Cards**: Total, active, inactive counts
- **Filters**: Search, status, date range
- **Export**: CSV, PDF export functionality
- **Bulk Actions**: Select multiple students
- **Quick View**: Modal for quick student info

##### Sub-components

**FiltersBar** (`widgets/FiltersBar.tsx`):
```tsx
import FiltersBar from '@/pages/Students/widgets/FiltersBar';

<FiltersBar
  filters={filters}
  onFilterChange={setFilters}
  onSearch={handleSearch}
/>
```

**StudentList** (`widgets/StudentList.tsx`):
```tsx
import StudentList from '@/pages/Students/widgets/StudentList';

<StudentList
  students={students}
  loading={isLoading}
  onEdit={handleEdit}
  onDelete={handleDelete}
  onView={handleView}
/>
```

**SummaryCards** (`widgets/SummaryCards.tsx`):
```tsx
import SummaryCards from '@/pages/Students/widgets/SummaryCards';

<SummaryCards
  total={stats.total}
  active={stats.active}
  inactive={stats.inactive}
  graduated={stats.graduated}
/>
```

##### Usage Example

```tsx
import StudentsPage from '@/pages/Students/StudentsPage';

<Route path="/students" element={<StudentsPage />} />
```

##### Custom Columns

```tsx
// In widgets/config.ts
export const studentColumns = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    sorter: true,
    render: (text, record) => (
      <a onClick={() => viewStudent(record.id)}>{text}</a>
    )
  },
  {
    title: 'Email',
    dataIndex: 'email',
    key: 'email'
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    render: (status) => (
      <Tag color={status === 'ACTIVE' ? 'green' : 'red'}>
        {status}
      </Tag>
    )
  },
  {
    title: 'Classes',
    dataIndex: 'classCount',
    key: 'classCount'
  },
  {
    title: 'Actions',
    key: 'actions',
    render: (_, record) => (
      <Space>
        <Button onClick={() => editStudent(record.id)}>Edit</Button>
        <Button danger onClick={() => deleteStudent(record.id)}>Delete</Button>
      </Space>
    )
  }
];
```

---

### Authentication Components

#### Login Page

**File**: `client/src/pages/Login/Login.tsx`

User login page with role selection.

##### Features

- **Email/Password**: Standard authentication
- **Role Selection**: Choose user role before login
- **Remember Me**: Persist login (not implemented yet)
- **Forgot Password Link**: Navigate to password reset
- **Form Validation**: Real-time validation

##### Usage Example

```tsx
import Login from '@/pages/Login/Login';

<Route path="/login" element={<Login />} />
```

##### Custom Login Handler

```tsx
function Login() {
  const { mutate: login, isLoading } = useLogin();
  const navigate = useNavigate();

  const handleSubmit = (values) => {
    // Set role before login
    authService.setRole(values.role);
    
    login({
      email: values.email,
      password: values.password
    }, {
      onSuccess: () => {
        message.success('Login successful');
        navigate('/dashboard');
      },
      onError: (error) => {
        message.error('Login failed: ' + error.message);
      }
    });
  };

  return (
    <Form onFinish={handleSubmit}>
      <Form.Item name="role" label="Login As">
        <Select>
          <Option value="ADMIN">Admin</Option>
          <Option value="TEACHER">Teacher</Option>
          <Option value="STUDENT">Student</Option>
        </Select>
      </Form.Item>
      
      <Form.Item 
        name="email" 
        rules={[{ required: true, type: 'email' }]}
      >
        <Input placeholder="Email" />
      </Form.Item>
      
      <Form.Item 
        name="password" 
        rules={[{ required: true, min: 6 }]}
      >
        <Input.Password placeholder="Password" />
      </Form.Item>
      
      <Button type="primary" htmlType="submit" loading={isLoading}>
        Login
      </Button>
    </Form>
  );
}
```

---

#### ForgotPassword Page

**File**: `client/src/pages/ForgotPassword/ForgotPassword.tsx`

Password reset request page.

##### Features

- **Email Input**: Request reset link
- **Success Message**: Confirmation
- **Back to Login Link**: Easy navigation

##### Usage Example

```tsx
import ForgotPassword from '@/pages/ForgotPassword/ForgotPassword';

<Route path="/forgot-password" element={<ForgotPassword />} />
```

---

#### Profile Page

**File**: `client/src/pages/Profile/Profile.tsx`

User profile view and edit page.

##### Features

- **View Profile**: Display user information
- **Edit Profile**: Update user details
- **Change Password**: Password update form
- **Upload Avatar**: Profile picture upload
- **Account Settings**: Email, notifications

##### Usage Example

```tsx
import Profile from '@/pages/Profile/Profile';

<Route path="/profile" element={<Profile />} />
```

##### Custom Profile Sections

```tsx
function Profile() {
  const { user } = useAuthStore();
  const { mutate: updateProfile } = useMutation({
    mutationFn: authService.patchProfile
  });

  return (
    <Tabs>
      <TabPane tab="Basic Info" key="1">
        <Form initialValues={user} onFinish={updateProfile}>
          <Form.Item name="name" label="Name">
            <Input />
          </Form.Item>
          <Form.Item name="email" label="Email">
            <Input disabled />
          </Form.Item>
          <Button type="primary" htmlType="submit">Save</Button>
        </Form>
      </TabPane>
      
      <TabPane tab="Password" key="2">
        <PasswordChangeForm />
      </TabPane>
      
      <TabPane tab="Avatar" key="3">
        <AvatarUpload />
      </TabPane>
    </Tabs>
  );
}
```

---

## Component Patterns

### HOC Pattern: Protected Route

```tsx
// components/ProtectedRoute.tsx
import { Navigate } from 'react-router-dom';
import useAuthStore from '@/module/authentication/store/authStore';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
}

// Usage
<Route 
  path="/admin" 
  element={
    <ProtectedRoute allowedRoles={['ADMIN']}>
      <AdminPage />
    </ProtectedRoute>
  } 
/>
```

---

### Compound Component Pattern

```tsx
// components/Table/Table.tsx
interface TableProps {
  children: React.ReactNode;
  data: any[];
  loading?: boolean;
}

function Table({ children, data, loading }: TableProps) {
  return (
    <table>
      {React.Children.map(children, child => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, { data, loading });
        }
        return child;
      })}
    </table>
  );
}

Table.Header = function TableHeader({ children }) {
  return <thead>{children}</thead>;
};

Table.Body = function TableBody({ children, data }) {
  return (
    <tbody>
      {data.map((row, index) => (
        <tr key={index}>
          {React.Children.map(children, child => {
            if (React.isValidElement(child)) {
              return React.cloneElement(child, { row });
            }
            return child;
          })}
        </tr>
      ))}
    </tbody>
  );
};

Table.Column = function TableColumn({ field, render, row }) {
  return <td>{render ? render(row[field], row) : row[field]}</td>;
};

// Usage
<Table data={students} loading={isLoading}>
  <Table.Header>
    <tr>
      <th>Name</th>
      <th>Email</th>
      <th>Status</th>
    </tr>
  </Table.Header>
  <Table.Body>
    <Table.Column field="name" />
    <Table.Column field="email" />
    <Table.Column 
      field="status" 
      render={(status) => <Tag>{status}</Tag>} 
    />
  </Table.Body>
</Table>
```

---

### Render Props Pattern

```tsx
// components/DataProvider.tsx
interface DataProviderProps<T> {
  queryKey: string[];
  queryFn: () => Promise<T>;
  children: (props: {
    data: T | undefined;
    isLoading: boolean;
    error: Error | null;
    refetch: () => void;
  }) => React.ReactNode;
}

function DataProvider<T>({ queryKey, queryFn, children }: DataProviderProps<T>) {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey,
    queryFn
  });

  return <>{children({ data, isLoading, error, refetch })}</>;
}

// Usage
<DataProvider 
  queryKey={['students']} 
  queryFn={studentService.getAllStudents}
>
  {({ data, isLoading, error, refetch }) => (
    <div>
      {isLoading && <Spin />}
      {error && <Alert type="error" message={error.message} />}
      {data && <StudentList students={data.data} />}
      <Button onClick={refetch}>Refresh</Button>
    </div>
  )}
</DataProvider>
```

---

## Styling Guidelines

### Ant Design Theme Customization

**File**: `client/src/theme/themeConfig.ts`

```typescript
export const lightTheme = {
  token: {
    colorPrimary: '#1890ff',
    colorSuccess: '#52c41a',
    colorWarning: '#faad14',
    colorError: '#ff4d4f',
    colorInfo: '#1890ff',
    colorBgContainer: '#ffffff',
    colorBgLayout: '#f0f2f5',
    borderRadius: 8,
  },
};

export const darkTheme = {
  token: {
    colorPrimary: '#1890ff',
    colorSuccess: '#52c41a',
    colorWarning: '#faad14',
    colorError: '#ff4d4f',
    colorInfo: '#1890ff',
    colorBgContainer: '#1f1f1f',
    colorBgLayout: '#141414',
    borderRadius: 8,
  },
};
```

---

### CSS Modules

```tsx
// Component.module.css
.container {
  padding: 24px;
  background: var(--bg-color);
}

.header {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 16px;
}

// Component.tsx
import styles from './Component.module.css';

function Component() {
  return (
    <div className={styles.container}>
      <h1 className={styles.header}>Title</h1>
    </div>
  );
}
```

---

### Styled Components (if using styled-components)

```tsx
import styled from 'styled-components';

const Container = styled.div`
  padding: 24px;
  background: ${props => props.theme.bgColor};
`;

const Header = styled.h1`
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 16px;
  color: ${props => props.theme.textColor};
`;

function Component() {
  return (
    <Container>
      <Header>Title</Header>
    </Container>
  );
}
```

---

### Responsive Design

```tsx
import { Grid } from 'antd';

const { useBreakpoint } = Grid;

function ResponsiveComponent() {
  const screens = useBreakpoint();

  return (
    <div>
      {screens.xs && <MobileView />}
      {screens.md && <TabletView />}
      {screens.lg && <DesktopView />}
    </div>
  );
}
```

---

## Best Practices

### 1. Component Organization

```
components/
├── layout/          # Layout components (Header, Sidebar)
├── common/          # Reusable components (Button, Input)
├── features/        # Feature-specific components
│   ├── students/
│   ├── teachers/
│   └── classes/
└── pages/           # Page components
```

### 2. Props Naming

```tsx
// Good
interface ButtonProps {
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
  children: React.ReactNode;
}

// Avoid
interface ButtonProps {
  click: () => void;      // Use onClick
  isDisabled?: boolean;   // Use disabled
  isLoading?: boolean;    // Use loading
}
```

### 3. Component Size

- Keep components under 300 lines
- Extract sub-components when needed
- Use hooks to separate logic from UI

### 4. Performance Optimization

```tsx
// Use React.memo for expensive components
const ExpensiveComponent = React.memo(({ data }) => {
  // Complex rendering
});

// Use useMemo for expensive calculations
const sortedData = useMemo(() => {
  return data.sort(complexSort);
}, [data]);

// Use useCallback for event handlers
const handleClick = useCallback(() => {
  // Handler logic
}, [dependencies]);
```

### 5. Error Boundaries

```tsx
class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Component error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback />;
    }
    return this.props.children;
  }
}

// Usage
<ErrorBoundary>
  <MyComponent />
</ErrorBoundary>
```

---

**Last Updated**: 2024-01-01
**Version**: 1.0.0
