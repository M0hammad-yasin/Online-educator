import React from 'react';
import { Button, Space, Typography, Flex } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { Role } from '../../../constants/role';
import { useStudentModals, hasAccess } from '../';
import { useRole, useResponsive, useResponsiveFontSize, useResponsiveSpacing } from '../../../hooks';

const { Title, Text } = Typography;

// Design System Colors
const COLORS = {
  primary: { gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
  neutral: { 600: '#525252' },
};

const StudentPageHeader: React.FC = () => {
  const currentRole = useRole();
  const { setCreateModalOpen } = useStudentModals();
  const { isMobile } = useResponsive();
  const fontSize = useResponsiveFontSize();
  const spacing = useResponsiveSpacing();

  return (
    <Flex
      justify="space-between"
      align={isMobile ? "flex-start" : "center"}
      style={{ marginBottom: spacing.lg }}
      vertical={isMobile}
      gap={isMobile ? spacing.sm : 0}
    >
      <Space direction="vertical" size={4}>
        <Title
          level={isMobile ? 3 : 2}
          style={{ margin: 0, fontSize: fontSize.h2, fontWeight: 700 }}
        >
          {currentRole === Role.TEACHER ? 'My Students' : 'Students Management'}
        </Title>
        <Text style={{ fontSize: fontSize.body, color: COLORS.neutral[600], opacity: 0.7 }}>
          {currentRole === Role.TEACHER
            ? 'Manage and track your students progress'
            : 'Comprehensive student management dashboard'
          }
        </Text>
      </Space>

      <Space wrap>
        {hasAccess(currentRole, 'quickActions') && (
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => { setCreateModalOpen(true); }}
            style={{
              borderRadius: '8px',
              background: COLORS.primary.gradient,
              border: 'none',
            }}
          >
            Add Student
          </Button>
        )}
      </Space>
    </Flex>
  );
};

export default StudentPageHeader;
