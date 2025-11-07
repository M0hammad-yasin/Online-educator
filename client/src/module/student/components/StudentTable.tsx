import React from 'react';
import {
  Table,
  Space,
  Avatar,
  Tag,
  Progress,
  Badge,
  Dropdown,
  Button,
  message,
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
import { UserRole } from '../../../module/authentication';
import { Role } from '../../../constants/role';
import { Student,useStudents ,useStudentFilters, hasAccess} from '../';
import { HighlightedText, } from '../../../components/widgets';
import {useRole} from '../../../hooks';
import { usePermissions } from '../../../hooks/usePermissions';
import { all } from 'axios';

const StudentTable: React.FC = () => {
  // Color palette
  const currentRole=useRole();
 const{getAllowedViewFields,canPerformAction}= usePermissions('student');
  const { filters, setFilters } = useStudentFilters();
  const { data: studentsResponse, isLoading } = useStudents(filters);
  const students = studentsResponse?.data;
  const pagination = studentsResponse?.pagination;
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
        // title: 'Actions',
        key: 'actions',
        fixed: 'right' as const,
        width: 50,
        render: (_: unknown, _record: Student) => (
          <Dropdown
            menu={{
              items: [
                {
                  key: 'view',
                  icon: <EyeOutlined />,
                  onClick:()=>(message.success('View Details')),
                  label: 'View Details',
                  disabled: !canPerformAction('view'),
                },
                {
                  key: 'edit',
                  icon: <EditOutlined />,
                  label: 'Edit',
                  disabled: !canPerformAction('edit'),
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
                  disabled: !canPerformAction('delete'),
                },
              ],
            }}
          >
            <Button type="text" icon={<MoreOutlined />} />
          </Dropdown>
        ),
      },
    };
    const fields= getAllowedViewFields(allColumns);
    fields.push('actions');
    return fields.map(key => allColumns[key as keyof typeof allColumns]).filter(Boolean);
  };

  if (!hasAccess(currentRole,'table')) {
    return null;
  }

  return (
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
          onChange: (page, pageSize) => setFilters({ page, limit: pageSize }),
        }}
        scroll={{ x: 1200 }}
      />
  );
};

export default StudentTable;
