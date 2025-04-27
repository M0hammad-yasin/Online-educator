import React from "react";
import { Card, Typography, Space, Timeline, Avatar, Button } from "antd";
import { FaTrophy, FaRocket, FaGlobeAmericas } from "react-icons/fa";

const { Title, Text } = Typography;

interface ActivityProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  time: string;
  color?: string;
}

const Activity: React.FC<ActivityProps> = ({
  icon,
  title,
  description,
  time,
  color,
}) => {
  return (
    <Space direction="vertical" size={0}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <Avatar
          size="small"
          icon={icon}
          style={{ backgroundColor: color || "#1890ff" }}
        />
        <Title level={3} style={{ fontSize: 15 }}>
          {title}
        </Title>
      </div>
      <Text type="secondary">{description}</Text>
      <Text type="secondary" style={{ fontSize: 12 }}>
        {time}
      </Text>
    </Space>
  );
};

const RecentActivities: React.FC = () => {
  return (
    <Card
      title="Recent Activities"
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
        },
      }}
    >
      <Timeline
        items={[
          {
            dot: <FaTrophy style={{ fontSize: "16px", color: "#1890ff" }} />,
            children: (
              <Activity
                icon={<FaTrophy />}
                title="1st place in 'Chess'"
                description="John Doe won 1st place in 'Chess'"
                time="1 day ago"
                color="#1890ff"
              />
            ),
          },
          {
            dot: <FaRocket style={{ fontSize: "16px", color: "#52c41a" }} />,
            children: (
              <Activity
                icon={<FaRocket />}
                title="Participated in 'Carrom'"
                description="Justin Lee participated in 'Carrom'"
                time="2 hours ago"
                color="#52c41a"
              />
            ),
          },
          {
            dot: (
              <FaGlobeAmericas style={{ fontSize: "16px", color: "#722ed1" }} />
            ),
            children: (
              <Activity
                icon={<FaGlobeAmericas />}
                title="Internation conference in 'St.John School'"
                description="Justin Lee attended internation conference in 'St.John School'"
                time="2 Week ago"
                color="#722ed1"
              />
            ),
          },
          {
            dot: <FaTrophy style={{ fontSize: "16px", color: "#faad14" }} />,
            children: (
              <Activity
                icon={<FaTrophy />}
                title="Won 1st place in 'Chess'"
                description="John Doe won 1st place in 'Chess'"
                time="3 Day ago"
                color="#faad14"
              />
            ),
          },
          {
            dot: <FaTrophy style={{ fontSize: "16px", color: "#faad14" }} />,
            children: (
              <Activity
                icon={<FaTrophy />}
                title="Won 1st place in 'Chess'"
                description="John Doe won 1st place in 'Chess'"
                time="3 Day ago"
                color="#faad14"
              />
            ),
          },
        ]}
      />
      <Button type="link" style={{ padding: 0 }}>
        Show more
      </Button>
    </Card>
  );
};

export default RecentActivities;
