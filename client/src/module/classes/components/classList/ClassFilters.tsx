// client/src/module/classes/components/ClassFilters.tsx

import React from 'react';
import { Card, Row, Col, Select, Typography, Space, Button, Divider } from 'antd';
import { FilterOutlined, ClearOutlined } from '@ant-design/icons';
import { useClassStore, useClassStoreSelectors } from '../../store/useClassStore';
import { ClassStatus } from '../../types/class.type';
import SearchBox from './SearchBox'; // ✅ your extracted component

const { Text } = Typography;

const ClassFilters: React.FC = () => {
  const filters = useClassStoreSelectors.filters();
  const setFilters = useClassStore((state) => state.setFilters);

  const [statusFilter, setStatusFilter] = React.useState<string>(filters.status || 'all-classes');
  const [gradeFilter, setGradeFilter] = React.useState<number | undefined>(filters.grade);

  const statusOptions = [
    { label: 'All Classes', value: 'all-classes' },
    { label: 'Scheduled', value: 'SCHEDULED' },
    { label: 'In Progress', value: 'IN_PROGRESS' },
    { label: 'Completed', value: 'COMPLETED' },
    { label: 'Cancelled', value: 'CANCELLED' },
  ];

  const gradeOptions = Array.from({ length: 12 }, (_, i) => ({
    label: `Grade ${i + 1}`,
    value: i + 1,
  }));

  const hasActiveFilters = Boolean(filters.searchData) || statusFilter !== 'all-classes' || Boolean(gradeFilter);

  const handleStatusChange = (value: string) => {
    setStatusFilter(value);
    setFilters({ status: value === 'all-classes' ? undefined : (value as ClassStatus), page: 1 });
  };

  const handleGradeChange = (value: number | undefined) => {
    setGradeFilter(value);
    setFilters({ grade: value, page: 1 });
  };

  const handleClearFilters = () => {
    setStatusFilter('all-classes');
    setGradeFilter(undefined);
    setFilters({ status: undefined, searchData: undefined, grade: undefined, page: 1 });
  };

  return (
    <Card 
      size="small" 
      style={{ marginBottom: 16, borderRadius: 8 }}
      styles={{ body: { padding: '16px' } }}
    >
      <Row gutter={[16, 16]} align="middle" justify="space-between">
        {/* Left side: filters grouped */}
        <Col xs={24} md={18}>
          <Space wrap>
            <SearchBox />
            <Select
              placeholder="Status"
              value={statusFilter}
              onChange={handleStatusChange}
              options={statusOptions}
              style={{ minWidth: 150 }}
              suffixIcon={<FilterOutlined />}
            />
            <Select
              placeholder="Grade"
              value={gradeFilter}
              onChange={handleGradeChange}
              options={gradeOptions}
              style={{ minWidth: 120 }}
              allowClear
            />
          </Space>
        </Col>

        {/* Right side: Clear + status text */}
        <Col xs={24} md={6} style={{ textAlign: 'right' }}>
          <Space size="small" direction="horizontal">
            {hasActiveFilters && (
              <Button
                icon={<ClearOutlined />}
                onClick={handleClearFilters}
                size="small"
                type="default"
              >
                Clear
              </Button>
            )}
            <Text type="secondary" style={{ fontSize: 12 }}>
              {hasActiveFilters ? 'Filters applied' : 'No filters'}
            </Text>
          </Space>
        </Col>
      </Row>

      {/* Divider only visible on small screens to separate rows */}
      <Divider className="lg:hidden" style={{ margin: '8px 0' }} />
    </Card>
  );
};

export default ClassFilters;
