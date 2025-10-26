// client/src/components/layout/ResponsiveMainContent.tsx
import { Layout, theme } from "antd";
import { useResponsive } from "../../hooks/useResponsive";
import PageWrapper from "../wrapper/pageWrapper";

const { Content } = Layout;

interface MainContentProps {
  children?: React.ReactNode;
}

const MainContent: React.FC<MainContentProps> = ({ children }) => {
  const { token } = theme.useToken();
  const { isMobile, isTablet } = useResponsive();
  return (
    <Content
      style={{
        padding: isMobile ? token.paddingXXS : isTablet ? token.paddingXS : token.paddingMD,
        minHeight: 280,
        background: token.Layout?.bodyBg,
        overflowX: "hidden",
        overflowY: "auto",
      }}
    >
      <PageWrapper>{children || "Main content goes here"}</PageWrapper>
    </Content>
  );
};

export default MainContent;