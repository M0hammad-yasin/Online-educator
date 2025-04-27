import React, { useState } from "react";
import {
  Card,
  Typography,
  Button,
  Flex,
  DatePicker,
  theme,
  Dropdown,
  Avatar,
  Tag,
  Tooltip,
} from "antd";
import { DownOutlined, CalendarOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import styles from "./ItemList.module.css";

const { Text, Title } = Typography; // Combine imports

interface Item {
  label: string;
  time: string;
  status: "success" | "warning" | "error" | "default";
}
interface SelectOption {
  value: string;
  label: string;
}
interface ItemListProps {
  items: Item[];
  titleOptions: SelectOption[];
  icon?: React.ReactNode; // Add icon prop
}

const ItemList: React.FC<ItemListProps> = ({ titleOptions, items, icon }) => {
  const { token } = theme.useToken();

  const [selectedTitle, setSelectedTitle] = useState<string>(
    titleOptions[0].label
  );
  const [selectedPeriod, setSelectedPeriod] = useState<dayjs.Dayjs>(dayjs());

  return (
    <Card
      styles={{
        header: {
          padding: "16px",
          borderBottom: `1px solid ${token.colorBorderSecondary}`,
          background: token.colorBgContainer,
        },
        body: {
          padding: "0",
          background: token.colorBgContainer,
        },
      }}
      title={
        <Flex justify="space-between" align="center" vertical>
          {/* Title and Dropdown */}
          <Flex align="center" gap={8}>
            <Title
              level={5}
              style={{
                textAlign: "center",
                margin: 0,
                fontWeight: 600,
                maxWidth: 140,
                wordBreak: "break-word",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "normal",
                lineHeight: 1.2,
                marginBottom: 8,
              }}
            >
              {selectedTitle}
            </Title>
            <Dropdown
              menu={{
                items: titleOptions.map((option) => ({
                  key: option.value,
                  label: option.label,
                })),
                onClick: ({ key }) => {
                  const selectedOption = titleOptions.find(
                    (option) => option.value === key
                  );
                  if (selectedOption) {
                    setSelectedTitle(selectedOption.label);
                  }
                },
              }}
              trigger={["click"]}
            >
              <Button
                type="text"
                size="small"
                icon={<DownOutlined />}
                style={{ padding: 0, color: token.colorPrimary }}
              />
            </Dropdown>
          </Flex>

          {/* Date Picker */}
          <Flex align="center">
            <DatePicker
              picker="month"
              defaultValue={selectedPeriod}
              format="MMM YYYY"
              style={{
                width: 120,
                borderRadius: token.borderRadiusLG,
              }}
              onChange={(date) => {
                if (date) setSelectedPeriod(date);
              }}
              allowClear={false}
              suffixIcon={
                <CalendarOutlined style={{ color: token.colorPrimary }} />
              }
              size="small"
            />
          </Flex>
        </Flex>
      }
      style={{
        height: "100%",
        boxShadow: token.boxShadow,
        borderRadius: token.borderRadiusLG,
        overflow: "hidden",
      }}
    >
      <div style={{ width: "100%" }}>
        {items.slice(0, 5).map((item, index) => (
          <Flex
            key={index}
            justify="space-between"
            align="center"
            className={styles.itemRow}
            style={{
              padding: "6px 12px",
              borderBottom:
                index < items.slice(0, 5).length - 1
                  ? `1px solid ${token.colorBorder}`
                  : "none",
            }}
          >
            <Flex align="center" gap={8}>
              <Avatar
                style={{
                  backgroundColor:
                    item.status === "success"
                      ? token.colorSuccess
                      : item.status === "warning"
                      ? token.colorWarning
                      : item.status === "error"
                      ? token.colorError
                      : token.colorPrimary,
                  fontSize: 12,
                }}
                icon={icon}
              >
                {!icon && item.label.charAt(0).toUpperCase()}
              </Avatar>
              <Text strong style={{ fontSize: "14px" }}>
                {item.label}
              </Text>
            </Flex>

            <Flex align="center" gap={12}>
              <Tooltip title={`Scheduled at ${item.time}`}>
                <Tag
                  color={
                    item.status === "success"
                      ? "success"
                      : item.status === "warning"
                      ? "warning"
                      : item.status === "error"
                      ? "error"
                      : "default"
                  }
                  style={{
                    borderRadius: token.borderRadiusSM,
                    margin: 0,
                    padding: "0 8px",
                  }}
                >
                  {item.time}
                </Tag>
              </Tooltip>
            </Flex>
          </Flex>
        ))}

        {items.length > 5 && (
          <Flex align="center" justify="center">
            <Button
              type="link"
              style={{
                padding: 0,
                fontWeight: 500,
                fontSize: "14px",
              }}
            >
              Show more
            </Button>
          </Flex>
        )}
      </div>
    </Card>
  );
};

export default ItemList;
