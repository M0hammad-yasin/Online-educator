import { useState, useMemo } from 'react';
import { Card, Row, Col, Space, Table, Select } from 'antd';
import { useAuthUser, UserRole } from '../../module/authentication/store/authStore';
import { useStudentFilters, useStudents, useCreateStudent } from '../../module/student';
import { Role } from '../../constants/role';
import {
  StudentStatsCards,
  StudentCharts,
  StudentTable,
  AddStudentModal,
  StudentPageHeader,
} from '../../module/student/components';
import { CreateStudentRequest, StudentWidget } from '../../module/student/types/student.types';
import { SearchBox } from '../../components/layout';

// Widget configuration based on roles
export const widgetConfig = {
  stats: {
    roles: [Role.ADMIN, Role.MODERATOR, Role.TEACHER] as UserRole[],
    widgets: {
      [Role.ADMIN]: ['totalStudents', 'activeStudents', 'avgAttendance', 'topPerformers'],
      [Role.MODERATOR]: ['totalStudents', 'activeStudents', 'avgAttendance', 'topPerformers'],
      [Role.TEACHER]: ['myStudents', 'activeStudents', 'avgAttendance', 'upcomingClasses'],
    },
  },
  charts: {
    roles: [Role.ADMIN, Role.MODERATOR] as UserRole[],
    widgets: {
      [Role.ADMIN]: ['gradeDistribution', 'attendanceTrend', 'performanceAnalysis', 'regionDistribution'],
      [Role.MODERATOR]: ['gradeDistribution', 'attendanceTrend', 'regionDistribution'],
    },
  },
  quickActions: {
    roles: [Role.ADMIN, Role.MODERATOR, Role.TEACHER] as UserRole[],
    actions: {
      [Role.ADMIN]: ['addStudent', 'bulkImport', 'exportData', 'sendNotification'],
      [Role.MODERATOR]: ['addStudent', 'exportData', 'sendNotification'],
      [Role.TEACHER]: ['viewSchedule', 'contactStudent'],
    },
  },
  table: {
    roles: [Role.ADMIN, Role.MODERATOR, Role.TEACHER] as UserRole[],
    columns: {
      [Role.ADMIN]: ['name', 'email', 'grade', 'region', 'attendance', 'performance', 'status', 'actions'],
      [Role.MODERATOR]: ['name', 'email', 'grade', 'region', 'attendance', 'status', 'actions'],
      [Role.TEACHER]: ['name', 'grade', 'attendance', 'performance', 'lastClass', 'actions'],
    },
  },
};

const StudentsPage = () => {
  const { role: currentRole } = useAuthUser() || {};
  const { filters, setFilters } = useStudentFilters();
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const { data: studentsResponse, isLoading } = useStudents(filters);
  const students = studentsResponse?.data;
  const pagination = studentsResponse?.pagination;
  const createStudentMutation = useCreateStudent();
  
  // Calculate statistics
  const stats = useMemo(() => {
    const total = students?.length || 0;
    const active = 20;
    const avgAttendance = Math.round(85 / total);
    const topPerformers = 8;
    
    return { total, active, avgAttendance, topPerformers };
  }, [students]);

  // Chart data
  const chartData = useMemo(() => {
    const gradeDistribution = (() => {
      const distribution: Record<number, number> = {};
      students?.forEach(s => {
        distribution[s.grade] = (distribution[s.grade] || 0) + 1;
      });
      return Object.entries(distribution).map(([grade, count]) => ({
        grade: `Grade ${grade}`,
        count: count as number,
      }));
    })();

    const regionDistribution = (() => {
      const distribution = students?.reduce<Record<string, number>>((acc, student) => {
        const key = student.region ?? "Unknown";
        acc[key] = (acc[key] ?? 0) + 1;
        return acc;
      }, {});
      if (!distribution) return [{ region: "Unknown", value: 0 }];
      return Object.entries(distribution).map(([region, value]) => ({
        region,
        value,
      }));
    })();

    const attendanceTrend = [
      { month: 'Jan', attendance: 85 },
      { month: 'Feb', attendance: 88 },
      { month: 'Mar', attendance: 82 },
      { month: 'Apr', attendance: 90 },
      { month: 'May', attendance: 87 },
      { month: 'Jun', attendance: stats.avgAttendance },
    ];

    return {
      gradeDistribution,
      regionDistribution,
      attendanceTrend,
      avgAttendance: stats.avgAttendance,
    };
  }, [students, stats.avgAttendance]);

  // Check if role has access to widget
  const hasAccess = (widgetType: StudentWidget['widgetType'], widgetName: StudentWidget['widgetName'] = null) => {
    const config = widgetConfig[widgetType];
    if (!config) return false;

    if (!config.roles.includes(currentRole as UserRole)) return false;

    if (widgetName) {
      if ('widgets' in config) {
        const widgets = config.widgets;
        if (!Object.prototype.hasOwnProperty.call(widgets, currentRole)) return false;
        const roleKey = currentRole as keyof typeof widgets;
        return widgets[roleKey]?.includes(widgetName);
      }
    }

    return true;
  };

  // Handler functions
  const handleAddStudent = (studentData: CreateStudentRequest) => {
    createStudentMutation.mutate(studentData, {
      onSuccess: () => {
        setIsModalOpen(false);
      },
    });
  };

  return (
    <div style={{ padding: '24px', minHeight: '100vh' }}>
      {/* Header Section */}
      <StudentPageHeader
        currentRole={currentRole as UserRole}
        hasAccess={hasAccess}
        onAddStudent={() => setIsModalOpen(true)}
      />

      {/* Stats Cards Section */}
      <StudentStatsCards
        stats={stats}
        currentRole={currentRole as UserRole}
        hasAccess={hasAccess}
      />

      {/* Charts Section */}
      <StudentCharts
        chartData={chartData}
        currentRole={currentRole as UserRole}
        hasAccess={hasAccess}
      />

      {/* Students Table Section */}
      {hasAccess('table') && (
        <Card
          bordered={false}
          style={{ borderRadius: '16px' }}
          title={
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '16px',
            }}>
              <span style={{ fontSize: '18px', fontWeight: 600 }}>
                {currentRole === Role.TEACHER ? 'My Students List' : 'All Students'}
              </span>
              <Space wrap>
                <SearchBox
                  placeholder="Search teachers by name, qualification..."
                  initialValue={filters.search}
                  onSearch={(val) => setFilters({ search: val, page: 1 })}
                />
                <Select
                  placeholder="Filter by Grade"
                  value={filters.grade}
                  onChange={(val) => setFilters({ grade: val, page: 1 })}
                  style={{ width: 140 }}
                  allowClear
                  options={[
                    { label: 'Grade 1', value: 1 },
                    { label: 'Grade 2', value: 2 },
                    { label: 'Grade 3', value: 3 },
                    { label: 'Grade 4', value: 4 },
                    { label: 'Grade 5', value: 5 },
                    { label: 'Grade 6', value: 6 },
                    { label: 'Grade 7', value: 7 },
                    { label: 'Grade 8', value: 8 },
                    { label: 'Grade 9', value: 9 },
                    { label: 'Grade 10', value: 10 },
                    { label: 'Grade 11', value: 11 },
                    { label: 'Grade 12', value: 12 },
                  ]}
                />
                {currentRole !== Role.TEACHER && (
                  <Select
                    placeholder="Filter by Region"
                    value={filters.region}
                    onChange={(val) => setFilters({ region: val, page: 1 })}
                    style={{ width: 140 }}
                    allowClear
                    options={[
                      { label: 'Canada', value: 'canada' },
                      { label: 'USA', value: 'USA' },
                      { label: 'England', value: 'England' },
                      { label: 'West', value: 'West' },
                    ]}
                  />
                )}
              </Space>
            </div>
          }
        >
          <StudentTable
            students={students}
            isLoading={isLoading}
            pagination={pagination}
            filters={filters}
            currentRole={currentRole as UserRole}
            hasAccess={hasAccess}
            onFiltersChange={setFilters}
          />
        </Card>
      )}

      {/* Add Student Modal */}
      <AddStudentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddStudent={handleAddStudent}
      />
    </div>
  );
};

export default StudentsPage;