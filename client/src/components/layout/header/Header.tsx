import {
  Avatar,
  Badge,
  Button,
  Input,
  Layout,
  Space,
  Switch,
  theme,
  Tooltip,
  Dropdown,
  MenuProps,
  Flex,
  Typography,
} from "antd";
import {
  BellOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SearchOutlined,
  UserOutlined,
  SunOutlined,
  MoonOutlined,
  DownOutlined,
  SettingOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import useThemeStore from "../../../store/themeStore";
import "../../../style/header.css";
const { Header } = Layout;

interface HeaderProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

const AppHeader: React.FC<HeaderProps> = ({ collapsed, setCollapsed }) => {
  const { toggleTheme } = useThemeStore();
  const {
    token: {
      colorBgContainer,
      colorPrimary,
      colorTextSecondary,
      colorBorderSecondary,
    },
  } = theme.useToken();

  const profileMenuItems: MenuProps["items"] = [
    {
      key: "profile",
      icon: <UserOutlined style={{ color: colorTextSecondary }} />,
      label: <span style={{ color: colorTextSecondary }}>Profile</span>,
    },
    {
      key: "settings",
      icon: <SettingOutlined style={{ color: colorTextSecondary }} />,
      label: <span style={{ color: colorTextSecondary }}>Settings</span>,
    },
    {
      type: "divider",
    },
    {
      key: "logout",
      icon: <LogoutOutlined style={{ color: colorTextSecondary }} />,
      label: <span style={{ color: colorTextSecondary }}>Logout</span>,
    },
  ];

  return (
    <Header
      style={{
        padding: "0 16px",
        background: colorBgContainer,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <div
        style={{ display: "flex", alignItems: "center", position: "relative" }}
      >
        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={() => setCollapsed(!collapsed)}
          style={{
            position: "absolute",
            left: "-5%", // Use position and left to move left
            borderRadius: "50%",
            width: 25,
            height: 25,
            background: colorBgContainer,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 0,
            border: `1.4px solid ${colorBorderSecondary}`,
          }}
        />
        <span style={{ fontSize: "18px", fontWeight: "bold", marginRight: 24 }}>
          Online Educator Platform
        </span>
        <Input
          prefix={<SearchOutlined />}
          placeholder="Search for something"
          style={{ width: 250 }}
        />
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <Tooltip title="Notifications">
          <Badge count={1} size="small">
            <Button
              type="text"
              icon={<BellOutlined style={{ fontSize: 20 }} />}
            />
          </Badge>
        </Tooltip>

        <Tooltip title="Toggle theme">
          <Switch
            checkedChildren={<SunOutlined />}
            unCheckedChildren={<MoonOutlined />}
            checked={useThemeStore.getState().mode === "light"}
            onChange={toggleTheme}
          />
        </Tooltip>
        <Space align="center" size={8}>
          <Avatar
            icon={<UserOutlined />}
            src="https://randomuser.me/api/portraits/women/44.jpg"
          />
          <Flex vertical align="start">
            <Typography.Text strong style={{ lineHeight: "1.2" }}>
              Moni Roy
            </Typography.Text>
            <Typography.Text
              style={{ fontSize: "12px", color: colorTextSecondary }}
            >
              Admin
            </Typography.Text>
          </Flex>
          <Dropdown
            menu={{
              items: profileMenuItems,
              style: {
                borderRadius: 6,
              },
            }}
            trigger={["click"]}
            dropdownRender={(menu) => (
              <div
                style={{
                  boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                  borderRadius: 6,
                  color: colorTextSecondary,
                }}
              >
                {menu}
              </div>
            )}
          >
            <Button
              style={{
                borderRadius: "50%",
                width: 25,
                height: 25,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: 0,
              }}
            >
              <DownOutlined style={{ color: colorPrimary }} />
            </Button>
          </Dropdown>
        </Space>
      </div>
    </Header>
  );
};

export default AppHeader;
