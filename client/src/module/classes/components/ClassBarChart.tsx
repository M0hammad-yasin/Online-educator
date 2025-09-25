// client/src/module/classes/components/ClassBarChart.tsx

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useClassesCountByGroup } from '../hooks/useClasses';
import { ClassStatus } from '../types/class.type';
import { Skeleton, Empty } from 'antd';
import dayjs from 'dayjs';

interface ClassBarChartProps {
  status?: ClassStatus | 'all-classes';
  groupBy?: 'day' | 'hour' | 'month';
  height?: number;
}

const ClassBarChart: React.FC<ClassBarChartProps> = ({
  status = 'SCHEDULED',
  groupBy = 'day',
  height = 300,
}) => {
  const { data: chartData, isLoading } = useClassesCountByGroup({
    groupBy,
  });

  // Transform data for the chart
  const transformedData = React.useMemo(() => {
    if (!chartData?.data) return [];

    const rawData = chartData.data;
    
    // Handle different data structures based on groupBy
    if (groupBy === 'day') {
      // Generate data for the last 7 days
      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const date = dayjs().subtract(i, 'day');
        const key = date.format('YYYY-MM-DD');
        return {
          name: date.format('ddd'),
          value: rawData[key] || 0,
          fullDate: date.format('MMM DD'),
        };
      }).reverse();
      
      return last7Days;
    } else if (groupBy === 'hour') {
      // Generate data for 24 hours
      return Array.from({ length: 24 }, (_, i) => ({
        name: `${i}:00`,
        value: rawData[i] || 0,
        fullDate:undefined,
      }));
    } else if (groupBy === 'month') {
      // Generate data for the last 12 months
      const last12Months = Array.from({ length: 12 }, (_, i) => {
        const date = dayjs().subtract(i, 'month');
        const key = date.format('YYYY-MM');
        return {
          name: date.format('MMM'),
          value: rawData[key] || 0,
          fullDate: date.format('MMM YYYY'),
        };
      }).reverse();
      
      return last12Months;
    }

    return [];
  }, [chartData, groupBy]);

  if (isLoading) {
    return <Skeleton active paragraph={{ rows: 8 }} />;
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart
        data={transformedData}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey="name" 
          tick={{ fontSize: 12 }}
          interval={0}
          angle={groupBy === 'hour' ? -45 : 0}
          textAnchor={groupBy === 'hour' ? 'end' : 'middle'}
          height={groupBy === 'hour' ? 60 : 30}
        />
        <YAxis tick={{ fontSize: 12 }} />
        <Tooltip 
          formatter={(value: number) => [value, 'Classes']}
          labelFormatter={(label) => {
            const item = transformedData.find(d => d.name === label);
            return item?.fullDate || label;
          }}
        />
        <Bar 
          dataKey="value" 
          fill="#1890ff"
          radius={[4, 4, 0, 0]}
          name="Classes"
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default ClassBarChart;