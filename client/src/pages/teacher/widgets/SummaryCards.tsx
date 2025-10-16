import React from 'react';
import { Card, Col, Row, Statistic, theme as antdTheme, Skeleton } from 'antd';
import { UserOutlined, CheckCircleOutlined, BookOutlined, BarChartOutlined } from '@ant-design/icons';
import { useTeacherSummary } from '../../../module/teacher/hooks/useTeacherStatistics';
import useThemeStore from '../../../store/themeStore';

interface StatCardProps {
  title: string;
  value?: number;
  loading: boolean;
  icon: React.ReactNode;
  gradient: string;
  iconBg: string;
  valueColor?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, loading, icon, gradient, iconBg, valueColor }) => {
  const { token } = antdTheme.useToken();
  const { mode } = useThemeStore();

  const cardStyle: React.CSSProperties = {
    height: '100%',
    borderRadius: token.borderRadiusLG,
    background: gradient,
    backdropFilter: 'blur(10px)',
    border: `1px solid ${mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.06)'}`,
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    cursor: 'pointer',
    overflow: 'hidden',
    position: 'relative',
  };

  const iconStyle: React.CSSProperties = {
    width: 56,
    height: 56,
    borderRadius: token.borderRadiusLG,
    background: iconBg,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 24,
    color: '#fff',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    marginBottom: token.marginMD,
  };

  const hoverEffect: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    right: 0,
    width: '100px',
    height: '100px',
    background: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '50%',
    transform: 'translate(30%, -30%)',
    transition: 'transform 0.3s ease',
  };

  return (
    <Card
      bordered={false}
      style={cardStyle}
      styles={{ body: { padding: token.paddingLG, position: 'relative', zIndex: 1 } }}
      className="stat-card"
      hoverable
    >
      <div style={hoverEffect} className="hover-circle" />
      <div style={iconStyle}>{icon}</div>
      {loading ? (
        <Skeleton active paragraph={{ rows: 2 }} />
      ) : (
        <Statistic
          title={
            <span style={{ 
              fontSize: token.fontSize, 
              fontWeight: 500,
              color: token.colorTextSecondary,
            }}>
              {title}
            </span>
          }
          value={value}
          valueStyle={{ 
            color: valueColor || token.colorText,
            fontSize: token.fontSizeHeading2,
            fontWeight: 700,
          }}
        />
      )}
      <style>
        {`
          .stat-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
          }
          .stat-card:hover .hover-circle {
            transform: translate(20%, -20%) scale(1.2);
          }
        `}
      </style>
    </Card>
  );
};

const SummaryCards: React.FC = () => {
  const { token } = antdTheme.useToken();
  const { mode } = useThemeStore();
  const { data: summaryData, isLoading: summaryLoading } = useTeacherSummary({});

  const cards = [
    {
      title: 'Total Teachers',
      value: summaryData?.data.totalTeachers,
      icon: <UserOutlined />,
      gradient: mode === 'dark'
        ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(139, 92, 246, 0.15) 100%)'
        : 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
      iconBg: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      valueColor: token.colorText,
    },
    {
      title: 'Active Teachers',
      value: summaryData?.data.activeTeachers,
      icon: <CheckCircleOutlined />,
      gradient: mode === 'dark'
        ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(5, 150, 105, 0.15) 100%)'
        : 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.1) 100%)',
      iconBg: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      valueColor: '#10b981',
    },
    {
      title: 'Total Classes',
      value: summaryData?.data.totalClasses,
      icon: <BookOutlined />,
      gradient: mode === 'dark'
        ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(37, 99, 235, 0.15) 100%)'
        : 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(37, 99, 235, 0.1) 100%)',
      iconBg: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
      valueColor: token.colorText,
    },
    {
      title: 'Avg Classes / Teacher',
      value: summaryData?.data.avgClassesPerDay ? Number(summaryData.data.avgClassesPerDay.toFixed(1)) : 0,
      icon: <BarChartOutlined />,
      gradient: mode === 'dark'
        ? 'linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(217, 119, 6, 0.15) 100%)'
        : 'linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(217, 119, 6, 0.1) 100%)',
      iconBg: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
      valueColor: token.colorText,
    },
  ];

  return (
    <Row gutter={[token.size, token.size]}>
      {cards.map((card, index) => (
        <Col xs={24} sm={12} md={12} lg={6} key={index}>
          <StatCard
            title={card.title}
            value={card.value}
            loading={summaryLoading}
            icon={card.icon}
            gradient={card.gradient}
            iconBg={card.iconBg}
            valueColor={card.valueColor}
          />
        </Col>
      ))}
    </Row>
  );
};

export default SummaryCards;
