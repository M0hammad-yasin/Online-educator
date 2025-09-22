// client/src/module/classes/components/ClassList.tsx

import React from 'react';
import { Table, Tag, Button, Space, Typography, Tooltip } from 'antd';
import { EditOutlined, DeleteOutlined, EyeOutlined, CaretUpOutlined, CaretDownOutlined } from '@ant-design/icons';
import { format } from 'date-fns';
import { useClasses } from '../hooks/useClasses';
import { useClassStore, useClassStoreSelectors } from '../store/useClassStore';
import { Class, ClassOrderBy, ClassStatus } from '../index';

const { Text } = Typography;

// Define sortable fields mapping
const SORTABLE_FIELDS = {
  subject: 'subject',
  scheduledAt: 'startTime',
  duration: 'duration',
  classStatus: 'status',
} as const;

type SortableField = keyof typeof SORTABLE_FIELDS;

interface SortableHeaderProps {
  title: string;
  field: SortableField;
  currentOrderBy: ClassOrderBy;
  onSort: (field: SortableField) => void;
}

const SortableHeader: React.FC<SortableHeaderProps> = ({ title, field, currentOrderBy, onSort }) => {
  const getCurrentSortOrder = () => {
    const orderByField = SORTABLE_FIELDS[field];
    const sortEntry = currentOrderBy.find(item => item[orderByField]);
    return sortEntry ? sortEntry[orderByField] : null;
  };

  const currentOrder = getCurrentSortOrder();
  const isActive = currentOrder !== null;

  const getArrowIcon = () => {
    return currentOrder === 'desc' ? <CaretUpOutlined /> : <CaretDownOutlined />;
  };

  const getArrowColor = () => {
    return isActive ? '#1890ff' : '#949191';
  };

  return (
    <div 
      style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '4px',
        cursor: 'pointer',
        userSelect: 'none',
        padding: '4px 8px',
        borderRadius: '4px',
        transition: 'background-color 0.2s ease',
      }}
      onClick={() => onSort(field)}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = '#f5f5f5';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = 'transparent';
      }}
    >
      <span style={{ fontWeight: isActive ? 600 : 400 }}>{title}</span>
      <span style={{ color: getArrowColor(), fontSize: '12px' }}>
        {getArrowIcon()}
      </span>
    </div>
  );
};

const ClassList: React.FC = () => {
  const filters = useClassStoreSelectors.filters();
  console.log('filters', filters.orderBy);
  const { setSelectedClassId, setEditModalOpen, setDeleteModalOpen, setFilters } = useClassStore();
  
  const { data: classesData, isLoading, error } = useClasses(filters);

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

  const handleSort = (field: SortableField) => {
    const orderByField = SORTABLE_FIELDS[field];
    const currentOrderBy = filters.orderBy || [];
    
    // Find existing sort entry for this field
    const existingIndex = currentOrderBy.findIndex(item => item[orderByField]);
    
    let newOrderBy: ClassOrderBy;
    
    if (existingIndex === -1) {
      // First click: Add field with 'asc' order
      newOrderBy = [...currentOrderBy, { [orderByField]: 'asc' }];
    } else {
      const currentOrder = currentOrderBy[existingIndex][orderByField];
      
      if (currentOrder === 'asc') {
        // Second click: Change from 'asc' to 'desc'
        newOrderBy = [...currentOrderBy];
        newOrderBy[existingIndex] = { [orderByField]: 'desc' };
      } else {
        // Third click: Remove field from sorting
        newOrderBy = currentOrderBy.filter((_, index) => index !== existingIndex);
      }
    }
    setFilters({ orderBy: newOrderBy });
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
      title: (
        <SortableHeader
          title="Subject"
          field="subject"
          currentOrderBy={filters.orderBy || []}
          onSort={handleSort}
        />
      ),
      dataIndex: 'subject',
      key: 'subject',
      render: (subject: string) => (
        <Text strong>{subject}</Text>
      ),
    },
    {
      title: (
        <span style={{ fontWeight: 400 }}>Teacher</span>
      ),
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
      title: (
        <span style={{ fontWeight: 400 }}>Student</span>
      ),
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
      title: (
        <SortableHeader
          title="Scheduled Time"
          field="scheduledAt"
          currentOrderBy={filters.orderBy || []}
          onSort={handleSort}
        />
      ),
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
      title: (
        <SortableHeader
          title="Duration"
          field="duration"
          currentOrderBy={filters.orderBy || []}
          onSort={handleSort}
        />
      ),
      dataIndex: 'duration',
      key: 'duration',
      render: (duration: string) => `${duration} min`,
    },
    {
      title: (
        <SortableHeader
          title="Status"
          field="classStatus"
          currentOrderBy={filters.orderBy || []}
          onSort={handleSort}
        />
      ),
      dataIndex: 'status',
      key: 'classStatus',
      render: (status: ClassStatus) => (
        <Tag color={getStatusColor(status)}>
          {status}
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
      dataSource={classesData?.data || []}
      rowKey="id"
      loading={isLoading}
      pagination={{
        current: classesData?.pagination.page,
        pageSize: classesData?.pagination.limit,
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