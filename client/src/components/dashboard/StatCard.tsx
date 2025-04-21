import React from "react";
import { Card, Typography, Space, theme } from "antd";

const { Title, Text } = Typography;

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: number;
  period: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, title, value, period }) => {
  const { token } = theme.useToken();

  return (
    <Card style={{ padding: 5 }}>
      <Space direction="horizontal" align="center">
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: 8,
            borderRadius: token.borderRadiusLG,
            backgroundColor: token.colorPrimaryBg,
            color: token.colorPrimary,
            fontSize: 24,
          }}
        >
          {icon}
        </div>
        <Space direction="vertical" size={0}>
          <Text type="secondary">{title}</Text>
          <Title level={3} style={{ margin: 0 }}>
            {value}
          </Title>
          <Text type="secondary" style={{ fontSize: 12 }}>
            {period}
          </Text>
        </Space>
      </Space>
    </Card>
  );
};

export default StatCard;
