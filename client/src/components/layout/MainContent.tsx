import { Layout, theme } from "antd";

const { Content } = Layout;

interface MainContentProps {
  children?: React.ReactNode;
}

const MainContent: React.FC<MainContentProps> = ({ children }) => {
  const { token } = theme.useToken();

  return (
    <Content
      style={{
        padding: 24,
        minHeight: 280,
        background: token.Layout?.bodyBg,
      }}
    >
      {children || "Main content goes here"}
    </Content>
  );
};

export default MainContent;
