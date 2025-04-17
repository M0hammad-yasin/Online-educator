import React from "react";
import { Card, Typography, theme } from "antd";

const { Title, Text } = Typography;

interface SummaryCardProps {
  title: string;
  value: string | number;
  period: string;
  icon: React.ReactNode;
}

const SummaryCard: React.FC<SummaryCardProps> = ({
  title,
  value,
  period,
  icon,
}) => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Card
      style={{
        borderRadius: borderRadiusLG,
        background: colorBgContainer,
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.09)", // Subtle shadow
      }}
      bodyStyle={{ padding: "20px 24px" }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <Text strong>{title}</Text>
        {/* Placeholder for dropdown icon */}
        <span style={{ cursor: "pointer" }}>...</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", marginBottom: 8 }}>
        <div style={{ marginRight: 16 }}>{icon}</div>
        <Title level={2} style={{ margin: 0 }}>
          {value}
        </Title>
      </div>
      <Text type="secondary">{period}</Text>
    </Card>
  );
};

export default SummaryCard;
