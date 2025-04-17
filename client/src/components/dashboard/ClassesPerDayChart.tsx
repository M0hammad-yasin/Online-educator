import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { theme } from "antd";

// Dummy data matching the screenshot structure
const data = [
  { name: "Mon", classes: 9 },
  { name: "Tue", classes: 5 },
  { name: "Wed", classes: 12 },
  { name: "Thu", classes: 8 },
  { name: "Fri", classes: 11 },
  { name: "Sat", classes: 7 },
];

const ClassesPerDayChart: React.FC = () => {
  const { token } = theme.useToken();

  return (
    <ResponsiveContainer width="100%" height="20px">
      <BarChart
        data={data}
        margin={{ top: 5, right: 0, left: -25, bottom: 5 }} // Adjust margins to fit labels
      >
        <CartesianGrid
          strokeDasharray="3 3"
          vertical={false}
          stroke={token.colorSplit}
        />
        <XAxis
          dataKey="name"
          tickLine={false}
          axisLine={false}
          dy={10}
          style={{ fontSize: "12px", fill: token.colorTextSecondary }}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          style={{ fontSize: "12px", fill: token.colorTextSecondary }}
        />
        <Tooltip cursor={{ fill: "rgba(0, 0, 0, 0.05)" }} />
        <Bar
          dataKey="classes"
          fill={token.colorPrimary}
          radius={[4, 4, 0, 0]}
          barSize={20}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default ClassesPerDayChart;
