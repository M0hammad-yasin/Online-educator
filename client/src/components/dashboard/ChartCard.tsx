import React from "react";
import { Card, Typography, theme, Space } from "antd";

const { Text } = Typography;

interface ChartCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode; // To render the actual chart component
  onOptionsClick?: () => void; // Optional handler for options/dropdown
}

const ChartCard: React.FC<ChartCardProps> = ({
  title,
  subtitle,
  children,
  onOptionsClick,
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
        height: "100%", // Ensure card takes full height
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
          {/* Placeholder for options icon/dropdown */}
          {onOptionsClick && (
            <span style={{ cursor: "pointer" }} onClick={onOptionsClick}>
              ...
            </span>
          )}
        </div>
      }
    >
      <div style={{ flexGrow: 1 }}>{children}</div>
    </Card>
  );
};

export default ChartCard;
