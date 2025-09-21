// client/src/pages/dashboard/Dashboard.tsx
import React, { useState } from "react";
import { Row, Col, Card, Typography, Select } from "antd";
import StatCard from "./StatCard";
import ItemList from "./ItemList";
import StudentsPieChart from "./charts/StudentsPieChart";
import RevenueLineChart from "./charts/RevenueLineChart";
import styles from "./Dashboard.module.css";
import {
  FaBookOpen,
  FaUserGraduate,
  FaChalkboardTeacher,
  FaBook,
  FaAngleDown,
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
} from "../../constants/statCardOptions";

// Import class components
import {
  ClassStatsCard,
  ClassListCard,
  ClassBarChart,
  ClassRecentActivities,
} from "../../module/classes/components";
import { ClassStatus } from "../../module/classes";
import { useClassStore } from "../../module/classes/store/useClassStore";

const { Title } = Typography;

const Dashboard: React.FC = () => {
  const [selectedStatus, setSelectedStatus] = useState<string>(
    CLASS_STATUS.UPCOMING
  );
  const handlePeriodChange = (date: any, dateString: string | string[]) => {
    console.log('Period changed:', date, dateString);
    // Handle period changes if needed
  };
  const classFilters =useClassStore(state=>state.filters);

  // Static data for student/teacher/courses (as in DashboardCopy)
  const staticListItems: any[] = [
    { label: "class1", time: "3 pm", status: "success" },
    { label: "class1", time: "12 pm", status: "warning" },
    { label: "class1", time: "6:20", status: "error" },
    { label: "class1", time: "6 jul", status: "success" },
    { label: "class1", time: "6 jul", status: "error" },
    { label: "class1", time: "6 jul", status: "default" },
    { label: "class1", time: "6 jul", status: "default" },
  ];
  const studentsPieData = [
    { name: "United States", value: 52.1 },
    { name: "Canada", value: 22.8 },
    { name: "Mexico", value: 13.9 },
    { name: "Other", value: 11.2 },
  ];

  return (
    <div className={styles.dashboard}>
      {/* Stat Cards Row */}
      <Row gutter={[40, 40]} className={styles.equalHeightRow}>
        <Col xs={24} sm={12} md={12} lg={6} className={styles.equalHeightCol}>
          {/* Class stat card (dynamic) */}
          <ClassStatsCard
            icon={<FaBookOpen />}
            titleOptions={CLASS_TITLE_OPTIONS}
            statType="total"
            onPeriodChange={handlePeriodChange}
          />
        </Col>
        <Col xs={24} sm={12} md={12} lg={6} className={styles.equalHeightCol}>
          {/* Student stat card (static) */}
          <StatCard
            icon={<FaUserGraduate />}
            value={23}
            titleOptions={STUDENT_TITLE_OPTIONS}
          />
        </Col>
        <Col xs={24} sm={12} md={12} lg={6} className={styles.equalHeightCol}>
          {/* Teacher stat card (static) */}
          <StatCard
            icon={<FaChalkboardTeacher />}
            value={23}
            titleOptions={TEACHER_TITLE_OPTIONS}
          />
        </Col>
        <Col xs={24} sm={12} md={12} lg={6} className={styles.equalHeightCol}>
          {/* Course stat card (static) */}
          <StatCard
            icon={<FaBook />}
            value={23}
            titleOptions={COURSE_TITLE_OPTIONS}
          />
        </Col>
      </Row>

      {/* Middle Row */}
      <Row
        gutter={[16, 16]}
        style={{ marginTop: 16 }}
        className={styles.equalHeightRow}
      >
        {/* List items (class dynamic, student/teacher static) */}
        <Col xs={24} lg={14} className={styles.equalHeightCol}>
          <Row gutter={[16, 16]} className={styles.equalHeightRow}>
            <Col xs={24} lg={8} className={styles.equalHeightCol}>
              {/* Class list card (dynamic) */}
              <ClassListCard
                titleOptions={CLASS_TITLE_OPTIONS}
                icons={<FaAngleDown />}
                filters={{
                  ...classFilters,
                  classStatus: 'SCHEDULED',
                  limit: 7,
                }}
                onViewMore={() => console.log('View more classes')}
              />
            </Col>
            <Col xs={24} lg={8} className={styles.equalHeightCol}>
              {/* Student list (static) */}
              <ItemList
                titleOptions={STUDENT_TITLE_OPTIONS}
                icon={<FaUserGraduate />}
                items={staticListItems}
              />
            </Col>
            <Col xs={24} lg={8} className={styles.equalHeightCol}>
              {/* Teacher list (static) */}
              <ItemList
                titleOptions={TEACHER_TITLE_OPTIONS}
                icon={<FaChalkboardTeacher />}
                items={staticListItems}
              />
            </Col>
          </Row>
        </Col>
        {/* Bar Chart col (dynamic) */}
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
            <ClassBarChart status={selectedStatus as ClassStatus} />
          </Card>
        </Col>
      </Row>

      {/* Bottom Row */}
      <Row
        gutter={[16, 16]}
        style={{ marginTop: 16 }}
        className={styles.equalHeightRow}
      >
        {/* Recent Activities (dynamic) */}
        <Col xs={24} lg={14} className={styles.equalHeightCol}>
          <ClassRecentActivities />
        </Col>
        {/* Charts (static) */}
        <Col xs={24} lg={10} className={styles.equalHeightCol}>
          <Row gutter={[16, 16]} className={styles.equalHeightRow}>
            {/* Students by Location (static) */}
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
                <StudentsPieChart data={studentsPieData} />
              </Card>
            </Col>
            {/* Revenue vs Payouts (static) */}
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