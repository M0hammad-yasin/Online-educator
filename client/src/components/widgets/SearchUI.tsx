// client/src/components/GlobalSearch/GlobalSearch.tsx
import React, { useState, useMemo } from 'react';
import { Input, Dropdown, Space, Typography, Avatar, Badge, Spin, Empty, Button, Tooltip } from 'antd';
import { SearchOutlined, UserOutlined, BookOutlined, TeamOutlined, LoadingOutlined, FilterOutlined } from '@ant-design/icons';
import { useGlobalSearch,useDebounce } from '../../hooks';
import { useNavigate } from 'react-router-dom';
import useHighlightMatch from '../../hooks/useHighlightMatch';
import { useAuthUser } from '../../module/authentication';
import { Role } from '../../constants/role';
import SearchModal from './SearchModal';
import '../../style/searchUI.css';

const { Text } = Typography;

interface SearchResultItemProps {
  id: string;
  name: string;
  email?: string;
  profilePicture?: string;
  subtitle?: string;
  type: 'teacher' | 'student' | 'class';
  icon: React.ReactNode;
  searchQuery: string;
  onClick: () => void;
}

const SearchResultItem: React.FC<SearchResultItemProps> = ({
  name,
  email,
  profilePicture,
  subtitle,
  icon,
  searchQuery,
  onClick,
}) => {
  const highlightedName = useHighlightMatch(name, searchQuery, '#ffe58f');
  const highlightedEmail = useHighlightMatch(email, searchQuery, '#ffe58f');
  const highlightedSubtitle = useHighlightMatch(subtitle, searchQuery, '#ffe58f');

  return (
    <div className="search-result-item" onClick={onClick}>
      <Space size="middle" align="start" style={{ width: '100%' }}>
        <Avatar
          size={40}
          src={profilePicture}
          icon={icon}
          style={{ flexShrink: 0 }}
        />
        <div style={{ flex: 1, minWidth: 0 }}>
          <Text strong ellipsis style={{ display: 'block' }}>
            {highlightedName}
          </Text>
          {email && (
            <Text type="secondary" ellipsis style={{ fontSize: '12px', display: 'block' }}>
              {highlightedEmail}
            </Text>
          )}
          {subtitle && (
            <Text type="secondary" ellipsis style={{ fontSize: '12px', display: 'block' }}>
              {highlightedSubtitle}
            </Text>
          )}
        </div>
      </Space>
    </div>
  );
};

const SearchUI: React.FC = () => {
  const [searchValue, setSearchValue] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [showAdvancedModal, setShowAdvancedModal] = useState(false);
  const debouncedSearch = useDebounce(searchValue, 400);
  const navigate = useNavigate();
  const user = useAuthUser();

  const { data, isLoading, isFetching } = useGlobalSearch({
    query: debouncedSearch,
    limit: 5,
    enabled: debouncedSearch.length >= 2,
  });

  const results = data?.data;
  const hasResults = results && (
    results.teachers.length > 0 ||
    results.students.length > 0 ||
    results.classes.length > 0
  );

  const canViewTeachers = [Role.ADMIN, Role.MODERATOR].includes(user?.role as any);
  const canViewStudents = [Role.ADMIN, Role.MODERATOR, Role.TEACHER].includes(user?.role as any);

  const totalResults = results 
    ? results.teachers.length + results.students.length + results.classes.length 
    : 0;

  const dropdownItems = useMemo(() => {
    if (!results || !hasResults) return [];

    const items: any[] = [];

    // Teachers Section
    if (canViewTeachers && results.teachers.length > 0) {
      items.push({
        type: 'group',
        label: (
          <div className="search-group-header">
            <TeamOutlined style={{ marginRight: 8 }} />
            <Text strong>Teachers</Text>
            <Badge count={results.teachers.length} style={{ marginLeft: 'auto' }} />
          </div>
        ),
      });

      results.teachers.forEach((teacher) => {
        items.push({
          key: `teacher-${teacher.id}`,
          label: (
            <SearchResultItem
              id={teacher.id}
              name={teacher.name}
              email={teacher.email}
              profilePicture={teacher.profilePicture}
              subtitle={teacher.qualification}
              type="teacher"
              icon={<TeamOutlined />}
              searchQuery={debouncedSearch}
              onClick={() => {
                navigate(`/teachers`);
                setIsOpen(false);
                setSearchValue('');
              }}
            />
          ),
        });
      });

      items.push({ type: 'divider' });
    }

    // Students Section
    if (canViewStudents && results.students.length > 0) {
      items.push({
        type: 'group',
        label: (
          <div className="search-group-header">
            <UserOutlined style={{ marginRight: 8 }} />
            <Text strong>Students</Text>
            <Badge count={results.students.length} style={{ marginLeft: 'auto' }} />
          </div>
        ),
      });

      results.students.forEach((student) => {
        items.push({
          key: `student-${student.id}`,
          label: (
            <SearchResultItem
              id={student.id}
              name={student.name}
              email={student.email}
              profilePicture={student.profilePicture}
              subtitle={`Grade ${student.grade}`}
              type="student"
              icon={<UserOutlined />}
              searchQuery={debouncedSearch}
              onClick={() => {
                navigate(`/students`);
                setIsOpen(false);
                setSearchValue('');
              }}
            />
          ),
        });
      });

      items.push({ type: 'divider' });
    }

    // Classes Section
    if (results.classes.length > 0) {
      items.push({
        type: 'group',
        label: (
          <div className="search-group-header">
            <BookOutlined style={{ marginRight: 8 }} />
            <Text strong>Classes</Text>
            <Badge count={results.classes.length} style={{ marginLeft: 'auto' }} />
          </div>
        ),
      });

      results.classes.forEach((classItem) => {
        const classSubtitle = `${classItem.teacher.name} → ${classItem.student.name}`;
        items.push({
          key: `class-${classItem.id}`,
          label: (
            <SearchResultItem
              id={classItem.id}
              name={classItem.subject}
              subtitle={classSubtitle}
              type="class"
              icon={<BookOutlined />}
              searchQuery={debouncedSearch}
              onClick={() => {
                navigate(`/classes/list`);
                setIsOpen(false);
                setSearchValue('');
              }}
            />
          ),
        });
      });
    }

    // Add "View All Results" button if there are more results
    if (totalResults >= 5) {
      items.push({ type: 'divider' });
      items.push({
        key: 'view-all',
        label: (
          <Button
            type="link"
            block
            icon={<FilterOutlined />}
            onClick={() => {
              setShowAdvancedModal(true);
              setIsOpen(false);
            }}
            style={{ textAlign: 'center' }}
          >
            View All Results ({totalResults}+ found)
          </Button>
        ),
      });
    }

    return items;
  }, [results, debouncedSearch, canViewTeachers, canViewStudents, navigate, totalResults]);

  const dropdownRender = () => {
    if (searchValue.length < 2) {
      return (
        <div className="search-dropdown-empty">
          <Text type="secondary">Type at least 2 characters to search...</Text>
        </div>
      );
    }

    if (isLoading || isFetching) {
      return (
        <div className="search-dropdown-loading">
          <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
          <Text type="secondary" style={{ marginTop: 12 }}>
            Searching...
          </Text>
        </div>
      );
    }

    if (!hasResults) {
      return (
        <div className="search-dropdown-empty">
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="No results found"
          />
        </div>
      );
    }

    return null;
  };

  return (
    <>
      <Dropdown
        menu={{ items: dropdownItems }}
        open={isOpen && (searchValue.length >= 2)}
        onOpenChange={setIsOpen}
        placement="bottomLeft"
        overlayClassName="global-search-dropdown"
        dropdownRender={(menu) => (
          <div className="global-search-dropdown-content">
            {dropdownRender() || menu}
          </div>
        )}
        trigger={['click']}
      >
        <Input
          placeholder="Search teachers, students, classes..."
          prefix={<SearchOutlined />}
          suffix={
            <>
              {(isLoading || isFetching) && searchValue.length >= 2 && (
                <Spin size="small" style={{ marginRight: 8 }} />
              )}
              <Tooltip title="Advanced Search">
                <FilterOutlined
                  onClick={() => setShowAdvancedModal(true)}
                  style={{ cursor: 'pointer', color: '#1890ff' }}
                />
              </Tooltip>
            </>
          }
          value={searchValue}
          onChange={(e) => {
            setSearchValue(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onPressEnter={() => {
            if (searchValue.length >= 2) {
              setShowAdvancedModal(true);
              setIsOpen(false);
            }
          }}
          style={{ width: 320 }}
          allowClear
        />
      </Dropdown>

      <SearchModal
        open={showAdvancedModal}
        onClose={() => setShowAdvancedModal(false)}
      />
    </>
  );
};

export default SearchUI;