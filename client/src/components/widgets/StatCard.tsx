import React from 'react';
import { Card, Flex, Skeleton, Space, Tag, Typography, theme as antdTheme } from 'antd';
import { useResponsive } from '../../hooks';
const { Title, Text } = Typography;

interface StatCardProps {
  title: string;
  value?: number | string;
  loading: boolean;
  icon: React.ReactNode;
  iconBg: string;
  tag?: {
    change: number;
    isIncrease: boolean;
  };
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  loading,
  icon,
  iconBg,
  tag,
}) => {
  const { token } = antdTheme.useToken();
  const { isMobile } = useResponsive();

  const cardStyle: React.CSSProperties = {
    height: '100%',
    borderRadius: token.borderRadiusLG,
    background: `radial-gradient(circle at center,${token.colorBgElevated} 0%, ${token.colorBgContainer} 100%)`,
    backdropFilter: 'blur(10px)',
    border: token.colorBorder,
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    cursor: 'pointer',
    overflow: 'hidden',
    position: 'relative',
  };

  const iconStyle: React.CSSProperties = {
    width: 50,
    height: 50,
    borderRadius: token.borderRadiusLG,
    background: iconBg,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 24,
    color: '#fff',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
  };

  const hoverEffect: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    right: 0,
    width: isMobile ? 80 : 120,
    height: isMobile ? 80 : 120,
    opacity: 0.1,
    background: iconBg,
    borderRadius: `0 ${token.borderRadiusLG}px 0 100%`,
    transform: 'translate(10%, -10%)',
    transition: 'transform 0.3s ease',
  };

  return (
    <Card
      variant='borderless'
      style={cardStyle}
      styles={{ body: { padding: isMobile ? 16 : 20, position: 'relative', zIndex: 1 } }}
      hoverable
    >
      <div style={hoverEffect} />
      {loading ? (
        <Skeleton active paragraph={{ rows: 2 }} />
      ) :
        (
          <Space direction="vertical" size={isMobile ? 12 : 16} style={{ width: '100%', position: 'relative', zIndex: 1 }}>
            <Flex justify='space-between' align='flex-start'>
              <div style={iconStyle}>
                {icon}
              </div>
              {
                tag && (
                  <Tag
                    color={tag.isIncrease ? 'success' : 'error'}
                    style={{
                      borderRadius: 6,
                      padding: '2px 8px',
                      border: 'none',
                      fontWeight: 600,
                      fontSize: isMobile ? 11 : 12,
                    }}
                  >
                    {tag.isIncrease ? `+${tag.change}%` : `${tag.change}%`}
                  </Tag>
                )
              }
            </Flex>
            <Flex vertical justify='center' align='flex-start' >
              <Text style={{ fontSize: isMobile ? 14 : 16, color: token.colorTextSecondary, display: 'block' }}>
                {title}
              </Text>
              <Title level={3} style={{ margin: 0, fontSize: isMobile ? 20 : 28, fontWeight: 700 }}>
                {value}
              </Title>
            </Flex>
          </Space>
        )
      }

    </Card>
  );
};

export default StatCard;