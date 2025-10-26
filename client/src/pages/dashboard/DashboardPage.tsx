// client/src/pages/dashboard/DashboardPage.tsx
import React from 'react';
import {
  Card,
  Row,
  Col,
  Typography,
  Space,
  Tag,
  Avatar,
  List,
  theme as antdTheme,
  Flex,
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
  Legend,
} from 'recharts';
import {
  BookOutlined,
  TeamOutlined,
  RiseOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';
import { useResponsive, useResponsiveColumns, useResponsiveFontSize, useResponsiveSpacing } from '../../hooks';

const { Title, Text } = Typography;

// Design System Colors
const COLORS = {
  primary: { main: '#6366f1', lighter: '#c7d2fe', gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
  success: { main: '#10b981', lighter: '#d1fae5', gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' },
  warning: { main: '#f59e0b', lighter: '#fef3c7', gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' },
  error: { main: '#ef4444', lighter: '#fee2e2' },
  info: { main: '#3b82f6', lighter: '#dbeafe', gradient: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)' },
  neutral: { 50: '#fafafa', 200: '#e5e5e5', 600: '#525252', 800: '#262626' },
};

// Mock Data
const statsData = [
  { title: 'Total Students', value: 1248, change: 12.5, isIncrease: true, icon: <TeamOutlined />, color: COLORS.primary.main, bgGradient: COLORS.primary.gradient },
  { title: 'Active Classes', value: 42, change: 8.2, isIncrease: true, icon: <BookOutlined />, color: COLORS.success.main, bgGradient: COLORS.success.gradient },
  { title: 'Total Revenue', value: '$48,352', change: -3.4, isIncrease: false, icon: <RiseOutlined />, color: COLORS.warning.main, bgGradient: COLORS.warning.gradient },
  { title: 'Completion Rate', value: '94.3%', change: 2.1, isIncrease: true, icon: <CheckCircleOutlined />, color: COLORS.info.main, bgGradient: COLORS.info.gradient },
];

const classesPerDayData = [
  { day: 'Mon', scheduled: 8, completed: 7, cancelled: 1 },
  { day: 'Tue', scheduled: 12, completed: 10, cancelled: 2 },
  { day: 'Wed', scheduled: 10, completed: 9, cancelled: 1 },
  { day: 'Thu', scheduled: 15, completed: 13, cancelled: 2 },
  { day: 'Fri', scheduled: 11, completed: 10, cancelled: 1 },
  { day: 'Sat', scheduled: 6, completed: 6, cancelled: 0 },
  { day: 'Sun', scheduled: 4, completed: 4, cancelled: 0 },
];

const revenueData = [
  { month: 'Jan', revenue: 12500, payouts: 8900 },
  { month: 'Feb', revenue: 15200, payouts: 10500 },
  { month: 'Mar', revenue: 18900, payouts: 13200 },
  { month: 'Apr', revenue: 22300, payouts: 15800 },
  { month: 'May', revenue: 28600, payouts: 19200 },
  { month: 'Jun', revenue: 32100, payouts: 22400 },
];

const studentDistributionData = [
  { name: 'Grade 9-10', value: 35, color: COLORS.primary.main },
  { name: 'Grade 11-12', value: 42, color: COLORS.success.main },
  { name: 'Undergraduate', value: 18, color: COLORS.warning.main },
  { name: 'Others', value: 5, color: COLORS.info.main },
];

const upcomingClasses = [
  { id: 1, subject: 'Advanced Mathematics', teacher: 'Dr. Sarah Johnson', student: 'Michael Chen', time: '10:00 AM', status: 'scheduled', avatar: 'SJ' },
  { id: 2, subject: 'Physics Lab Session', teacher: 'Prof. James Wilson', student: 'Emma Davis', time: '11:30 AM', status: 'in-progress', avatar: 'JW' },
  { id: 3, subject: 'Chemistry Basics', teacher: 'Dr. Maria Garcia', student: 'Alex Kumar', time: '2:00 PM', status: 'scheduled', avatar: 'MG' },
  { id: 4, subject: 'Biology Review', teacher: 'Dr. Robert Lee', student: 'Sophia Martinez', time: '3:30 PM', status: 'scheduled', avatar: 'RL' },
];

const DashboardPage: React.FC = () => {
  const { token } = antdTheme.useToken();
  const { isMobile } = useResponsive();
  const columns = useResponsiveColumns();
  const fontSize = useResponsiveFontSize();
  const spacing = useResponsiveSpacing();

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'scheduled': return { color: COLORS.primary.main, bg: COLORS.primary.lighter, text: 'Scheduled' };
      case 'in-progress': return { color: COLORS.warning.main, bg: COLORS.warning.lighter, text: 'In Progress' };
      case 'completed': return { color: COLORS.success.main, bg: COLORS.success.lighter, text: 'Completed' };
      case 'cancelled': return { color: COLORS.error.main, bg: COLORS.error.lighter, text: 'Cancelled' };
      default: return { color: COLORS.neutral[600], bg: COLORS.neutral[50], text: status };
    }
  };

  return (
    <>
      {/* Header Section */}
      <Flex 
        justify="space-between" 
        align={isMobile ? "flex-start" : "center"}
        style={{ marginBottom: spacing.lg }}
        vertical={isMobile}
        gap={isMobile ? spacing.sm : 0}
      >
        <Space direction="vertical" size={4}>
          <Title level={isMobile ? 3 : 2} style={{ margin: 0, fontSize: fontSize.h2, fontWeight: 700 }}>
            Dashboard Overview
          </Title>
          <Text style={{ fontSize: fontSize.body, color: COLORS.neutral[600] }}>
            {isMobile ? "Today's overview" : "Welcome back! Here's what's happening today."}
          </Text>
        </Space>
      </Flex>

      {/* Stats Cards */}
      <Row gutter={columns.gutter as [number, number]} style={{ marginBottom: spacing.lg }}>
        {statsData.map((stat, index) => (
          <Col {...columns.statCard} key={index}>
            <Card
              variant='borderless'
              style={{
                borderRadius: token.borderRadiusLG,
                background: '#fff',
                boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                overflow: 'hidden',
                position: 'relative',
                transition: 'all 0.3s ease',
              }}
              styles={{ body: { padding: isMobile ? 16 : 20 } }}
            >
              <div style={{
                position: 'absolute',
                top: 0,
                right: 0,
                width: isMobile ? 80 : 120,
                height: isMobile ? 80 : 120,
                background: stat.bgGradient,
                opacity: 0.08,
                borderRadius: `0 ${token.borderRadiusLG}px 0 100%`
              }} />
              
              <Space direction="vertical" size={isMobile ? 12 : 16} style={{ width: '100%', position: 'relative', zIndex: 1 }}>
                <Flex justify="space-between" align="flex-start">
                  <div
                    style={{
                      width: isMobile ? 40 : 56,
                      height: isMobile ? 40 : 56,
                      borderRadius: token.borderRadiusLG,
                      background: stat.bgGradient,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: isMobile ? 18 : 24,
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
                      fontWeight: 600,
                      fontSize: isMobile ? 11 : 12,
                    }}
                  >
                    {Math.abs(stat.change)}%
                  </Tag>
                </Flex>
                <div>
                  <Text style={{ fontSize: isMobile ? 12 : 14, color: COLORS.neutral[600], display: 'block', marginBottom: 4 }}>
                    {stat.title}
                  </Text>
                  <Title level={3} style={{ margin: 0, fontSize: isMobile ? 20 : 28, fontWeight: 700 }}>
                    {stat.value}
                  </Title>
                </div>
              </Space>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Charts Row */}
      <Row gutter={columns.gutter as [number, number]} style={{ marginBottom: spacing.lg }}>
        {/* Classes Bar Chart */}
        <Col {...columns.twoThirds}>
          <Card
            bordered={false}
            title={
              <Flex justify="space-between" align="center" wrap="wrap" gap={spacing.sm}>
                <div>
                  <Title level={4} style={{ margin: 0, fontSize: fontSize.h4, fontWeight: 600 }}>
                    Classes This Week
                  </Title>
                  {!isMobile && (
                    <Text style={{ fontSize: fontSize.small, color: COLORS.neutral[600] }}>
                      Daily class overview
                    </Text>
                  )}
                </div>
              </Flex>
            }
            style={{
              borderRadius: token.borderRadiusLG,
              boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
            }}
            styles={{ body: { padding: isMobile ? 12 : 24 } }}
          >
            <ResponsiveContainer width="100%" height={isMobile ? 200 : 300}>
              <BarChart data={classesPerDayData}>
                <CartesianGrid strokeDasharray="3 3" stroke={COLORS.neutral[200]} vertical={false} />
                <XAxis
                  dataKey="day"
                  tick={{ fill: COLORS.neutral[600], fontSize: isMobile ? 11 : 13 }}
                  axisLine={{ stroke: COLORS.neutral[200] }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: COLORS.neutral[600], fontSize: isMobile ? 11 : 13 }}
                  axisLine={false}
                  tickLine={false}
                />
                <RechartsTooltip
                  contentStyle={{
                    background: '#fff',
                    border: 'none',
                    borderRadius: 8,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    fontSize: isMobile ? 11 : 13,
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
        <Col {...columns.oneThird}>
          <Card
            bordered={false}
            title={
              <div>
                <Title level={4} style={{ margin: 0, fontSize: fontSize.h4, fontWeight: 600 }}>
                  Student Distribution
                </Title>
                {!isMobile && (
                  <Text style={{ fontSize: fontSize.small, color: COLORS.neutral[600] }}>
                    By grade level
                  </Text>
                )}
              </div>
            }
            style={{
              borderRadius: token.borderRadiusLG,
              boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
            }}
            styles={{ body: { padding: isMobile ? 12 : 24 } }}
          >
            <ResponsiveContainer width="100%" height={isMobile ? 200 : 300}>
              <PieChart>
                <Pie
                  data={studentDistributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={isMobile ? 40 : 60}
                  outerRadius={isMobile ? 70 : 90}
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
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    fontSize: isMobile ? 11 : 13,
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ marginTop: spacing.md }}>
              {studentDistributionData.map((item, index) => (
                <Flex key={index} justify="space-between" style={{ marginBottom: spacing.xs }}>
                  <Space size={8}>
                    <div style={{ width: 12, height: 12, borderRadius: 3, background: item.color }} />
                    <Text style={{ fontSize: isMobile ? 12 : 14 }}>{item.name}</Text>
                  </Space>
                  <Text strong style={{ fontSize: isMobile ? 12 : 14 }}>{item.value}%</Text>
                </Flex>
              ))}
            </div>
          </Card>
        </Col>
      </Row>

      {/* Revenue Chart */}
      <Row gutter={columns.gutter as [number, number]} style={{ marginBottom: spacing.lg }}>
        <Col {...columns.fullWidth}>
          <Card
            bordered={false}
            title={
              <div>
                <Title level={4} style={{ margin: 0, fontSize: fontSize.h4, fontWeight: 600 }}>
                  Revenue & Payouts
                </Title>
                {!isMobile && (
                  <Text style={{ fontSize: fontSize.small, color: COLORS.neutral[600] }}>
                    Monthly financial overview
                  </Text>
                )}
              </div>
            }
            style={{
              borderRadius: token.borderRadiusLG,
              boxShadow: '0 1px 3px rgba(0,0,0,0.08)'
            }}
            styles={{ body: { padding: isMobile ? 12 : 24 } }}
          >
            <ResponsiveContainer width="100%" height={isMobile ? 200 : 280}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke={COLORS.neutral[200]} vertical={false} />
                <XAxis
                  dataKey="month"
                  tick={{ fill: COLORS.neutral[600], fontSize: isMobile ? 11 : 13 }}
                  axisLine={{ stroke: COLORS.neutral[200] }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: COLORS.neutral[600], fontSize: isMobile ? 11 : 13 }}
                  axisLine={false}
                  tickLine={false}
                />
                <RechartsTooltip
                  contentStyle={{
                    background: '#fff',
                    border: 'none',
                    borderRadius: 8,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    fontSize: isMobile ? 11 : 13,
                  }}
                  formatter={(value: number) => `${value.toLocaleString()}`}
                />
                {!isMobile && <Legend wrapperStyle={{ paddingTop: 20 }} iconType="circle" />}
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke={COLORS.primary.main}
                  strokeWidth={isMobile ? 2 : 3}
                  dot={{ fill: COLORS.primary.main, r: isMobile ? 3 : 5 }}
                  activeDot={{ r: isMobile ? 5 : 7 }}
                />
                <Line
                  type="monotone"
                  dataKey="payouts"
                  stroke={COLORS.error.main}
                  strokeWidth={isMobile ? 2 : 3}
                  dot={{ fill: COLORS.error.main, r: isMobile ? 3 : 5 }}
                  activeDot={{ r: isMobile ? 5 : 7 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      {/* Upcoming Classes */}
      <Row gutter={columns.gutter as [number, number]}>
        <Col {...columns.fullWidth}>
          <Card
            bordered={false}
            title={
              <Flex justify="space-between" align="center">
                <div>
                  <Title level={4} style={{ margin: 0, fontSize: fontSize.h4, fontWeight: 600 }}>
                    Upcoming Classes
                  </Title>
                  {!isMobile && (
                    <Text style={{ fontSize: fontSize.small, color: COLORS.neutral[600] }}>
                      Today's schedule
                    </Text>
                  )}
                </div>
              </Flex>
            }
            style={{
              borderRadius: token.borderRadiusLG,
              boxShadow: '0 1px 3px rgba(0,0,0,0.08)'
            }}
            styles={{ body: { padding: 0 } }}
          >
            <List
              dataSource={upcomingClasses}
              renderItem={(item, index) => {
                const statusConfig = getStatusConfig(item.status);
                return (
                  <List.Item
                    style={{
                      padding: isMobile ? '12px 16px' : '16px 24px',
                      borderBottom: index < upcomingClasses.length - 1 ? `1px solid ${COLORS.neutral[200]}` : 'none',
                    }}
                  >
                    <Space size={isMobile ? 12 : 16} style={{ width: '100%' }} direction={isMobile ? "vertical" : "horizontal"} align={isMobile ? "start" : "center"}>
                      <Avatar
                        size={isMobile ? 40 : 48}
                        style={{
                          background: statusConfig.color,
                          fontSize: isMobile ? 14 : 16,
                          fontWeight: 600,
                        }}
                      >
                        {item.avatar}
                      </Avatar>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <Flex justify="space-between" align="center" style={{ marginBottom: 4 }} wrap="wrap" gap={spacing.xs}>
                          <Text strong style={{ fontSize: isMobile ? 13 : 15, color: COLORS.neutral[800] }}>
                            {item.subject}
                          </Text>
                          <Tag
                            color={statusConfig.bg}
                            style={{
                              color: statusConfig.color,
                              border: 'none',
                              borderRadius: 6,
                              fontWeight: 500,
                              fontSize: isMobile ? 11 : 12,
                            }}
                          >
                            {statusConfig.text}
                          </Tag>
                        </Flex>
                        <Text style={{ fontSize: isMobile ? 12 : 13, color: COLORS.neutral[600], display: 'block' }}>
                          Teacher: {item.teacher}
                        </Text>
                        <Space size={8} style={{ marginTop: 4 }}>
                          <ClockCircleOutlined style={{ color: COLORS.neutral[600], fontSize: isMobile ? 11 : 12 }} />
                          <Text style={{ fontSize: isMobile ? 12 : 13, color: COLORS.neutral[600] }}>
                            {item.time}
                          </Text>
                          {!isMobile && (
                            <>
                              <Text style={{ fontSize: 13, color: COLORS.neutral[200] }}>•</Text>
                              <Text style={{ fontSize: 13, color: COLORS.neutral[600] }}>
                                {item.student}
                              </Text>
                            </>
                          )}
                        </Space>
                      </div>
                    </Space>
                  </List.Item>
                );
              }}
            />
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default DashboardPage;