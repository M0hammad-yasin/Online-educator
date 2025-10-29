import React, { useMemo } from 'react';
import { Card, Row, Col, Statistic } from 'antd';
import {
  UserOutlined,
  TeamOutlined,
  RiseOutlined,
  TrophyOutlined,
} from '@ant-design/icons';
import { Role } from '../../../constants/role';
import {useRole} from '../../../hooks';
import { hasAccess, useStudentFilters, useStudents } from '..';

const StudentStatsCards: React.FC = () => {
  const currentRole=useRole();
  const { filters} = useStudentFilters();

  const { data: studentsResponse } = useStudents(filters);
  const students = studentsResponse?.data;
    // Calculate statistics
    const stats = useMemo(() => {
      const total = students?.length || 0;
      const active = 20;
      const avgAttendance = Math.round(85 / total);
      const topPerformers = 8;
      
      return { total, active, avgAttendance, topPerformers };
    }, [students]);
  
  // Stat cards configuration
  const statCards = [
    {
      key: 'totalStudents',
      title: currentRole === Role.TEACHER ? 'My Students' : 'Total Students',
      value: stats.total,
      icon: <TeamOutlined style={{ fontSize: '24px' }} />,
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    },
    {
      key: 'activeStudents',
      title: 'Active Students',
      value: stats.active,
      icon: <UserOutlined style={{ fontSize: '24px' }} />,
      gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    },
    {
      key: 'avgAttendance',
      title: 'Avg Attendance',
      value: stats.avgAttendance,
      suffix: '%',
      icon: <RiseOutlined style={{ fontSize: '24px' }} />,
      gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
    },
    {
      key: 'topPerformers',
      title: currentRole === Role.TEACHER ? 'Upcoming Classes' : 'Top Performers',
      value: currentRole === Role.TEACHER ? 8 : stats.topPerformers,
      icon: <TrophyOutlined style={{ fontSize: '24px' }} />,
      gradient: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
    },
  ];

  if (!hasAccess(currentRole,'stats')) {
    return null;
  }

  return (
    <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
      {statCards
        .filter(card => hasAccess(currentRole,'stats', card.key))
        .map((card) => (
          <Col xs={24} sm={12} lg={6} key={card.key}>
            <Card
              variant='borderless'
              style={{
                borderRadius: '16px',
                background: card.gradient,
                overflow: 'hidden',
                position: 'relative',
              }}
              styles={{body:{ padding: '24px'} }}
            >
              <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{ 
                  marginBottom: '16px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                  <div style={{
                    background: 'rgba(255, 255, 255, 0.2)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '12px',
                    padding: '12px',
                    color: 'white',
                  }}>
                    {card.icon}
                  </div>
                </div>
                <Statistic
                  value={card.value}
                  suffix={card.suffix}
                  valueStyle={{ 
                    color: 'white',
                    fontSize: '32px',
                    fontWeight: 700,
                  }}
                />
                <div style={{ 
                  color: 'rgba(255, 255, 255, 0.9)',
                  fontSize: '14px',
                  fontWeight: 500,
                  marginTop: '8px',
                }}>
                  {card.title}
                </div>
              </div>
              
              {/* Decorative element */}
              <div style={{
                position: 'absolute',
                top: -20,
                right: -20,
                width: 100,
                height: 100,
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.1)',
                filter: 'blur(40px)',
              }} />
            </Card>
          </Col>
        ))}
    </Row>
  );
};

export default StudentStatsCards;
