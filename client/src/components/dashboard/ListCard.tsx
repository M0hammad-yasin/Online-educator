import React from "react";
import { Card, List, Typography, theme, Space } from "antd";

const { Text } = Typography;

interface ListItem {
  id: string | number;
  primary: string;
  secondary?: string;
  status?: "success" | "error" | "default" | "processing" | "warning"; // Optional status indicator
}

interface ListCardProps {
  title: string;
  subtitle?: string;
  items: ListItem[];
  onShowMore?: () => void;
}

const ListCard: React.FC<ListCardProps> = ({
  title,
  subtitle,
  items,
  onShowMore,
}) => {
  const {
    token: {
      colorBgContainer,
      borderRadiusLG,
      colorTextSecondary,
      colorSuccess,
      colorError,
    },
  } = theme.useToken();

  const renderStatusDot = (status?: ListItem["status"]) => {
    let color = colorTextSecondary;
    if (status === "success") color = colorSuccess;
    if (status === "error") color = colorError;
    // Add more status colors if needed

    return (
      <span
        style={{
          display: "inline-block",
          width: 8,
          height: 8,
          borderRadius: "50%",
          backgroundColor: color,
          marginLeft: 8,
        }}
      />
    );
  };

  return (
    <Card
      style={{
        borderRadius: borderRadiusLG,
        background: colorBgContainer,
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.09)",
        height: "100%", // Ensure card takes full height of its grid cell
      }}
      bodyStyle={{
        padding: "20px 24px",
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
      title={
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Space direction="vertical" size={0}>
            <Text strong>{title}</Text>
            {subtitle && (
              <Text type="secondary" style={{ fontSize: "12px" }}>
                {subtitle}
              </Text>
            )}
          </Space>
          {/* Placeholder for options icon */}
          <span style={{ cursor: "pointer" }}>...</span>
        </div>
      }
    >
      <List
        itemLayout="horizontal"
        dataSource={items}
        renderItem={(item) => (
          <List.Item style={{ padding: "8px 0" }}>
            <List.Item.Meta
              title={<Text style={{ fontSize: "14px" }}>{item.primary}</Text>}
              description={
                item.secondary && (
                  <Text type="secondary" style={{ fontSize: "12px" }}>
                    {item.secondary}
                  </Text>
                )
              }
            />
            {item.status && renderStatusDot(item.status)}
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

export default ListCard;
