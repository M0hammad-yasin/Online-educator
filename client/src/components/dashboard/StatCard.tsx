import React, { useState } from "react";
import { Card, Typography, theme, Flex, Select, DatePicker } from "antd";
import dayjs from "dayjs";

const { Title } = Typography;

interface SelectOption {
  value: string;
  label: string;
}

interface StatCardProps {
  icon: React.ReactNode;
  value: number;
  titleOptions: SelectOption[];
  // periodOptions: SelectOption[]; // Removed
  onTitleChange?: (value: string) => void;
  onPeriodChange?: (date: dayjs.Dayjs, dateString: string | string[]) => void; // Updated signature
}

const StatCard: React.FC<StatCardProps> = ({
  icon,
  value,
  titleOptions,
  // periodOptions, // Removed
  onTitleChange,
  onPeriodChange,
}) => {
  const { token } = theme.useToken();

  const [selectedTitle, setSelectedTitle] = useState<string>(
    titleOptions[0].label
  );
  const [selectedPeriod, setSelectedPeriod] = useState<dayjs.Dayjs>(dayjs());
  return (
    <Card
      // className="stat-card"
      styles={{
        body: {
          padding: "14px 8px",
          borderRadius: token.borderRadiusLG,
          boxShadow: token.boxShadow,
        },
      }}
    >
      <Flex
        vertical
        align={"center"}
        justify="center"
        gap={4}
        style={{ margin: 0 }}
      >
        <Flex justify="space-evenly" align="center" className="w-full mb-10">
          <Title level={4} style={{ margin: 0, fontSize: 20 }}>
            <Select
              style={{ width: 160, textAlign: "left" }}
              value={selectedTitle}
              onChange={(value) => {
                setSelectedTitle(value);
                onTitleChange?.(value);
              }}
              options={titleOptions}
            />
          </Title>
        </Flex>
        <Flex
          justify={"space-evenly"}
          align="center"
          gap={16}
          className="w-full"
          style={{ padding: "5px 8px", margin: "10px 0px" }}
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
        <Flex justify="center" align="center" className="w-full">
          <DatePicker
            picker="month"
            defaultValue={selectedPeriod}
            format="MMM YYYY"
            style={{ width: 160, textAlign: "center" }}
            onChange={(date, dateString) => {
              if (date) setSelectedPeriod(date);
              onPeriodChange?.(date, dateString);
            }}
            allowClear={false}
          />
        </Flex>
      </Flex>
    </Card>
  );
};

export default StatCard;
