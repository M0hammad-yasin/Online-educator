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

interface ClassesBarChartProps {
  status?: string;
}

const ClassesBarChart: React.FC<ClassesBarChartProps> = ({
  status = "UPCOMING",
}) => {
  const { token } = theme.useToken();

  const data = [
    { day: "Mon", classes: 7 },
    { day: "Tue", classes: 4 },
    { day: "Wed", classes: 11 },
    { day: "Thu", classes: 10 },
    { day: "Fri", classes: 6 },
    { day: "Sat", classes: 3 },
  ];

  // In a real application, we would filter or fetch data based on the status
  console.log(`Showing classes with status: ${status}`);

  return (
    <ResponsiveContainer width="100%" height={250}>
      <BarChart
        data={data}
        margin={{
          top: 20,
          right: 0,
          left: -30,
          bottom: -5,
        }}
      >
        <CartesianGrid
          strokeDasharray="2 3"
          stroke={token.colorBorder}
          vertical={false}
        />
        <XAxis
          dataKey="day"
          axisLine={{ stroke: token.colorBorder }}
          tick={{ fill: token.colorTextHeading }}
          tickLine={false}
        />
        <YAxis
          axisLine={{ stroke: token.colorBorderSecondary }}
          tick={{ fill: token.colorTextSecondary }}
          tickLine={false}
          ticks={[0, 2, 4, 6, 8, 10, 12]}
          domain={[0, 12]}
        />
        <Tooltip
          contentStyle={{
            borderRadius: token.borderRadiusLG,
            backgroundColor: token.colorBgElevated,
            boxShadow: token.boxShadow,
            borderColor: token.colorBorderSecondary,
            color: token.colorText,
            opacity: 0.9,
          }}
          labelStyle={{ color: token.colorPrimary }}
          cursor={{ fill: "transparent" }} // Add this line to make the cursor background transparent
        />
        <Bar
          dataKey="classes"
          fill={token.colorPrimary}
          name="Classes"
          radius={[4, 4, 4, 4]}
          barSize={30}
          activeBar={{}}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default ClassesBarChart;
