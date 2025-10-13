import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./style/index.css";
import AppRouter from "./routes/AppRouter";
import ThemeProvider from "./theme/ThemeProvider";
import '@ant-design/v5-patch-for-react-19';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from "./components/layout/ErrorBoundary";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
      <ErrorBoundary>
        <AppRouter />
        </ErrorBoundary>
      </ThemeProvider>
    </QueryClientProvider>
  </StrictMode>
);
