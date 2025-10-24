// client/src/components/layout/sideBar/ResponsiveSidebar.tsx
import { Button, Drawer, Flex, Layout, Menu, message, Space, theme } from "antd";
import {
  DashboardOutlined,
  UserOutlined,
  CalendarOutlined,
  BookOutlined,
  FileOutlined,
  SettingOutlined,
  LogoutOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import SIDEBAR_MENU from "../../../constants/menu";
import { useLogout } from "../../../module/authentication";
import { FaChevronLeft, FaChevronRight, FaBookOpen } from "react-icons/fa";
import React from "react";
import { useRole } from "../../../hooks";
import { useResponsive } from "../../../hooks/useResponsive";
import { useUIStore } from "../../../store/uiStore";

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
  const { mutate: logout } = useLogout();
  const { token } = theme.useToken();
  const { isMobile } = useResponsive();
  const currentRole = useRole();
  const menuItems = SIDEBAR_MENU[currentRole as keyof typeof SIDEBAR_MENU] || SIDEBAR_MENU.STUDENT;

  // Use UI store for sidebar state
  const { sidebarCollapsed, setSidebarCollapsed, mobileMenuOpen, setMobileMenuOpen } = useUIStore();
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
    const findMenuItem = (items: MenuItem[]): MenuItem | undefined => {
      for (const menuItem of items) {
        if (menuItem.key.toString() === item.key) return menuItem;
        if (menuItem.children) {
          const found = findMenuItem(menuItem.children);
          if (found) return found;
        }
      }
      return undefined;
    };

    const menuItem = findMenuItem(menuItems);
    if (!menuItem || !menuItem.path) return;

    // Close mobile menu after navigation
    if (isMobile) {
      setMobileMenuOpen(false);
    }

    switch (menuItem.path) {
      case '/dashboard':
        navigate('/dashboard');
        break;
      case '/logout':
        handleLogOut();
        navigate('/login');
        break;
      case '/profile':
        navigate('/profile');
        break;
      default:
        navigate(menuItem.path);
        break;
    }
  };

  // Get current selected keys based on location
  const getSelectedKeys = () => {
    const currentPath = location.pathname;
    const selectedKeys: string[] = [];
    
    menuItems.forEach((item: MenuItem) => {
      if (item.children) {
        const childItem = item.children.find((child) => child.path === currentPath);
        if (childItem) {
          selectedKeys.push(item.key.toString());
          selectedKeys.push(childItem.key.toString());
        }
      } else if (item.path === currentPath) {
        selectedKeys.push(item.key.toString());
      }
    });
    
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

  // Render menu content
  const renderMenuContent = () => (
    <>
      <Flex
        justify="space-around"
        align="center"
        gap={4}
        style={{
          margin: isMobile ? 4 : 6,
          paddingBlock: isMobile ? 12 : 20,
          paddingInline: 8,
          background: "rgba(24, 144, 255, 0.2)",
          borderRadius: token.borderRadiusLG,
        }}
      >
        {!isMobile && (
          <Button
            type="text"
            icon={sidebarCollapsed ? <FaChevronRight /> : <FaChevronLeft />}
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
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
        )}

        {!isMobile && <Flex justify="space-around" vertical>
          { sidebarCollapsed ? (
            <Space
              style={{
                background: token.colorBgElevated,
                borderRadius: "100%",
                alignContent: "center",
                padding: token.sizeXS,
                alignItems: "center",
                transition: "ease-in",
              }}
            >
              <FaBookOpen />
            </Space>
          ) : (
            <Space
              style={{
                fontSize: isMobile ? "16px" : "18px",
                fontWeight: "bold",
                alignContent: "center",
                alignItems: "center",
                transition: "ease-in",
              }}
            >
              Online Educator
            </Space>
          )}
        </Flex>}
      </Flex>

      <Menu
        mode="inline"
        selectedKeys={getSelectedKeys()}
        defaultOpenKeys={getOpenKeys()}
        onClick={handleMenuClick}
        style={{
          fontSize: isMobile ? 13 : 14,
        }}
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
    </>
  );

  // Mobile: Render as Drawer
  if (isMobile) {
    return (
      <Drawer
        placement="left"
        onClose={() => setMobileMenuOpen(false)}
        title={ <Space
          style={{
            fontSize: isMobile ? "16px" : "18px",
            fontWeight: "bold",
            alignContent: "center",
            alignItems: "center",
            transition: "ease-in",
          }}
        >
          Online Educator
        </Space>}
        open={mobileMenuOpen}
        styles={{
          header:{background:"rgba(24, 144, 255, 0.2)" ,
                  display:'flex',
                  justifyContent:'space-around',
                  borderRadius:token.borderRadius,margin:token.marginXXS},
          body: { padding: 0 },
        }}
        width={280}
      >
        <div
          style={{
            background: token.colorBgLayout,
            height: "100%",
          }}
        >
          {renderMenuContent()}
        </div>
      </Drawer>
    );
  }

  // Desktop: Render as Sider
  return (
    <Sider
      style={{
        background: token.colorBgLayout,
        borderRightColor: token.colorBorder,
        borderRightWidth: 1,
        overflow: 'auto',
        height: '100vh',
        position: 'sticky',
        top: 0,
        left: 0,
      }}
      trigger={null}
      collapsible
      collapsed={sidebarCollapsed}
      width={240}
      collapsedWidth={80}
      breakpoint="lg"
      onBreakpoint={(broken) => {
        // Automatically collapse on smaller screens
        if (broken && !sidebarCollapsed) {
          setSidebarCollapsed(true);
        }
      }}
    >
      {renderMenuContent()}
    </Sider>
  );
};

export default Sidebar;