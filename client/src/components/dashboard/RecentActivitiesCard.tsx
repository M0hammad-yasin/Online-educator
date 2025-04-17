import React from "react";
import { Card, List, Typography, theme, Avatar } from "antd";

const { Text } = Typography;

interface ActivityItem {
  id: string | number;
  icon: React.ReactNode; // Icon for the activity
  title: string;
  description: string;
  time: string;
}

interface RecentActivitiesCardProps {
  title: string;
  items: ActivityItem[];
  onShowMore?: () => void;
}

const RecentActivitiesCard: React.FC<RecentActivitiesCardProps> = ({
  title,
  items,
  onShowMore,
}) => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Card
      style={{
        borderRadius: borderRadiusLG,
        background: colorBgContainer,
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.09)",
        height: "100%",
      }}
      bodyStyle={{
        padding: "20px 24px",
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
      title={<Text strong>{title}</Text>}
    >
      <List
        itemLayout="horizontal"
        dataSource={items}
        renderItem={(item) => (
          <List.Item style={{ padding: "12px 0" }}>
            <List.Item.Meta
              avatar={
                <Avatar
                  size="large"
                  icon={item.icon}
                  style={{
                    backgroundColor: "transparent",
                    color: theme.useToken().token.colorPrimary,
                  }}
                />
              }
              title={
                <Text strong style={{ fontSize: "14px" }}>
                  {item.title}
                </Text>
              }
              description={
                <Text type="secondary" style={{ fontSize: "12px" }}>
                  {item.description}
                </Text>
              }
            />
            <Text
              type="secondary"
              style={{ fontSize: "12px", whiteSpace: "nowrap", marginLeft: 16 }}
            >
              {item.time}
            </Text>
          </List.Item>
        )}
        style={{ flexGrow: 1, overflowY: "auto" }}
      />
      {onShowMore && (
        <div style={{ textAlign: "center", marginTop: 12 }}>
          <a onClick={onShowMore} style={{ fontSize: "12px" }}>
            Show more
          </a>
        </div>
      )}
    </Card>
  );
};

export default RecentActivitiesCard;
