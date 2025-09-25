// client/src/module/classes/components/ClassPerDayChart.tsx

import React from 'react';
import { Card, Skeleton } from 'antd';
import dayjs from 'dayjs';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LabelList,
} from 'recharts';
import { ClassFilters, ClassStatus } from '../../types/class.type';
import { useClassesCountByGroup } from '../../hooks/useClasses';
import ClassChartFilter from './ClassChartFilter';

dayjs.extend(weekOfYear);

interface DayCount {
  date: string; // key used for X-axis
  count: number;
  label: string; // short label for axis
  fullDate?: string; // tooltip full label
}

const WIDTH = 500;
const HEIGHT = 380;
const PADDING = { top: 16, right: 16, bottom: 36, left: 32 };
const noOfBAr=10;

const ClassPerDayChart: React.FC = () => {
  // 🔹 filter states
  const [groupBy, setGroupBy] = React.useState<ClassFilters['groupBy']>('day');
  const [status, setStatus] = React.useState<ClassStatus>('all-classes');
  const [startDate, setStartDate] = React.useState(dayjs().subtract(3, 'day'));
  const [endDate, setEndDate] = React.useState(dayjs().add(6,'day'));

  // 🔹 date navigation
  const goPrev = () => {
    let diff = 10;
    
    // Adjust navigation based on groupBy
    if (groupBy === 'day') {
      diff = 10;
    } else if (groupBy === 'hour') {
      diff = 10;
    } else if (groupBy === 'month') {
      diff = 10;
    }
    
    setStartDate(startDate.subtract(diff, groupBy as dayjs.ManipulateType));
    setEndDate(endDate.subtract(diff, groupBy as dayjs.ManipulateType));
  };

  const goNext = () => {
    let diff = 10;
    
    // Adjust navigation based on groupBy
    if (groupBy === 'day') {
      diff = 10;
    } else if (groupBy === 'hour') {
      diff = 10;
    } else if (groupBy === 'month') {
      diff = 10;
    }
    
    setStartDate(startDate.add(diff, groupBy as dayjs.ManipulateType));
    setEndDate(endDate.add(diff, groupBy as dayjs.ManipulateType));
  };

  // 🔹 fetch with filters
  const { data, isLoading } = useClassesCountByGroup({
    groupBy,
    status,
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString(),
  });

  // 🔹 normalize API response
  const serverItems: Record<string, number> = React.useMemo(() => {
    const raw = data?.data;
    const map: Record<string, number> = {};
    if (!raw) return map;

    if (typeof raw === 'object') {
      Object.entries(raw).forEach(([k, v]) => {
        let c: number | undefined;
        if (typeof v === 'number') {
          c = v;
        } else if (typeof v === 'object' && v !== null && 'classCount' in v) {
          c = (v as { classCount: number }).classCount;
        }
        if (typeof c === 'number') {
          map[k] = c;
        }
      });
    }
    return map;
  }, [data]);

  // 🔹 build timeline depending on groupBy
  const series: DayCount[] = React.useMemo(() => {
    if (groupBy === 'day') {
      return Array.from({ length:noOfBAr }, (_, i) => {
        const d = dayjs(startDate).add(i, 'day');
        const key = d.format('YYYY-MM-DD');
        return {
          date: key,
          count: serverItems[key] ?? 0,
          label: d.format('DD MMM'),
          fullDate: d.format('MMM DD, YYYY'),
        };
      });
    } else if (groupBy === 'hour') {
      return Array.from({ length: noOfBAr }, (_, i) => {
        // Get the actual hour from startDate and add i hours
        const d = dayjs(startDate).add(i, 'hour');
        const hour = d.hour();
        const key = hour.toString();
        
        // Format in 12-hour format with AM/PM
        const hourLabel = d.format('h:00 A'); // e.g., "10:00 AM"
        const fullDate = d.format('MMM DD, YYYY h:00 A'); // Show both date and time
        
        return {
          date: key,
          count: serverItems[key] ?? 0,
          label: hourLabel,
          fullDate: fullDate,
        };
      });
    } else if (groupBy === 'month') {
      return Array.from({ length:noOfBAr }, (_, i) => {
        const d = dayjs(startDate).add(i, 'month');
        const key = d.format('YYYY-MM');
        return {
          date: key,
          count: serverItems[key] ?? 0,
          label: d.format('MMM'),
          fullDate: d.format('MMM YYYY'),
        };
      });
    }
    return [];
  }, [groupBy, startDate, serverItems]);

  const maxY = Math.max(12, ...series.map((d) => d.count));

  if (isLoading) {
    return (
      <Card style={{ borderRadius: 12 }}>
        <Skeleton active paragraph={{ rows: 6 }} />
      </Card>
    );
  }

  return (
    <Card style={{ borderRadius: 12 }}>
      {/* 🔹 Filter bar */}
      <ClassChartFilter
        groupBy={groupBy}
        status={status}
        startDate={startDate}
        endDate={endDate}
        onGroupByChange={setGroupBy}
        onStatusChange={setStatus}
        onPrev={goPrev}
        onNext={goNext}
      />

      <div style={{ width: '100%', height: HEIGHT, overflowY: 'hidden',overflowX: 'scroll' }}>

        <div style={{ minWidth: WIDTH, height: HEIGHT }}>

        <ResponsiveContainer width="100%" height="100%" style={{}}>


          <BarChart
            data={series}
            margin={{
              top: PADDING.top+5,
              right: 0,
              bottom: PADDING.bottom,
              left: -PADDING.left,
            }}
            barCategoryGap={2} // mimic spacing
          >
            {/* 🔹 Grid lines same as manual */}
            <CartesianGrid
              stroke="#f0f0f0"
              vertical={false}
              strokeDasharray="0"
            />

            {/* 🔹 Y Axis ticks (filtered like manual) */}
            <YAxis
              tick={{ fontSize: 10, fill: '#8c8c8c' }}
              tickLine={false}
              axisLine={{ stroke: '#e8e8e8' }}
              allowDecimals={false}
              ticks={Array.from({ length: maxY + 1 }, (_, i) => i).filter(
                (i) => i % Math.ceil(maxY / 6) === 0
              )}
            />

            {/* 🔹 X Axis labels */}
            <XAxis
              dataKey="label"
              tick={{ fontSize: 12, fill: '#8c8c8c',dy:8}}
              tickLine={false}
              axisLine={{ stroke: '#e8e8e8' }}
              angle={-45 }
              textAnchor={groupBy === 'hour' ? 'end' : 'middle'}
              interval={0}
            />

            {/* 🔹 Tooltip exactly like manual */}
            <Tooltip
              cursor={{ fill: 'rgba(0,0,0,0.05)' ,radius:8}}
              formatter={(value: number, _: string, props: any) =>
                [`${value} Classes`, props.payload.fullDate]
              }
            />

            {/* 🔹 Bars with rounded corners */}
            <Bar
              dataKey="count"
              fill="#5955d8"
              radius={[6, 6, 0, 0]}
              isAnimationActive={false}
            >
              <LabelList dataKey="count" position="top" fontSize={10} fill="#5955d8" />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        </div>
      </div>
    </Card>
  );
};

export default ClassPerDayChart;
