// client/src/module/classes/components/ClassPerDayChart.tsx

import React from 'react';
import { Card, Skeleton } from 'antd';
import dayjs from 'dayjs';
import { useClassesCountByGroup } from '../hooks/useClasses';

interface DayCount {
  date: string; // YYYY-MM-DD
  count: number;
}

const WIDTH = 640;
const HEIGHT = 280;
const PADDING = { top: 16, right: 16, bottom: 36, left: 32 };

const ClassPerDayChart: React.FC = () => {
  const { data, isLoading } = useClassesCountByGroup({ groupBy: 'day' });
  const last12Days: string[] = React.useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => dayjs().subtract(11 - i, 'day').format('YYYY-MM-DD'));
  }, []);

  const serverItems: Record<string, number> = React.useMemo(() => {
    const raw = data;
    const map: Record<string, number> = {};
    if (!raw) return map;

    if (Array.isArray(raw)) {
      raw.forEach((item: any) => {
        const d = item?.date || item?.day || item?.startTime || item?.key || item?.label;
        const date = d ? dayjs(d).format('YYYY-MM-DD') : undefined;
        const c = typeof item?.count === 'number' ? item.count : (typeof item?.value === 'number' ? item.value : undefined);
        if (date && typeof c === 'number') map[date] = c;
      });
      return map;
    }

    // If the API returns an object map like { '2025-09-10': 3, ... }
   if (typeof raw === 'object') {
  Object.entries(raw).forEach(([k, v]) => {
    const date = dayjs(k).isValid() ? dayjs(k).format('YYYY-MM-DD') : undefined;

    let c: number | undefined;

    if (typeof v === 'number') {
      c = v;
    } else if (typeof v === 'object' && v !== null && 'classCount' in v) {
      c = (v as { classCount: number }).classCount;
    }

    if (date && typeof c === 'number') {
      map[date] = c;
    }
  });
  return map;
}



    return map;
  }, [data]);

  const series: DayCount[] = last12Days.map((date) => ({ date, count: serverItems[date] ?? 0 }));
  console.log(series);
  console.log(data);
  const maxY = Math.max(12, ...series.map((d) => d.count));

  const innerW = WIDTH - PADDING.left - PADDING.right;
  const innerH = HEIGHT - PADDING.top - PADDING.bottom;
  const barGap = 8;
  const barWidth = (innerW - (series.length - 1) * barGap) / series.length;

  const yScale = (v: number) => innerH - (v / maxY) * innerH;

  return (
    <Card style={{ borderRadius: 12 }}>
      {isLoading ? (
        <Skeleton active paragraph={{ rows: 6 }} />
      ) : (
        <div style={{ width: '100%', overflowX: 'auto' }}>
          <svg width={WIDTH} height={HEIGHT} role="img" aria-label="Classes per day bar chart">
            <g transform={`translate(${PADDING.left},${PADDING.top})`}>
              {/* Y axis ticks */}
              {Array.from({ length: maxY + 1 }, (_, i) => i).filter((i) => i % Math.ceil(maxY / 6) === 0).map((tick) => (
                <g key={`y-${tick}`}>
                  <line x1={0} y1={yScale(tick)} x2={innerW} y2={yScale(tick)} stroke="#f0f0f0" />
                  <text x={-8} y={yScale(tick)} textAnchor="end" dominantBaseline="middle" style={{ fill: '#8c8c8c', fontSize: 10 }}>
                    {tick}
                  </text>
                </g>
              ))}

              {/* Bars */}
              {series.map((d, i) => {
                const x = i * (barWidth + barGap);
                const h = innerH - yScale(d.count);
                const y = yScale(d.count);
                return (
                  <g key={d.date}>
                    <rect
                      x={x}
                      y={y}
                      width={barWidth}
                      height={h}
                      rx={6}
                      fill="#5955d8"
                    />
                    {/* X axis labels */}
                    <text
                      x={x + barWidth / 2}
                      y={innerH + 16}
                      textAnchor="middle"
                      style={{ fill: '#8c8c8c', fontSize: 10 }}
                    >
                      {dayjs(d.date).format('ddd')}
                    </text>
                  </g>
                );
              })}

              {/* X axis baseline */}
              <line x1={0} y1={innerH} x2={innerW} y2={innerH} stroke="#e8e8e8" />
            </g>
          </svg>
        </div>
      )}
    </Card>
  );
};

export default ClassPerDayChart;


