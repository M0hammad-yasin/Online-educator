// client/src/module/classes/components/ClassRecentActivities.tsx

import React from 'react';
import { Card, Typography, List, Avatar, Button, Tag, Flex, theme, Skeleton, Empty } from 'antd';
import { useClasses } from '../hooks/useClasses';
import { ClassStatus } from '../types/class.type';
import { FaBookOpen, FaPlay, FaCheck, FaTimes, FaClock } from 'react-icons/fa';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

const { Title, Text } = Typography;
const { useToken } = theme;

interface ActivityItem {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  time: string;
  color: string;
  status: ClassStatus;
}

const getStatusIcon = (status: ClassStatus): React.ReactNode => {
  switch (status) {
    case 'SCHEDULED':
      return <FaClock />;
    case 'IN_PROGRESS':
      return <FaPlay />;
    case 'COMPLETED':
      return <FaCheck />;
    case 'CANCELLED':
      return <FaTimes />;
    case 'LIVE':
      return <FaPlay />;
    default:
      return <FaBookOpen />;
  }
};

const getStatusColor = (status: ClassStatus): string => {
  switch (status) {
    case 'SCHEDULED':
      return '#1890ff';
    case 'IN_PROGRESS':
      return '#faad14';
    case 'COMPLETED':
      return '#52c41a';
    case 'CANCELLED':
      return '#f5222d';
    case 'LIVE':
      return '#722ed1';
    default:
      return '#1890ff';
  }
};

const getActivityDescription = (classItem: any): string => {
  const teacherName = classItem.teacher?.name || 'Unknown Teacher';
  const studentName = classItem.student?.name || 'Unknown Student';
  
  switch (classItem.classStatus) {
    case 'SCHEDULED':
      return `${teacherName} scheduled a class with ${studentName}`;
    case 'IN_PROGRESS':
      return `Class is currently in progress with ${teacherName}`;
    case 'COMPLETED':
      return `${teacherName} completed the class with ${studentName}`;
    case 'CANCELLED':
      return `Class was cancelled by ${teacherName}`;
    case 'LIVE':
      return `${teacherName} is live with ${studentName}`;
    default:
      return `Class activity with ${teacherName}`;
  }
};

const ClassRecentActivities: React.FC = () => {
  const { token } = useToken();
  
  const { data: classesData, isLoading } = useClasses({
    limit: 10,
    page: 1,
    sortBy: 'startTime',
    order: 'desc',
  });

  const activities: ActivityItem[] = React.useMemo(() => {
    if (!classesData?.data) return [];

    return classesData.data.map(classItem => ({
      id: classItem.id,
      icon: getStatusIcon(classItem.classStatus),
      title: classItem.subject,
      description: getActivityDescription(classItem),
      time: dayjs(classItem.scheduledAt).fromNow(),
      color: getStatusColor(classItem.classStatus),
      status: classItem.classStatus,
    }));
  }, [classesData]);

  if (isLoading) {
    return (
      <Card
        title="Recent Class Activities"
        style={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
        styles={{
          body: {
            flex: 1,
            display: "flex",
            flexDirection: "column",
            padding: '16px',
          },
        }}
      >
        {Array.from({ length: 6 }).map((_, index) => (
          <Skeleton key={index} active paragraph={{ rows: 2 }} style={{ marginBottom: 16 }} />
        ))}
      </Card>
    );
  }

  return (
    <Card
      title={
        <Flex justify="space-between" align="center">
          <Title level={5} style={{ margin: 0 }}>
            Recent Class Activities
          </Title>
          <Tag color="processing">Live</Tag>
        </Flex>
      }
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        borderRadius: token.borderRadiusLG,
        overflow: "hidden",
      }}
      styles={{
        body: {
          flex: 1,
          display: "flex",
          flexDirection: "column",
          padding: 0,
        },
      }}
    >
      {activities.length === 0 ? (
        <Empty description="No recent activities" style={{ margin: 'auto' }} />
      ) : (
        <List
          itemLayout="horizontal"
          dataSource={activities.slice(0, 8)}
          renderItem={(item, index) => (
            <List.Item
              style={{
                padding: "12px 24px",
                borderBottom:
                  index < activities.length - 1
                    ? `1px solid ${token.colorBorderSecondary}`
                    : "none",
                transition: "background-color 0.3s",
              }}
            >
              <Flex align="center" style={{ width: "100%" }}>
                <Avatar
                  size="large"
                  icon={item.icon}
                  style={{
                    backgroundColor: item.color,
                    marginRight: 16,
                  }}
                />
                <Flex vertical style={{ flex: 1, overflow: "hidden" }}>
                  <Flex align="center" justify="space-between">
                    <Title level={5} style={{ margin: 0, fontSize: 16 }}>
                      {item.title}
                    </Title>
                    <Tag color={item.color}>{item.time}</Tag>
                  </Flex>
                  <Text
                    type="secondary"
                    style={{
                      whiteSpace: "normal",
                      wordBreak: "break-word",
                    }}
                  >
                    {item.description}
                  </Text>
                </Flex>
              </Flex>
            </List.Item>
          )}
          style={{
            flex: 1,
            overflow: "auto",
          }}
        />
      )}
      
      {activities.length > 0 && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignContent: "center",
            padding: "12px 24px",
            borderTop: `1px solid ${token.colorBorderSecondary}`,
          }}
        >
          <Button type="link" style={{ padding: 0 }}>
            Show more
          </Button>
        </div>
      )}
    </Card>
  );
};

export default ClassRecentActivities;