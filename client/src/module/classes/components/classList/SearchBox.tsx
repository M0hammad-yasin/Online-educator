import { Input } from "antd";
import React from "react";
import { useClassStoreSelectors, useClassStore } from "../../store/useClassStore";
import { useDebounce } from "../../../../hooks/useDebounce";
import { SearchOutlined,  } from '@ant-design/icons';

const SearchBox: React.FC = () => {
  const filters = useClassStoreSelectors.filters();
  const setFilters = useClassStore((state) => state.setFilters);

  const [searchValue, setSearchValue] = React.useState<string>(filters.searchData || '');
  const debouncedSearch = useDebounce(searchValue, 400); // wait 400ms

  // Run filter update only when debounced value changes
  React.useEffect(() => {
    setFilters({ searchData: debouncedSearch || undefined, page: 1 });
  }, [debouncedSearch, setFilters]);

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
  };

  return (
    <Input
      placeholder="Search classes by subject, teacher, or student..."
      prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
      value={searchValue}
      onChange={(e) => handleSearchChange(e.target.value)}
      allowClear
      style={{ borderRadius: 6 }}
    />
  );
};

export default SearchBox;
