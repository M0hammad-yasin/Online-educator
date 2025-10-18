// PerformanceCharts.tsx
// Visual insights and charts for teacher performance analytics

import React from 'react';
import { Card, Row, Col, theme as antdTheme, Empty, Spin } from 'antd';
import { BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';
import { useTeachersWithClassCount } from '..';
import useThemeStore from '../../../store/themeStore';

const PerformanceCharts: React.FC = () => {
  const { token } = antdTheme.useToken();
  const { mode } = useThemeStore();
  const { data, isLoading } = useTeachersWithClassCount({ limit: 50 });

  const teachers = data?.data || [];
  // Prepare data for charts
  const topTeachersData = teachers
    .sort((a, b) => (b._count?.classes || 0) - (a._count?.classes || 0))
    .slice(0, 6)
    .map((teacher) => ({
      name: teacher.name.split(' ').slice(0, 2).join(' '), // Shorten name
      classes: teacher._count?.classes || 0,
    }));

  // Distribution by qualification
  const qualificationMap = new Map<string, number>();
  teachers.forEach((teacher) => {
    const qual = teacher.email ? 'Qualified' : 'Not Qualified'; // Simplified - adjust as needed
    qualificationMap.set(qual, (qualificationMap.get(qual) || 0) + 1);
  });

  // Colors based on theme
  const COLORS = mode === 'dark' 
    ? ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6']
    : ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe', '#00f2fe'];

  const chartCardStyle: React.CSSProperties = {
    background: mode === 'dark' 
      ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(139, 92, 246, 0.05) 100%)'
      : 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)',
    backdropFilter: 'blur(10px)',
    borderRadius: token.borderRadiusLG,
    border: `1px solid ${mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.06)'}`,
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  };

  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: token.paddingLG }}>
        <Spin size="large" />
      </div>
    );
  }

  if (teachers.length === 0) {
    return <Empty description="No performance data available" />;
  }

  return (
    <Row gutter={[token.size, token.size]}>
      {/* Top Performing Teachers Bar Chart */}
      <Col xs={24} sm={24} md={24} lg={14} xl={14}>
        <Card
          title={
            <span style={{ 
              fontSize: token.fontSizeLG, 
              fontWeight: 600,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              Top Performing Teachers
            </span>
          }
          bordered={false}
          style={chartCardStyle}
          styles={{ body: { padding: token.paddingLG } }}
        >
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topTeachersData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke={mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'} 
              />
              <XAxis 
                dataKey="name" 
                stroke={token.colorTextSecondary}
                style={{ fontSize: token.fontSizeSM }}
              />
              <YAxis 
                stroke={token.colorTextSecondary}
                style={{ fontSize: token.fontSizeSM }}
              />
              <Tooltip
                contentStyle={{
                  background: token.colorBgContainer,
                  border: `1px solid ${token.colorBorder}`,
                  borderRadius: token.borderRadius,
                  boxShadow: token.boxShadow,
                }}
                labelStyle={{ color: token.colorText }}
              />
              <Legend />
              <Bar 
                dataKey="classes" 
                fill="url(#colorGradient)" 
                radius={[8, 8, 0, 0]}
                name="Classes Taught"
              />
              <defs>
                <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#667eea" stopOpacity={1} />
                  <stop offset="100%" stopColor="#764ba2" stopOpacity={0.8} />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </Col>

      {/* Teacher Distribution Pie Chart */}
      <Col xs={24} sm={24} md={24} lg={10} xl={10}>
        <Card
          title={
            <span style={{ 
              fontSize: token.fontSizeLG, 
              fontWeight: 600,
              background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              Activity Distribution
            </span>
          }
          bordered={false}
          style={chartCardStyle}
          styles={{ body: { padding: token.paddingLG } }}
        >
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={[
                  { name: 'Active', value: teachers.filter(t => (t._count?.classes || 0) > 0).length },
                  { name: 'Inactive', value: teachers.filter(t => (t._count?.classes || 0) === 0).length },
                ]}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {[0, 1].map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: token.colorBgContainer,
                  border: `1px solid ${token.colorBorder}`,
                  borderRadius: token.borderRadius,
                  boxShadow: token.boxShadow,
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </Col>
    </Row>
  );
};

export default PerformanceCharts;
