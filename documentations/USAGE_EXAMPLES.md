# Usage Examples

Complete, real-world examples for common tasks in the Online Educator Platform.

## Table of Contents
1. [Authentication Flow](#authentication-flow)
2. [Student Management](#student-management)
3. [Teacher Management](#teacher-management)
4. [Class Management](#class-management)
5. [Dashboard Implementation](#dashboard-implementation)
6. [Advanced Patterns](#advanced-patterns)

---

## Authentication Flow

### Complete Login Implementation

```tsx
// pages/Login/Login.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Select, message, Card } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useLogin } from '@/module/authentication/hooks/useAuth';
import { authService } from '@/module/authentication';
import useAuthStore from '@/module/authentication/store/authStore';

const { Option } = Select;

export default function LoginPage() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const { mutate: login, isLoading } = useLogin();
  const setUser = useAuthStore(state => state.setUser);

  const handleLogin = async (values) => {
    try {
      // Set the role endpoint before login
      authService.setRole(values.role);

      // Perform login
      login(
        {
          email: values.email,
          password: values.password
        },
        {
          onSuccess: (response) => {
            // Store user in auth store
            setUser(response.data.user);
            
            message.success('Login successful!');
            
            // Redirect based on role
            switch (response.data.user.role) {
              case 'ADMIN':
              case 'MODERATOR':
                navigate('/dashboard');
                break;
              case 'TEACHER':
                navigate('/teacher/dashboard');
                break;
              case 'STUDENT':
                navigate('/student/dashboard');
                break;
              default:
                navigate('/');
            }
          },
          onError: (error) => {
            message.error(error.message || 'Login failed');
          }
        }
      );
    } catch (error) {
      message.error('An unexpected error occurred');
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }}>
      <Card 
        title="Online Educator Platform" 
        style={{ width: 400 }}
      >
        <Form
          form={form}
          onFinish={handleLogin}
          layout="vertical"
          initialValues={{ role: 'STUDENT' }}
        >
          <Form.Item
            name="role"
            label="Login As"
            rules={[{ required: true, message: 'Please select a role' }]}
          >
            <Select size="large">
              <Option value="ADMIN">Administrator</Option>
              <Option value="TEACHER">Teacher</Option>
              <Option value="STUDENT">Student</Option>
              <Option value="MODERATOR">Moderator</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Please enter your email' },
              { type: 'email', message: 'Please enter a valid email' }
            ]}
          >
            <Input 
              prefix={<UserOutlined />} 
              placeholder="your@email.com"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={[
              { required: true, message: 'Please enter your password' },
              { min: 6, message: 'Password must be at least 6 characters' }
            ]}
          >
            <Input.Password 
              prefix={<LockOutlined />} 
              placeholder="Password"
              size="large"
            />
          </Form.Item>

          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={isLoading}
              block
              size="large"
            >
              Login
            </Button>
          </Form.Item>

          <div style={{ textAlign: 'center' }}>
            <a href="/forgot-password">Forgot password?</a>
          </div>
        </Form>
      </Card>
    </div>
  );
}
```

### Protected Route Implementation

```tsx
// components/ProtectedRoute.tsx
import { Navigate, Outlet } from 'react-router-dom';
import { Spin } from 'antd';
import useAuthStore from '@/module/authentication/store/authStore';

interface ProtectedRouteProps {
  allowedRoles?: string[];
  redirectTo?: string;
}

export default function ProtectedRoute({ 
  allowedRoles,
  redirectTo = '/login' 
}: ProtectedRouteProps) {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
}

// Usage in Router
import { Routes, Route } from 'react-router-dom';

<Routes>
  <Route path="/login" element={<LoginPage />} />
  
  {/* Protected Routes */}
  <Route element={<ProtectedRoute allowedRoles={['ADMIN', 'MODERATOR']} />}>
    <Route path="/admin" element={<AdminDashboard />} />
    <Route path="/students" element={<StudentsPage />} />
    <Route path="/teachers" element={<TeachersPage />} />
  </Route>

  <Route element={<ProtectedRoute allowedRoles={['TEACHER']} />}>
    <Route path="/teacher/classes" element={<TeacherClassesPage />} />
  </Route>

  <Route element={<ProtectedRoute allowedRoles={['STUDENT']} />}>
    <Route path="/student/classes" element={<StudentClassesPage />} />
  </Route>
</Routes>
```

---

## Student Management

### Complete CRUD Implementation

```tsx
// pages/Students/StudentsPage.tsx
import { useState } from 'react';
import { 
  Table, 
  Button, 
  Input, 
  Space, 
  Tag, 
  Modal, 
  Form, 
  message,
  Card,
  Row,
  Col
} from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined,
  SearchOutlined,
  UserOutlined 
} from '@ant-design/icons';
import { 
  useStudents, 
  useCreateStudent, 
  useUpdateStudent, 
  useDeleteStudent 
} from '@/module/student/hooks/useStudents';
import { useDebounce } from '@/hooks/useDebounce';

export default function StudentsPage() {
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    search: '',
    status: undefined
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [form] = Form.useForm();

  const debouncedSearch = useDebounce(filters.search, 500);
  
  const { data, isLoading } = useStudents({
    ...filters,
    search: debouncedSearch
  });
  
  const { mutate: createStudent, isLoading: isCreating } = useCreateStudent();
  const { mutate: updateStudent, isLoading: isUpdating } = useUpdateStudent();
  const { mutate: deleteStudent } = useDeleteStudent();

  const handleCreate = () => {
    setEditingStudent(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleEdit = (student) => {
    setEditingStudent(student);
    form.setFieldsValue(student);
    setIsModalOpen(true);
  };

  const handleDelete = (student) => {
    Modal.confirm({
      title: 'Delete Student',
      content: `Are you sure you want to delete ${student.name}?`,
      okText: 'Delete',
      okType: 'danger',
      onOk: () => {
        deleteStudent(student.id, {
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

  const handleSubmit = (values) => {
    if (editingStudent) {
      updateStudent(
        { id: editingStudent.id, data: values },
        {
          onSuccess: () => {
            message.success('Student updated successfully');
            setIsModalOpen(false);
            form.resetFields();
          },
          onError: (error) => {
            message.error(error.message);
          }
        }
      );
    } else {
      createStudent(values, {
        onSuccess: () => {
          message.success('Student created successfully');
          setIsModalOpen(false);
          form.resetFields();
        },
        onError: (error) => {
          message.error(error.message);
        }
      });
    }
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text) => (
        <Space>
          <UserOutlined />
          {text}
        </Space>
      )
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email'
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone'
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
      key: 'classCount',
      align: 'center'
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button 
            icon={<EditOutlined />} 
            onClick={() => handleEdit(record)}
          >
            Edit
          </Button>
          <Button 
            danger 
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record)}
          >
            Delete
          </Button>
        </Space>
      )
    }
  ];

  // Summary statistics
  const stats = {
    total: data?.pagination?.total || 0,
    active: data?.data?.filter(s => s.status === 'ACTIVE').length || 0,
    inactive: data?.data?.filter(s => s.status === 'INACTIVE').length || 0
  };

  return (
    <div style={{ padding: 24 }}>
      {/* Summary Cards */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={8}>
          <Card>
            <h3>Total Students</h3>
            <h1 style={{ fontSize: 36, margin: 0 }}>{stats.total}</h1>
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <h3>Active Students</h3>
            <h1 style={{ fontSize: 36, margin: 0, color: '#52c41a' }}>
              {stats.active}
            </h1>
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <h3>Inactive Students</h3>
            <h1 style={{ fontSize: 36, margin: 0, color: '#ff4d4f' }}>
              {stats.inactive}
            </h1>
          </Card>
        </Col>
      </Row>

      {/* Filters and Actions */}
      <Card style={{ marginBottom: 16 }}>
        <Space style={{ width: '100%', justifyContent: 'space-between' }}>
          <Space>
            <Input
              placeholder="Search students..."
              prefix={<SearchOutlined />}
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              style={{ width: 300 }}
            />
          </Space>
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={handleCreate}
          >
            Add Student
          </Button>
        </Space>
      </Card>

      {/* Students Table */}
      <Card>
        <Table
          dataSource={data?.data}
          columns={columns}
          loading={isLoading}
          rowKey="id"
          pagination={{
            current: filters.page,
            pageSize: filters.limit,
            total: data?.pagination?.total,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} students`,
            onChange: (page, pageSize) => {
              setFilters({ ...filters, page, limit: pageSize });
            }
          }}
        />
      </Card>

      {/* Create/Edit Modal */}
      <Modal
        title={editingStudent ? 'Edit Student' : 'Create Student'}
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          form.resetFields();
        }}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="name"
            label="Name"
            rules={[
              { required: true, message: 'Please enter student name' },
              { min: 2, message: 'Name must be at least 2 characters' }
            ]}
          >
            <Input placeholder="John Doe" />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Please enter email' },
              { type: 'email', message: 'Please enter valid email' }
            ]}
          >
            <Input placeholder="john@example.com" />
          </Form.Item>

          {!editingStudent && (
            <Form.Item
              name="password"
              label="Password"
              rules={[
                { required: true, message: 'Please enter password' },
                { min: 6, message: 'Password must be at least 6 characters' }
              ]}
            >
              <Input.Password placeholder="Password" />
            </Form.Item>
          )}

          <Form.Item
            name="phone"
            label="Phone"
          >
            <Input placeholder="+1234567890" />
          </Form.Item>

          <Form.Item
            name="address"
            label="Address"
          >
            <Input.TextArea rows={3} placeholder="Street address" />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button 
                type="primary" 
                htmlType="submit"
                loading={isCreating || isUpdating}
              >
                {editingStudent ? 'Update' : 'Create'}
              </Button>
              <Button onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
```

---

## Class Management

### Class Calendar View

```tsx
// pages/Classes/ClassCalendarPage.tsx
import { useState } from 'react';
import { Calendar, momentLocalizer, Event } from 'react-big-calendar';
import moment from 'moment';
import { Modal, Descriptions, Tag, Button } from 'antd';
import { useCalendarClasses } from '@/module/classes/hooks/useClasses';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

export default function ClassCalendarPage() {
  const [dateRange, setDateRange] = useState({
    startDate: moment().startOf('month').format('YYYY-MM-DD'),
    endDate: moment().endOf('month').format('YYYY-MM-DD')
  });
  const [selectedClass, setSelectedClass] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: classes, isLoading } = useCalendarClasses(dateRange);

  const handleNavigate = (date) => {
    const start = moment(date).startOf('month');
    const end = moment(date).endOf('month');
    
    setDateRange({
      startDate: start.format('YYYY-MM-DD'),
      endDate: end.format('YYYY-MM-DD')
    });
  };

  const handleSelectEvent = (event) => {
    setSelectedClass(event.resource);
    setIsModalOpen(true);
  };

  const events: Event[] = classes?.data?.map(cls => ({
    id: cls.id,
    title: cls.title,
    start: new Date(cls.start),
    end: new Date(cls.end),
    resource: cls
  })) || [];

  const eventStyleGetter = (event) => {
    const statusColors = {
      SCHEDULED: '#1890ff',
      IN_PROGRESS: '#52c41a',
      COMPLETED: '#8c8c8c',
      CANCELLED: '#ff4d4f'
    };

    return {
      style: {
        backgroundColor: statusColors[event.resource.status] || '#1890ff'
      }
    };
  };

  return (
    <div style={{ padding: 24 }}>
      <h1>Class Calendar</h1>
      
      <div style={{ height: 600 }}>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          onNavigate={handleNavigate}
          onSelectEvent={handleSelectEvent}
          eventPropGetter={eventStyleGetter}
          views={['month', 'week', 'day']}
          defaultView="month"
        />
      </div>

      {/* Class Details Modal */}
      <Modal
        title="Class Details"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={[
          <Button key="close" onClick={() => setIsModalOpen(false)}>
            Close
          </Button>,
          <Button 
            key="view" 
            type="primary" 
            onClick={() => navigate(`/classes/${selectedClass?.id}`)}
          >
            View Full Details
          </Button>
        ]}
      >
        {selectedClass && (
          <Descriptions column={1}>
            <Descriptions.Item label="Title">
              {selectedClass.title}
            </Descriptions.Item>
            <Descriptions.Item label="Subject">
              {selectedClass.subject}
            </Descriptions.Item>
            <Descriptions.Item label="Teacher">
              {selectedClass.teacher}
            </Descriptions.Item>
            <Descriptions.Item label="Location">
              {selectedClass.location}
            </Descriptions.Item>
            <Descriptions.Item label="Time">
              {moment(selectedClass.start).format('HH:mm')} - 
              {moment(selectedClass.end).format('HH:mm')}
            </Descriptions.Item>
            <Descriptions.Item label="Status">
              <Tag color={
                selectedClass.status === 'SCHEDULED' ? 'blue' :
                selectedClass.status === 'IN_PROGRESS' ? 'green' :
                selectedClass.status === 'COMPLETED' ? 'default' : 'red'
              }>
                {selectedClass.status}
              </Tag>
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
}
```

---

## Dashboard Implementation

### Admin Dashboard with Statistics

```tsx
// pages/Dashboard/AdminDashboard.tsx
import { Row, Col, Card, Statistic, Table, List } from 'antd';
import { 
  UserOutlined, 
  TeamOutlined, 
  BookOutlined,
  DollarOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined 
} from '@ant-design/icons';
import { useStudentsCount } from '@/module/student/hooks/useStudents';
import { useTeachersCount } from '@/module/teacher/hooks/useTeachers';
import { useClassesCount } from '@/module/classes/hooks/useClasses';
import { 
  StudentsPieChart,
  ClassesBarChart,
  RevenueLineChart 
} from './charts';

export default function AdminDashboard() {
  const { data: studentsCount } = useStudentsCount();
  const { data: teachersCount } = useTeachersCount();
  const { data: classesCount } = useClassesCount();

  const stats = [
    {
      title: 'Total Students',
      value: studentsCount?.data || 0,
      icon: <UserOutlined />,
      color: '#1890ff',
      trend: { value: 12, isPositive: true }
    },
    {
      title: 'Total Teachers',
      value: teachersCount?.data || 0,
      icon: <TeamOutlined />,
      color: '#52c41a',
      trend: { value: 8, isPositive: true }
    },
    {
      title: 'Active Classes',
      value: classesCount?.data || 0,
      icon: <BookOutlined />,
      color: '#faad14',
      trend: { value: 3, isPositive: false }
    },
    {
      title: 'Monthly Revenue',
      value: '$45,231',
      icon: <DollarOutlined />,
      color: '#eb2f96',
      trend: { value: 15, isPositive: true }
    }
  ];

  return (
    <div style={{ padding: 24 }}>
      <h1>Dashboard</h1>

      {/* Statistics Cards */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        {stats.map((stat, index) => (
          <Col span={6} key={index}>
            <Card>
              <Statistic
                title={stat.title}
                value={stat.value}
                prefix={stat.icon}
                valueStyle={{ color: stat.color }}
                suffix={
                  stat.trend && (
                    <span style={{ 
                      fontSize: 14, 
                      color: stat.trend.isPositive ? '#52c41a' : '#ff4d4f' 
                    }}>
                      {stat.trend.isPositive ? 
                        <ArrowUpOutlined /> : 
                        <ArrowDownOutlined />
                      }
                      {stat.trend.value}%
                    </span>
                  )
                }
              />
            </Card>
          </Col>
        ))}
      </Row>

      {/* Charts */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={12}>
          <Card title="Student Distribution">
            <StudentsPieChart />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Classes by Status">
            <ClassesBarChart />
          </Card>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={16}>
          <Card title="Revenue Trend">
            <RevenueLineChart />
          </Card>
        </Col>
        <Col span={8}>
          <Card title="Recent Activities">
            <RecentActivitiesList />
          </Card>
        </Col>
      </Row>
    </div>
  );
}

// Recent Activities Component
function RecentActivitiesList() {
  const activities = [
    {
      id: 1,
      action: 'New student enrolled',
      user: 'Jane Doe',
      time: '2 minutes ago',
      type: 'success'
    },
    {
      id: 2,
      action: 'Class created',
      user: 'Bob Teacher',
      time: '15 minutes ago',
      type: 'info'
    },
    {
      id: 3,
      action: 'Class cancelled',
      user: 'Admin',
      time: '1 hour ago',
      type: 'warning'
    }
  ];

  return (
    <List
      dataSource={activities}
      renderItem={(item) => (
        <List.Item>
          <List.Item.Meta
            title={item.action}
            description={`${item.user} • ${item.time}`}
          />
        </List.Item>
      )}
    />
  );
}
```

---

## Advanced Patterns

### Infinite Scroll with React Query

```tsx
import { useInfiniteQuery } from '@tanstack/react-query';
import { List, Button, Spin } from 'antd';
import { studentService } from '@/module/student';

function InfiniteStudentList() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading
  } = useInfiniteQuery({
    queryKey: ['students', 'infinite'],
    queryFn: ({ pageParam = 1 }) => 
      studentService.getAllStudents({ page: pageParam, limit: 10 }),
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.pagination;
      return page < totalPages ? page + 1 : undefined;
    }
  });

  const students = data?.pages.flatMap(page => page.data) || [];

  if (isLoading) return <Spin />;

  return (
    <div>
      <List
        dataSource={students}
        renderItem={(student) => (
          <List.Item key={student.id}>
            <List.Item.Meta
              title={student.name}
              description={student.email}
            />
          </List.Item>
        )}
      />
      
      {hasNextPage && (
        <Button 
          onClick={() => fetchNextPage()}
          loading={isFetchingNextPage}
          block
        >
          Load More
        </Button>
      )}
    </div>
  );
}
```

---

### Real-time Updates with WebSocket

```tsx
import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import io from 'socket.io-client';

function useRealtimeUpdates() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const socket = io('http://localhost:3000');

    socket.on('student:created', (student) => {
      message.success(`New student ${student.name} registered`);
      queryClient.invalidateQueries({ queryKey: ['students'] });
    });

    socket.on('class:updated', (classData) => {
      message.info(`Class ${classData.title} updated`);
      queryClient.invalidateQueries({ queryKey: ['classes'] });
      queryClient.invalidateQueries({ queryKey: ['class', classData.id] });
    });

    return () => {
      socket.disconnect();
    };
  }, [queryClient]);
}

// Usage in App.tsx
function App() {
  useRealtimeUpdates();
  
  return <AppRouter />;
}
```

---

### Form with Dynamic Fields

```tsx
import { Form, Input, Button, Space } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';

function ClassScheduleForm() {
  const [form] = Form.useForm();

  const onFinish = (values) => {
    console.log('Received values:', values);
    // values.schedules = [{ day: 'Monday', startTime: '09:00', ... }, ...]
  };

  return (
    <Form form={form} onFinish={onFinish}>
      <Form.List name="schedules">
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, ...restField }) => (
              <Space key={key} style={{ display: 'flex', marginBottom: 8 }}>
                <Form.Item
                  {...restField}
                  name={[name, 'day']}
                  rules={[{ required: true, message: 'Missing day' }]}
                >
                  <Select placeholder="Day" style={{ width: 120 }}>
                    <Option value="MONDAY">Monday</Option>
                    <Option value="TUESDAY">Tuesday</Option>
                    {/* ... more days */}
                  </Select>
                </Form.Item>

                <Form.Item
                  {...restField}
                  name={[name, 'startTime']}
                  rules={[{ required: true, message: 'Missing start time' }]}
                >
                  <TimePicker format="HH:mm" placeholder="Start Time" />
                </Form.Item>

                <Form.Item
                  {...restField}
                  name={[name, 'endTime']}
                  rules={[{ required: true, message: 'Missing end time' }]}
                >
                  <TimePicker format="HH:mm" placeholder="End Time" />
                </Form.Item>

                <MinusCircleOutlined onClick={() => remove(name)} />
              </Space>
            ))}

            <Form.Item>
              <Button 
                type="dashed" 
                onClick={() => add()} 
                block 
                icon={<PlusOutlined />}
              >
                Add Schedule
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
}
```

---

### Export to CSV

```tsx
import { Button } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';

function ExportStudentsButton() {
  const { data: students } = useStudents({ limit: 1000 });

  const exportToCSV = () => {
    if (!students?.data) return;

    // Convert to CSV
    const headers = ['Name', 'Email', 'Phone', 'Status', 'Classes'];
    const rows = students.data.map(student => [
      student.name,
      student.email,
      student.phone || '',
      student.status,
      student.classCount || 0
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    // Download
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `students_${new Date().toISOString()}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <Button 
      icon={<DownloadOutlined />} 
      onClick={exportToCSV}
    >
      Export to CSV
    </Button>
  );
}
```

---

**Last Updated**: 2024-01-01
**Version**: 1.0.0
