import React from "react";
import { Card, Typography, Space, Badge, Button } from "antd";

const { Text } = Typography;

interface Item {
  label: string;
  time: string;
  status: "success" | "warning" | "error" | "default";
}

interface ItemListProps {
  title: string;
  date: string;
  items: Item[];
}

const ItemList: React.FC<ItemListProps> = ({ title, date, items }) => {
  return (
    <Card
      title={
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text strong>{title}</Text>
          <Text type="secondary" style={{ fontSize: 12 }}>
            {date}
          </Text>
        </div>
      }
      style={{ height: "100%" }}
    >
      <Space direction="vertical" style={{ width: "100%" }} size="small">
        {items.slice(0, 5).map((item, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "4px 0",
            }}
          >
            <Text>{item.label}</Text>
            <Space>
              <Text>{item.time}</Text>
              <Badge status={item.status} />
            </Space>
          </div>
        ))}
        <Button type="link" style={{ padding: 0 }}>
          Show more
        </Button>
      </Space>
    </Card>
  );
};

export default ItemList;
