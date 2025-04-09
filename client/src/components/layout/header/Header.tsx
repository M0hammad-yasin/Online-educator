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
} from "antd";
import {
  BellOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SearchOutlined,
  UserOutlined,
  SunOutlined,
  MoonOutlined,
} from "@ant-design/icons";

const { Header } = Layout;

interface HeaderProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

const AppHeader: React.FC<HeaderProps> = ({ collapsed, setCollapsed }) => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

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
      <div style={{ display: "flex", alignItems: "center" }}>
        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={() => setCollapsed(!collapsed)}
          style={{ fontSize: "16px", width: 64, height: 64 }}
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
            defaultChecked
          />
        </Tooltip>

        <Space>
          <Avatar
            icon={<UserOutlined />}
            src="https://randomuser.me/api/portraits/women/44.jpg"
          />
          <div>
            <div style={{ fontWeight: "bold", lineHeight: "1.2" }}>
              Moni Roy
            </div>
            <div style={{ fontSize: "12px", color: "rgba(0, 0, 0, 0.45)" }}>
              Admin
            </div>
          </div>
        </Space>
      </div>
    </Header>
  );
};

export default AppHeader;
