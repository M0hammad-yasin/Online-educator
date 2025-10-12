import React from 'react';
import { Card, Col, Row, Statistic, theme as antdTheme } from 'antd';
import { UserOutlined, CheckCircleOutlined, BookOutlined, BarChartOutlined } from '@ant-design/icons';
import { useTeachers } from '../../../module/teacher/hooks/useTeachers';
import { useTeachersWithClassCount } from '../../../module/teacher/hooks/useTeacherStatistics';

const SummaryCards: React.FC = () => {
  const { token } = antdTheme.useToken();
  const { data: teachersData, isLoading: teachersLoading } = useTeachers({});
  const { data: classCountData, isLoading: classCountLoading } = useTeachersWithClassCount({});

  const isLoading = teachersLoading || classCountLoading;

  // Calculate statistics
  const totalTeachers = teachersData?.pagination?.total || 0;
  const teachers = classCountData?.data || [];
  const totalClasses = teachers.reduce((sum, t) => sum + (t._count?.classes || 0), 0);
  const activeTeachers = teachers.filter(t => (t._count?.classes || 0) > 0).length;
  const avgClassesPerTeacher = totalTeachers > 0 ? (totalClasses / totalTeachers).toFixed(1) : '0';

  const cardStyle = {
    height: '100%',
    borderRadius: token.borderRadiusLG,
  };

  return (
    <Row gutter={[token.size, token.size]}>
      <Col xs={24} sm={12} md={6}>
        <Card bordered={false} style={cardStyle}>
          <Statistic
            title="Total Teachers"
            value={totalTeachers}
            loading={isLoading}
            prefix={<UserOutlined style={{ color: token.colorPrimary }} />}
            valueStyle={{ color: token.colorText }}
          />
        </Card>
      </Col>
      
      <Col xs={24} sm={12} md={6}>
        <Card bordered={false} style={cardStyle}>
          <Statistic
            title="Active Teachers"
            value={activeTeachers}
            loading={isLoading}
            prefix={<CheckCircleOutlined style={{ color: token.colorSuccess }} />}
            valueStyle={{ color: token.colorSuccess }}
          />
        </Card>
      </Col>
      
      <Col xs={24} sm={12} md={6}>
        <Card bordered={false} style={cardStyle}>
          <Statistic
            title="Total Classes Taught"
            value={totalClasses}
            loading={isLoading}
            prefix={<BookOutlined style={{ color: token.colorInfo }} />}
            valueStyle={{ color: token.colorText }}
          />
        </Card>
      </Col>
      
      <Col xs={24} sm={12} md={6}>
        <Card bordered={false} style={cardStyle}>
          <Statistic
            title="Avg Classes / Teacher"
            value={avgClassesPerTeacher}
            loading={isLoading}
            prefix={<BarChartOutlined style={{ color: token.colorWarning }} />}
            valueStyle={{ color: token.colorText }}
          />
        </Card>
      </Col>
    </Row>
  );
};

export default SummaryCards;
