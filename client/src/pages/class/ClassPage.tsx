import React from "react";
import { useLocation } from "react-router-dom";
import ClassOverviewPage from "./ClassOverviewPage";
import ClassListPage from "./ClassListPage";
import ClassCreatePage from "./ClassCreatePage";

const ClassPage: React.FC = () => {
  const location = useLocation();
  const path = location.pathname;

  // Render appropriate component based on the current path
  if (path === "/classes/overview") {
    return <ClassOverviewPage />;
  } else if (path === "/classes/list") {
    return <ClassListPage />;
  } else if (path === "/classes/create") {
    return <ClassCreatePage />;
  }

  // Default to overview if path doesn't match
  return <ClassOverviewPage />;
};

export default ClassPage;