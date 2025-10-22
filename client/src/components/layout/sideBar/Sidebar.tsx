import { Button, Flex, Layout, Menu, message, Space, theme } from "antd";
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
import { useLogout } from "../../../module/authentication";
import { FaChevronLeft, FaChevronRight,FaBookOpen } from "react-icons/fa";
import React from "react";
import { useRole } from "../../../hooks";
const { Sider } = Layout;

interface MenuItem {
  key: number | string;
  label: string;
  path?: string;
  icon?: string;
  children?: MenuItem[];
}

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {mutate : logout }= useLogout();
  const [collapsed, setCollapsed] = React.useState(false);

  
  const {token} = theme.useToken();

  // Get menu items based on user role
  const currenRole =useRole();
  const menuItems = SIDEBAR_MENU[currenRole as keyof typeof SIDEBAR_MENU] || SIDEBAR_MENU[Role.STUDENT];
const handleLogOut = () => {
  logout(undefined, {
    onSuccess: () => {
      message.success('You are logged out successfully');
    },
    onError: (error: any) => {
      message.error(`${error?.message ?? 'Logout failed.'}\nYou have been logged out`);
    }
  });
};
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
        handleLogOut();
        navigate('/login');
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
        background: token.colorBgLayout,
        borderRightColor: token.colorBorder,
        borderRightWidth: 1,
      }}
      trigger={null}
      hidden={Boolean('true')}
      collapsible
      collapsed={collapsed}
    >
      <Flex
       justify='space-between'
       align='center'
       gap={4}
        className="demo-logo-vertical"
        style={{
          margin:6,
          paddingBlock:20,
          paddingInline: 8,
          background: "rgba(24, 144, 255, 0.2)",
          borderRadius: token.borderRadiusLG,
        }}
      >
      <Button
          type="text"
          icon={collapsed ? <FaChevronRight /> : <FaChevronLeft />}
          onClick={() => setCollapsed(!collapsed)}
          style={{
            borderRadius: "50%",
            width: 25,
            height: 25,
            background: token.colorBgContainer,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 0,
            border: `1.4px solid ${token.colorBorderSecondary}`,
          }}
        />
    <Flex justify='space-around' vertical>
      
    {collapsed?<Space style={{background:token.colorBgElevated,borderRadius:"100%",  alignContent:'center',padding:token.sizeXS, alignItems:'center',transition:'ease-in'}}><FaBookOpen/></Space>: <Space style={{ fontSize: "18px", fontWeight: "bold", alignContent:'center', alignItems:'center',transition:'ease-in'}}>
          Online Educator
        </Space>}
    </Flex>
        </Flex>
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

