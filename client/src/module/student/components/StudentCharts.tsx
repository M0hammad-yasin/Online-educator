import React from 'react';
import { Card, Row, Col, Progress } from 'antd';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import { UserRole } from '../../../module/authentication/store/authStore';
import { StudentWidget } from '../types/student.types';

interface ChartData {
  gradeDistribution: Array<{ grade: string; count: number }>;
  regionDistribution: Array<{ region: string; value: number }>;
  attendanceTrend: Array<{ month: string; attendance: number }>;
  avgAttendance: number;
}

interface StudentChartsProps {
  chartData: ChartData;
  currentRole: UserRole;
  hasAccess: (widgetType: StudentWidget['widgetType'], widgetName?: StudentWidget['widgetName']) => boolean;
}

const StudentCharts: React.FC<StudentChartsProps> = ({
  chartData,
  currentRole,
  hasAccess,
}) => {
  // Color palette
  const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  if (!hasAccess('charts')) {
    return null;
  }

  return (
    <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
      {hasAccess('charts', 'gradeDistribution') && (
        <Col xs={24} lg={12}>
          <Card
            title="Grade Distribution"
            bordered={false}
            style={{ 
              borderRadius: '16px',
              height: '400px',
            }}
          >
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData.gradeDistribution}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis dataKey="grade" style={{ fontSize: '12px' }} />
                <YAxis style={{ fontSize: '12px' }} />
                <RechartsTooltip 
                  contentStyle={{ 
                    borderRadius: '8px',
                    border: 'none',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  }}
                />
                <Bar 
                  dataKey="count" 
                  fill="url(#colorGrade)" 
                  radius={[8, 8, 0, 0]}
                />
                <defs>
                  <linearGradient id="colorGrade" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#667eea" />
                    <stop offset="100%" stopColor="#764ba2" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      )}

      {hasAccess('charts', 'attendanceTrend') && (
        <Col xs={24} lg={12}>
          <Card
            title="Attendance Trend"
            bordered={false}
            style={{ 
              borderRadius: '16px',
              height: '400px',
            }}
          >
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData.attendanceTrend}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis dataKey="month" style={{ fontSize: '12px' }} />
                <YAxis style={{ fontSize: '12px' }} />
                <RechartsTooltip 
                  contentStyle={{ 
                    borderRadius: '8px',
                    border: 'none',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="attendance" 
                  stroke="#10b981" 
                  strokeWidth={3}
                  dot={{ fill: '#10b981', r: 5 }}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      )}

      {hasAccess('charts', 'regionDistribution') && (
        <Col xs={24} lg={12}>
          <Card
            title="Region Distribution"
            bordered={false}
            style={{ 
              borderRadius: '16px',
              height: '400px',
            }}
          >
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={chartData.regionDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ region, percent }) => `${region} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {chartData.regionDistribution.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip 
                  contentStyle={{ 
                    borderRadius: '8px',
                    border: 'none',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      )}

      {hasAccess('charts', 'performanceAnalysis') && (
        <Col xs={24} lg={12}>
          <Card
            title="Performance Analysis"
            bordered={false}
            style={{ 
              borderRadius: '16px',
              height: '400px',
            }}
          >
            <div style={{ 
              height: '300px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              flexDirection: 'column',
              gap: '16px',
            }}>
              <Progress 
                type="circle" 
                percent={chartData.avgAttendance} 
                strokeColor={{
                  '0%': '#667eea',
                  '100%': '#764ba2',
                }}
                size={180}
              />
              <h3 style={{ margin: 0 }}>Average Student Performance</h3>
            </div>
          </Card>
        </Col>
      )}
    </Row>
  );
};

export default StudentCharts;
