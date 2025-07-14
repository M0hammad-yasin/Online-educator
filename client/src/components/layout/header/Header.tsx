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
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import UserManagement from '../../../module/authentication/components/UserManagement';
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
      borderRadius,
    },
  } = theme.useToken();

  return (
    <Header
      style={{
        margin: "0 10px",
        padding: "0 16px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderRadius: borderRadius,
        border: `1.4px solid ${colorBorderSecondary}`,
      }}
    >
      <div
        style={{ display: "flex", alignItems: "center", position: "relative" }}
      >
        <Button
          type="text"
          icon={collapsed ? <FaChevronRight /> : <FaChevronLeft />}
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
        {/* Replace old user profile and dropdown with UserManagement */}
        <UserManagement />
      </div>
    </Header>
  );
};

export default AppHeader;
