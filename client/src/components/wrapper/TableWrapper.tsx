// client/src/components/common/ResponsiveTable.tsx
import React from 'react';
import { Table, Card, List, Space, Typography } from 'antd';
import type { TableProps } from 'antd';
import { useResponsive } from '../../hooks/useResponsive';

const { Text } = Typography;

interface TableWrapperProps<T> extends TableProps<T> {
  mobileRenderItem?: (item: T, index: number) => React.ReactNode;
  mobileCardProps?: any;
}

/**
 * Responsive table component that switches between Table (desktop) and List (mobile)
 * Usage:
 * <ResponsiveTable
 *   dataSource={data}
 *   columns={columns}
 *   mobileRenderItem={(item) => <CustomMobileCard data={item} />}
 * />
 */
function TableWrapper<T extends object>({
  mobileRenderItem,
  mobileCardProps,
  ...tableProps
}: TableWrapperProps<T>) {
  const { isMobile, isTablet } = useResponsive();

  // Mobile view: Render as List with Cards
  if (isMobile) {
    return (
      <List
        dataSource={tableProps.dataSource as T[]}
        loading={tableProps.loading}
        pagination={
          tableProps.pagination
            ? {
                current: tableProps.pagination.current,
                pageSize: tableProps.pagination.pageSize,
                total: tableProps.pagination.total,
                simple: true,
                size: 'small',
              }
            : false
        }
        renderItem={(item, index) => {
          // Use custom mobile render if provided
          if (mobileRenderItem) {
            return mobileRenderItem(item, index);
          }

          // Default mobile card render
          return (
            <List.Item style={{ padding: '8px 0', border: 'none' }}>
              <Card
                size="small"
                style={{ width: '100%' }}
                {...mobileCardProps}
              >
                <Space direction="vertical" size={4} style={{ width: '100%' }}>
                  {tableProps.columns?.map((column: any) => {
                    const value = item[column.dataIndex as keyof T];
                    return (
                      <div key={column.key || column.dataIndex}>
                        <Text type="secondary" style={{ fontSize: 11, display: 'block' }}>
                          {column.title}
                        </Text>
                        <Text strong style={{ fontSize: 13 }}>
                          {column.render ? column.render(value, item, index) : String(value)}
                        </Text>
                      </div>
                    );
                  })}
                </Space>
              </Card>
            </List.Item>
          );
        }}
      />
    );
  }

  // Tablet/Desktop view: Render as Table
  return (
    <Table
      {...tableProps}
      scroll={
        isTablet
          ? { x: 'max-content', ...tableProps.scroll }
          : tableProps.scroll
      }
      size={isTablet ? 'small' : tableProps.size}
      pagination={
        tableProps.pagination
          ? {
              ...tableProps.pagination,
              showSizeChanger: !isTablet,
              size: isTablet ? 'small' : 'default',
            }
          : false
      }
    />
  );
}

export default TableWrapper;