import { Layout } from "antd";
import { useState } from "react";

// Import the CSS file for styling
import "./App.css";
import { AppHeader, MainContent, Sidebar } from "./components/layout";

const App = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sidebar collapsed={collapsed} />
      <Layout>
        <AppHeader collapsed={collapsed} setCollapsed={setCollapsed} />
        <MainContent>
          {/* Content can be passed as children to MainContent */}
          <div>Welcome to the Online Educator Platform!</div>
        </MainContent>
      </Layout>
    </Layout>
  );
};

export default App;
