// client/src/module/classes/components/ClassListCard.tsx

import React, { useState } from 'react';
import { Card, Typography, List, Avatar, Tag, Flex, Button, theme, Skeleton, DatePicker } from 'antd';
import { useClasses } from '../hooks/useClasses';
import { ClassFilters, ClassStatus } from '../types/class.type';
import { FaClock, FaUser, FaAngleDown, FaBook } from 'react-icons/fa';
import dayjs from 'dayjs';
import {CalendarOutlined} from '@ant-design/icons'
import { IconBaseProps } from 'react-icons';
 const { Title, Text } = Typography;

interface SelectOption {
  value: string;
  label: string;
}

interface ClassListCardProps {
  titleOptions: SelectOption[];
  icons: React.ReactNode;
  filters?: ClassFilters;
  maxItems?: number;
  onViewMore?: () => void;
}

const getStatusColor = (status: ClassStatus): string => {
  switch (status) {
    case 'SCHEDULED':
      return 'blue';
    case 'IN_PROGRESS':
      return 'orange';
    case 'COMPLETED':
      return 'green';
    case 'CANCELLED':
      return 'red';
    default:
      return 'default';
  }
};

const getStatusText = (status: ClassStatus): string => {
  switch (status) {
    case 'SCHEDULED':
      return 'Scheduled';
    case 'IN_PROGRESS':
      return 'In Progress';
    case 'COMPLETED':
      return 'Completed';
    case 'CANCELLED':
      return 'Cancelled';
    default:
      return status;
  }
};

const ClassListCard: React.FC<ClassListCardProps> = ({
  titleOptions,
  icons,
  filters = { limit: 7, page: 1 },
  maxItems = 7,
  onViewMore,
}) => {
  const { token } = theme.useToken();
  const [selectedTitle, setSelectedTitle] = useState<string>(
    titleOptions[0].label
  );
  const [selectedPeriod, setSelectedPeriod] = useState<dayjs.Dayjs>(dayjs());

  const { data: classesData, isLoading } = useClasses({
    ...filters,
    limit: maxItems,
  });
  const classes = classesData?.data || [];

  return (
    <Card
      title={
        <Flex justify='space-between' align='center' vertical>
        <Flex justify="space-between" align="center">
          <Title level={5} style={{ margin: 0 }}>
            {selectedTitle}
          </Title>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: 6,
              borderRadius: token.borderRadiusLG,
              backgroundColor: token.colorPrimaryBg,
              color: token.colorPrimary,
              fontSize: 16,
            }}
          >
            {icons}
          </div>
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
        display: "flex",
        flexDirection: "column",
      }}
      styles={{
        body: {
          flex: 1,
          display: "flex",
          flexDirection: "column",
          padding: 0,
        },
      }}
    >
      {isLoading ? (
        <div style={{ padding: '16px' }}>
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} active paragraph={{ rows: 1 }} style={{ marginBottom: 16 }} />
          ))}
        </div>
      ) : (
        <List
          itemLayout="horizontal"
          dataSource={classes}
          renderItem={(classItem, index) => (
            <List.Item
              style={{
                padding: "12px 16px",
                borderBottom:
                  index < classes.length - 1
                    ? `1px solid ${token.colorBorderSecondary}`
                    : "none",
              }}
            >
              <Flex align="center" style={{ width: "100%" }}>
                <Avatar
                  size="small"
                  icon={<FaBook />}
                  style={{
                    backgroundColor: getStatusColor(classItem.classStatus),
                    marginRight: 12,
                    flexShrink: 0,
                  }}
                />
                <Flex vertical style={{ flex: 1, minWidth: 0 }}>
                  <Flex justify="space-between" align="center">
                    <Text
                      strong
                      style={{
                        fontSize: 14,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {classItem.subject}
                    </Text>
                    <Tag
                      color={getStatusColor(classItem.classStatus)}
                      style={{ fontSize: 11, marginLeft: 8 }}
                    >
                      {getStatusText(classItem.classStatus)}
                    </Tag>
                  </Flex>
                  <Flex align="center" gap={8} style={{ marginTop: 4 }}>
                    <Flex align="center" gap={4}>
                      <FaClock style={{ fontSize: 11, color: token.colorTextSecondary }} />
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        {dayjs(classItem.scheduledAt).format('MMM DD, HH:mm')}
                      </Text>
                    </Flex>
                    {classItem.teacher && (
                      <Flex align="center" gap={4}>
                        <FaUser style={{ fontSize: 11, color: token.colorTextSecondary }} />
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          {classItem.teacher.name}
                        </Text>
                      </Flex>
                    )}
                  </Flex>
                </Flex>
              </Flex>
            </List.Item>
          )}
          style={{
            flex: 1,
            overflow: "auto",
          }}
        />
      )}
      
      {classes.length > 0 && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            padding: "12px 16px",
            borderTop: `1px solid ${token.colorBorderSecondary}`,
          }}
        >
          <Button type="link" onClick={onViewMore} style={{ padding: 0 }}>
            View all classes
          </Button>
        </div>
      )}
    </Card>
  );
};

export default ClassListCard;