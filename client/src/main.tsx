import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./style/index.css";
import AppRouter from "./routes/AppRouter";
import ThemeProvider from "./theme/ThemeProvider";
import '@ant-design/v5-patch-for-react-19';

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <AppRouter />
    </ThemeProvider>
  </StrictMode>
);
