import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./style/index.css";
import AppRouter from "./routes.tsx";
import ThemeProvider from "./theme/ThemeProvider";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <AppRouter />
    </ThemeProvider>
  </StrictMode>
);
