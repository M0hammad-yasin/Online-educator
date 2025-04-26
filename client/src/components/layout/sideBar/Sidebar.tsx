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
    token: { colorBgContainer, borderRadiusLG, Layout, colorBorder },
  } = theme.useToken();
  console.log(colorBgContainer);
  return (
    <Sider
      style={{
        background: Layout?.siderBg,
        borderRightColor: colorBorder,
        borderRightWidth: 1,
      }}
      trigger={null}
      collapsible
      collapsed={collapsed}
    >
      <div
        className="demo-logo-vertical"
        style={{
          height: 32,
          margin: 14,
          background: "rgba(24, 144, 255, 0.2)",
          borderRadius: borderRadiusLG,
        }}
      />
      <Menu
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
            label: <span style={{ fontWeight: 600 }}>{item.label}</span>,
          };
        })}
      />
    </Sider>
  );
};

export default Sidebar;
