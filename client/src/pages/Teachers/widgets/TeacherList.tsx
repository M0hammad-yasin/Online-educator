import React, { useState } from 'react';
import {
  Avatar,
  Button,
  Flex,
  List,
  Pagination,
  Space,
  Tag,
  Tooltip,
  theme as antdTheme,
  Popconfirm,
  message,
} from 'antd';
import {
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  UserOutlined,
  MailOutlined,
  BookOutlined,
} from '@ant-design/icons';
import { useTeachers, useDeleteTeacher } from '../../../module/teacher/hooks/useTeachers';
import { useTeacherFilters, useTeacherSelection } from '../../../module/teacher/store/useTeacherStore';
import { Role } from '../../../constants/role';
import useAuthStore from '../../../module/authentication/store/authStore';
import TeacherDetailDrawer from './TeacherDetailDrawer';
import TeacherEditModal from './TeacherEditModal';
import { Teacher } from '../../../module/teacher/types/teacher.types';

const TeacherList: React.FC = () => {
  const { token } = antdTheme.useToken();
  const { filters, setFilters } = useTeacherFilters();
  const { setSelectedTeacherId } = useTeacherSelection();
  const user = useAuthStore((s) => s.user);
  const role = user?.role;

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);

  const { data, isLoading } = useTeachers(filters);
  const deleteTeacherMutation = useDeleteTeacher();
  
  const items = data?.data || [];
  const pagination = data?.pagination;
  const total = pagination?.totalItems || 0;

  const isAdmin = role === Role.ADMIN;
  const isAdminOrMod = role === Role.ADMIN || role === Role.MODERATOR;

  const handleViewDetails = (teacher: Teacher) => {
    setSelectedTeacher(teacher);
    setSelectedTeacherId(teacher.id);
    setDrawerOpen(true);
  };

  const handleEdit = (teacher: Teacher) => {
    setSelectedTeacher(teacher);
    setSelectedTeacherId(teacher.id);
    setEditModalOpen(true);
  };

  const handleDelete = async (teacherId: string) => {
    try {
      await deleteTeacherMutation.mutateAsync(teacherId);
      message.success('Teacher deleted successfully');
    } catch (error: any) {
      message.error(error?.message || 'Failed to delete teacher');
    }
  };

  const getStatusTag = (teacher: Teacher) => {
    if (teacher.isEmailVerified) {
      return <Tag color="success">Active</Tag>;
    }
    return <Tag color="warning">Pending Verification</Tag>;
  };

  return (
    <>
      <List
        loading={isLoading}
        dataSource={items}
        renderItem={(teacher: Teacher) => (
          <List.Item
            actions={[
              <Tooltip key="view" title="View Details">
                <Button
                  size="small"
                  icon={<EyeOutlined />}
                  onClick={() => handleViewDetails(teacher)}
                >
                  View
                </Button>
              </Tooltip>,
              ...(isAdminOrMod
                ? [
                    <Tooltip key="edit" title="Edit Teacher">
                      <Button
                        size="small"
                        icon={<EditOutlined />}
                        onClick={() => handleEdit(teacher)}
                      >
                        Edit
                      </Button>
                    </Tooltip>,
                  ]
                : []),
              ...(isAdmin
                ? [
                    <Popconfirm
                      key="delete"
                      title="Delete Teacher"
                      description="Are you sure you want to delete this teacher?"
                      onConfirm={() => handleDelete(teacher.id)}
                      okText="Yes"
                      cancelText="No"
                    >
                      <Tooltip title="Delete Teacher">
                        <Button
                          size="small"
                          danger
                          icon={<DeleteOutlined />}
                          loading={deleteTeacherMutation.isPending}
                        >
                          Delete
                        </Button>
                      </Tooltip>
                    </Popconfirm>,
                  ]
                : []),
            ]}
          >
            <List.Item.Meta
              avatar={
                <Avatar
                  shape="square"
                  size={56}
                  src={teacher.profilePicture}
                  icon={<UserOutlined />}
                  style={{ background: token.colorPrimary }}
                />
              }
              title={
                <Space size={token.sizeSM}>
                  <span style={{ fontWeight: 600, fontSize: token.fontSizeLG }}>
                    {teacher.name}
                  </span>
                  {getStatusTag(teacher)}
                </Space>
              }
              description={
                <Flex vertical gap={6}>
                  <Space size={token.sizeXS}>
                    <MailOutlined style={{ color: token.colorTextSecondary }} />
                    <span style={{ color: token.colorTextSecondary }}>{teacher.email}</span>
                  </Space>
                  {teacher.qualification && (
                    <Space size={token.sizeXS}>
                      <BookOutlined style={{ color: token.colorTextTertiary }} />
                      <span style={{ color: token.colorTextTertiary }}>
                        {teacher.qualification}
                      </span>
                    </Space>
                  )}
                  {teacher.classRate && (
                    <Tag color="blue" style={{ width: 'fit-content' }}>
                      Rate: ${teacher.classRate}/hr
                    </Tag>
                  )}
                </Flex>
              }
            />
          </List.Item>
        )}
      />
      
      <Flex justify="end" style={{ marginTop: token.margin }}>
        <Pagination
          current={filters.page || 1}
          pageSize={filters.limit || 10}
          total={total}
          showSizeChanger
          showTotal={(total) => `Total ${total} teachers`}
          onChange={(page, pageSize) => setFilters({ page, limit: pageSize })}
        />
      </Flex>

      {/* Teacher Detail Drawer */}
      <TeacherDetailDrawer
        open={drawerOpen}
        onClose={() => {
          setDrawerOpen(false);
          setSelectedTeacher(null);
          setSelectedTeacherId(null);
        }}
        teacher={selectedTeacher}
      />

      {/* Teacher Edit Modal */}
      <TeacherEditModal
        open={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setSelectedTeacher(null);
          setSelectedTeacherId(null);
        }}
        teacher={selectedTeacher}
      />
    </>
  );
};

export default TeacherList;
