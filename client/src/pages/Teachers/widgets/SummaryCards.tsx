import React from 'react';
import { Card, Col, Row, Statistic, theme as antdTheme } from 'antd';
import { UserOutlined, CheckCircleOutlined, BookOutlined, BarChartOutlined } from '@ant-design/icons';
import { useTeacherSummary } from '../../../module/teacher/hooks/useTeacherStatistics';

const SummaryCards: React.FC = () => {
  const { token } = antdTheme.useToken();
  const { data: summaryData, isLoading: summaryLoading } = useTeacherSummary({});

  // Calculate statistics
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
            value={summaryData?.data.totalTeachers}
            loading={summaryLoading}
            prefix={<UserOutlined style={{ color: token.colorPrimary }} />}
            valueStyle={{ color: token.colorText }}
          />
        </Card>
      </Col>
      
      <Col xs={24} sm={12} md={6}>
        <Card bordered={false} style={cardStyle}>
          <Statistic
            title="Active Teachers"
            value={summaryData?.data.activeTeachers}
            loading={summaryLoading}
            prefix={<CheckCircleOutlined style={{ color: token.colorSuccess }} />}
            valueStyle={{ color: token.colorSuccess }}
          />
        </Card>
      </Col>
      
      <Col xs={24} sm={12} md={6}>
        <Card bordered={false} style={cardStyle}>
          <Statistic
            title="Total Classes Taught"
            value={summaryData?.data.totalClasses}
            loading={summaryLoading}
            prefix={<BookOutlined style={{ color: token.colorInfo }} />}
            valueStyle={{ color: token.colorText }}
          />
        </Card>
      </Col>
      
      <Col xs={24} sm={12} md={6}>
        <Card bordered={false} style={cardStyle}>
          <Statistic
            title="Avg Classes / Teacher"
            value={summaryData?.data.avgClassesPerDay}
            loading={summaryLoading}
            prefix={<BarChartOutlined style={{ color: token.colorWarning }} />}
            valueStyle={{ color: token.colorText }}
          />
        </Card>
      </Col>
    </Row>
  );
};

export default SummaryCards;
