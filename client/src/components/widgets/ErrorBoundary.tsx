// src/components/common/ErrorBoundary.tsx

import { ErrorBoundary as ReactErrorBoundary, FallbackProps } from "react-error-boundary";
import { Result, Button, Typography, theme } from "antd";
import { ReloadOutlined } from "@ant-design/icons";
import type { ErrorInfo, ReactNode } from "react";
import { useResponsiveSpacing } from "../../hooks";

const { Paragraph, Text } = Typography;

function DefaultFallback({ error, resetErrorBoundary }: FallbackProps) {
  const { token } = theme.useToken();
  const padding=useResponsiveSpacing();

  return (
    <div
      style={{
        height: 'fit-content',
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: token.colorBgContainer, // Auto light/dark support
        padding: padding.sm,
      }}
    >
      <Result
        status="error"
        title="Something went wrong"
        subTitle={
          <Paragraph style={{ color: token.colorTextSecondary }}>
            An unexpected error occurred.
            <br />
            <Text code>{error?.message}</Text>
          </Paragraph>
        }
        extra={
          <Button
            type="primary"
            icon={<ReloadOutlined />}
            onClick={resetErrorBoundary}
          >
            Try Again
          </Button>
        }
      />
    </div>
  );
}

interface ErrorBoundaryProps {
  children: ReactNode;
  FallbackComponent?: React.ComponentType<FallbackProps>;
  onError?: (error: Error, info: ErrorInfo) => void;
  onReset?: () => void;
}

export function ErrorBoundary({
  children,
  FallbackComponent = DefaultFallback,
  onError,
  onReset,
}: ErrorBoundaryProps) {
  const handleError = (error: Error, info: ErrorInfo) => {
    onError?.(error, info);

    if (!onError) {
      console.error("❌ ErrorBoundary:", error);
      console.log("🧱 Component Stack:", info.componentStack);
    }
  };

  return (
    <ReactErrorBoundary
      FallbackComponent={FallbackComponent}
      onError={handleError}
      onReset={onReset ?? (() => window.location.reload())}
    >
      {children}
    </ReactErrorBoundary>
  );
}
