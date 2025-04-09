import { Layout, Menu, theme } from "antd";
import {
  DashboardOutlined,
  UserOutlined,
  CalendarOutlined,
  BookOutlined,
  FileOutlined,
  SettingOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import SIDEBAR_MENU from "../../../config/menu";
import { Role } from "../../../config/constants";
const { Sider } = Layout;

const menuItems = SIDEBAR_MENU[Role.ADMIN];
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
          margin: 14,
          background: "rgba(255,255,255,.2)",
          borderRadius: borderRadiusLG,
        }}
      />
      <Menu
        theme="dark"
        mode="inline"
        defaultSelectedKeys={["1"]}
        items={menuItems.map((item) => {
          const IconComponent = {
            DashboardOutlined,
            UserOutlined,
            CalendarOutlined,
            BookOutlined,
            FileOutlined,
            SettingOutlined,
            LogoutOutlined,
          }[item.icon];
          return {
            key: item.key,
            icon: IconComponent ? <IconComponent /> : null,
            label: item.label,
          };
        })}
      />
    </Sider>
  );
};

export default Sidebar;
