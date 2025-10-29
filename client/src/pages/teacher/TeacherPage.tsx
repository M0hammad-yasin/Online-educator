// TeacherPage.tsx
// Modern, config-driven Teachers Management Dashboard
// Supports role-based widget visibility with glass-morphism design

import React, { useMemo } from 'react';
import { Card, Space, Typography, theme as antdTheme, Flex } from 'antd';
import { TeamOutlined } from '@ant-design/icons';
import useThemeStore from '../../store/themeStore';
import { SummaryCards,PerformanceCharts,FiltersBar,TeacherList, getVisibleWidgets, } from '../../module/teacher';
import { useRole } from '../../hooks';
const { Title, Text } = Typography;

// Widget registry - maps widget keys to their React components
const widgetRenderer: Record<string, React.FC> = {
  SummaryCards: SummaryCards,
  PerformanceCharts: PerformanceCharts,
  FiltersBar: FiltersBar,
  TeacherList: TeacherList,
};

const TeacherPage: React.FC = () => {
  const { token } = antdTheme.useToken();
  const { mode } = useThemeStore();

  const currentRole = useRole();
  const dashboardSections = useMemo(() => getVisibleWidgets(currentRole), [currentRole]);

  const headerGradientStyle: React.CSSProperties = {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  };

  return (
    <>
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
                  <WidgetComponent />
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
    </>
  );
};

export default TeacherPage;
