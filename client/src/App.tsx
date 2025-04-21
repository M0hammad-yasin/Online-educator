import { Layout } from "antd";
import { useState } from "react";

// Import the CSS file for styling
import "./style/App.css";
import { AppHeader, MainContent, Sidebar } from "./components/layout";
import Dashboard from "./components/dashboard/Dashboard";

const App = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sidebar collapsed={collapsed} />
      <Layout>
        <AppHeader collapsed={collapsed} setCollapsed={setCollapsed} />
        <MainContent>
          <Dashboard />
        </MainContent>
      </Layout>
    </Layout>
  );
};

export default App;
