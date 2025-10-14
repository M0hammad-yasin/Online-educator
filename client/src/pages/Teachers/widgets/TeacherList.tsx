import React, { useState } from 'react';
import {
  Avatar,
  Button,
  Flex,
  Card,
  Row,
  Col,
  Pagination,
  Space,
  Tag,
  Tooltip,
  theme as antdTheme,
  Popconfirm,
  message,
  Typography,
  Empty,
  Skeleton,
} from 'antd';
import {
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  UserOutlined,
  MailOutlined,
  BookOutlined,
  DollarOutlined,
} from '@ant-design/icons';
import { useTeachers, useDeleteTeacher } from '../../../module/teacher/hooks/useTeachers';
import { useTeacherFilters, useTeacherSelection } from '../../../module/teacher/store/useTeacherStore';
import { Role } from '../../../constants/role';
import useAuthStore from '../../../module/authentication/store/authStore';
import TeacherDetailDrawer from './TeacherDetailDrawer';
import TeacherEditModal from './TeacherEditModal';
import { Teacher } from '../../../module/teacher/types/teacher.types';
import useThemeStore from '../../../store/themeStore';

const { Text } = Typography;

const TeacherList: React.FC = () => {
  const { token } = antdTheme.useToken();
  const { mode } = useThemeStore();
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
      return <Tag color="success" style={{ borderRadius: 6 }}>Verified</Tag>;
    }
    return <Tag color="warning" style={{ borderRadius: 6 }}>Pending</Tag>;
  };

  const teacherCardStyle = (isHovered: boolean): React.CSSProperties => ({
    height: '100%',
    borderRadius: token.borderRadiusLG,
    background: mode === 'dark'
      ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)'
      : 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.7) 100%)',
    backdropFilter: 'blur(10px)',
    border: `1px solid ${mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.06)'}`,
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    cursor: 'pointer',
    transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
    boxShadow: isHovered ? '0 12px 24px rgba(0, 0, 0, 0.15)' : '0 2px 8px rgba(0, 0, 0, 0.08)',
  });

  if (isLoading) {
    return (
      <Row gutter={[token.size, token.size]}>
        {[1, 2, 3, 4].map((i) => (
          <Col xs={24} sm={12} md={12} lg={6} key={i}>
            <Card>
              <Skeleton active avatar paragraph={{ rows: 3 }} />
            </Card>
          </Col>
        ))}
      </Row>
    );
  }

  if (items.length === 0) {
    return <Empty description="No teachers found" />;
  }

  return (
    <>
      <Row gutter={[token.size, token.size]}>
        {items.map((teacher: Teacher) => {
          const [isHovered, setIsHovered] = useState(false);
          
          return (
            <Col xs={24} sm={12} md={12} lg={6} key={teacher.id}>
              <Card
                bordered={false}
                style={teacherCardStyle(isHovered)}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                styles={{ body: { padding: token.paddingLG } }}
              >
                {/* Header with Avatar */}
                <Flex vertical align="center" gap={token.size}>
                  <Avatar
                    size={80}
                    src={teacher.profilePicture}
                    icon={<UserOutlined />}
                    style={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      border: `3px solid ${token.colorBgContainer}`,
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                    }}
                  />
                  
                  <Flex vertical align="center" gap={4}>
                    <Text
                      strong
                      style={{
                        fontSize: token.fontSizeLG,
                        textAlign: 'center',
                        color: token.colorText,
                      }}
                    >
                      {teacher.name}
                    </Text>
                    {getStatusTag(teacher)}
                  </Flex>
                </Flex>

                {/* Details */}
                <Flex vertical gap={8} style={{ marginTop: token.marginMD }}>
                  <Flex align="center" gap={8}>
                    <MailOutlined style={{ color: token.colorTextSecondary, fontSize: 14 }} />
                    <Text
                      ellipsis
                      style={{ 
                        fontSize: token.fontSizeSM, 
                        color: token.colorTextSecondary,
                        flex: 1,
                      }}
                    >
                      {teacher.email}
                    </Text>
                  </Flex>

                  {teacher.qualification && (
                    <Flex align="center" gap={8}>
                      <BookOutlined style={{ color: token.colorTextSecondary, fontSize: 14 }} />
                      <Text style={{ fontSize: token.fontSizeSM, color: token.colorTextSecondary }}>
                        {teacher.qualification}
                      </Text>
                    </Flex>
                  )}

                  {teacher.classRate && (
                    <Flex align="center" gap={8}>
                      <DollarOutlined style={{ color: '#10b981', fontSize: 14 }} />
                      <Text style={{ fontSize: token.fontSizeSM, color: '#10b981', fontWeight: 600 }}>
                        ${teacher.classRate}/hr
                      </Text>
                    </Flex>
                  )}
                </Flex>

                {/* Actions */}
                <Flex gap={8} style={{ marginTop: token.marginMD }}>
                  <Tooltip title="View Details">
                    <Button
                      type="primary"
                      ghost
                      icon={<EyeOutlined />}
                      onClick={() => handleViewDetails(teacher)}
                      style={{ flex: 1, borderRadius: 8 }}
                    />
                  </Tooltip>

                  {isAdminOrMod && (
                    <Tooltip title="Edit">
                      <Button
                        icon={<EditOutlined />}
                        onClick={() => handleEdit(teacher)}
                        style={{ borderRadius: 8 }}
                      />
                    </Tooltip>
                  )}

                  {isAdmin && (
                    <Popconfirm
                      title="Delete Teacher"
                      description="Are you sure?"
                      onConfirm={() => handleDelete(teacher.id)}
                      okText="Yes"
                      cancelText="No"
                    >
                      <Tooltip title="Delete">
                        <Button
                          danger
                          icon={<DeleteOutlined />}
                          loading={deleteTeacherMutation.isPending}
                          style={{ borderRadius: 8 }}
                        />
                      </Tooltip>
                    </Popconfirm>
                  )}
                </Flex>
              </Card>
            </Col>
          );
        })}
      </Row>
      
      <Flex justify="end" style={{ marginTop: token.marginLG }}>
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
