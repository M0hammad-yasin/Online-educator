import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { theme } from "antd";

// Dummy data - replace with actual data fetching
const data = [
  { name: "Jan", revenue: 4000, payouts: 2400 },
  { name: "Feb", revenue: 3000, payouts: 1398 },
  { name: "Mar", revenue: 2000, payouts: 9800 },
  { name: "Apr", revenue: 2780, payouts: 3908 },
  { name: "May", revenue: 1890, payouts: 4800 },
  { name: "Jun", revenue: 2390, payouts: 3800 },
  { name: "Jul", revenue: 3490, payouts: 4300 },
  { name: "Aug", revenue: 4000, payouts: 2400 },
  { name: "Sep", revenue: 3000, payouts: 1398 },
  { name: "Oct", revenue: 2000, payouts: 9800 },
  { name: "Nov", revenue: 2780, payouts: 3908 },
  { name: "Dec", revenue: 1890, payouts: 4800 },
];

const RevenuePayoutsChart: React.FC = () => {
  const { token } = theme.useToken();

  return (
    <ResponsiveContainer width="100%" height="30px">
      <LineChart
        data={data}
        margin={{ top: 5, right: 10, left: -25, bottom: 5 }}
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
          style={{ fontSize: "10px", fill: token.colorTextSecondary }}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          style={{ fontSize: "10px", fill: token.colorTextSecondary }}
        />
        <Tooltip />
        <Legend
          verticalAlign="top"
          align="right"
          height={36}
          iconSize={10}
          wrapperStyle={{ fontSize: "10px" }}
        />
        <Line
          type="monotone"
          dataKey="revenue"
          stroke={token.colorPrimary}
          strokeWidth={2}
          dot={false}
          name="Revenue"
        />
        <Line
          type="monotone"
          dataKey="payouts"
          stroke={token.colorSuccess}
          strokeWidth={2}
          dot={false}
          name="Payouts"
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default RevenuePayoutsChart;
