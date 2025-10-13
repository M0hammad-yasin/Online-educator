// src/components/common/ErrorBoundary.tsx
import { ErrorBoundary as ReactErrorBoundary } from "react-error-boundary";
import { Result, Button, Typography } from "antd";
import { ReloadOutlined } from "@ant-design/icons";
import type { ErrorInfo } from "react";

const { Paragraph, Text } = Typography;

function ErrorFallback({ error, resetErrorBoundary }: any) {
  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f9f9f9",
      }}
    >
      <Result
        status="error"
        title="Something went wrong"
        subTitle={
          <Paragraph>
            <Text type="secondary">
              An unexpected error occurred in the application.
            </Text>
            <br />
            <Text code>{error.message}</Text>
          </Paragraph>
        }
        extra={[
          <Button
            type="primary"
            icon={<ReloadOutlined />}
            key="reload"
            onClick={resetErrorBoundary}
          >
            Try Again
          </Button>,
        ]}
      />
    </div>
  );
}

export function ErrorBoundary({ children }: { children: React.ReactNode }) {
    const handleError = (error: Error, info: ErrorInfo) => {
        console.error("❌ Caught by ErrorBoundary:", error);
        console.log("🧱 Component Stack:", info.componentStack ?? "");
      };

  return (
    <ReactErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={handleError}
      onReset={() => window.location.reload()}
    >
      {children}
    </ReactErrorBoundary>
  );
}
