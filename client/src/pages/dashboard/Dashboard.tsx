import React, { useState } from 'react';
import {
  Card,
  Row,
  Col,
  Typography,
  Space,
  Button,
  Tag,
  Avatar,
  DatePicker,
  List,
  Dropdown,
} from 'antd';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import {
  BookOutlined,
  UserOutlined,
  TeamOutlined,
  ClockCircleOutlined,
  RiseOutlined,
  FallOutlined,
  CalendarOutlined,
  DownOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

// Modern Design System Colors
const COLORS = {
  primary: {
    main: '#6366f1',
    light: '#818cf8',
    lighter: '#c7d2fe',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
  },
  success: {
    main: '#10b981',
    light: '#34d399',
    lighter: '#d1fae5'
  },
  warning: {
    main: '#f59e0b',
    light: '#fbbf24',
    lighter: '#fef3c7'
  },
  error: {
    main: '#ef4444',
    light: '#f87171',
    lighter: '#fee2e2'
  },
  info: {
    main: '#3b82f6',
    light: '#60a5fa',
    lighter: '#dbeafe'
  },
  neutral: {
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#e5e5e5',
    300: '#d4d4d4',
    600: '#525252',
    700: '#404040',
    800: '#262626'
  }
};

// Mock Data
const statsData = [
  {
    title: 'Total Students',
    value: 1248,
    change: 12.5,
    isIncrease: true,
    icon: <TeamOutlined />,
    color: COLORS.primary.main,
    bgGradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
  },
  {
    title: 'Active Classes',
    value: 42,
    change: 8.2,
    isIncrease: true,
    icon: <BookOutlined />,
    color: COLORS.success.main,
    bgGradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
  },
  {
    title: 'Total Revenue',
    value: '$48,352',
    change: -3.4,
    isIncrease: false,
    icon: <RiseOutlined />,
    color: COLORS.warning.main,
    bgGradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
  },
  {
    title: 'Completion Rate',
    value: '94.3%',
    change: 2.1,
    isIncrease: true,
    icon: <CheckCircleOutlined />,
    color: COLORS.info.main,
    bgGradient: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)'
  }
];

const classesPerDayData = [
  { day: 'Mon', scheduled: 8, completed: 7, cancelled: 1 },
  { day: 'Tue', scheduled: 12, completed: 10, cancelled: 2 },
  { day: 'Wed', scheduled: 10, completed: 9, cancelled: 1 },
  { day: 'Thu', scheduled: 15, completed: 13, cancelled: 2 },
  { day: 'Fri', scheduled: 11, completed: 10, cancelled: 1 },
  { day: 'Sat', scheduled: 6, completed: 6, cancelled: 0 },
  { day: 'Sun', scheduled: 4, completed: 4, cancelled: 0 }
];

const revenueData = [
  { month: 'Jan', revenue: 12500, payouts: 8900 },
  { month: 'Feb', revenue: 15200, payouts: 10500 },
  { month: 'Mar', revenue: 18900, payouts: 13200 },
  { month: 'Apr', revenue: 22300, payouts: 15800 },
  { month: 'May', revenue: 28600, payouts: 19200 },
  { month: 'Jun', revenue: 32100, payouts: 22400 }
];

const studentDistributionData = [
  { name: 'Grade 9-10', value: 35, color: COLORS.primary.main },
  { name: 'Grade 11-12', value: 42, color: COLORS.success.main },
  { name: 'Undergraduate', value: 18, color: COLORS.warning.main },
  { name: 'Others', value: 5, color: COLORS.info.main }
];

const upcomingClasses = [
  {
    id: 1,
    subject: 'Advanced Mathematics',
    teacher: 'Dr. Sarah Johnson',
    student: 'Michael Chen',
    time: '10:00 AM',
    status: 'scheduled',
    avatar: 'SJ'
  },
  {
    id: 2,
    subject: 'Physics Lab Session',
    teacher: 'Prof. James Wilson',
    student: 'Emma Davis',
    time: '11:30 AM',
    status: 'in-progress',
    avatar: 'JW'
  },
  {
    id: 3,
    subject: 'Chemistry Basics',
    teacher: 'Dr. Maria Garcia',
    student: 'Alex Kumar',
    time: '2:00 PM',
    status: 'scheduled',
    avatar: 'MG'
  },
  {
    id: 4,
    subject: 'Biology Review',
    teacher: 'Dr. Robert Lee',
    student: 'Sophia Martinez',
    time: '3:30 PM',
    status: 'scheduled',
    avatar: 'RL'
  }
];

const recentActivities = [
  {
    id: 1,
    type: 'class_completed',
    message: 'Physics Class completed by Dr. Sarah Johnson',
    time: '5 mins ago',
    icon: <CheckCircleOutlined />,
    color: COLORS.success.main
  },
  {
    id: 2,
    type: 'new_student',
    message: 'New student enrolled: Michael Chen',
    time: '15 mins ago',
    icon: <UserOutlined />,
    color: COLORS.primary.main
  },
  {
    id: 3,
    type: 'class_cancelled',
    message: 'Chemistry Class cancelled due to emergency',
    time: '1 hour ago',
    icon: <CloseCircleOutlined />,
    color: COLORS.error.main
  },
  {
    id: 4,
    type: 'payment',
    message: 'Payment received: $450 from Emma Davis',
    time: '2 hours ago',
    icon: <RiseOutlined />,
    color: COLORS.success.main
  }
];

const Dashboard: React.FC = () => {
  const [dateRange, setDateRange] = useState('week');
  const [selectedPeriod, setSelectedPeriod] = useState(dayjs());

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'scheduled':
        return { color: COLORS.primary.main, bg: COLORS.primary.lighter, text: 'Scheduled' };
      case 'in-progress':
        return { color: COLORS.warning.main, bg: COLORS.warning.lighter, text: 'In Progress' };
      case 'completed':
        return { color: COLORS.success.main, bg: COLORS.success.lighter, text: 'Completed' };
      case 'cancelled':
        return { color: COLORS.error.main, bg: COLORS.error.lighter, text: 'Cancelled' };
      default:
        return { color: COLORS.neutral[600], bg: COLORS.neutral[100], text: status };
    }
  };

  return (
    <div style={{ 
      background: COLORS.neutral[50], 
      minHeight: '100vh',
      padding: '24px'
    }}>
      {/* Header Section */}
      <div style={{ marginBottom: 32 }}>
        <Space direction="vertical" size={8} style={{ width: '100%' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
            <div>
              <Title level={2} style={{ margin: 0, fontSize: 32, fontWeight: 700, color: COLORS.neutral[800] }}>
                Dashboard Overview
              </Title>
              <Text style={{ fontSize: 16, color: COLORS.neutral[600] }}>
                Welcome back! Here's what's happening today.
              </Text>
            </div>
            <Space size={12}>
              <DatePicker
                picker="month"
                value={selectedPeriod}
                format="MMM YYYY"
                onChange={(date) => date && setSelectedPeriod(date)}
                style={{ borderRadius: 8 }}
                suffixIcon={<CalendarOutlined style={{ color: COLORS.primary.main }} />}
              />
              <Dropdown
                menu={{
                  items: [
                    { key: 'week', label: 'This Week' },
                    { key: 'month', label: 'This Month' },
                    { key: 'year', label: 'This Year' }
                  ],
                  onClick: ({ key }) => setDateRange(key)
                }}
              >
                <Button style={{ borderRadius: 8 }}>
                  {dateRange === 'week' ? 'This Week' : dateRange === 'month' ? 'This Month' : 'This Year'}
                  <DownOutlined />
                </Button>
              </Dropdown>
            </Space>
          </div>
        </Space>
      </div>

      {/* Stats Cards */}
      <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
        {statsData.map((stat, index) => (
          <Col xs={24} sm={12} lg={6} key={index}>
            <Card
              variant='borderless'
              style={{
                borderRadius: 16,
                background: '#fff',
                boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                overflow: 'hidden',
                position: 'relative',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}
              styles={{body:{ padding: 24 }}}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.08)';
              }}
            >
              {/* Gradient background element */}
              <div style={{
                position: 'absolute',
                top: 0,
                right: 0,
                width: 120,
                height: 120,
                background: stat.bgGradient,
                opacity: 0.08,
                borderRadius: '0 16px 0 100%'
              }} />
              
              <Space direction="vertical" size={16} style={{ width: '100%', position: 'relative', zIndex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div
                    style={{
                      width: 56,
                      height: 56,
                      borderRadius: 14,
                      background: stat.bgGradient,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 24,
                      color: '#fff',
                      boxShadow: `0 4px 12px ${stat.color}40`
                    }}
                  >
                    {stat.icon}
                  </div>
                  <Tag
                    color={stat.isIncrease ? 'success' : 'error'}
                    style={{
                      borderRadius: 6,
                      padding: '2px 8px',
                      border: 'none',
                      fontWeight: 600
                    }}
                  >
                    {stat.isIncrease ? <RiseOutlined /> : <FallOutlined />}
                    {Math.abs(stat.change)}%
                  </Tag>
                </div>
                <div>
                  <Text style={{ fontSize: 14, color: COLORS.neutral[600], display: 'block', marginBottom: 4 }}>
                    {stat.title}
                  </Text>
                  <Title level={3} style={{ margin: 0, fontSize: 28, fontWeight: 700, color: COLORS.neutral[800] }}>
                    {stat.value}
                  </Title>
                </div>
              </Space>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Charts Row */}
      <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
        {/* Classes Bar Chart */}
        <Col xs={24} lg={16}>
          <Card
            bordered={false}
            title={
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <Title level={4} style={{ margin: 0, fontSize: 18, fontWeight: 600 }}>
                    Classes This Week
                  </Title>
                  <Text style={{ fontSize: 14, color: COLORS.neutral[600] }}>
                    Daily class overview
                  </Text>
                </div>
                <Space>
                  <Tag color="default" style={{ margin: 0 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: COLORS.primary.main, display: 'inline-block', marginRight: 6 }} />
                    Scheduled
                  </Tag>
                  <Tag color="default" style={{ margin: 0 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: COLORS.success.main, display: 'inline-block', marginRight: 6 }} />
                    Completed
                  </Tag>
                  <Tag color="default" style={{ margin: 0 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: COLORS.error.main, display: 'inline-block', marginRight: 6 }} />
                    Cancelled
                  </Tag>
                </Space>
              </div>
            }
            style={{
              borderRadius: 16,
              boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
              height: '100%'
            }}
            bodyStyle={{ padding: '24px 24px 12px' }}
          >
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={classesPerDayData}>
                <CartesianGrid strokeDasharray="3 3" stroke={COLORS.neutral[200]} vertical={false} />
                <XAxis
                  dataKey="day"
                  tick={{ fill: COLORS.neutral[600], fontSize: 13 }}
                  axisLine={{ stroke: COLORS.neutral[200] }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: COLORS.neutral[600], fontSize: 13 }}
                  axisLine={false}
                  tickLine={false}
                />
                <RechartsTooltip
                  contentStyle={{
                    background: '#fff',
                    border: 'none',
                    borderRadius: 8,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                  }}
                />
                <Bar dataKey="scheduled" fill={COLORS.primary.main} radius={[8, 8, 0, 0]} />
                <Bar dataKey="completed" fill={COLORS.success.main} radius={[8, 8, 0, 0]} />
                <Bar dataKey="cancelled" fill={COLORS.error.main} radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        {/* Student Distribution Pie Chart */}
        <Col xs={24} lg={8}>
          <Card
            bordered={false}
            title={
              <div>
                <Title level={4} style={{ margin: 0, fontSize: 18, fontWeight: 600 }}>
                  Student Distribution
                </Title>
                <Text style={{ fontSize: 14, color: COLORS.neutral[600] }}>
                  By grade level
                </Text>
              </div>
            }
            style={{
              borderRadius: 16,
              boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
              height: '100%'
            }}
            bodyStyle={{ padding: 24 }}
          >
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={studentDistributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {studentDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip
                  contentStyle={{
                    background: '#fff',
                    border: 'none',
                    borderRadius: 8,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ marginTop: 16 }}>
              {studentDistributionData.map((item, index) => (
                <div key={index} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <Space size={8}>
                    <div style={{ width: 12, height: 12, borderRadius: 3, background: item.color }} />
                    <Text style={{ fontSize: 14 }}>{item.name}</Text>
                  </Space>
                  <Text strong style={{ fontSize: 14 }}>{item.value}%</Text>
                </div>
              ))}
            </div>
          </Card>
        </Col>
      </Row>

      {/* Revenue Chart - Full Width */}
      <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
        <Col span={24}>
          <Card
            bordered={false}
            title={
              <div>
                <Title level={4} style={{ margin: 0, fontSize: 18, fontWeight: 600 }}>
                  Revenue & Payouts
                </Title>
                <Text style={{ fontSize: 14, color: COLORS.neutral[600] }}>
                  Monthly financial overview
                </Text>
              </div>
            }
            style={{
              borderRadius: 16,
              boxShadow: '0 1px 3px rgba(0,0,0,0.08)'
            }}
            bodyStyle={{ padding: '24px 24px 12px' }}
          >
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke={COLORS.neutral[200]} vertical={false} />
                <XAxis
                  dataKey="month"
                  tick={{ fill: COLORS.neutral[600], fontSize: 13 }}
                  axisLine={{ stroke: COLORS.neutral[200] }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: COLORS.neutral[600], fontSize: 13 }}
                  axisLine={false}
                  tickLine={false}
                />
                <RechartsTooltip
                  contentStyle={{
                    background: '#fff',
                    border: 'none',
                    borderRadius: 8,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                  }}
                  formatter={(value: number) => `$${value.toLocaleString()}`}
                />
                <Legend
                  wrapperStyle={{ paddingTop: 20 }}
                  iconType="circle"
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke={COLORS.primary.main}
                  strokeWidth={3}
                  dot={{ fill: COLORS.primary.main, r: 5 }}
                  activeDot={{ r: 7 }}
                />
                <Line
                  type="monotone"
                  dataKey="payouts"
                  stroke={COLORS.error.main}
                  strokeWidth={3}
                  dot={{ fill: COLORS.error.main, r: 5 }}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      {/* Bottom Section - Upcoming Classes & Recent Activities */}
      <Row gutter={[24, 24]}>
        {/* Upcoming Classes */}
        <Col xs={24} lg={12}>
          <Card
            bordered={false}
            title={
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <Title level={4} style={{ margin: 0, fontSize: 18, fontWeight: 600 }}>
                    Upcoming Classes
                  </Title>
                  <Text style={{ fontSize: 14, color: COLORS.neutral[600] }}>
                    Today's schedule
                  </Text>
                </div>
                <Button type="link" style={{ padding: 0, height: 'auto' }}>
                  View All
                </Button>
              </div>
            }
            style={{
              borderRadius: 16,
              boxShadow: '0 1px 3px rgba(0,0,0,0.08)'
            }}
            bodyStyle={{ padding: 0 }}
          >
            <List
              dataSource={upcomingClasses}
              renderItem={(item, index) => {
                const statusConfig = getStatusConfig(item.status);
                return (
                  <List.Item
                    style={{
                      padding: '16px 24px',
                      borderBottom: index < upcomingClasses.length - 1 ? `1px solid ${COLORS.neutral[200]}` : 'none',
                      transition: 'background 0.2s ease',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = COLORS.neutral[50];
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent';
                    }}
                  >
                    <Space size={16} style={{ width: '100%' }}>
                      <Avatar
                        size={48}
                        style={{
                          background: statusConfig.color,
                          fontSize: 16,
                          fontWeight: 600
                        }}
                      >
                        {item.avatar}
                      </Avatar>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                          <Text strong style={{ fontSize: 15, color: COLORS.neutral[800] }}>
                            {item.subject}
                          </Text>
                          <Tag
                            color={statusConfig.bg}
                            style={{
                              color: statusConfig.color,
                              border: 'none',
                              borderRadius: 6,
                              fontWeight: 500,
                              fontSize: 12
                            }}
                          >
                            {statusConfig.text}
                          </Tag>
                        </div>
                        <Text style={{ fontSize: 13, color: COLORS.neutral[600], display: 'block' }}>
                          Teacher: {item.teacher}
                        </Text>
                        <Space size={8} style={{ marginTop: 4 }}>
                          <ClockCircleOutlined style={{ color: COLORS.neutral[600], fontSize: 12 }} />
                          <Text style={{ fontSize: 13, color: COLORS.neutral[600] }}>
                            {item.time}
                          </Text>
                          <Text style={{ fontSize: 13, color: COLORS.neutral[300] }}>•</Text>
                          <Text style={{ fontSize: 13, color: COLORS.neutral[600] }}>
                            {item.student}
                          </Text>
                        </Space>
                      </div>
                    </Space>
                  </List.Item>
                );
              }}
            />
          </Card>
        </Col>

        {/* Recent Activities */}
        <Col xs={24} lg={12}>
          <Card
            bordered={false}
            title={
              <div>
                <Title level={4} style={{ margin: 0, fontSize: 18, fontWeight: 600 }}>
                  Recent Activities
                </Title>
                <Text style={{ fontSize: 14, color: COLORS.neutral[600] }}>
                  Latest system updates
                </Text>
              </div>
            }
            style={{
              borderRadius: 16,
              boxShadow: '0 1px 3px rgba(0,0,0,0.08)'
            }}
            bodyStyle={{ padding: 0 }}
          >
            <List
              dataSource={recentActivities}
              renderItem={(item, index) => (
                <List.Item
                  style={{
                    padding: '16px 24px',
                    borderBottom: index < recentActivities.length - 1 ? `1px solid ${COLORS.neutral[200]}` : 'none',
                    transition: 'background 0.2s ease',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = COLORS.neutral[50];
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                  }}
                >
                  <Space size={16} style={{ width: '100%' }}>
                    <div
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 10,
                        background: `${item.color}15`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: item.color,
                        fontSize: 18
                      }}
                    >
                      {item.icon}
                    </div>
                    <div style={{ flex: 1 }}>
                      <Text style={{ fontSize: 14, color: COLORS.neutral[800], display: 'block', marginBottom: 4 }}>
                        {item.message}
                      </Text>
                      <Text style={{ fontSize: 12, color: COLORS.neutral[600] }}>
                        {item.time}
                      </Text>
                    </div>
                  </Space>
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;