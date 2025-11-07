import React from 'react';
import { Col, Row, theme as antdTheme } from 'antd';
import { UserOutlined, CheckCircleOutlined, BookOutlined, BarChartOutlined } from '@ant-design/icons';
import { useTeacherSummary } from '..';
import useThemeStore from '../../../store/themeStore';
import StatCard from '../../../components/widgets/StatCard';

const SummaryCards: React.FC = () => {
  const { token } = antdTheme.useToken();
  const { mode } = useThemeStore();
  const { data: summaryData, isLoading: summaryLoading } = useTeacherSummary({});

  const cards = [
    {
      title: 'Total Teachers',
      value: summaryData?.data.totalTeachers,
      icon: <UserOutlined />,
      iconBg: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    },
    {
      title: 'Active Teachers',
      value: summaryData?.data.activeTeachers,
      icon: <CheckCircleOutlined />,
      iconBg: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    },
    {
      title: 'Total Classes',
      value: summaryData?.data.totalClasses,
      icon: <BookOutlined />,
      iconBg: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
    },
    {
      title: 'Avg Classes / Teacher',
      value: summaryData?.data.avgClassesPerDay ? Number(summaryData.data.avgClassesPerDay.toFixed(1)) : 0,
      icon: <BarChartOutlined />,
      iconBg: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
    },
  ];

  return (
    <Row gutter={[token.size, token.size]}>
      {cards.map((card, index) => (
        <Col xs={12} sm={12} md={12} lg={6} key={index}>
          <StatCard
            title={card.title}
            value={card.value}
            loading={summaryLoading}
            icon={card.icon}
            iconBg={card.iconBg}
          />
        </Col>
      ))}
    </Row>
  );
};

export default SummaryCards;
