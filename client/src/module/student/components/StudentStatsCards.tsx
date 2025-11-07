import React, { ComponentType, useMemo } from 'react';
import { Row, Col, theme as antdTheme } from 'antd';
import {
  UserOutlined,
  TeamOutlined,
  RiseOutlined,
  TrophyOutlined,
} from '@ant-design/icons';
import { Role } from '../../../constants/role';
import { useResponsive, useResponsiveColumns, useResponsiveFontSize, useResponsiveSpacing, useRole } from '../../../hooks';
import { hasAccess, studentPageConfig, useStudentFilters, useStudents } from '..';
import useThemeStore from '../../../store/themeStore';
import StatCard from '../../../components/widgets/StatCard';

const StudentStatsCards: React.FC = () => {
  const currentRole = useRole();
  const { filters } = useStudentFilters();
  const { token } = antdTheme.useToken();
  const { mode } = useThemeStore();

  const { isMobile } = useResponsive();
  const columns = useResponsiveColumns();
  const fontSize = useResponsiveFontSize();
  const spacing = useResponsiveSpacing();


  const { data: studentsResponse, isLoading } = useStudents(filters);
  const students = studentsResponse?.data;

  const stats = useMemo(() => {
    const total = students?.length || 0;
    const active = 20;
    const avgAttendance = total > 0 ? Math.round(85 / total) : 0;
    const topPerformers = 8;

    return { total, active, avgAttendance, topPerformers };
  }, [students]);

  const statCards = [
    {
      key: 'totalStudents',
      role:[Role.MODERATOR],
      title: currentRole === Role.TEACHER ? 'My Students' : 'Total Students',
      value: stats.total,
      icon: <TeamOutlined />,
      iconBg: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    },
    {
      key: 'activeStudents',
      role:[Role.ADMIN,Role.MODERATOR],
      title: 'Active Students',
      value: stats.active,
      icon: <UserOutlined />,
      iconBg: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    },
    {
      key: 'avgAttendance',
      role:[Role.ADMIN,Role.MODERATOR],
      title: 'Avg Attendance',
      value: stats.avgAttendance,
      suffix: '%',
      icon: <RiseOutlined />,
      iconBg: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
    },
    {
      key: 'topPerformers',
      role:[Role.ADMIN,Role.MODERATOR],
      title: currentRole === Role.TEACHER ? 'Upcoming Classes' : 'Top Performers',
      value: currentRole === Role.TEACHER ? 8 : stats.topPerformers,
      icon: <TrophyOutlined />,
      iconBg: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
    },
  ];
  const colProps = () => {
    switch (statCards.length) {
      case 1:
        return columns.fullWidth;
      case 2:
        return columns.halfWidth;
      case 3:
        return columns.thirdWidth;
      default:
        return columns.quarterWidth;
    }
  };
  statCards.forEach(card=>(studentPageConfig.sections[0].widgets.push(
    {
      order:1,
      id:card.key,
      roles:card.role,
      component: <Col {...colProps()} key={card.key}>
          <StatCard
            title={card.title}
            value={card.value}
            loading={isLoading}
            icon={card.icon}
            iconBg={card.iconBg}
          />
        </Col>as unknown as ComponentType,
    }
  )));

  return (
    // <Row gutter={columns.gutter as [number,number]} style={{ marginBottom: spacing.lg }}>
    //   {statCards.map(card => (
    //     <Col {...colProps()} key={card.key}>
    //       <StatCard
    //         title={card.title}
    //         value={card.value}
    //         loading={isLoading}
    //         icon={card.icon}
    //         iconBg={card.iconBg}
    //       />
    //     </Col>
    //   ))}
    // </Row>
    <Row gutter={columns.gutter as [number,number]} style={{ marginBottom: spacing.lg }}>
      {statCards.map(card => (
        <Col {...colProps()} key={card.key}>
          <StatCard
            title={card.title}
            value={card.value}
            loading={isLoading}
            icon={card.icon}
            iconBg={card.iconBg}
          />
        </Col>
      ))}
    </Row>
  );
};

export default StudentStatsCards;
