import React from 'react';
import {
  Card,
  Table,
  Space,
  Avatar,
  Tag,
  Progress,
  Badge,
  Dropdown,
  Button,
  Select,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
  MoreOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  MailOutlined,
  CalendarOutlined,
} from '@ant-design/icons';
import { UserRole } from '../../../module/authentication/store/authStore';
import { Role } from '../../../constants/role';
import { Student, StudentFilters, StudentWidget } from '../types/student.types';
import { SearchBox } from '../../../components/layout';
import { HighlightedText } from '../../../components/widgets/HighlightedText';

interface StudentTableProps {
  students: Student[] | undefined;
  isLoading: boolean;
  pagination: {
    page?: number;
    limit?: number;
    totalItems?: number;
  } | undefined;
  filters: StudentFilters;
  currentRole: UserRole;
  hasAccess: (widgetType: StudentWidget['widgetType'], widgetName?: StudentWidget['widgetName']) => boolean;
  onFiltersChange: (filters: Partial<StudentFilters>) => void;
}

const StudentTable: React.FC<StudentTableProps> = ({
  students,
  isLoading,
  pagination,
  filters,
  currentRole,
  hasAccess,
  onFiltersChange,
}) => {
  // Color palette
  const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  // Get role-specific columns
  const getTableColumns = (): ColumnsType<Student> => {
    const allColumns = {
      name: {
        title: 'Student',
        key: 'name',
        fixed: 'left' as const,
        width: 200,
        render: (_: unknown, record: Student) => (
          <Space>
            <Avatar 
              style={{ 
                backgroundColor: COLORS[record.id.charCodeAt(8) % COLORS.length],
              }}
            >
              {record.name.charAt(0)}
            </Avatar>
            <div>
              <HighlightedText text={record.name} search={filters.search} strong />
            </div>
          </Space>
        ),
      },
      email: {
        title: 'Email',
        dataIndex: 'email',
        key: 'email',
        render: (email: string) => (
          <Space>
            <MailOutlined style={{ opacity: 0.5 }} />
            <span style={{ fontSize: '13px' }}>{email}</span>
          </Space>
        ),
      },
      grade: {
        title: 'Grade',
        dataIndex: 'grade',
        key: 'grade',
        render: (grade: number) => (
          <Tag color="blue" style={{ borderRadius: '6px' }}>Grade {grade}</Tag>
        ),
      },
      region: {
        title: 'Region',
        dataIndex: 'region',
        key: 'region',
        render: (region: string) => (
          <Tag style={{ borderRadius: '6px' }}>{region}</Tag>
        ),
      },
      attendance: {
        title: 'Attendance',
        dataIndex: 'attendance',
        key: 'attendance',
        render: (attendance: number) => (
          <div style={{ minWidth: '120px' }}>
            <Progress 
              percent={attendance} 
              size="small"
              strokeColor={{
                '0%': attendance >= 80 ? '#10b981' : attendance >= 60 ? '#f59e0b' : '#ef4444',
                '100%': attendance >= 80 ? '#34d399' : attendance >= 60 ? '#fbbf24' : '#f87171',
              }}
            />
          </div>
        ),
      },
      performance: {
        title: 'Performance',
        dataIndex: 'performance',
        key: 'performance',
        render: (performance: number) => (
          <div style={{ minWidth: '120px' }}>
            <Progress 
              percent={performance} 
              size="small"
              strokeColor={{
                '0%': '#6366f1',
                '100%': '#818cf8',
              }}
            />
          </div>
        ),
      },
      status: {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        render: (status: 'active' | 'inactive' | 'pending') => {
          const colorMap = {
            active: 'success',
            inactive: 'default',
            pending: 'warning',
          };
          return (
            <Badge 
              status={colorMap[status] as "default" | "success" | "warning" | "processing" | "error" | undefined}
              text={status?.charAt(0).toUpperCase() + status?.slice(1)}
            />
          );
        },
      },
      lastClass: {
        title: 'Last Class',
        key: 'lastClass',
        render: () => (
          <Space>
            <CalendarOutlined style={{ opacity: 0.5 }} />
            <span style={{ fontSize: '13px' }}>2 days ago</span>
          </Space>
        ),
      },
      actions: {
        title: 'Actions',
        key: 'actions',
        fixed: 'right' as const,
        width: 80,
        render: (_: unknown, _record: Student) => (
          <Dropdown
            menu={{
              items: [
                {
                  key: 'view',
                  icon: <EyeOutlined />,
                  label: 'View Details',
                },
                {
                  key: 'edit',
                  icon: <EditOutlined />,
                  label: 'Edit',
                  disabled: currentRole === Role.TEACHER,
                },
                {
                  key: 'contact',
                  icon: <MailOutlined />,
                  label: 'Contact',
                },
                {
                  type: 'divider',
                },
                {
                  key: 'delete',
                  icon: <DeleteOutlined />,
                  label: 'Delete',
                  danger: true,
                  disabled: currentRole === Role.TEACHER,
                },
              ],
            }}
          >
            <Button type="text" icon={<MoreOutlined />} />
          </Dropdown>
        ),
      },
    };

    // Widget configuration for table columns
    const widgetConfig = {
      table: {
        roles: [Role.ADMIN, Role.MODERATOR, Role.TEACHER] as UserRole[],
        columns: {
          [Role.ADMIN]: ['name', 'email', 'grade', 'region', 'attendance', 'performance', 'status', 'actions'],
          [Role.MODERATOR]: ['name', 'email', 'grade', 'region', 'attendance', 'status', 'actions'],
          [Role.TEACHER]: ['name', 'grade', 'attendance', 'performance', 'lastClass', 'actions'],
        },
      },
    };

    let roleColumns: string[] = [];
    if (Object.prototype.hasOwnProperty.call(widgetConfig.table.columns, currentRole)) {
      const roleKey = currentRole as keyof typeof widgetConfig.table.columns;
      roleColumns = widgetConfig.table.columns[roleKey] || [];
    }

    return roleColumns.map(key => allColumns[key as keyof typeof allColumns]).filter(Boolean);
  };

  if (!hasAccess('table')) {
    return null;
  }

  return (
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
              placeholder="Search students by name, email..."
              initialValue={filters.search}
              onSearch={(val) => onFiltersChange({ search: val, page: 1 })}
            />
            <Select
              placeholder="Filter by Grade"
              value={filters.grade}
              onChange={(val) => onFiltersChange({ grade: val, page: 1 })}
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
                onChange={(val) => onFiltersChange({ region: val, page: 1 })}
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
      <Table
        dataSource={students}
        columns={getTableColumns()}
        rowKey="id"
        loading={isLoading}
        pagination={{
          current: pagination?.page,
          pageSize: pagination?.limit,
          total: pagination?.totalItems || 0,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} of ${total} students`,
          onChange: (page, pageSize) => onFiltersChange({ page, limit: pageSize }),
        }}
        scroll={{ x: 1200 }}
      />
    </Card>
  );
};

export default StudentTable;
