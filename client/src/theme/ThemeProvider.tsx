import React from "react";
import { ConfigProvider, theme as antTheme } from "antd";
import useThemeStore from "../store/themeStore";

interface ThemeProviderProps {
  children: React.ReactNode;
}

const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const { mode } = useThemeStore();

  // Configure theme based on current mode
  const themeConfig = {
    algorithm:
      mode === "dark" ? antTheme.darkAlgorithm : antTheme.defaultAlgorithm,
    token: {
      colorPrimary: "#1890ff",
      colorSuccess: "#52c41a",
      colorWarning: "#faad14",
      colorError: "#f5222d",
      colorInfo: "#1890ff",
      colorTextBase: mode === "dark" ? "#ffffff" : "#000000",
      colorBgBase: mode === "dark" ? "#141414" : "#ffffff",
      borderRadius: 6,
      borderRadiusLG: 12,
      fontFamily: '"Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      fontSize: 14,
      colorBgContainer: mode === "dark" ? "#1f1f1f" : "#FAFDFE",
      boxShadow: "1px 5px 9px #00000027", // Added custom box shadow
    },
    components: {
      Menu: {
        itemBg: mode === "dark" ? "#141414" : "#f5f5f5",
        itemColor: mode === "dark" ? "#d9d9d9" : "#67655c",
        itemSelectedColor: "#1890ff",
        itemSelectedBg: mode === "dark" ? "#374f64af" : "#daecfcbc", // More vibrant selected background color
        itemHoverBg: mode === "dark" ? "#1a3a5a" : "#e6f7ff", // Added hover background color
        itemHoverColor: "#1890ff",
        algorithm: true,
      },
      Layout: {
        algorithm: true,
        headerBg: mode === "dark" ? "#1f1f1f" : "#f8f8f8",
        bodyBg: mode === "dark" ? "#141414" : "#F3FDFF",
        siderBg: mode === "dark" ? "#141414" : "#f8f8f8",
        triggerBg: "#002140",
      },
      Button: {
        colorPrimary: "#1890ff",
        algorithm: true,
      },
    },
  };

  return <ConfigProvider theme={themeConfig}>{children}</ConfigProvider>;
};

export default ThemeProvider;
