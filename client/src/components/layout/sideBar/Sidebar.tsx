import { Layout, Menu, theme } from "antd";
import {
  UserOutlined,
  VideoCameraOutlined,
  BookOutlined,
} from "@ant-design/icons";

const { Sider } = Layout;

interface SidebarProps {
  collapsed: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed }) => {
  const {
    token: { borderRadiusLG },
  } = theme.useToken();

  return (
    <Sider trigger={null} collapsible collapsed={collapsed}>
      <div
        className="demo-logo-vertical"
        style={{
          height: 32,
          margin: 16,
          background: "rgba(255,255,255,.2)",
          borderRadius: borderRadiusLG,
        }}
      />
      <Menu
        theme="dark"
        mode="inline"
        defaultSelectedKeys={["1"]}
        items={[
          {
            key: "1",
            icon: <UserOutlined />,
            label: "Dashboard",
          },
          {
            key: "2",
            icon: <VideoCameraOutlined />,
            label: "Classes",
          },
          {
            key: "3",
            icon: <BookOutlined />,
            label: "Resources",
          },
        ]}
      />
    </Sider>
  );
};

export default Sidebar;
