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
import { useNavigate, useLocation } from "react-router-dom";
import SIDEBAR_MENU from "../../../constants/menu";
import { Role } from "../../../constants/role";
import useAuthStore from "../../../module/authentication/store/authStore";
const { Sider } = Layout;

interface SidebarProps {
  collapsed: boolean;
}

interface MenuItem {
  key: number;
  label: string;
  path: string;
  icon: string;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuthStore();
  
  const {
    token: { colorBgContainer, borderRadiusLG, Layout, colorBorder },
  } = theme.useToken();

  // Get menu items based on user role
  const userRole = user?.role || Role.STUDENT;
  const menuItems = SIDEBAR_MENU[userRole as keyof typeof SIDEBAR_MENU] || SIDEBAR_MENU[Role.STUDENT];

  // Handle menu item click
  const handleMenuClick = async (item: { key: string }) => {
    const menuItem = menuItems.find((menu: MenuItem) => menu.key.toString() === item.key);
    
    if (menuItem) {
      if (menuItem.path === "/logout") {
        // Handle logout
        try {
          await logout();
          navigate("/login");
        } catch (error) {
          console.error("Logout failed:", error);
        }
      } else {
        // Navigate to the specified path
        navigate(menuItem.path);
      }
    }
  };

  // Get current selected key based on location
  const getSelectedKey = () => {
    const currentPath = location.pathname;
    const menuItem = menuItems.find((item: MenuItem) => item.path === currentPath);
    return menuItem ? [menuItem.key.toString()] : ["1"];
  };

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
        selectedKeys={getSelectedKey()}
        onClick={handleMenuClick}
        items={menuItems.map((item) => {
          const iconMap: { [key: string]: React.ComponentType<any> } = {
            DashboardOutlined,
            UserOutlined,
            CalendarOutlined,
            BookOutlined,
            FileOutlined,
            SettingOutlined,
            LogoutOutlined,
          };
          const IconComponent = iconMap[item.icon];
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
