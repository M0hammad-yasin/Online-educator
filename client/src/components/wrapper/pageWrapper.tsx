import React, { ReactNode } from "react";
import { theme as antdTheme } from "antd";
import { motion } from "framer-motion";
import useThemeStore from "../../store/themeStore";
import { useResponsive, useResponsiveSpacing } from "../../hooks";
import { useLocation } from "react-router-dom";

interface PageWrapperProps {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

const lightVariants = {
  initial: { opacity: 0, y: 10 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: "easeOut" as const },
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: { duration: 0.25, ease: "easeIn" as const },
  },
};

const darkVariants = {
  initial: { opacity: 0, y: 20, filter: "blur(3px)" },
  animate: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.45, ease: "easeOut" as const },
  },
  exit: {
    opacity: 0,
    y: -15,
    filter: "blur(2px)",
    transition: { duration: 0.3, ease: "easeIn" as const },
  },
};

/**
 * A global, responsive page wrapper that:
 * - Uses theme + responsive hooks
 * - Animates transitions between pages
 * - Adapts background gradients to theme mode
 * - Applies adaptive padding and border radii
 */
const PageWrapper: React.FC<PageWrapperProps> = ({ children, className, style }) => {
  const { token } = antdTheme.useToken();
  const { mode } = useThemeStore();
  const { isMobile, isTablet } = useResponsive();
  const spacing = useResponsiveSpacing();
  const location = useLocation();

  const variants = mode === "dark" ? darkVariants : lightVariants;

  const pageContainerStyle: React.CSSProperties = {
    padding: isMobile ? spacing.sm : spacing.lg,
    minHeight: "100vh",
    background:
      mode === "dark"
        ? "linear-gradient(180deg, rgb(36,36,36) 0%, rgb(48,48,48) 50%, rgb(62,62,62) 100%)"
        : "linear-gradient(180deg, #f0f9ff 0%, #e0f2fe 50%, #f8fafc 100%)",
    borderRadius: isMobile
      ? token.borderRadiusSM
      : isTablet
      ? token.borderRadius
      : token.borderRadiusLG,
    transition: "background 0.4s ease, border-radius 0.3s ease",
    overflow: "hidden",
    ...style,
  };

  return (
    <motion.div
      key={`${location.pathname}-${mode}`}
      className={className}
      style={pageContainerStyle}
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {children}
    </motion.div>
  );
};

export default PageWrapper;
