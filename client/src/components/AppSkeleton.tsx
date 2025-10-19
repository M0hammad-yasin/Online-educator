import React from "react";
import { Layout, Skeleton, Card, Row, Col, Avatar, Space, theme } from "antd";
import {
  BookOutlined,
  TeamOutlined,
  UserOutlined,
  MenuOutlined,
} from "@ant-design/icons";

const { Header, Sider, Content } = Layout;

const AppSkeleton: React.FC = () => {
  const { token } = theme.useToken();

  return (
    <Layout
      style={{
        minHeight: "100vh",
        background: token.colorBgContainer,
      }}
    >
      {/* Sidebar */}
      <Sider
        width={240}
        breakpoint="lg"
        collapsedWidth="0"
        style={{
          background: token.colorBgElevated,
          borderRight: `1px solid ${token.colorBorderSecondary}`,
        }}
      >
        <div
          style={{
            height: 64,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderBottom: `1px solid ${token.colorBorderSecondary}`,
          }}
        >
          <Skeleton.Avatar active size="large" shape="circle" />
        </div>

        <div style={{ padding: 16 }}>
          {[...Array(6)].map((_, i) => (
            <Skeleton.Input
              key={i}
              active
              size="small"
              block
              style={{ marginBottom: 14, borderRadius: token.borderRadius }}
            />
          ))}
        </div>
      </Sider>

      <Layout>
        {/* Header */}
        <Header
          style={{
            background: token.colorBgContainer,
            paddingInline: 24,
            marginTop:12,
            paddingBlock: 12,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            border: `1px solid ${token.colorBorderSecondary}`,
            boxShadow: token.boxShadowTertiary,
          }}
        >
          <Space size="large" align="center" >
            <MenuOutlined
              style={{ fontSize: 18, color: token.colorTextTertiary }}
            />
            <Skeleton.Input active size="small" style={{ width: 140 }} />
          </Space>
          <Space size="middle" align="center">
            <Skeleton.Button active size="small" shape="circle" />
            <Skeleton.Button active size="small" shape="circle" />
            <Skeleton.Avatar active size="large" shape="circle" />
          </Space>
        </Header>

        {/* Main Content */}
        <Content
          style={{
            padding: "24px 32px",
            background: token.colorBgLayout,
            overflowY: "auto",
          }}
        >
          {/* Statistic Cards */}
          <Row gutter={[24, 24]}>
            {[BookOutlined, TeamOutlined, UserOutlined].map((Icon, i) => (
              <Col xs={24} sm={12} md={8} key={i}>
                <Card
                  bordered={false}
                  bodyStyle={{
                    padding: 20,
                    display: "flex",
                    alignItems: "center",
                  }}
                  style={{
                    borderRadius: token.borderRadiusLG,
                    background: token.colorBgElevated,
                    boxShadow: token.boxShadowTertiary,
                  }}
                >
                  <Space align="center" size="large">
                    <Avatar
                      size={48}
                      icon={<Icon />}
                      style={{
                        backgroundColor: token.colorFillSecondary,
                        color: token.colorText,
                      }}
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

          {/* Table / Chart Placeholder */}
          <Card
            variant='borderless'
            styles={{body:{ padding: 24} }}
            style={{
              marginTop: 32,
              borderRadius: token.borderRadiusLG,
              background: token.colorBgElevated,
              boxShadow: token.boxShadowTertiary,
            }}
          >
            <Skeleton active paragraph={{ rows: 10 }} />
          </Card>
        </Content>
      </Layout>
    </Layout>
  );
};

export default AppSkeleton;
