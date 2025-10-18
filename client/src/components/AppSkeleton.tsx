import React from "react";
import { Skeleton, Card, Row, Col, Layout, Space, Avatar } from "antd";
import { BookOutlined, UserOutlined, TeamOutlined } from "@ant-design/icons";

const { Header, Content } = Layout;

const AppSkeleton: React.FC = () => {
  return (
    <Layout
      style={{
        minHeight: "100vh",
        background: "var(--ant-layout-body-background)",
      }}
    >
      {/* Header Skeleton */}
      <Header
        style={{
          background: "var(--ant-layout-header-background)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          paddingInline: 24,
        }}
      >
        <Space align="center">
          <Skeleton.Avatar active size="large" shape="circle" />
          <Skeleton.Input active size="small" style={{ width: 120 }} />
        </Space>

        <Space align="center" size="middle">
          <Skeleton.Button active size="small" shape="circle" />
          <Skeleton.Button active size="small" shape="circle" />
          <Skeleton.Avatar active size="large" />
        </Space>
      </Header>

      {/* Main Content */}
      <Content style={{ padding: "32px 48px" }}>
        {/* Stats Cards Skeleton */}
        <Row gutter={[24, 24]}>
          {[BookOutlined, TeamOutlined, UserOutlined].map((Icon, index) => (
            <Col xs={24} sm={12} md={8} key={index}>
              <Card
                bordered={false}
                style={{
                  borderRadius: 16,
                  background: "var(--ant-layout-sider-background)",
                }}
              >
                <Space direction="horizontal" size="large" align="center">
                  <Avatar
                    size={48}
                    style={{
                      background:
                        "var(--ant-color-primary-bg-hover, rgba(0,0,0,0.06))",
                    }}
                    icon={<Icon />}
                  />
                  <div>
                    <Skeleton.Input
                      active
                      style={{ width: 100, marginBottom: 8 }}
                    />
                    <Skeleton.Input active style={{ width: 60 }} />
                  </div>
                </Space>
              </Card>
            </Col>
          ))}
        </Row>

        {/* Table/Chart Skeleton */}
        <Card
          bordered={false}
          style={{
            marginTop: 32,
            borderRadius: 16,
            background: "var(--ant-layout-sider-background)",
          }}
        >
          <Skeleton active paragraph={{ rows: 10 }} />
        </Card>
      </Content>
    </Layout>
  );
};

export default AppSkeleton;
