import React from "react";
import { Avatar, Button, Dropdown, MenuProps, Typography, Flex, message, Drawer, Descriptions, Space, Spin } from "antd";
import { UserOutlined, SettingOutlined, LogoutOutlined, DownOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import  { useAuthUser,useLogout } from "..";

const { Text } = Typography;

const UserManagement: React.FC = () => {
  const navigate = useNavigate();
  const user = useAuthUser();
  const { mutate: logout, isPending } = useLogout();
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  const handleMenuClick: MenuProps["onClick"] = ({ key }) => {
    if (key === "profile") {
      setDrawerOpen(true);
    } else if (key === "settings") {
      message.info("Settings page coming soon!");
    } else if (key === "logout") {
      logout(undefined, {
        onSuccess: () => {
          navigate("/login");
          message.success('you\'re logged out successfuly');
        },
      });
    }
  };

  const menuItems: MenuProps["items"] = [
    {
      key: "profile",
      icon: <UserOutlined />,
      label: <span>Profile</span>,
    },
    {
      key: "settings",
      icon: <SettingOutlined />,
      label: <span>Settings</span>,
    },
    {
      type: "divider",
    },
    {
      key: "logout",
      icon: isPending ? <Spin size="small" /> : <LogoutOutlined />, // fixed icon
      label: <span>Logout</span>,
      danger: true,
    },
  ];

  if (!user) return null;

  return (
    <>
      <Flex align="center" gap={8}>
        <Avatar icon={<UserOutlined />} />
        <Flex vertical align="start">
          <Text strong style={{ lineHeight: "1.2" }}>{user.name}</Text>
          <Text style={{ fontSize: 12, color: "#888" }}>{user.role}</Text>
        </Flex>
        <Dropdown
          menu={{ items: menuItems, onClick: handleMenuClick, style: { borderRadius: 6 } }}
          trigger={['hover']}
          dropdownRender={(menu) => (
            <div style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.15)", borderRadius: 6 }}>{menu}</div>
          )}
        >
          <Button
            style={{ borderRadius: "50%", width: 25, height: 25, display: "flex", alignItems: "center", justifyContent: "center", padding: 0 }}
          >
            <DownOutlined />
          </Button>
        </Dropdown>
      </Flex>
      <Drawer
        title="User Profile"
        placement="right"
        onClose={() => setDrawerOpen(false)}
        open={drawerOpen}
        width={340}
      >
        <Descriptions column={1} bordered size="small">
          <Descriptions.Item label="Name">{user.name}</Descriptions.Item>
          <Descriptions.Item label="Email">{user.email}</Descriptions.Item>
          <Descriptions.Item label="Role">{user.role}</Descriptions.Item>
        </Descriptions>
        <Space style={{ marginTop: 24, width: "100%", justifyContent: "center", display: "flex" }}>
          <Button type="primary" onClick={() => { setDrawerOpen(false); navigate('/profile'); }}>Update Profile</Button>
        </Space>
      </Drawer>
    </>
  );
};

export default UserManagement; 