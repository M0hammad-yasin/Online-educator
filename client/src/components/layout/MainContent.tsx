// client/src/components/layout/ResponsiveMainContent.tsx
import { Layout, theme } from "antd";
import { useResponsive, useResponsiveSpacing } from "../../hooks/useResponsive";

const { Content } = Layout;

interface MainContentProps {
  children?: React.ReactNode;
}

const MainContent: React.FC<MainContentProps> = ({ children }) => {
  const { token } = theme.useToken();
  const { isMobile, isTablet } = useResponsive();
  const spacing = useResponsiveSpacing();

  return (
    <Content
      style={{
        padding: isMobile ? token.paddingXXS : isTablet ? token.paddingXS : token.paddingXL,
        minHeight: 280,
        background: token.Layout?.bodyBg,
        overflowX: "hidden",
        overflowY: "auto",
      }}
    >
      {children || "Main content goes here"}
    </Content>
  );
};

export default MainContent;