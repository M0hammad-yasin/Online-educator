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
import { useAuthState, useLogout } from "../../../module/authentication/hooks/useAuth";
const { Sider } = Layout;

interface SidebarProps {
  collapsed: boolean;
}

interface MenuItem {
  key: number | string;
  label: string;
  path?: string;
  icon?: string;
  children?: MenuItem[];
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user,  } = useAuthStore();
  const {mutate : logout }= useLogout();
  
  const {
    token: {  borderRadiusLG, Layout, colorBorder },
  } = theme.useToken();

  // Get menu items based on user role
  const userRole = user?.role || Role.STUDENT;
  const menuItems = SIDEBAR_MENU[userRole as keyof typeof SIDEBAR_MENU] || SIDEBAR_MENU[Role.STUDENT];

  // Handle menu item click
  const handleMenuClick = async (item: { key: string }) => {
    // Find the menu item in the flat structure (including children)
    const findMenuItem = (items: MenuItem[]): MenuItem | undefined => {
      for (const menuItem of items) {
        if (menuItem.key.toString() === item.key) {
          return menuItem;
        }
        if (menuItem.children) {
          const found = findMenuItem(menuItem.children);
          if (found) return found;
        }
      }
      return undefined;
    };

    const menuItem = findMenuItem(menuItems);
    if (!menuItem || !menuItem.path) return;

    switch (menuItem.path) {
      case '/dashboard':
        navigate('/dashboard');
        break;
      case '/logout':
        try {
          await logout();
          navigate('/login');
        } catch (error) {
          console.error('Logout failed:', error);
        }
        break;
      case '/profile':
        navigate('/profile')
        break;
      default:
        navigate(menuItem.path);
        break;
    }
  };

  // Get current selected keys based on location
  const getSelectedKeys = () => {
    const currentPath = location.pathname;
    
    // Find main menu item
    const selectedKeys: string[] = [];
    
    // Check for submenu items first
    menuItems.forEach((item: MenuItem) => {
      if (item.children) {
        const childItem = item.children.find((child) => child.path === currentPath);
        if (childItem) {
          selectedKeys.push(item.key.toString()); // Parent key
          selectedKeys.push(childItem.key.toString()); // Child key
        }
      } else if (item.path === currentPath) {
        selectedKeys.push(item.key.toString());
      }
    });
    
    // If no match found, default to first item
    return selectedKeys.length > 0 ? selectedKeys : ["1"];
  };

  // Get open submenu keys
  const getOpenKeys = () => {
    const currentPath = location.pathname;
    const openKeys: string[] = [];
    
    menuItems.forEach((item: MenuItem) => {
      if (item.children) {
        const hasMatch = item.children.some((child) => child.path === currentPath);
        if (hasMatch) {
          openKeys.push(item.key.toString());
        }
      }
    });
    
    return openKeys;
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
        selectedKeys={getSelectedKeys()}
        defaultOpenKeys={getOpenKeys()}
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
            children: item.children?.map((child) => ({
              key: child.key,
              label: child.label,
            })),
          };
        })}
      />
    </Sider>
  );
};

export default Sidebar;

