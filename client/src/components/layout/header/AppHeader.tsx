// client/src/components/layout/header/ResponsiveHeader.tsx
import {
    Badge,
    Button,
    Flex,
    Layout,
    Switch,
    theme,
    Tooltip,
  } from "antd";
  import {
    BellOutlined,
    MenuOutlined,
    SunOutlined,
    MoonOutlined,
  } from "@ant-design/icons";
  import useThemeStore from "../../../store/themeStore";
  import UserManagement from "../../../module/authentication/components/UserManagement";
  import NavigationKeeper from "./NavigationKeeper";
  import { SearchUI } from "../../widgets";
  import { useResponsive } from "../../../hooks/useResponsive";
  import { useUIStore } from "../../../store/uiStore";
  
  const { Header } = Layout;
  
  const AppHeader: React.FC = () => {
    const { toggleTheme, mode } = useThemeStore();
    const { isMobile, isTablet } = useResponsive();
    const toggleMobileMenu = useUIStore(state=>state.toggleMobileMenu);
  
    const {
      token: { colorBorderSecondary, borderRadius },
    } = theme.useToken();
  
    return (
      <Header
        style={{
          margin: isMobile ? "0 4px" : "0 10px",
          padding: isMobile ? "0 8px" : "0 16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderRadius: borderRadius,
          border: `1.4px solid ${colorBorderSecondary}`,
          height: isMobile ? 56 : 64,
        }}
      >
        {/* Left Section */}
        <Flex align="center" gap={isMobile ? 8 : 16} style={{ flex: 1, minWidth: 0 }}>
          {isMobile && (
            <Button
              type="text"
              icon={<MenuOutlined style={{ fontSize: 18 }} />}
              onClick={toggleMobileMenu}
              style={{ padding: "4px 8px" }}
            />
          )}
          
          {!isMobile && !isTablet && <NavigationKeeper />}
        </Flex>
  
        {/* Center Section - Search (Desktop only) */}
          <Flex style={{ flex: 1, justifyContent: "center", maxWidth: 400 }}>
            <SearchUI />
          </Flex>
        {/* Right Section */}
        <Flex
          style={{
            alignItems: "center",
            gap: isMobile ? 8 : 16,
            flex: 1,
            justifyContent: "flex-end",
          }}
        >
          {/* Notifications */}
          {!isMobile && (
            <Tooltip title="Notifications">
              <Badge count={1} size="small">
                <Button
                  type="text"
                  icon={<BellOutlined style={{ fontSize: 18 }} />}
                  style={{ padding: "4px 8px" }}
                />
              </Badge>
            </Tooltip>
          )}
  
          {/* Theme Toggle */}
          {!isMobile && (
            <Tooltip title="Toggle theme">
              <Switch
                checkedChildren={<SunOutlined />}
                unCheckedChildren={<MoonOutlined />}
                checked={mode === "light"}
                onChange={toggleTheme}
                size={isMobile ? "small" : "default"}
              />
            </Tooltip>
          )}
  
          {/* User Management */}
          <UserManagement />
        </Flex>
      </Header>
    );
  };
  
  export default AppHeader;