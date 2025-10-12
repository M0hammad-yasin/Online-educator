import React from 'react';
import {
  Drawer,
  Descriptions,
  Avatar,
  Tag,
  Space,
  Divider,
  List,
  Card,
  Statistic,
  Row,
  Col,
  theme as antdTheme,
  Spin,
  Empty,
} from 'antd';
import {
  UserOutlined,
  MailOutlined,
  BookOutlined,
  DollarOutlined,
  HomeOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons';
import { Teacher } from '../../../module/teacher/types/teacher.types';
import { useTeachersWithClasses } from '../../../module/teacher/hooks/useTeachers';
import AccessControlPanel from './AccessControlPanel';
import useAuthStore from '../../../module/authentication/store/authStore';
import { Role } from '../../../constants/role';

interface TeacherDetailDrawerProps {
  open: boolean;
  onClose: () => void;
  teacher: Teacher | null;
}

const TeacherDetailDrawer: React.FC<TeacherDetailDrawerProps> = ({ open, onClose, teacher }) => {
  const { token } = antdTheme.useToken();
  const user = useAuthStore((s) => s.user);
  const isAdmin = user?.role === Role.ADMIN;

  // Fetch teacher with classes
  const { data: teacherWithClassesData, isLoading } = useTeachersWithClasses({
    search: teacher?.email,
  });

  const teacherWithClasses = teacherWithClassesData?.data?.[0];
  const classes = teacherWithClasses?.scheduledClasses || [];
  const classCount = classes.length;

  if (!teacher) return null;

  return (
    <Drawer
      title={
        <Space>
          <Avatar
            size={48}
            src={teacher.profilePicture}
            icon={<UserOutlined />}
            style={{ background: token.colorPrimary }}
          />
          <div>
            <div style={{ fontSize: token.fontSizeLG, fontWeight: 600 }}>{teacher.name}</div>
            <div style={{ fontSize: token.fontSize, color: token.colorTextSecondary }}>
              Teacher Details
            </div>
          </div>
        </Space>
      }
      placement="right"
      width={640}
      onClose={onClose}
      open={open}
    >
      {/* Basic Information */}
      <Card
        title="Basic Information"
        size="small"
        style={{ marginBottom: token.marginMD }}
      >
        <Descriptions column={1} size="small">
          <Descriptions.Item label={<Space><UserOutlined />Name</Space>}>
            {teacher.name}
          </Descriptions.Item>
          <Descriptions.Item label={<Space><MailOutlined />Email</Space>}>
            {teacher.email}
          </Descriptions.Item>
          <Descriptions.Item label={<Space><BookOutlined />Qualification</Space>}>
            {teacher.qualification || 'N/A'}
          </Descriptions.Item>
          <Descriptions.Item label={<Space><DollarOutlined />Class Rate</Space>}>
            {teacher.classRate ? `$${teacher.classRate}/hr` : 'N/A'}
          </Descriptions.Item>
          <Descriptions.Item label={<Space><HomeOutlined />Address</Space>}>
            {teacher.address || 'N/A'}
          </Descriptions.Item>
          <Descriptions.Item label="Email Verified">
            {teacher.isEmailVerified ? (
              <Tag icon={<CheckCircleOutlined />} color="success">
                Verified
              </Tag>
            ) : (
              <Tag icon={<CloseCircleOutlined />} color="warning">
                Not Verified
              </Tag>
            )}
          </Descriptions.Item>
          <Descriptions.Item label="Member Since">
            {new Date(teacher.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      {/* Class Statistics */}
      <Card
        title="Class Statistics"
        size="small"
        style={{ marginBottom: token.marginMD }}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Statistic title="Total Classes" value={classCount} />
          </Col>
          <Col span={12}>
            <Statistic
              title="Active Classes"
              value={classes.filter((c) => c.classStatus === 'SCHEDULED').length}
            />
          </Col>
        </Row>
      </Card>

      {/* Classes Assigned */}
      <Card title="Assigned Classes" size="small" style={{ marginBottom: token.marginMD }}>
        {isLoading ? (
          <Spin />
        ) : classes.length > 0 ? (
          <List
            size="small"
            dataSource={classes.slice(0, 5)}
            renderItem={(cls) => (
              <List.Item>
                <List.Item.Meta
                  title={
                    <Space>
                      <span>{cls.subject}</span>
                      <Tag color={cls.classStatus === 'SCHEDULED' ? 'blue' : 'default'}>
                        {cls.classStatus}
                      </Tag>
                    </Space>
                  }
                  description={
                    <Space>
                      <CalendarOutlined />
                      {new Date(cls.scheduledAt).toLocaleString()}
                    </Space>
                  }
                />
              </List.Item>
            )}
          />
        ) : (
          <Empty description="No classes assigned" />
        )}
        {classes.length > 5 && (
          <div style={{ marginTop: token.marginSM, color: token.colorTextSecondary }}>
            And {classes.length - 5} more classes...
          </div>
        )}
      </Card>

      {/* Access Control Panel - Admin Only */}
      {isAdmin && (
        <>
          <Divider />
          <AccessControlPanel teacherId={teacher.id} />
        </>
      )}
    </Drawer>
  );
};

export default TeacherDetailDrawer;
