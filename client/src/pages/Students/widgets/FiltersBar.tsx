import React, { useMemo } from 'react';
import { Input, Select, Flex, theme as antdTheme, Button } from 'antd';
import { useStudentFilters } from '../../../module/student/store/useStudentStore';
import { useDebounce } from '../../../hooks/useDebounce';

const FiltersBar: React.FC = () => {
  const { token } = antdTheme.useToken();
  const { filters, setFilters, resetFilters } = useStudentFilters();
  const [search, setSearch] = React.useState(filters.search || '');
  const debouncedSearch = useDebounce(search, 300);

  React.useEffect(() => {
    if ((filters.search ?? '') !== debouncedSearch) {
      setFilters({ search: debouncedSearch, page: 1 });
    }
  }, [debouncedSearch]);

  const grades = useMemo(() => Array.from({ length: 12 }, (_, i) => ({ label: `Grade ${i + 1}`, value: i + 1 })), []);
  const regions = ['North', 'South', 'East', 'West', 'Central'].map((r) => ({ label: r, value: r }));

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
          placeholder="Grade"
          value={filters.grade}
          onChange={(val) => setFilters({ grade: val ?? undefined, page: 1 })}
          options={grades}
          style={{ width: 160 }}
        />
        <Select
          allowClear
          placeholder="Region"
          value={filters.region}
          onChange={(val) => setFilters({ region: val ?? undefined, page: 1 })}
          options={regions}
          style={{ width: 180 }}
        />
      </Flex>
      <Button onClick={resetFilters}>Reset</Button>
    </Flex>
  );
};

export default FiltersBar;


