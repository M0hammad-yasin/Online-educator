import { Layout, theme, Row, Col, Space } from "antd";
import {
  DashboardOutlined,
  TeamOutlined,
  UserOutlined,
  BookOutlined,
  TrophyOutlined,
  ExperimentOutlined,
  BankOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import {
  SummaryCard,
  ListCard,
  ChartCard,
  RecentActivitiesCard,
  ClassesPerDayChart,
  StudentsByLocationChart,
  RevenuePayoutsChart,
} from "../dashboard"; // Import dashboard components

const { Content } = Layout;

// Dummy data for list cards
const classItems = [
  { id: 1, primary: "class1 3 pm", status: "success" as const },
  { id: 2, primary: "class1 12 pm", status: "default" as const },
  { id: 3, primary: "class1 60:20", status: "error" as const },
  { id: 4, primary: "class1 6 jul", status: "default" as const },
  { id: 5, primary: "class1 6 jul", status: "default" as const },
  { id: 6, primary: "class1 6 jul", status: "default" as const },
  { id: 7, primary: "class1 6 jul", status: "default" as const },
];

const teacherItems = classItems.slice(0, 5); // Reuse for brevity
const studentItems = classItems.slice(0, 6);
const invoiceItems = [
  { id: 1, primary: "ali 30$", status: "success" as const },
  { id: 2, primary: "ali 12 pm", status: "default" as const },
  { id: 3, primary: "ali 60:20", status: "error" as const },
  { id: 4, primary: "ali 6 jul", status: "default" as const },
  { id: 5, primary: "ali 6 jul", status: "default" as const },
  { id: 6, primary: "ali 20$", status: "default" as const },
  { id: 7, primary: "ali 20$", status: "default" as const },
];

// Dummy data for recent activities
const activityItems = [
  {
    id: 1,
    icon: <TrophyOutlined />,
    title: '1st place in "Chess"',
    description: 'John Doe won 1st place in "Chess"',
    time: "1 Day ago",
  },
  {
    id: 2,
    icon: <ExperimentOutlined />,
    title: 'Participated in "Carrom"',
    description: 'Justin Lee participated in "Carrom"',
    time: "2 hours ago",
  },
  {
    id: 3,
    icon: <BankOutlined />,
    title: 'Internation conference in "St.John School"',
    description: 'Justin Lee attended internation conference in "St.John..."',
    time: "2 Week ago",
  },
  {
    id: 4,
    icon: <SettingOutlined />,
    title: 'Won 1st place in "Chess"',
    description: 'John Doe won 1st place in "Chess"',
    time: "3 Day ago",
  },
  {
    id: 5,
    icon: <SettingOutlined />,
    title: 'Won 1st place in "Chess"',
    description: 'John Doe won 1st place in "Chess"',
    time: "3 Day ago",
  },
];

const MainContent: React.FC = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  // Determine content: show dashboard or children
  return (
    <Content
      style={{
        margin: "24px 16px",
        padding: 24,
        minHeight: 280,
        background: colorBgContainer,
        borderRadius: borderRadiusLG,
      }}
    >
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        {/* Row 1: Summary Cards */}
        <Row>
          <Col flex={3}>
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12} md={12} lg={6}>
                <SummaryCard
                  title="Total Classes"
                  value={23}
                  period="January 2025"
                  icon={
                    <DashboardOutlined
                      style={{
                        fontSize: 24,
                        color: theme.useToken().token.colorPrimary,
                      }}
                    />
                  }
                />
              </Col>
              <Col xs={24} sm={12} md={12} lg={6}>
                <SummaryCard
                  title="Total Students"
                  value={23}
                  period="January 2025"
                  icon={
                    <UserOutlined
                      style={{
                        fontSize: 24,
                        color: theme.useToken().token.colorPrimary,
                      }}
                    />
                  }
                />
              </Col>
              <Col xs={24} sm={12} md={12} lg={6}>
                <SummaryCard
                  title="Total Teachers"
                  value={23}
                  period="January 2025"
                  icon={
                    <TeamOutlined
                      style={{
                        fontSize: 24,
                        color: theme.useToken().token.colorPrimary,
                      }}
                    />
                  }
                />
              </Col>
              <Col xs={24} sm={12} md={12} lg={6}>
                <SummaryCard
                  title="Total Courses"
                  value={23}
                  period="January 2025"
                  icon={
                    <BookOutlined
                      style={{
                        fontSize: 24,
                        color: theme.useToken().token.colorPrimary,
                      }}
                    />
                  }
                />
              </Col>
            </Row>

            {/* Row 2: List Cards & Bar Chart */}
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12} md={6}>
                <ListCard
                  title="All Classes"
                  subtitle="sun 12 jul 2025"
                  items={classItems}
                  onShowMore={() => console.log("Show more classes")}
                />
              </Col>
              <Col xs={24} sm={12} md={6}>
                <ListCard
                  title="Teachers"
                  subtitle="sun 12 jul 2025"
                  items={teacherItems}
                  onShowMore={() => console.log("Show more teachers")}
                />
              </Col>
              <Col xs={24} sm={12} md={6}>
                <ListCard
                  title="Students"
                  subtitle="sun 12 jul 2025"
                  items={studentItems}
                  onShowMore={() => console.log("Show more students")}
                />
              </Col>
              <Col xs={24} sm={12} md={6}>
                <ListCard
                  title="Invoices"
                  subtitle="sun 12 jul 2025"
                  items={invoiceItems}
                  onShowMore={() => console.log("Show more invoices")}
                />
              </Col>
            </Row>
          </Col>
          <Col flex={2}>
            <ChartCard
              title="Classes per day"
              subtitle="upcoming"
              onOptionsClick={() => console.log("Chart options clicked")}
            >
              <ClassesPerDayChart />
            </ChartCard>
          </Col>
        </Row>
        {/* Row 3: Activities, Location Chart, Revenue Chart */}
        <Row gutter={[16, 16]}>
          <Col xs={24} lg={8}>
            <RecentActivitiesCard
              title="Recent Activities"
              items={activityItems}
              onShowMore={() => console.log("Show more activities")}
            />
          </Col>
          <Col xs={24} sm={12} lg={8}>
            <ChartCard title="Students by Location">
              <StudentsByLocationChart />
            </ChartCard>
          </Col>
          <Col xs={24} sm={12} lg={8}>
            <ChartCard title="Revenue vs. Payouts">
              <RevenuePayoutsChart />
            </ChartCard>
          </Col>
        </Row>
      </Space>
    </Content>
  );
};

export default MainContent;
