import React, { Suspense, useMemo } from 'react';
import { Card, Space, Typography, theme, Flex, Spin, Alert } from 'antd';
import { ErrorBoundary } from '../widgets/ErrorBoundary';
import {
  PageConfig,
  PermissionContext,
  WidgetConfig,
} from '../../config/rbac-types';
import {
  getVisibleSections,
  validatePageConfig,
  getAllowedViewFields,
} from '../../utils/permission-utils';
import { modelPermissionsRegistry } from '../../config/model-permissions.config';

const { Title, Text } = Typography;

interface DashboardRendererProps {
  config: PageConfig;
  context: PermissionContext;
  loading?: boolean;
  onError?: (error: Error, widgetId: string) => void;
}

const DefaultErrorFallback: React.FC<{
  error: Error;
  reset: () => void;
  widgetId: string;
}> = ({ error, reset, widgetId }) => (
  <Alert
    message="Widget Error"
    description={
      <div>
        <p>Failed to load widget: {widgetId}</p>
        <p style={{ fontSize: '12px', color: '#666' }}>{error.message}</p>
        <button onClick={reset}>Retry</button>
      </div>
    }
    type="error"
    showIcon
  />
);

const WidgetRenderer: React.FC<{
  widget: WidgetConfig;
  context: PermissionContext;
  onError?: (error: Error, widgetId: string) => void;
}> = ({ widget, context, onError }) => {
  const { token } = theme.useToken();
  const Component = widget.component;

  const filteredFields = useMemo(() => {
    if (!widget.model || !widget.applyFieldFiltering) return null;
    const modelConfig = modelPermissionsRegistry[widget.model];
    if (!modelConfig) return null;
    return getAllowedViewFields(context, modelConfig, widget.fieldOverrides);
  }, [widget.model, widget.applyFieldFiltering, context, widget.fieldOverrides]);

  const enhancedProps = useMemo(() => {
    const baseProps = widget.props || {};
    if (filteredFields) {
      return { ...baseProps, allowedFields: filteredFields, permissionContext: context };
    }
    return baseProps;
  }, [widget.props, filteredFields, context]);

  const WidgetContent = (
    <Suspense
      fallback={
        <div style={{ padding: token.paddingSM, textAlign: 'center' }}>
          <Spin tip="Loading widget..." />
        </div>
      }
    >
      <Component {...enhancedProps} />
    </Suspense>
  );

  const SafeWidget = (
    <ErrorBoundary
      FallbackComponent={
        widget.errorFallback || ((props) => (
          <DefaultErrorFallback error={props.error} reset={props.resetErrorBoundary} widgetId={widget.id} />
        ))
      }
      onError={(error) => onError?.(error, widget.id)}
    >
      {WidgetContent}
    </ErrorBoundary>
  );

  if (widget.wrapInCard) {
    return (
      <Card
        {...widget.cardProps}
        style={{
          borderRadius: token.borderRadiusLG,
          ...(widget.cardProps?.styles || {}),
        }}
      >
        {SafeWidget}
      </Card>
    );
  }
  return <div style={{ marginBottom: token.marginLG }}>{SafeWidget}</div>;
};

const SectionRenderer: React.FC<{
  section: any;
  context: PermissionContext;
  onError?: (error: Error, widgetId: string) => void;
}> = ({ section, context, onError }) => {
  const { token } = theme.useToken();
  if (section.widgets?.length === 0) return null;
  return (
    <div key={section.id} >
      {section.label && (
        <div style={{ marginBottom: token.margin }}>
          <Title level={4} style={{ margin: 0 }}>
            {section.label}
          </Title>
          {section.description && (
            <Text type="secondary" style={{ fontSize: token.fontSizeSM }}>
              {section.description}
            </Text>
          )}
        </div>
      )}
      <Space
        direction={section.containerProps?.direction || 'vertical'}
        size={ section.containerProps?.spacing || token.sizeLG}
        style={{ width: '100%',marginBottom: 0 }}
      >
        {section.widgets.map((widget: WidgetConfig) => (
          <WidgetRenderer key={widget.id} widget={widget} context={context} onError={onError} />
        ))}
      </Space>
    </div>
  );
};

const PageHeader: React.FC<{ config: PageConfig }> = ({ config }) => {
  const { token } = theme.useToken();
  const headerGradientStyle: React.CSSProperties = {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  };
  if (config.header?.customComponent) {
    const CustomHeader = config.header.customComponent as any;
    return <CustomHeader />;
  }
  return (
    <Flex justify="space-between" align="center" style={{ marginBottom: token.marginLG }}>
      <Space direction="vertical" size={4}>
        <Flex align="center" gap={token.size}>
          {config.icon && (
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: token.borderRadiusLG,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)',
              }}
            >
              {config.icon}
            </div>
          )}
          <Title level={2} style={{ margin: 0, ...headerGradientStyle }}>
            {config.title}
          </Title>
        </Flex>
        {config.description && (
          <Text type="secondary" style={{ fontSize: token.fontSize }}>
            {config.description}
          </Text>
        )}
      </Space>
    </Flex>
  );
};

export const DashboardRenderer: React.FC<DashboardRendererProps> = ({
  config,
  context,
  loading = false,
  onError,
}) => {
  if (import.meta.env.DEV) {
    const errors = validatePageConfig(config);
    if (errors.length > 0) {
      // eslint-disable-next-line no-console
      console.error('Dashboard Configuration Errors:', errors);
    }
  }
  const visibleSections = useMemo(
    () => getVisibleSections(config.sections, context, modelPermissionsRegistry),
    [config.sections, context]
  );
  if (loading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <Spin size="large" tip="Loading dashboard..." />
      </div>
    );
  }
  if (visibleSections.length === 0) {
    return (
      <Alert
        message="No Content Available"
        description="You don't have permission to view any content on this page."
        type="info"
        showIcon
      />
    );
  }
  return (
    <>
      {config.header?.show !== false && <PageHeader config={config} />}
      <div>
        {visibleSections.map((section) => (
          <SectionRenderer key={section.id} section={section} context={context} onError={onError} />
        ))}
      </div>
    </>
  );
};

export default DashboardRenderer;


