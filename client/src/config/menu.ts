import { Role } from "./constants";
const SIDEBAR_MENU = {
  [Role.ADMIN]: [
    {
      key: 1,
      label: "Dashboard",
      path: "/dashboard",
      icon: "DashboardOutlined",
    },
    {
      key: 2,
      label: "Manage Teachers",
      path: "/teachers",
      icon: "UserOutlined",
    },
    {
      key: 3,
      label: "Manage Students",
      path: "/students",
      icon: "UserOutlined",
    },
    {
      key: 4,
      label: "Manage Classes",
      path: "/classes",
      icon: "CalendarOutlined",
    },
    {
      key: 5,
      label: "Manage Subjects",
      path: "/subjects",
      icon: "BookOutlined",
    },
    {
      key: 6,
      label: "Manage Assignments",
      path: "/assignments",
      icon: "FileOutlined",
    },
    {
      key: 7,
      label: "Calendar",
      path: "/calendar",
      icon: "CalendarOutlined",
    },
    {
      key: 8,
      label: "Settings",
      path: "/settings",
      icon: "SettingOutlined",
    },
    {
      key: 9,
      label: "My Profile",
      path: "/profile",
      icon: "UserOutlined",
    },
    {
      key: 10,
      label: "Logout",
      path: "/logout",
      icon: "LogoutOutlined",
    },
  ],
  [Role.TEACHER]: [
    {
      key: 1,
      label: "My Classes",
      path: "/classes",
      icon: "CalendarOutlined",
    },
    {
      key: 2,
      label: "My Assignments",
      path: "/assignments",
      icon: "FileOutlined",
    },
    {
      key: 3,
      label: "Calendar",
      path: "/calendar",
      icon: "CalendarOutlined",
    },
    {
      key: 4,
      label: "My Students",
      path: "/students",
      icon: "UserOutlined",
    },
    {
      key: 5,
      label: "Settings",
      path: "/settings",
      icon: "SettingOutlined",
    },
    {
      key: 6,
      label: "My Profile",
      path: "/profile",
      icon: "UserOutlined",
    },
    {
      key: 7,
      label: "Logout",
      path: "/logout",
      icon: "LogoutOutlined",
    },
  ],
  [Role.STUDENT]: [
    {
      key: 1,
      label: "Dashboard",
      path: "/dashboard",
      icon: "DashboardOutlined",
    },
    {
      key: 2,
      label: "My Classes",
      path: "/classes",
      icon: "CalendarOutlined",
    },
    {
      key: 3,
      label: "My Assignments",
      path: "/assignments",
      icon: "FileOutlined",
    },
    {
      key: 4,
      label: "Calendar",
      path: "/calendar",
      icon: "CalendarOutlined",
    },
    {
      key: 5,
      label: "My Profile",
      path: "/profile",
      icon: "UserOutlined",
    },
    {
      key: 6,
      label: "Logout",
      path: "/logout",
      icon: "LogoutOutlined",
    },
  ],
};
export default SIDEBAR_MENU;
