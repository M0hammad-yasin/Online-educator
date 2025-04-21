import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { theme } from "antd";

const RevenueLineChart: React.FC = () => {
  const { token } = theme.useToken();

  const data = [
    { month: "Jan", revenue: 350, payouts: 250 },
    { month: "Feb", revenue: 400, payouts: 300 },
    { month: "Mar", revenue: 450, payouts: 325 },
    { month: "Apr", revenue: 470, payouts: 350 },
    { month: "May", revenue: 520, payouts: 390 },
  ];

  return (
    <ResponsiveContainer width="100%" height={250}>
      <LineChart
        data={data}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid
          strokeDasharray="3 3"
          stroke={token.colorBorderSecondary}
        />
        <XAxis
          dataKey="month"
          stroke={token.colorTextSecondary}
          tick={{ fill: token.colorTextSecondary }}
        />
        <YAxis
          stroke={token.colorTextSecondary}
          tick={{ fill: token.colorTextSecondary }}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: token.colorBgElevated,
            borderColor: token.colorBorderSecondary,
            color: token.colorText,
          }}
        />
        <Legend
          wrapperStyle={{ fontSize: "12px", color: token.colorTextSecondary }}
        />
        <Line
          type="monotone"
          dataKey="revenue"
          stroke={token.colorPrimary}
          strokeWidth={2}
          activeDot={{ r: 8 }}
          dot={{
            stroke: token.colorPrimary,
            strokeWidth: 2,
            r: 4,
            fill: token.colorBgContainer,
          }}
        />
        <Line
          type="monotone"
          dataKey="payouts"
          stroke={token.colorError}
          strokeWidth={2}
          dot={{
            stroke: token.colorError,
            strokeWidth: 2,
            r: 4,
            fill: token.colorBgContainer,
          }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default RevenueLineChart;
