import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
  PieLabelRenderProps,
} from "recharts";
import { theme } from "antd";

interface DataItem {
  name: string;
  value: number;
}

interface StudentsPieChartProps {
  data: DataItem[];
}

const StudentsPieChart: React.FC<StudentsPieChartProps> = ({ data }) => {
  const { token } = theme.useToken();

  // Define colors based on theme
  const COLORS = [
    token.colorPrimary,
    token.colorSuccess,
    token.colorWarning,
    token.colorInfo,
  ];

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }: PieLabelRenderProps) => {
    const safeInnerRadius = Number(innerRadius ?? 0);
    const safeOuterRadius = Number(outerRadius ?? 0);
    const safeCx = Number(cx ?? 0);
    const safeCy = Number(cy ?? 0);

    const radius = safeInnerRadius + (safeOuterRadius - safeInnerRadius) * 0.5;
    const x = safeCx + radius * Math.cos(-midAngle * RADIAN);
    const y = safeCy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill={token.colorBgContainer}
        textAnchor={x > safeCx ? "start" : "end"}
        dominantBaseline="central"
        fontSize={12}
      >
        {percent && `${(percent * 100).toFixed(1)}%`}
      </text>
    );
  };

  return (
    <ResponsiveContainer width="100%" height={250}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={renderCustomizedLabel}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {data.map((_, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            backgroundColor: token.colorBgElevated,
            borderColor: token.colorBorderSecondary,
            color: token.colorText,
          }}
          formatter={(value: number) => [`${value}%`, "Percentage"]}
        />
        <Legend
          layout="horizontal"
          verticalAlign="bottom"
          align="center"
          wrapperStyle={{ fontSize: "12px", color: token.colorTextSecondary }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default StudentsPieChart;
