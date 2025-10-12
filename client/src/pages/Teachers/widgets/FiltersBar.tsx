import React from 'react';
import { Input, Select, Flex, theme as antdTheme, Button } from 'antd';
import { useTeacherFilters } from '../../../module/teacher/store/useTeacherStore';
import { useDebounce } from '../../../hooks/useDebounce';

const FiltersBar: React.FC = () => {
  const { token } = antdTheme.useToken();
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

  return (
    <Flex gap={token.size} wrap="wrap" align="center" justify="space-between">
      <Flex gap={token.size} wrap="wrap">
        <Input
          allowClear
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or email"
          style={{ width: 260 }}
        />
        <Select
          allowClear
          placeholder="Qualification"
          value={filters.qualification}
          onChange={(val) => setFilters({ qualification: val ?? undefined, page: 1 })}
          options={qualifications}
          style={{ width: 160 }}
        />
        <Select
          allowClear
          placeholder="Sort By"
          value={currentSort}
          onChange={handleSortChange}
          options={sortOptions}
          style={{ width: 180 }}
        />
      </Flex>
      <Button onClick={resetFilters}>Reset Filters</Button>
    </Flex>
  );
};

export default FiltersBar;
