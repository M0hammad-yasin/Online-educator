import React,  {useMemo } from 'react';
import { Row, Col,  } from 'antd';
import {
  UserOutlined,
  TeamOutlined,
  RiseOutlined,
  TrophyOutlined,
} from '@ant-design/icons';
import { Role } from '../../../constants/role';
import {  useResponsiveColumns,  useResponsiveSpacing, useRole } from '../../../hooks';
import {  useStudentFilters, useStudents } from '..';
import StatCard from '../../../components/widgets/StatCard';

const StudentStatsCards: React.FC = () => {
  const currentRole = useRole();
  const { filters } = useStudentFilters();
  const columns = useResponsiveColumns();
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
      title: currentRole === Role.TEACHER ? 'My Students' : 'Total Students',
      value: stats.total,
      icon: <TeamOutlined />,
      iconBg: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    },
    {
      key: 'activeStudents',
      title: 'Active Students',
      value: stats.active,
      icon: <UserOutlined />,
      iconBg: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    },
    {
      key: 'avgAttendance',
      title: 'Avg Attendance',
      value: stats.avgAttendance,
      suffix: '%',
      icon: <RiseOutlined />,
      iconBg: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
    },
    {
      key: 'topPerformers',
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

  return (
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
