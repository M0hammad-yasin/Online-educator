import React from "react";
import { Card, Typography, List, Avatar, Button, Tag, Flex, theme } from "antd";
import styles from "./RecentActivities.module.css";
import {
  FaBookOpen,
  FaUserGraduate,
  FaChalkboardTeacher,
  FaGraduationCap,
  FaStar,
  FaCalendarCheck,
  FaDollarSign,
  FaUsers,
  FaClipboard,
  FaRegClock,
} from "react-icons/fa";

const { Title, Text } = Typography;
const { useToken } = theme;

interface ActivityItem {
  icon: React.ReactNode;
  title: string;
  description: string;
  time: string;
  color: string;
}

const activityItems: ActivityItem[] = [
  {
    icon: <FaGraduationCap />,
    title: "Completed Advanced Math Course",
    description:
      "Emma Wilson completed the Advanced Math Course with distinction.",
    time: "1 day ago",
    color: "#1890ff",
  },
  {
    icon: <FaUserGraduate />,
    title: "New Student Enrollment",
    description: "Alex Johnson enrolled in the Physics 101 course.",
    time: "2 hours ago",
    color: "#52c41a",
  },
  {
    icon: <FaChalkboardTeacher />,
    title: "Teacher Added New Lesson Plan",
    description: "Ms. Parker added a new lesson plan for Chemistry class.",
    time: "2 days ago",
    color: "#722ed1",
  },
  {
    icon: <FaBookOpen />,
    title: "New Course Created",
    description:
      "The 'Introduction to Computer Science' course was successfully created.",
    time: "3 days ago",
    color: "#faad14",
  },
  {
    icon: <FaStar />,
    title: "Student Achievement",
    description: "Ryan Thomas scored 95% in the Biology Final Exam.",
    time: "5 days ago",
    color: "#eb2f96",
  },
  {
    icon: <FaCalendarCheck />,
    title: "Class Scheduled by Teacher",
    description:
      "Mr. Harris scheduled a new class on 'Environmental Science' for April 30th.",
    time: "6 hours ago",
    color: "#13c2c2",
  },
  {
    icon: <FaDollarSign />,
    title: "Payment Received from Student",
    description: "Samantha paid for 5 sessions of the Spanish Language Course.",
    time: "4 hours ago",
    color: "#fa541c",
  },
  {
    icon: <FaUsers />,
    title: "New Teacher Assigned to Class",
    description: "John Smith was assigned as the teacher for 'Physics 102'.",
    time: "1 day ago",
    color: "#f5222d",
  },
  {
    icon: <FaClipboard />,
    title: "Class Rescheduled by Teacher",
    description:
      "The 'Advanced Chemistry' class was rescheduled to May 5th at 10 AM.",
    time: "3 days ago",
    color: "#faad14",
  },
  {
    icon: <FaRegClock />,
    title: "Class Join Confirmation",
    description: "Student Lucy joined the 'Machine Learning' class at 3 PM.",
    time: "30 minutes ago",
    color: "#2f54eb",
  },
];

const RecentActivities: React.FC = () => {
  const { token } = useToken();

  return (
    <Card
      title={
        <Flex justify="space-between" align="center">
          <Title level={5} style={{ margin: 0 }}>
            Recent Educational Activities
          </Title>
          <Tag color="processing">Today</Tag>
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
      <List
        itemLayout="horizontal"
        dataSource={activityItems.slice(0, 8)}
        renderItem={(item, index) => (
          <List.Item
            style={{
              padding: "12px 24px",
              borderBottom:
                index < activityItems.length - 1
                  ? `1px solid ${token.colorBorderSecondary}`
                  : "none",
              transition: "background-color 0.3s",
            }}
            className={styles.activityItem}
          >
            <Flex
              align="center"
              style={{ width: "100%" }}
              className={styles.activityContent}
            >
              <Avatar
                size="large"
                icon={item.icon}
                style={{
                  backgroundColor: item.color,
                  marginRight: 16,
                }}
                className={styles.activityAvatar}
              />
              <Flex
                vertical
                style={{
                  flex: 1,
                  overflow: "hidden",
                }}
              >
                <Flex
                  align="center"
                  justify="space-between"
                  className={styles.activityHeader}
                >
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
        footer={
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignContent: "center",
              padding: "12px 24px",
            }}
          >
            <Button type="link" style={{ padding: 0 }}>
              Show more
            </Button>
          </div>
        }
        style={{
          flex: 1,
          // overflow: "auto",
        }}
        className={styles.activityList}
      />
    </Card>
  );
};

export default RecentActivities;
