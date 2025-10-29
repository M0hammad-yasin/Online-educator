// client/src/module/classes/components/ClassList.tsx

import React, { useState } from 'react';
import { Table, Tag, Button, Typography, Tooltip, message, Modal, Space } from 'antd';
import dayjs from 'dayjs';
import { useClasses, useDeleteClass } from '../../hooks/useClasses';
import { useClassStore, useClassStoreSelectors } from '../../store/useClassStore';
import { Class, ClassOrderBy, ClassStatus } from '../../index';
import SortableHeader from './SortableHeader';
import ClassDetail from '../classDetail/ClassDetail';
import { motion, AnimatePresence } from 'framer-motion';
import './ClassList.css';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { HighlightedText } from '../../../../components/widgets/HighlightedText';

const { Text } = Typography;

// Define sortable fields mapping
const SORTABLE_FIELDS = {
  subject: 'subject',
  scheduledAt: 'startTime',
  duration: 'duration',
  classStatus: 'status',
  teacher: 'teacherName',
  student: 'studentName',
} as const;

type SortableField = keyof typeof SORTABLE_FIELDS;

const ClassList: React.FC = () => {
  const filters = useClassStoreSelectors.filters();
  const { setFilters } = useClassStore();

  const {  data:classesResponse, isLoading, error } = useClasses(filters);
  const [selectedClass, setSelectedClass] = useState<string | null>(null);

  const getStatusColor = (status: ClassStatus): string => {
    const colors = {
      SCHEDULED: 'blue',
      IN_PROGRESS: 'green',
      COMPLETED: 'success',
      CANCELLED: 'error',
      'all-classes': 'default',
    };
    return colors[status] || 'default';
  };

  // Delete section
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [classToDelete, setClassToDelete] = useState<Class | null>(null);
  const { mutate: deleteClass, isPending: isDeleting } = useDeleteClass();

  const confirmDelete = () => {
    if (!classToDelete) return;
    deleteClass(classToDelete.id, {
      onSuccess: () => {
        message.success(`Class "${classToDelete.subject}" deleted successfully`);
        setDeleteModalOpen(false);
        setClassToDelete(null);
      },
      onError: (err: any) => {
        message.error(err?.message || 'Failed to delete class');
      },
    });
  };

  // Edit section
  const navigate = useNavigate();
  const handleEdit = (classItem: Class) => {
    navigate(`/classes/update/${classItem.id}`);
  };

  // Row class name for selection highlight
  const rowClassName = (record: Class) => {
    return record.id === selectedClass ? 'row-selected' : '';
  };

  // Sorting logic
  const handleSort = (field: SortableField) => {
    const orderByField = SORTABLE_FIELDS[field];
    const currentOrderBy = filters.orderBy || [];

    const existingIndex = currentOrderBy.findIndex((item) => item[orderByField]);

    let newOrderBy: ClassOrderBy;

    if (existingIndex === -1) {
      newOrderBy = [...currentOrderBy, { [orderByField]: 'asc' }];
    } else {
      const currentOrder = currentOrderBy[existingIndex][orderByField];
      if (currentOrder === 'asc') {
        newOrderBy = [...currentOrderBy];
        newOrderBy[existingIndex] = { [orderByField]: 'desc' };
      } else {
        newOrderBy = currentOrderBy.filter((_, index) => index !== existingIndex);
      }
    }
    setFilters({ orderBy: newOrderBy });
  };

  const getCurrentSortOrder = (field: SortableField): 'asc' | 'desc' | null => {
    const orderByField = SORTABLE_FIELDS[field];
    const sortEntry = (filters.orderBy || []).find((item) => item[orderByField]);
    return sortEntry ? (sortEntry[orderByField] as 'asc' | 'desc') : null;
  };

  // Safe date formatting helper
  const formatDate = (dateString: string, formatStr: string): string => {
    const date = dayjs(dateString);
    return date.isValid() ? date.format(formatStr) : 'Invalid Date';
  };

  const columns = [
    {
      title: (
        <SortableHeader
          title="Subject"
          currentOrder={getCurrentSortOrder('subject')}
          onClick={() => handleSort('subject')}
        />
      ),
      dataIndex: 'subject',
      key: 'subject',
      render: (subject: string) => (
        <HighlightedText text={subject} search={filters.search} strong />
      ),
    },
    {
      title: (
        <SortableHeader
          title="Teacher"
          currentOrder={getCurrentSortOrder('teacher')}
          onClick={() => handleSort('teacher')}
        />
      ),
      dataIndex: 'teacher',
      key: 'teacher',
      render: (teacher: Class['teacher']) => (
        <div>
          <HighlightedText text={teacher?.name} search={filters.search} strong />
          <Text type="secondary" style={{ fontSize: '12px' }}>
            {teacher?.qualification}
          </Text>
        </div>
      ),
    },
    {
      title: (
        <SortableHeader
          title="Student"
          currentOrder={getCurrentSortOrder('student')}
          onClick={() => handleSort('student')}
        />
      ),
      dataIndex: 'student',
      key: 'student',
      render: (student: Class['student']) => (
        <div>
          <HighlightedText text={student?.name} search={filters.search} strong />
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
          currentOrder={getCurrentSortOrder('scheduledAt')}
          onClick={() => handleSort('scheduledAt')}
        />
      ),
      dataIndex: 'scheduledAt',
      key: 'scheduledAt',
      render: (scheduledAt: string) => (
        <div>
          <div>{formatDate(scheduledAt, 'MMM DD, YYYY')}</div>
          <Text type="secondary" style={{ fontSize: '12px' }}>
            {formatDate(scheduledAt, 'hh:mm A')}
          </Text>
        </div>
      ),
    },
    {
      title: (
        <SortableHeader
          title="Duration"
          currentOrder={getCurrentSortOrder('duration')}
          onClick={() => handleSort('duration')}
        />
      ),
      dataIndex: 'duration',
      key: 'duration',
      render: (duration: number | string) => `${duration} min`,
    },
    {
      title: (
        <SortableHeader
          title="Status"
          currentOrder={getCurrentSortOrder('classStatus')}
          onClick={() => handleSort('classStatus')}
        />
      ),
      dataIndex: 'status',
      key: 'classStatus',
      render: (status: ClassStatus) => (
        <Tag color={getStatusColor(status)}>{status}</Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: Class) => (
        <Space>
          <Tooltip title="Edit Class">
            <Button
              type="text"
              size="small"
              icon={<EditOutlined />}
              onClick={(e) => {
                e.stopPropagation();
                handleEdit(record);
              }}
            />
          </Tooltip>
          <Tooltip title="Delete Class">
            <Button
              type="text"
              size="small"
              danger
              icon={<DeleteOutlined />}
              loading={isDeleting}
              onClick={(e) => {
                e.stopPropagation();
                setClassToDelete(record);
                setDeleteModalOpen(true);
              }}
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
    <div>
      <AnimatePresence mode="wait">
        {!selectedClass ? (
          <motion.div
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Table
              columns={columns}
              dataSource={classesResponse?.data || []}
              rowKey="id"
              loading={isLoading}
              rowClassName={rowClassName}
              className="interactive-table"
              pagination={{
                current: classesResponse?.pagination?.page,
                pageSize: classesResponse?.pagination?.limit,
                total: classesResponse?.pagination?.totalItems || 0,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) =>
                  `${range[0]}-${range[1]} of ${total} classes`,
                onChange: (page, pageSize) => {
                  setFilters({ page, limit: pageSize });
                },
              }}
              scroll={{ x: 1000 }}
              onRow={(record) => ({
                onClick: () => setSelectedClass(record.id),
                onKeyDown: (e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setSelectedClass(record.id);
                  }
                },
                tabIndex: 0,
                role: 'button',
                'aria-label': `View details for ${record.subject} class`,
              })}
              aria-live="polite"
              aria-busy={isLoading}
            />
          </motion.div>
        ) : (
          <motion.div
            key="detail"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <ClassDetail classId={selectedClass} onBack={() => setSelectedClass(null)} />
          </motion.div>
        )}
      </AnimatePresence>

      <Modal
        title="Confirm Delete"
        open={deleteModalOpen}
        onOk={confirmDelete}
        confirmLoading={isDeleting}
        onCancel={() => {
          setDeleteModalOpen(false);
          setClassToDelete(null);
        }}
        okText="Delete"
        okButtonProps={{ danger: true }}
      >
        {classToDelete && (
          <div>
            <p>
              <strong>Subject:</strong> {classToDelete.subject}
            </p>
            <p>
              <strong>Teacher:</strong> {classToDelete.teacher?.name}
            </p>
            <p>
              <strong>Student:</strong> {classToDelete.student?.name}
            </p>
            <p>
              <strong>Scheduled At:</strong>{' '}
              {formatDate(classToDelete.scheduledAt, 'MMM DD, YYYY hh:mm A')}
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ClassList;