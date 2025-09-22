// client/src/module/classes/components/ClassFilters.tsx

import React from 'react';
import { Card, Row, Col, Input, Select, Typography, Space, Button } from 'antd';
import { SearchOutlined, FilterOutlined, ClearOutlined } from '@ant-design/icons';
import { useClassStore, useClassStoreSelectors } from '../store/useClassStore';
import { ClassStatus } from '../types/class.type';

const { Text } = Typography;

const ClassFilters: React.FC = () => {
  const filters = useClassStoreSelectors.filters();
  const setFilters = useClassStore((state) => state.setFilters);

  const [searchValue, setSearchValue] = React.useState<string>(filters.searchData || '');
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

  const hasActiveFilters = Boolean(searchValue) || statusFilter !== 'all-classes' || Boolean(gradeFilter);

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
    setFilters({ searchData: value || undefined, page: 1 });
  };

  const handleStatusChange = (value: string) => {
    setStatusFilter(value);
    setFilters({ status: value === 'all-classes' ? undefined : (value as ClassStatus), page: 1 });
  };

  const handleGradeChange = (value: number | undefined) => {
    setGradeFilter(value);
    setFilters({ grade: value, page: 1 });
  };

  const handleClearFilters = () => {
    setSearchValue('');
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
      <Row gutter={[16, 16]} align="middle">
        <Col xs={24} sm={12} md={8}>
          <Input
            placeholder="Search classes by subject, teacher, or student..."
            prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
            value={searchValue}
            onChange={(e) => handleSearchChange(e.target.value)}
            allowClear
            style={{ borderRadius: 6 }}
          />
        </Col>
        
        <Col xs={12} sm={6} md={4}>
          <Select
            placeholder="Status"
            value={statusFilter}
            onChange={handleStatusChange}
            options={statusOptions}
            style={{ width: '100%' }}
            suffixIcon={<FilterOutlined />}
          />
        </Col>
        
        <Col xs={12} sm={6} md={4}>
          <Select
            placeholder="Grade"
            value={gradeFilter}
            onChange={handleGradeChange}
            options={gradeOptions}
            style={{ width: '100%' }}
            allowClear
          />
        </Col>
        
        <Col xs={24} sm={12} md={8} style={{ textAlign: 'right' }}>
          <Space>
            {hasActiveFilters && (
              <Button
                icon={<ClearOutlined />}
                onClick={handleClearFilters}
                size="small"
                type="text"
                danger
              >
                Clear Filters
              </Button>
            )}
            <Text type="secondary" style={{ fontSize: '12px' }}>
              {hasActiveFilters ? 'Filters applied' : 'No filters'}
            </Text>
          </Space>
        </Col>
      </Row>
    </Card>
  );
};

export default ClassFilters;


