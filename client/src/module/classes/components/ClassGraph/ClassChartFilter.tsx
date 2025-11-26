// client/src/module/classes/components/ClassChartFilter.tsx

import React from 'react';
import { Space, Select, Button } from 'antd';
import dayjs from 'dayjs';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import { ClassFilters, ClassStatus } from '../../types/class.type';

dayjs.extend(weekOfYear);


// Helper function to format date based on groupBy
const getFormattedDate = (date: dayjs.Dayjs, groupBy: ClassFilters['groupBy']): string => {
  switch (groupBy) {
    case 'day':
      return date.format('DD MMM');
    case 'month':
      return date.format('MMM YYYY');
    case 'hour':
      return date.format('hh:mm A');
    default:
      return date.format('DD MMM');
  }
};

export interface ClassChartFilterProps {
  groupBy: ClassFilters['groupBy'];
  status: ClassStatus;
  startDate: dayjs.Dayjs;
  endDate: dayjs.Dayjs;
  onGroupByChange: (val: ClassFilters['groupBy']) => void;
  onStatusChange: (val: ClassStatus) => void;
  onPrev: () => void;
  onNext: () => void;
}

const ClassChartFilter: React.FC<ClassChartFilterProps> = ({
  groupBy,
  status,
  startDate,
  endDate,
  onGroupByChange,
  onStatusChange,
  onPrev,
  onNext,
}) => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: 16,
      }}
    >
      {/* Left side filters */}
      <Space>
        <Select
          value={groupBy}
          options={[
            { value: 'day', label: 'Per Day' },
            { value: 'month', label: 'Per Month' },
            { value: 'hour', label: 'Per Hour' },
          ]}
          onChange={onGroupByChange}
          style={{ minWidth: 120 }}
        />

        <Select
          value={status}
          options={[
            { value: 'all', label: 'All Status' },
            { value: 'SCHEDULED', label: 'Scheduled' },
            { value: 'IN_PROGRESS', label: 'In Progress' },
            { value: 'COMPLETED', label: 'Completed' },
            { value: 'CANCELLED', label: 'Cancelled' },
          ]}
          onChange={onStatusChange}
          style={{ minWidth: 140 }}
        />
      </Space>

      {/* Right side date navigation */}
      <Space>
        <Button shape='round' onClick={onPrev}>
          {` < ${getFormattedDate(startDate, groupBy)}`}
        </Button>
        <Button shape="round" onClick={onNext}>
          {`${getFormattedDate(endDate, groupBy)} >`}
        </Button>
      </Space>
    </div>
  );
};

export default ClassChartFilter;
