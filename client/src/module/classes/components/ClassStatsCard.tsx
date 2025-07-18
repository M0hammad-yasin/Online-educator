// client/src/module/classes/components/ClassStatsCard.tsx

import React from 'react';
import { Card, Typography, theme, Flex, Select, DatePicker, Skeleton } from 'antd';
import dayjs from 'dayjs';
import { useClassesCount } from '../hooks/useClasses';
import { ClassFilters, ClassStatus } from '../types/class.type';
import { useClassStore } from '../store/useClassStore';

const { Title } = Typography;

export interface SelectClassOption {
  value: ClassStatus;
  label: string;
}

interface ClassStatsCardProps {
  icon: React.ReactNode;
  titleOptions: SelectClassOption[];
  onPeriodChange?: (date: dayjs.Dayjs, dateString: string | string[]) => void;
  statType?: 'total' | 'scheduled' | 'completed' | 'cancelled' | 'live' | 'inProgress';
}

const ClassStatsCard: React.FC<ClassStatsCardProps> = ({
  icon,
  titleOptions,
  onPeriodChange,
  statType = 'total',
}) => {
  const { token } = theme.useToken();
  const [selectedTitle, setSelectedTitle] = React.useState<SelectClassOption>(
    titleOptions[0]
  );
  const classFilters = useClassStore((state) => state.filters);
  const [selectedPeriod, setSelectedPeriod] = React.useState<dayjs.Dayjs>(dayjs());
console.log(classFilters.page);
  const { data: classCount, isLoading } = useClassesCount(classFilters);
  console.log(classCount)

  const getStatValue = () => {
    if (!classCount?.data) return 0;
    
    const counts = classCount.data;
    switch (statType) {
      case 'total':
        return counts.total;
      case 'scheduled':
        return counts.scheduled;
      case 'completed':
        return counts.completed;
      case 'cancelled':
        return counts.cancelled;
      case 'live':
        return counts.live;
      case 'inProgress':
        return counts.inProgress;
      default:
        return counts.total;
    }
  };

  function SetTitle(label: any): ClassStatus | "all-classes" | undefined {
    if (label === "All Classes") {
      return "all-classes";
    }
    return 
  }

  return (
    <Card
      styles={{
        body: {
          padding: "14px 8px",
          borderRadius: token.borderRadiusLG,
          boxShadow: token.boxShadow,
          display: "flex",
          flexDirection: "column",
          height: "100%",
        },
      }}
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Flex
        vertical
        align={"center"}
        justify="center"
        gap={4}
        style={{ margin: 0 }}
      >
        <Flex 
          justify="space-evenly" 
          align="center" 
          style={{ width: "100%", marginBottom: "20px" }}
        >
          <Title level={4} style={{ margin: 0, fontSize: 20 }}>
            <Select
              style={{ width: 160, textAlign: "left" }}
              value={selectedTitle.label}
              onChange={(value) => {
                setSelectedTitle(titleOptions.find((option) => option.value === value) as SelectClassOption);
                classFilters.classStatus = SetTitle(selectedTitle.value);
              }}
              options={titleOptions}
            />
          </Title>
        </Flex>
        
        <Flex
          justify={"space-evenly"}
          align="center"
          gap={16}
          style={{ width: "100%", padding: "5px 8px", margin: "10px 0px" }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: 8,
              borderRadius: token.borderRadiusLG,
              backgroundColor: token.colorPrimaryBg,
              color: token.colorPrimary,
              fontSize: 25,
            }}
          >
            {icon}
          </div>
          
          {isLoading ? (
            <Skeleton.Input active size="small"  />
          ) : (
            <Title level={1} style={{ margin: 0 }}>
              {getStatValue()}
            </Title>
          )}
        </Flex>
        
        <Flex 
          justify="center" 
          align="center" 
          style={{ width: "100%" }}
        >
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

export default ClassStatsCard;