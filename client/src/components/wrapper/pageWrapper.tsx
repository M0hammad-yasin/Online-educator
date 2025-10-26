import React, { ReactNode } from "react";
import { theme as antdTheme } from "antd";
import  useThemeStore from "../../store/themeStore";
import { useResponsive,  useResponsiveSpacing } from "../../hooks";

interface PageWrapperProps {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * A global, responsive page wrapper that:
 * - Uses global theme + responsive hooks
 * - Provides adaptive padding, background gradient, and rounded corners
 * - Automatically aligns with current color mode (dark/light)
 */
const PageWrapper: React.FC<PageWrapperProps> = ({ children, className, style }) => {
  const { token } = antdTheme.useToken();
  const { mode } = useThemeStore();
  const { isMobile,isTablet } = useResponsive();
  const spacing = useResponsiveSpacing();

  const pageContainerStyle: React.CSSProperties = {
    padding: isMobile ? spacing.sm : spacing.lg,
    minHeight: "100vh",
    background:
      mode === "dark"
        ? "linear-gradient(180deg,rgb(43, 43, 43) 0%,rgb(56, 55, 56) 50%,rgb(71, 71, 71) 100%)"
        : "linear-gradient(180deg, #f0f9ff 0%, #e0f2fe 50%, #f8fafc 100%)",
    borderRadius: isMobile ? token.borderRadiusSM : isTablet ? token.borderRadiusXS : token.borderRadiusLG,
    transition: "all 0.3s ease",
    ...style,
  };

  return (
    <div className={className} style={pageContainerStyle}>
      {children}
    </div>
  );
};

export default PageWrapper;
