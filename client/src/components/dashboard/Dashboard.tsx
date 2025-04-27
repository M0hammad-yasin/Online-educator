// client/src/components/dashboard/Dashboard.tsx
import React, { useState } from "react";
import { Row, Col, Card, Typography, Select } from "antd";
import StatCard from "./StatCard";
import ItemList from "./ItemList";
import ClassesBarChart from "./charts/ClassesBarChart";
import RecentActivities from "./RecentActivities";
import StudentsPieChart from "./charts/StudentsPieChart";
import RevenueLineChart from "./charts/RevenueLineChart";
import {
  FaBookOpen,
  FaUserGraduate,
  FaChalkboardTeacher,
  FaBook,
} from "react-icons/fa";
import {
  CLASS_STATUS,
  CLASS_STATUS_OPTIONS,
} from "../../constants/classStatus";
import {
  CLASS_TITLE_OPTIONS,
  STUDENT_TITLE_OPTIONS,
  TEACHER_TITLE_OPTIONS,
  COURSE_TITLE_OPTIONS,
  // PERIOD_OPTIONS, // Removed
} from "../../constants/statCardOptions";

const { Title } = Typography;

const Dashboard: React.FC = () => {
  const [selectedStatus, setSelectedStatus] = useState<string>(
    CLASS_STATUS.UPCOMING
  );
  return (
    <div className="dashboard">
      {/* Stat Cards Row */}
      <Row gutter={[40, 40]}>
        <Col xs={24} sm={12} md={12} lg={6}>
          <StatCard
            icon={<FaBookOpen />}
            value={23}
            titleOptions={CLASS_TITLE_OPTIONS}
            // periodOptions={PERIOD_OPTIONS} // Removed
          />
        </Col>
        <Col xs={24} sm={12} md={12} lg={6}>
          <StatCard
            icon={<FaUserGraduate />}
            value={23}
            titleOptions={STUDENT_TITLE_OPTIONS}
            // periodOptions={PERIOD_OPTIONS} // Removed
          />
        </Col>
        <Col xs={24} sm={12} md={12} lg={6}>
          <StatCard
            icon={<FaChalkboardTeacher />}
            value={23}
            titleOptions={TEACHER_TITLE_OPTIONS}
            // periodOptions={PERIOD_OPTIONS} // Removed
          />
        </Col>
        <Col xs={24} sm={12} md={12} lg={6}>
          <StatCard
            icon={<FaBook />}
            value={23}
            titleOptions={COURSE_TITLE_OPTIONS}
            // periodOptions={PERIOD_OPTIONS} // Removed
          />
        </Col>
      </Row>

      {/* Middle Row */}
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        {/* First three List items */}
        <Col xs={24} lg={14}>
          <Row gutter={[16, 16]}>
            <Col xs={24} lg={8}>
              <ItemList
                titleOptions={CLASS_TITLE_OPTIONS}
                icon={<FaBookOpen />}
                items={[
                  { label: "class1", time: "3 pm", status: "success" },
                  { label: "class1", time: "12 pm", status: "warning" },
                  { label: "class1", time: "6:20", status: "error" },
                  { label: "class1", time: "6 jul", status: "success" },
                  { label: "class1", time: "6 jul", status: "error" },
                  { label: "class1", time: "6 jul", status: "default" },
                  { label: "class1", time: "6 jul", status: "default" },
                ]}
              />
            </Col>
            <Col xs={24} lg={8}>
              <ItemList
                titleOptions={STUDENT_TITLE_OPTIONS}
                icon={<FaUserGraduate />}
                items={[
                  { label: "class1", time: "3 pm", status: "success" },
                  { label: "class1", time: "12 pm", status: "warning" },
                  { label: "class1", time: "6:20", status: "error" },
                  { label: "class1", time: "6 jul", status: "success" },
                  { label: "class1", time: "6 jul", status: "error" },
                  { label: "class1", time: "6 jul", status: "default" },
                  { label: "class1", time: "6 jul", status: "default" },
                ]}
              />
            </Col>
            <Col xs={24} lg={8}>
              <ItemList
                titleOptions={TEACHER_TITLE_OPTIONS}
                icon={<FaChalkboardTeacher />}
                items={[
                  { label: "class1", time: "3 pm", status: "success" },
                  { label: "class1", time: "12 pm", status: "warning" },
                  { label: "class1", time: "6:20", status: "error" },
                  { label: "class1", time: "6 jul", status: "success" },
                  { label: "class1", time: "6 jul", status: "error" },
                  { label: "class1", time: "6 jul", status: "default" },
                  { label: "class1", time: "6 jul", status: "default" },
                ]}
              />
            </Col>
          </Row>
        </Col>
        {/* Bar Chart col */}
        <Col xs={24} lg={10}>
          <Card>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <Title level={5} style={{ margin: 0 }}>
                Classes per day
              </Title>
              <Select
                defaultValue={CLASS_STATUS.UPCOMING}
                style={{ width: 120 }}
                onChange={(value) => setSelectedStatus(value)}
                options={CLASS_STATUS_OPTIONS.map((status) => ({
                  value: status,
                  label: status.charAt(0) + status.slice(1).toLowerCase(),
                }))}
              />
            </div>
            <ClassesBarChart status={selectedStatus} />
          </Card>
        </Col>
      </Row>

      {/* Bottom Row */}
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        {/* Recent Activities - 3/5 of the width */}
        <Col xs={24} lg={14}>
          <RecentActivities />
        </Col>

        {/* Charts - 2/5 of the width */}
        <Col xs={24} lg={10}>
          <Row gutter={[24, 24]}>
            {/* Students by Location */}
            <Col xs={24}>
              <Card title="Students by Location">
                <StudentsPieChart
                  data={[
                    { name: "United States", value: 52.1 },
                    { name: "Canada", value: 22.8 },
                    { name: "Mexico", value: 13.9 },
                    { name: "Other", value: 11.2 },
                  ]}
                />
              </Card>
            </Col>

            {/* Revenue vs Payouts */}
            <Col xs={24} style={{ marginTop: 16 }}>
              <Card title="Revenue vs. Payouts">
                <RevenueLineChart />
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
