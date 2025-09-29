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
        borderRadius: 8,
      },
      card: {
        padding: '24px',
        borderRadius: '16px',
        shadow: '0 1px 3px rgba(0, 0, 0, 0.08)',
        hoverShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
        hoverTransform: 'translateY(-4px)'
      },
      input: {
        borderRadius: '8px',
        padding: '10px 12px',
        borderColor: '#e5e5e5',
        focusBorderColor: '#6366f1',
        focusShadow: '0 0 0 3px rgba(99, 102, 241, 0.1)'
      },
      tag: {
        borderRadius: '6px',
        padding: '4px 10px',
        fontWeight: 500,
        fontSize: '13px'
      },
      avatar: {
        borderRadius: '10px',
        sizes: {
          sm: '32px',
          base: '40px',
          md: '48px',
          lg: '56px',
          xl: '64px'
        }
      }
    },
    // Breakpoints (mobile-first)
  breakpoints: {
    xs: '0px',
    sm: '576px',
    md: '768px',
    lg: '992px',
    xl: '1200px',
    xxl: '1600px'
  },
    typography: {
      fontFamily: {
        primary: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        mono: '"SF Mono", Monaco, "Cascadia Code", "Roboto Mono", Consolas, "Courier New", monospace'
      },
      fontSize: {
        xs: '12px',
        sm: '13px',
        base: '14px',
        md: '15px',
        lg: '16px',
        xl: '18px',
        '2xl': '20px',
        '3xl': '24px',
        '4xl': '28px',
        '5xl': '32px',
        '6xl': '36px'
      },
      fontWeight: {
        normal: 400,
        medium: 500,
        semibold: 600,
        bold: 700,
        extrabold: 800
      },
      lineHeight: {
        tight: 1.2,
        normal: 1.5,
        relaxed: 1.75,
        loose: 2
      }
    },
  
    // Spacing (8px base)
    spacing: {
      0: '0',
      1: '4px',
      2: '8px',
      3: '12px',
      4: '16px',
      5: '20px',
      6: '24px',
      7: '28px',
      8: '32px',
      10: '40px',
      12: '48px',
      16: '64px',
      20: '80px',
      24: '96px'
    },
  
    // Border Radius
    borderRadius: {
      none: '0',
      sm: '4px',
      base: '8px',
      md: '10px',
      lg: '12px',
      xl: '16px',
      '2xl': '20px',
      '3xl': '24px',
      full: '9999px'
    },
  
    // Shadows
    shadows: {
      none: 'none',
      sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
      base: '0 1px 3px rgba(0, 0, 0, 0.08)',
      md: '0 4px 6px rgba(0, 0, 0, 0.07)',
      lg: '0 8px 16px rgba(0, 0, 0, 0.1)',
      xl: '0 12px 24px rgba(0, 0, 0, 0.12)',
      '2xl': '0 20px 40px rgba(0, 0, 0, 0.15)',
      inner: 'inset 0 2px 4px rgba(0, 0, 0, 0.06)',
      glow: {
        primary: '0 0 20px rgba(99, 102, 241, 0.3)',
        success: '0 0 20px rgba(16, 185, 129, 0.3)',
        warning: '0 0 20px rgba(245, 158, 11, 0.3)',
        error: '0 0 20px rgba(239, 68, 68, 0.3)'
      }
    },
  
    // Transitions
    transitions: {
      fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
      base: '200ms cubic-bezier(0.4, 0, 0.2, 1)',
      slow: '300ms cubic-bezier(0.4, 0, 0.2, 1)',
      slowest: '500ms cubic-bezier(0.4, 0, 0.2, 1)'
    },
  
    // Z-Index
    zIndex: {
      base: 0,
      dropdown: 1000,
      sticky: 1020,
      fixed: 1030,
      modalBackdrop: 1040,
      modal: 1050,
      popover: 1060,
      tooltip: 1070
    },  
    colors: {
      primary: {
        main: '#6366f1',
        light: '#818cf8',
        lighter: '#c7d2fe',
        dark: '#4f46e5',
        gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        shadow: 'rgba(99, 102, 241, 0.25)'
      },
      success: {
        main: '#10b981',
        light: '#34d399',
        lighter: '#d1fae5',
        dark: '#059669',
        gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        shadow: 'rgba(16, 185, 129, 0.25)'
      },
      warning: {
        main: '#f59e0b',
        light: '#fbbf24',
        lighter: '#fef3c7',
        dark: '#d97706',
        gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
        shadow: 'rgba(245, 158, 11, 0.25)'
      },
      error: {
        main: '#ef4444',
        light: '#f87171',
        lighter: '#fee2e2',
        dark: '#dc2626',
        gradient: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
        shadow: 'rgba(239, 68, 68, 0.25)'
      },
      info: {
        main: '#3b82f6',
        light: '#60a5fa',
        lighter: '#dbeafe',
        dark: '#2563eb',
        gradient: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
        shadow: 'rgba(59, 130, 246, 0.25)'
      },
      neutral: {
        50: '#fafafa',
        100: '#f5f5f5',
        200: '#e5e5e5',
        300: '#d4d4d4',
        400: '#a3a3a3',
        500: '#737373',
        600: '#525252',
        700: '#404040',
        800: '#262626',
        900: '#171717'
      },
      background: {
        primary: '#ffffff',
        secondary: '#fafafa',
        tertiary: '#f5f5f5',
        overlay: 'rgba(0, 0, 0, 0.5)'
      }
    },
  };

  return <ConfigProvider theme={themeConfig}>{children}</ConfigProvider>;
};

export default ThemeProvider;
