import { theme } from "antd";
import type { ThemeConfig } from "antd";

// Custom theme configuration for Ant Design
const themeConfig: ThemeConfig = {
  // Use algorithm to enable dark mode if needed
  algorithm: theme.defaultAlgorithm,
  // Customize token values
  token: {
    // Colors
    colorPrimary: "#1890ff", // Primary brand color
    colorSuccess: "#52c41a", // Success state color
    colorWarning: "#faad14", // Warning state color
    colorError: "#f5222d", // Error state color
    colorInfo: "#1890ff", // Info state color

    // Base colors
    colorTextBase: "#000000", // Base text color
    colorBgBase: "#ffffff", // Base background color

    // Border radius
    borderRadius: 6, // Small component border radius
    borderRadiusLG: 8, // Large component border radius

    // Font settings
    fontFamily: '"Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    fontSize: 14,

    // Component specific tokens
    // Sidebar specific
    colorBgContainer: "#ffffff",

    // You can add more token customizations as needed
  },
  components: {
    Menu: {
      colorItemBg: "#f5f5f5",
      colorItemText: "#595959",
      colorItemTextSelected: "#1890ff",
      colorItemBgSelected: "#e6f7ff",
      colorItemTextHover: "#1890ff",
    },
    Layout: {
      colorBgHeader: "#ffffff",
      colorBgBody: "#f0f2f5",
      colorBgTrigger: "#002140",
    },
    Button: {
      colorPrimary: "#1890ff",
      algorithm: true, // Enable algorithm for button
    },
  },
};

export default themeConfig;
