import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import { theme } from "antd";

// Dummy data matching the screenshot
const data = [
  { name: "United States", value: 52.1 },
  { name: "Canada", value: 22.8 },
  { name: "Mexico", value: 13.9 },
  { name: "Other", value: 11.2 },
];

// Define colors - ideally derive from theme or use a consistent palette
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"]; // Example colors

const StudentsByLocationChart: React.FC = () => {
  const { token } = theme.useToken();

  const renderLegend = (props: any) => {
    const { payload } = props;
    return (
      <ul
        style={{
          listStyle: "none",
          padding: 0,
          margin: "16px 0 0 0",
          textAlign: "center",
        }}
      >
        {payload.map((entry: any, index: number) => (
          <li
            key={`item-${index}`}
            style={{
              display: "inline-block",
              marginRight: 10,
              fontSize: "12px",
              color: token.colorTextSecondary,
            }}
          >
            <span
              style={{
                display: "inline-block",
                width: 10,
                height: 10,
                backgroundColor: entry.color,
                marginRight: 5,
                borderRadius: "50%",
              }}
            ></span>
            {entry.value} {entry.payload.percent.toFixed(1)}%
          </li>
        ))}
      </ul>
    );
  };

  return (
    <ResponsiveContainer width="100%" height="30px">
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60} // Creates the donut hole
          outerRadius={80}
          fill="#8884d8"
          paddingAngle={1}
          dataKey="value"
          labelLine={false}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value: number) => `${value.toFixed(1)}%`} />
        <Legend content={renderLegend} verticalAlign="bottom" />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default StudentsByLocationChart;
