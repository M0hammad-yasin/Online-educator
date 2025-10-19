import {
  Badge,
  Button,
  Flex,
  Input,
  Layout,
  Switch,
  theme,
  Tooltip,
} from "antd";
import {
  BellOutlined,
  SearchOutlined,
  SunOutlined,
  MoonOutlined,
} from "@ant-design/icons";
import useThemeStore from "../../../store/themeStore";
import "../../../style/header.css";
import UserManagement from '../../../module/authentication/components/UserManagement';
import NavigationKeeper from "./NavigationKeeper";
import { SearchUI } from "../../widgets";
const { Header } = Layout;

const AppHeader: React.FC = () => {
  const { toggleTheme } = useThemeStore();
  const {
    token: {
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
        <NavigationKeeper/>
        <SearchUI/>
      <Flex style={{  alignItems: "center", gap: 16 }}>
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
        <UserManagement />
      </Flex>
    </Header>
  );
};

export default AppHeader;
