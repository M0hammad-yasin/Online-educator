import { Input } from "antd";
import React from "react";
import { SearchOutlined } from "@ant-design/icons";
import { useDebounce } from "../../hooks/useDebounce";

interface SearchBox {
  placeholder?: string;
  initialValue?: string;
  onSearch: (value?: string) => void; // external filter handler
  debounceMs?: number;
}

const SearchBox: React.FC<SearchBox> = ({
  placeholder = "Search...",
  initialValue = "",
  onSearch,
  debounceMs = 400,
}) => {
  const [searchValue, setSearchValue] = React.useState(initialValue);
  const debouncedSearch = useDebounce(searchValue, debounceMs);

  React.useEffect(() => {
    onSearch(debouncedSearch || undefined);
  }, [debouncedSearch]);

  return (
    <Input
      placeholder={placeholder}
      prefix={<SearchOutlined style={{ color: "#bfbfbf" }} />}
      value={searchValue}
      onChange={(e) => setSearchValue(e.target.value)}
      allowClear
      style={{ borderRadius: 6 }}
    />
  );
};

export default SearchBox;
