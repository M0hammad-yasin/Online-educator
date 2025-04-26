import React from "react";
import { Card, Typography, Space, theme, Flex } from "antd";

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
    <Card
      // className="stat-card"
      styles={{
        body: {
          padding: "14px 8px",
          borderRadius: token.borderRadiusLG,
        },
      }}
      style={{
        margin: 0,
        borderRadius: token.borderRadiusLG,
        boxShadow: token.boxShadow,
      }}
    >
      <Flex
        vertical
        align={"center"}
        justify="center"
        gap={3}
        style={{ margin: 0 }}
      >
        <Title type="secondary" level={3}>
          {title}
        </Title>
        <Flex
          justify={"space-evenly"}
          align="center"
          gap={16}
          className="w-full"
          style={{ padding: "0 8px" }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: 10,
              borderRadius: token.borderRadiusLG,
              backgroundColor: token.colorPrimaryBg,
              color: token.colorPrimary,
              fontSize: 25,
            }}
          >
            {icon}
          </div>
          <Title level={1} style={{ margin: 0 }}>
            {value}
          </Title>
        </Flex>
        <Space direction="vertical" size={0}>
          <Text type="secondary" style={{ fontSize: 20, fontWeight: 500 }}>
            {period}
          </Text>
        </Space>
      </Flex>
    </Card>
  );
};

export default StatCard;
