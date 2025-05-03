import { Layout } from "antd";
import { useState } from "react";

// Import the CSS file for styling
import "./style/App.css";
import { AppHeader, MainContent, Sidebar } from "./components/layout";
import Dashboard from "./components/dashboard/Dashboard";
import AppRouter from "./routes/AppRouter";
const App = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <AppRouter/>
  );
};

export default App;
