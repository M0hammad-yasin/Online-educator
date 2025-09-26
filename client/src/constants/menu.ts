import { Role } from "./role";
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
      label: "Classes",
      icon: "CalendarOutlined",
      children: [
        {
          key: "4-1",
          label: "Overview",
          path: "/classes/overview",
        },
        {
          key: "4-2",
          label: "Class List",
          path: "/classes/list",
        },
        {
          key: "4-3",
          label: "Create Class",
          path: "/classes/create",
        },
      ],
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
      label: "Dashboard",
      path: "/dashboard",
      icon: "DashboardOutlined",
    },
    {
      key: 2,
      label: "My Classes",
      icon: "CalendarOutlined",
      children: [
        {
          key: "2-1",
          label: "Overview",
          path: "/classes/overview",
        },
        {
          key: "2-2",
          label: "Class List",
          path: "/classes/list",
        },
        {
          key: "2-3",
          label: "Create Class",
          path: "/classes/create",
        },
      ],
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
      label: "My Students",
      path: "/students",
      icon: "UserOutlined",
    },
    {
      key: 6,
      label: "Settings",
      path: "/settings",
      icon: "SettingOutlined",
    },
    {
      key: 7,
      label: "My Profile",
      path: "/profile",
      icon: "UserOutlined",
    },
    {
      key: 8,
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
      icon: "CalendarOutlined",
      children: [
        {
          key: "2-1",
          label: "Overview",
          path: "/classes/overview",
        },
        {
          key: "2-2",
          label: "Class List",
          path: "/classes/list",
        },
      ],
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
