import React from 'react';
import { Input, Select, Flex, theme as antdTheme, Button, Typography } from 'antd';
import { SearchOutlined, FilterOutlined, SortAscendingOutlined, ReloadOutlined } from '@ant-design/icons';
import { useTeacherFilters } from '..';
import { useDebounce } from '../../../hooks';
import useThemeStore from '../../../store/themeStore';

const { Text } = Typography;

const FiltersBar: React.FC = () => {
  const { token } = antdTheme.useToken();
  const { mode } = useThemeStore();
  const { filters, setFilters, resetFilters } = useTeacherFilters();
  const [search, setSearch] = React.useState(filters.search || '');
  const debouncedSearch = useDebounce(search, 300);

  React.useEffect(() => {
    if ((filters.search ?? '') !== debouncedSearch) {
      setFilters({ search: debouncedSearch, page: 1 });
    }
  }, [debouncedSearch]);

  // Qualification options
  const qualifications = [
    { label: 'B.Ed', value: 'B.Ed' },
    { label: 'M.Ed', value: 'M.Ed' },
    { label: 'Ph.D', value: 'Ph.D' },
    { label: 'B.Sc', value: 'B.Sc' },
    { label: 'M.Sc', value: 'M.Sc' },
    { label: 'B.A', value: 'B.A' },
    { label: 'M.A', value: 'M.A' },
  ];

  // Sort options
  const sortOptions = [
    { label: 'Name (A-Z)', value: 'name_asc' },
    { label: 'Name (Z-A)', value: 'name_desc' },
    { label: 'Email (A-Z)', value: 'email_asc' },
    { label: 'Email (Z-A)', value: 'email_desc' },
    { label: 'Newest First', value: 'createdAt_desc' },
    { label: 'Oldest First', value: 'createdAt_asc' },
  ];

  const handleSortChange = (value: string | undefined) => {
    if (!value) {
      setFilters({ sortBy: undefined, order: undefined, page: 1 });
      return;
    }
    const [sortBy, order] = value.split('_') as [any, 'asc' | 'desc'];
    setFilters({ sortBy, order, page: 1 });
  };

  const currentSort = filters.sortBy && filters.order 
    ? `${filters.sortBy}_${filters.order}` 
    : undefined;

  const inputStyle: React.CSSProperties = {
    borderRadius: 8,
    border: `1px solid ${mode === 'dark' ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.15)'}`,
    background: mode === 'dark' 
      ? 'rgba(255, 255, 255, 0.05)' 
      : 'rgba(255, 255, 255, 0.9)',
  };

  return (
    <Flex vertical gap={token.size}>
      <Text strong style={{ fontSize: token.fontSizeLG }}>
        🔍 Filter & Search
      </Text>
      <Flex gap={token.size} wrap="wrap" align="center" justify="space-between">
        <Flex gap={token.size} wrap="wrap" align="center">
          <Input
            allowClear
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            prefix={<SearchOutlined style={{ color: token.colorTextSecondary }} />}
            style={{ width: 280, ...inputStyle }}
          />
          <Select
            allowClear
            placeholder="Filter by Qualification"
            value={filters.qualification}
            onChange={(val) => setFilters({ qualification: val ?? undefined, page: 1 })}
            options={qualifications}
            suffixIcon={<FilterOutlined style={{ color: token.colorTextSecondary }} />}
            style={{ width: 200 }}
            popupMatchSelectWidth={false}
          />
          <Select
            allowClear
            placeholder="Sort by..."
            value={currentSort}
            onChange={handleSortChange}
            options={sortOptions}
            suffixIcon={<SortAscendingOutlined style={{ color: token.colorTextSecondary }} />}
            style={{ width: 180 }}
            popupMatchSelectWidth={false}
          />
        </Flex>
        <Button 
          icon={<ReloadOutlined />}
          onClick={resetFilters}
          style={{ borderRadius: 8 }}
        >
          Reset
        </Button>
      </Flex>
    </Flex>
  );
};

export default FiltersBar;
