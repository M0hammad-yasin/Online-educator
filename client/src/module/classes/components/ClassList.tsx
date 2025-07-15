// client/src/module/classes/components/ClassList.tsx

import React from 'react';
import { Table, Tag, Button, Space, Typography, Tooltip } from 'antd';
import { EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import { format } from 'date-fns';
import { useClasses } from '../hooks/useClasses';
import { useClassStore, useClassStoreSelectors } from '../store/useClassStore';
import { Class, ClassStatus } from '../index';

const { Text } = Typography;

const ClassList: React.FC = () => {
  const filters = useClassStoreSelectors.filters();
  console.log('filters', filters);
  const { setSelectedClassId, setEditModalOpen, setDeleteModalOpen } = useClassStore();
  
  const { data: classesData, isLoading, error } = useClasses();
  console.log('classesData', classesData);
//   const deleteClassMutation = useDeleteClass();

  const getStatusColor = (status: ClassStatus): string => {
    const colors = {
      SCHEDULED: 'blue',
      IN_PROGRESS: 'orange',
      LIVE: 'green',
      COMPLETED: 'success',
      CANCELLED: 'error',
    };
    return colors[status] || 'default';
  };

  const handleEdit = (classItem: Class) => {
    setSelectedClassId(classItem.id);
    setEditModalOpen(true);
  };

  const handleDelete = (classItem: Class) => {
    setSelectedClassId(classItem.id);
    setDeleteModalOpen(true);
  };

  const handleView = (classItem: Class) => {
    setSelectedClassId(classItem.id);
    // Navigate to class detail page or open view modal
  };

//   const confirmDelete = async (id: string) => {
//     try {
//       await deleteClassMutation.mutateAsync(id);
//       message.success('Class deleted successfully');
//     } catch (error) {
//       message.error('Failed to delete class');
//     }
//   };

  const columns = [
    {
      title: 'Subject',
      dataIndex: 'subject',
      key: 'subject',
      render: (subject: string) => (
        <Text strong>{subject}</Text>
      ),
    },
    {
      title: 'Teacher',
      dataIndex: 'teacher',
      key: 'teacher',
      render: (teacher: Class['teacher']) => (
        <div>
          <div>{teacher?.name}</div>
          <Text type="secondary" style={{ fontSize: '12px' }}>
            {teacher?.qualification}
          </Text>
        </div>
      ),
    },
    {
      title: 'Student',
      dataIndex: 'student',
      key: 'student',
      render: (student: Class['student']) => (
        <div>
          <div>{student?.name}</div>
          <Text type="secondary" style={{ fontSize: '12px' }}>
            Grade {student?.grade}
          </Text>
        </div>
      ),
    },
    {
      title: 'Scheduled Time',
      dataIndex: 'scheduledAt',
      key: 'scheduledAt',
      render: (scheduledAt: string) => (
        <div>
          <div>{format(new Date(scheduledAt), 'MMM dd, yyyy')}</div>
          <Text type="secondary" style={{ fontSize: '12px' }}>
            {format(new Date(scheduledAt), 'hh:mm a')}
          </Text>
        </div>
      ),
    },
    {
      title: 'Duration',
      dataIndex: 'duration',
      key: 'duration',
      render: (duration: string) => `${duration} min`,
    },
    {
      title: 'Status',
      dataIndex: 'classStatus',
      key: 'classStatus',
      render: (status: ClassStatus) => (
        <Tag color={getStatusColor(status)}>
          {status?.replace('_', ' ')}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_:any, record: Class) => (
        <Space size="small">
          <Tooltip title="View Details">
            <Button 
              type="text" 
              icon={<EyeOutlined />} 
              size="small"
              onClick={() => handleView(record)}
            />
          </Tooltip>
          <Tooltip title="Edit Class">
            <Button 
              type="text" 
              icon={<EditOutlined />} 
              size="small"
              onClick={() => handleEdit(record)}
            />
          </Tooltip>
          <Tooltip title="Delete Class">
            <Button 
              type="text" 
              icon={<DeleteOutlined />} 
              size="small"
              danger
              onClick={() => handleDelete(record)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  if (error) {
    return <div>Error loading classes: {error.message}</div>;
  }

  return (
    <Table
      columns={columns}
      dataSource={classesData?.data.classes || []}
      rowKey="id"
      loading={isLoading}
      pagination={{
        current: filters.page,
        pageSize: filters.limit,
        total: classesData?.pagination?.total || 0,
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total, range) => 
          `${range[0]}-${range[1]} of ${total} classes`,
        onChange: (page, pageSize) => {
          useClassStore.getState().setFilters({ page, limit: pageSize });
        },
      }}
      scroll={{ x: 1000 }}
    />
  );
};

export default ClassList;