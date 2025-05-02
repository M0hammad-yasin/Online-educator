// client/src/components/dashboard/Dashboard.tsx
import React, { useState } from "react";
import { Row, Col, Card, Typography, Select } from "antd";
import StatCard from "./StatCard";
import ItemList from "./ItemList";
import ClassesBarChart from "./charts/ClassesBarChart";
import RecentActivities from "./RecentActivities";
import StudentsPieChart from "./charts/StudentsPieChart";
import RevenueLineChart from "./charts/RevenueLineChart";
import styles from "./Dashboard.module.css";
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
    <div className={styles.dashboard}>
      {/* Stat Cards Row */}
      <Row gutter={[40, 40]} className={styles.equalHeightRow}>
        <Col xs={24} sm={12} md={12} lg={6} className={styles.equalHeightCol}>
          <StatCard
            icon={<FaBookOpen />}
            value={23}
            titleOptions={CLASS_TITLE_OPTIONS}
            // periodOptions={PERIOD_OPTIONS} // Removed
          />
        </Col>
        <Col xs={24} sm={12} md={12} lg={6} className={styles.equalHeightCol}>
          <StatCard
            icon={<FaUserGraduate />}
            value={23}
            titleOptions={STUDENT_TITLE_OPTIONS}
            // periodOptions={PERIOD_OPTIONS} // Removed
          />
        </Col>
        <Col xs={24} sm={12} md={12} lg={6} className={styles.equalHeightCol}>
          <StatCard
            icon={<FaChalkboardTeacher />}
            value={23}
            titleOptions={TEACHER_TITLE_OPTIONS}
            // periodOptions={PERIOD_OPTIONS} // Removed
          />
        </Col>
        <Col xs={24} sm={12} md={12} lg={6} className={styles.equalHeightCol}>
          <StatCard
            icon={<FaBook />}
            value={23}
            titleOptions={COURSE_TITLE_OPTIONS}
            // periodOptions={PERIOD_OPTIONS} // Removed
          />
        </Col>
      </Row>

      {/* Middle Row */}
      <Row
        gutter={[16, 16]}
        style={{ marginTop: 16 }}
        className={styles.equalHeightRow}
      >
        {/* First three List items */}
        <Col xs={24} lg={14} className={styles.equalHeightCol}>
          <Row gutter={[16, 16]} className={styles.equalHeightRow}>
            <Col xs={24} lg={8} className={styles.equalHeightCol}>
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
            <Col xs={24} lg={8} className={styles.equalHeightCol}>
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
            <Col xs={24} lg={8} className={styles.equalHeightCol}>
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
        <Col xs={24} lg={10} className={styles.equalHeightCol}>
          <Card
            className={styles.equalHeightCard}
            styles={{
              body: {
                padding: "16px",
                display: "flex",
                flexDirection: "column",
                flex: 1,
              },
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "16px",
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
      <Row
        gutter={[16, 16]}
        style={{ marginTop: 16 }}
        className={styles.equalHeightRow}
      >
        {/* Recent Activities - 3/5 of the width */}
        <Col xs={24} lg={14} className={styles.equalHeightCol}>
          <RecentActivities />
        </Col>

        {/* Charts - 2/5 of the width */}
        <Col xs={24} lg={10} className={styles.equalHeightCol}>
          <Row gutter={[16, 16]} className={styles.equalHeightRow}>
            {/* Students by Location */}
            <Col xs={24}>
              <Card
                title="Students by Location"
                className={styles.equalHeightCard}
                styles={{
                  body: {
                    padding: "16px",
                    display: "flex",
                    flexDirection: "column",
                    flex: 1,
                  },
                }}
              >
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
            <Col xs={24}>
              <Card
                title="Revenue vs. Payouts"
                className={styles.equalHeightCard}
                styles={{
                  body: {
                    padding: "16px",
                    display: "flex",
                    flexDirection: "column",
                    flex: 1,
                  },
                }}
              >
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
