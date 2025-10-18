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
  Typography,
  Flex,
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
import { useTeachersWithClasses,AccessControlPanel,Teacher } from '..';
import {useAuthUser} from '../../authentication';
import { Role } from '../../../constants/role';
import useThemeStore from '../../../store/themeStore';

const { Text } = Typography;

interface TeacherDetailDrawerProps {
  open: boolean;
  onClose: () => void;
  teacher: Teacher | null;
}

const TeacherDetailDrawer: React.FC<TeacherDetailDrawerProps> = ({ open, onClose, teacher }) => {
  const { token } = antdTheme.useToken();
  const { mode } = useThemeStore();
  const user = useAuthUser();
  const isAdmin = user?.role === Role.ADMIN;

  // Fetch teacher with classes
  const { data: teacherWithClassesData, isLoading } = useTeachersWithClasses({
    search: teacher?.email,
  });

  const teacherWithClasses = teacherWithClassesData?.data?.[0];
  const classes = teacherWithClasses?.scheduledClasses || [];
  const classCount = classes.length;

  if (!teacher) return null;

  const cardStyle: React.CSSProperties = {
    marginBottom: token.marginMD,
    borderRadius: token.borderRadiusLG,
    background: mode === 'dark'
      ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)'
      : 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.7) 100%)',
    backdropFilter: 'blur(10px)',
    border: `1px solid ${mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.06)'}`,
  };

  const statCardStyle: React.CSSProperties = {
    textAlign: 'center',
    padding: token.paddingMD,
    borderRadius: token.borderRadiusLG,
    background: mode === 'dark'
      ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)'
      : 'linear-gradient(135deg, rgba(102, 126, 234, 0.08) 0%, rgba(118, 75, 162, 0.08) 100%)',
    border: `1px solid ${mode === 'dark' ? 'rgba(99, 102, 241, 0.2)' : 'rgba(102, 126, 234, 0.2)'}`,
  };

  return (
    <Drawer
      title={
        <Flex align="center" gap={token.size}>
          <Avatar
            size={56}
            src={teacher.profilePicture}
            icon={<UserOutlined />}
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              border: `2px solid ${token.colorBgContainer}`,
            }}
          />
          <Flex vertical>
            <Text strong style={{ fontSize: token.fontSizeLG }}>
              {teacher.name}
            </Text>
            <Text type="secondary" style={{ fontSize: token.fontSize }}>
              Teacher Profile
            </Text>
          </Flex>
        </Flex>
      }
      placement="right"
      width={640}
      onClose={onClose}
      open={open}
      styles={{
        body: {
          background: mode === 'dark' 
            ? 'linear-gradient(180deg, rgba(20, 20, 20, 0.98) 0%, rgba(31, 31, 31, 0.95) 100%)'
            : 'linear-gradient(180deg, rgba(248, 248, 248, 0.98) 0%, rgba(243, 253, 255, 0.95) 100%)',
        },
      }}
    >
      {/* Basic Information */}
      <Card
        title={
          <Text strong style={{ fontSize: token.fontSizeLG }}>
            📋 Basic Information
          </Text>
        }
        bordered={false}
        style={cardStyle}
      >
        <Descriptions column={1} size="small">
          <Descriptions.Item 
            label={
              <Space>
                <UserOutlined style={{ color: token.colorPrimary }} />
                <Text>Name</Text>
              </Space>
            }
          >
            <Text strong>{teacher.name}</Text>
          </Descriptions.Item>
          <Descriptions.Item 
            label={
              <Space>
                <MailOutlined style={{ color: token.colorInfo }} />
                <Text>Email</Text>
              </Space>
            }
          >
            <Text>{teacher.email}</Text>
          </Descriptions.Item>
          <Descriptions.Item 
            label={
              <Space>
                <BookOutlined style={{ color: token.colorWarning }} />
                <Text>Qualification</Text>
              </Space>
            }
          >
            <Tag color="blue" style={{ borderRadius: 6 }}>
              {teacher.qualification || 'N/A'}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item 
            label={
              <Space>
                <DollarOutlined style={{ color: '#10b981' }} />
                <Text>Class Rate</Text>
              </Space>
            }
          >
            <Text strong style={{ color: '#10b981' }}>
              {teacher.classRate ? `$${teacher.classRate}/hr` : 'N/A'}
            </Text>
          </Descriptions.Item>
          <Descriptions.Item 
            label={
              <Space>
                <HomeOutlined style={{ color: token.colorTextSecondary }} />
                <Text>Address</Text>
              </Space>
            }
          >
            <Text type="secondary">{teacher.address || 'N/A'}</Text>
          </Descriptions.Item>
          <Descriptions.Item label="Email Status">
            {teacher.isEmailVerified ? (
              <Tag icon={<CheckCircleOutlined />} color="success" style={{ borderRadius: 6 }}>
                Verified
              </Tag>
            ) : (
              <Tag icon={<CloseCircleOutlined />} color="warning" style={{ borderRadius: 6 }}>
                Not Verified
              </Tag>
            )}
          </Descriptions.Item>
          <Descriptions.Item label="Member Since">
            <Text type="secondary">
              {new Date(teacher.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </Text>
          </Descriptions.Item>
        </Descriptions>
      </Card>

      {/* Class Statistics */}
      <Card
        title={
          <Text strong style={{ fontSize: token.fontSizeLG }}>
            📊 Performance Metrics
          </Text>
        }
        bordered={false}
        style={cardStyle}
      >
        <Row gutter={16}>
          <Col span={12}>
            <div style={statCardStyle}>
              <Statistic 
                title="Total Classes" 
                value={classCount}
                valueStyle={{ 
                  color: token.colorPrimary,
                  fontSize: token.fontSizeHeading2,
                  fontWeight: 700,
                }}
              />
            </div>
          </Col>
          <Col span={12}>
            <div style={statCardStyle}>
              <Statistic
                title="Active Classes"
                value={classes.filter((c) => c.classStatus === 'SCHEDULED').length}
                valueStyle={{ 
                  color: '#10b981',
                  fontSize: token.fontSizeHeading2,
                  fontWeight: 700,
                }}
              />
            </div>
          </Col>
        </Row>
      </Card>

      {/* Classes Assigned */}
      <Card 
        title={
          <Text strong style={{ fontSize: token.fontSizeLG }}>
            📚 Assigned Classes
          </Text>
        }
        bordered={false}
        style={cardStyle}
      >
        {isLoading ? (
          <Flex justify="center" style={{ padding: token.paddingLG }}>
            <Spin />
          </Flex>
        ) : classes.length > 0 ? (
          <>
            <List
              size="small"
              dataSource={classes.slice(0, 5)}
              renderItem={(cls) => (
                <List.Item
                  style={{
                    padding: token.paddingSM,
                    borderRadius: token.borderRadius,
                    marginBottom: token.marginXS,
                    background: mode === 'dark' 
                      ? 'rgba(255, 255, 255, 0.02)' 
                      : 'rgba(0, 0, 0, 0.02)',
                  }}
                >
                  <List.Item.Meta
                    title={
                      <Space>
                        <Text strong>{cls.subject}</Text>
                        <Tag 
                          color={cls.classStatus === 'SCHEDULED' ? 'blue' : 'default'}
                          style={{ borderRadius: 4 }}
                        >
                          {cls.classStatus}
                        </Tag>
                      </Space>
                    }
                    description={
                      <Space>
                        <CalendarOutlined style={{ color: token.colorTextSecondary }} />
                        <Text type="secondary" style={{ fontSize: token.fontSizeSM }}>
                          {new Date(cls.scheduledAt).toLocaleString()}
                        </Text>
                      </Space>
                    }
                  />
                </List.Item>
              )}
            />
            {classes.length > 5 && (
              <Text type="secondary" style={{ fontSize: token.fontSizeSM }}>
                + {classes.length - 5} more classes
              </Text>
            )}
          </>
        ) : (
          <Empty 
            description="No classes assigned yet" 
            style={{ padding: token.paddingLG }}
          />
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
