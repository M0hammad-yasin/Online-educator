// TeacherPage.tsx
// Modern, config-driven Teachers Management Dashboard
// Supports role-based widget visibility with glass-morphism design

import React, { useMemo } from 'react';
import { Card, Space, Typography, theme as antdTheme, Flex } from 'antd';
import { TeamOutlined } from '@ant-design/icons';
import useAuthStore from '../../module/authentication/store/authStore';
import { Role } from '../../constants/role';
import { getVisibleWidgets } from '../Teachers/widgets/teacherDashboard.config';
import SummaryCards from '../Teachers/widgets/SummaryCards';
import PerformanceCharts from '../Teachers/widgets/PerformanceCharts';
import FiltersBar from '../Teachers/widgets/FiltersBar';
import TeacherList from '../Teachers/widgets/TeacherList';
import useThemeStore from '../../store/themeStore';

const { Title, Text } = Typography;

// Widget registry - maps widget keys to their React components
const widgetRenderer: Record<string, React.FC> = {
  SummaryCards: SummaryCards,
  PerformanceCharts: PerformanceCharts,
  FiltersBar: FiltersBar,
  TeacherList: TeacherList,
};

const TeacherPage: React.FC = () => {
  const user = useAuthStore((s) => s.user);
  const { token } = antdTheme.useToken();
  const { mode } = useThemeStore();

  const role = user?.role ?? Role.TEACHER;
  const dashboardSections = useMemo(() => getVisibleWidgets(role), [role]);

  // Glass-morphism card style with theme awareness
  const glassCardStyle: React.CSSProperties = {
    background: mode === 'dark'
      ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)'
      : 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.7) 100%)',
    backdropFilter: 'saturate(180%) blur(20px)',
    borderRadius: token.borderRadiusLG,
    border: `1px solid ${mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.06)'}`,
    boxShadow: mode === 'dark'
      ? '0 8px 32px rgba(0, 0, 0, 0.3)'
      : '0 8px 32px rgba(0, 0, 0, 0.08)',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  };

  const pageContainerStyle: React.CSSProperties = {
    padding: token.paddingLG,
    minHeight: '100vh',
    background: mode === 'dark'
      ? 'linear-gradient(180deg, #0a0a0a 0%, #141414 50%, #1a1a1a 100%)'
      : 'linear-gradient(180deg, #f0f9ff 0%, #e0f2fe 50%, #f8fafc 100%)',
  };

  const headerGradientStyle: React.CSSProperties = {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  };

  return (
    <div style={pageContainerStyle}>
      {/* Page Header */}
      <Flex 
        justify="space-between" 
        align="center" 
        style={{ marginBottom: token.marginLG }}
      >
        <Space direction="vertical" size={4}>
          <Flex align="center" gap={token.size}>
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: token.borderRadiusLG,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)',
              }}
            >
              <TeamOutlined style={{ fontSize: 24, color: '#fff' }} />
            </div>
            <Title level={2} style={{ margin: 0, ...headerGradientStyle }}>
              Teachers Management
            </Title>
          </Flex>
          <Text type="secondary" style={{ fontSize: token.fontSize }}>
            Manage teacher profiles, performance, and access controls
          </Text>
        </Space>
      </Flex>

      {/* Dashboard Sections */}
      <Space direction="vertical" size={token.sizeLG} style={{ width: '100%' }}>
        {dashboardSections.map((section) => (
          <div key={section.id}>
            {/* Section widgets */}
            {section.widgets.map((widget) => {
              const WidgetComponent = widgetRenderer[widget.key];
              if (!WidgetComponent) return null;

              // For SummaryCards and PerformanceCharts, render directly without card wrapper
              if (widget.key === 'SummaryCards' || widget.key === 'PerformanceCharts') {
                return (
                  <div key={widget.key} style={{ marginBottom: token.marginLG }}>
                    <WidgetComponent />
                  </div>
                );
              }

              // For other widgets, wrap in glass-morphism card
              return (
                <Card
                  key={widget.key}
                  bordered={false}
                  style={glassCardStyle}
                  styles={{ body: { padding: token.paddingLG } }}
                  className="dashboard-card"
                >
                  <WidgetComponent />
                </Card>
              );
            })}
          </div>
        ))}
      </Space>

      {/* Global styles for animations */}
      <style>
        {`
          .dashboard-card {
            animation: fadeInUp 0.5s ease-out;
          }
          
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .dashboard-card:hover {
            transform: translateY(-2px);
            box-shadow: ${mode === 'dark'
              ? '0 12px 40px rgba(0, 0, 0, 0.4)'
              : '0 12px 40px rgba(0, 0, 0, 0.12)'
            } !important;
          }

          /* Smooth scrollbar */
          ::-webkit-scrollbar {
            width: 8px;
            height: 8px;
          }

          ::-webkit-scrollbar-track {
            background: ${mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'};
            border-radius: 4px;
          }

          ::-webkit-scrollbar-thumb {
            background: ${mode === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)'};
            border-radius: 4px;
          }

          ::-webkit-scrollbar-thumb:hover {
            background: ${mode === 'dark' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)'};
          }
        `}
      </style>
    </div>
  );
};

export default TeacherPage;
