// client/src/module/authentication/components/ResponsiveUserManagement.tsx
import React from "react";
import {
  Avatar,
  Button,
  Dropdown,
  MenuProps,
  Typography,
  Flex,
  message,
  Drawer,
  Descriptions,
  Space,
  Spin,
  Badge,
  theme,
} from "antd";
import {
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
  DownOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useAuthUser, useLogout } from "..";
import { useResponsive, useResponsiveFontSize } from "../../../hooks/useResponsive";

const { Text } = Typography;

const UserManagement: React.FC = () => {
  const navigate = useNavigate();
  const user = useAuthUser();
  const { mutate: logout, isPending } = useLogout();
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  
  // Responsive hooks
  const { isMobile, isTablet } = useResponsive();
  const fontSize = useResponsiveFontSize();
  const { token } = theme.useToken();

  const handleMenuClick: MenuProps["onClick"] = ({ key }) => {
    if (key === "profile") {
      if (isMobile) {
        // On mobile, navigate directly to profile page instead of drawer
        navigate("/profile");
      } else {
        setDrawerOpen(true);
      }
    } else if (key === "settings") {
      message.info("Settings page coming soon!");
    } else if (key === "logout") {
      logout(undefined, {
        onSuccess: () => {
          navigate("/login");
          message.success("You're logged out successfully");
        },
        onError: () => {
          message.error("Logout failed. Please try again.");
        },
      });
    }
  };

  const menuItems: MenuProps["items"] = [
    {
      key: "profile",
      icon: <UserOutlined />,
      label: <span style={{ fontSize: isMobile ? 13 : 14 }}>Profile</span>,
    },
    {
      key: "settings",
      icon: <SettingOutlined />,
      label: <span style={{ fontSize: isMobile ? 13 : 14 }}>Settings</span>,
    },
    {
      type: "divider",
    },
    {
      key: "logout",
      icon: isPending ? <Spin size="small" /> : <LogoutOutlined />,
      label: <span style={{ fontSize: isMobile ? 13 : 14 }}>Logout</span>,
      danger: true,
      disabled: isPending,
    },
  ];

  if (!user) return null;

  // Mobile view: Show only avatar with dropdown
  if (isMobile) {
    return (
      <Dropdown
        menu={{
          items: menuItems,
          onClick: handleMenuClick,
          style: { borderRadius: 6, minWidth: 160 },
        }}
        trigger={["click"]}
        placement="bottomRight"
        dropdownRender={(menu) => (
          <div
            style={{
              boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
              borderRadius: 6,
            }}
          >
            {/* User info header in dropdown */}
            <div
              style={{
                padding: "12px 16px",
                borderBottom: `1px solid ${token.colorBorderSecondary}`,
                background: token.colorBgElevated,
              }}
            >
              <Flex align="center" gap={8}>
                <Avatar
                  size={40}
                  icon={<UserOutlined />}
                  src={user.profilePicture}
                  style={{ flexShrink: 0 }}
                />
                <Flex vertical align="start" style={{ flex: 1, minWidth: 0 }}>
                  <Text
                    strong
                    ellipsis
                    style={{
                      lineHeight: "1.2",
                      fontSize: 13,
                      width: "100%",
                    }}
                  >
                    {user.name}
                  </Text>
                  <Text
                    ellipsis
                    style={{
                      fontSize: 11,
                      color: token.colorTextSecondary,
                      width: "100%",
                    }}
                  >
                    {user.email}
                  </Text>
                  <Badge
                    count={user.role}
                    style={{
                      backgroundColor: token.colorPrimary,
                      fontSize: 10,
                      height: 18,
                      lineHeight: "18px",
                      marginTop: 4,
                    }}
                  />
                </Flex>
              </Flex>
            </div>
            {menu}
          </div>
        )}
      >
        <Button
          type="text"
          shape="circle"
          style={{
            outline:0,
            padding: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
           <Avatar
            size={36}
            icon={<UserOutlined />}
            src={user.profilePicture}
          />
            </Button>
      </Dropdown>
    );
  }

  // Tablet view: Show avatar and name, compact layout
  if (isTablet) {
    return (
      <>
        <Flex align="center" gap={8}>
          <Avatar
            size={36}
            icon={<UserOutlined />}
            src={user.profilePicture}
          />
          <Flex vertical align="start" style={{ maxWidth: 120 }}>
            <Text
              strong
              ellipsis
              style={{ lineHeight: "1.2", fontSize: 13 }}
            >
              {user.name}
            </Text>
            <Text
              ellipsis
              style={{ fontSize: 11, color: token.colorTextSecondary }}
            >
              {user.role}
            </Text>
          </Flex>
          <Dropdown
            menu={{
              items: menuItems,
              onClick: handleMenuClick,
              style: { borderRadius: 6 },
            }}
            trigger={["click"]}
            placement="bottomRight"
            dropdownRender={(menu) => (
              <div
                style={{
                  boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                  borderRadius: 6,
                }}
              >
                {menu}
              </div>
            )}
          >
            <Button
              style={{
                borderRadius: "50%",
                width: 24,
                height: 24,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: 0,
              }}
              size="small"
            >
              <DownOutlined style={{ fontSize: 10 }} />
            </Button>
          </Dropdown>
        </Flex>

        <Drawer
          title="User Profile"
          placement="right"
          onClose={() => setDrawerOpen(false)}
          open={drawerOpen}
          width={320}
        >
          <Space direction="vertical" size={16} style={{ width: "100%" }}>
            <Flex justify="center">
              <Avatar
                size={80}
                icon={<UserOutlined />}
                src={user.profilePicture}
              />
            </Flex>
            <Descriptions column={1} bordered size="small">
              <Descriptions.Item label="Name">{user.name}</Descriptions.Item>
              <Descriptions.Item label="Email">
                {user.email}
              </Descriptions.Item>
              <Descriptions.Item label="Role">{user.role}</Descriptions.Item>
            </Descriptions>
            <Space
              style={{
                marginTop: 16,
                width: "100%",
                justifyContent: "center",
                display: "flex",
              }}
            >
              <Button
                type="primary"
                onClick={() => {
                  setDrawerOpen(false);
                  navigate("/profile");
                }}
                block
              >
                Update Profile
              </Button>
            </Space>
          </Space>
        </Drawer>
      </>
    );
  }

  // Desktop view: Full layout with avatar, name, email, and role
  return (
    <>
      <Flex align="center" gap={12}>
        <Avatar
          size={40}
          icon={<UserOutlined />}
          src={user.profilePicture}
          style={{
            cursor: "pointer",
            transition: "all 0.3s",
          }}
          onClick={() => setDrawerOpen(true)}
        />
        <Flex vertical align="start" style={{ maxWidth: 150 }}>
          <Text
            strong
            ellipsis
            style={{ lineHeight: "1.2", fontSize: fontSize.body }}
          >
            {user.name}
          </Text>
          <Text
            ellipsis
            style={{
              fontSize: fontSize.small,
              color: token.colorTextSecondary,
            }}
          >
            {user.role}
          </Text>
        </Flex>
        <Dropdown
          menu={{
            items: menuItems,
            onClick: handleMenuClick,
            style: { borderRadius: 6 },
          }}
          trigger={["hover", "click"]}
          placement="bottomRight"
          dropdownRender={(menu) => (
            <div
              style={{
                boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                borderRadius: 6,
              }}
            >
              {menu}
            </div>
          )}
        >
          <Button
            style={{
              borderRadius: "50%",
              width: 28,
              height: 28,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 0,
              border: `1px solid ${token.colorBorderSecondary}`,
            }}
          >
            <DownOutlined style={{ fontSize: 12 }} />
          </Button>
        </Dropdown>
      </Flex>

      <Drawer
        title={
          <Flex align="center" gap={12}>
            <UserOutlined />
            <span>User Profile</span>
          </Flex>
        }
        placement="right"
        onClose={() => setDrawerOpen(false)}
        open={drawerOpen}
        width={380}
      >
        <Space direction="vertical" size={24} style={{ width: "100%" }}>
          {/* User Avatar and Basic Info */}
          <Flex vertical align="center" gap={12}>
            <Avatar
              size={100}
              icon={<UserOutlined />}
              src={user.profilePicture}
              style={{
                border: `2px solid ${token.colorPrimary}`,
              }}
            />
            <Text
              strong
              style={{
                fontSize: fontSize.h4,
                textAlign: "center",
              }}
            >
              {user.name}
            </Text>
            <Badge
              count={user.role}
              style={{
                backgroundColor: token.colorPrimary,
                fontSize: 12,
                padding: "4px 12px",
                height: "auto",
              }}
            />
          </Flex>

          {/* User Details */}
          <Descriptions
            column={1}
            bordered
            size="middle"
            labelStyle={{
              fontWeight: 600,
              width: "35%",
            }}
          >
            <Descriptions.Item label="Name">{user.name}</Descriptions.Item>
            <Descriptions.Item label="Email">{user.email}</Descriptions.Item>
            <Descriptions.Item label="Role">{user.role}</Descriptions.Item>
            {user.id && (
              <Descriptions.Item label="User ID">
                <Text
                  copyable
                  ellipsis
                  style={{ fontSize: fontSize.small, maxWidth: 180 }}
                >
                  {user.id}
                </Text>
              </Descriptions.Item>
            )}
          </Descriptions>

          {/* Action Buttons */}
          <Space
            direction="vertical"
            size={12}
            style={{
              width: "100%",
            }}
          >
            <Button
              type="primary"
              size="large"
              block
              onClick={() => {
                setDrawerOpen(false);
                navigate("/profile");
              }}
              icon={<UserOutlined />}
            >
              View Full Profile
            </Button>
            <Button
              size="large"
              block
              onClick={() => {
                setDrawerOpen(false);
                handleMenuClick({ key: "settings" } as any);
              }}
              icon={<SettingOutlined />}
            >
              Settings
            </Button>
            <Button
              danger
              size="large"
              block
              onClick={() => {
                setDrawerOpen(false);
                handleMenuClick({ key: "logout" } as any);
              }}
              icon={isPending ? <Spin size="small" /> : <LogoutOutlined />}
              loading={isPending}
            >
              Logout
            </Button>
          </Space>
        </Space>
      </Drawer>
    </>
  );
};

export default UserManagement;