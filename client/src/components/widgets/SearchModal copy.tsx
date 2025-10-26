// client/src/components/widgets/SearchModal.tsx
import React, { useState, useEffect } from 'react';
import {
  Modal,
  Drawer,
  Tabs,
  Input,
  List,
  Avatar,
  Tag,
  Space,
  Typography,
  Empty,
  Spin,
} from 'antd';
import {
  UserOutlined,
  TeamOutlined,
  BookOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { useSearchTeachers, useDebounce, useSearchStudents, useSearchClasses, useRole, useResponsive } from '../../hooks';
import { useNavigate } from 'react-router-dom';
import { Role } from '../../constants/role';
import useHighlightMatch from '../../hooks/useHighlightMatch';
import { ClassSearchResult } from '../../module/classes';
import { useUIStore } from '../../store/uiStore';

const { Text, Title } = Typography;

const SearchModal: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const debouncedSearch = useDebounce(searchQuery, 400);
  const navigate = useNavigate();
  const currentRole = useRole();
  const { isMobile } = useResponsive();

  // Use UI store for modal state
  const { searchModalOpen, setSearchModalOpen } = useUIStore();

  const canViewTeachers = [Role.ADMIN, Role.MODERATOR].includes(currentRole as any);
  const canViewStudents = [Role.ADMIN, Role.MODERATOR, Role.TEACHER].includes(currentRole as any);

  const { data: teachersData, isLoading: teachersLoading } = useSearchTeachers({
    query: debouncedSearch,
    limit: 20,
    enabled: searchModalOpen && canViewTeachers,
  });

  const { data: studentsData, isLoading: studentsLoading } = useSearchStudents({
    query: debouncedSearch,
    limit: 20,
    enabled: searchModalOpen && canViewStudents,
  });

  const { data: classesData, isLoading: classesLoading } = useSearchClasses({
    query: debouncedSearch,
    limit: 20,
    enabled: searchModalOpen,
  });

  const teachers = teachersData?.data || [];
  const students = studentsData?.data || [];
  const classes = classesData?.data || [];

  const handleNavigate = (path: string) => {
    navigate(path);
    setSearchModalOpen(false);
    setSearchQuery('');
  };

  // Reset search when modal closes
  useEffect(() => {
    if (!searchModalOpen) {
      setSearchQuery('');
      setActiveTab('all');
    }
  }, [searchModalOpen]);

  const renderTeacherItem = (teacher: any) => {
    const highlightedName = useHighlightMatch(teacher.name, debouncedSearch);
    const highlightedEmail = useHighlightMatch(teacher.email, debouncedSearch);

    return (
      <List.Item
        key={teacher.id}
        onClick={() => handleNavigate(`/teachers`)}
        style={{ cursor: 'pointer', padding: isMobile ? '8px 12px' : '12px 16px' }}
        className="advanced-search-item"
      >
        <List.Item.Meta
          avatar={
            <Avatar
              size={isMobile ? 40 : 48}
              src={teacher.profilePicture}
              icon={<TeamOutlined />}
            />
          }
          title={<div style={{ fontSize: isMobile ? 13 : 14 }}>{highlightedName}</div>}
          description={
            <Space direction="vertical" size={0}>
              <Text type="secondary" style={{ fontSize: isMobile ? 11 : 12 }}>{highlightedEmail}</Text>
              {teacher.qualification && !isMobile && (
                <Text type="secondary" style={{ fontSize: 11 }}>
                  {teacher.qualification}
                </Text>
              )}
            </Space>
          }
        />
        {teacher.classRate && (
          <Tag color="blue" style={{ fontSize: isMobile ? 11 : 12 }}>${teacher.classRate}/hr</Tag>
        )}
      </List.Item>
    );
  };

  const renderStudentItem = (student: any) => {
    const highlightedName = useHighlightMatch(student.name, debouncedSearch);
    const highlightedEmail = useHighlightMatch(student.email, debouncedSearch);

    return (
      <List.Item
        key={student.id}
        onClick={() => handleNavigate(`/students`)}
        style={{ cursor: 'pointer', padding: isMobile ? '8px 12px' : '12px 16px' }}
        className="advanced-search-item"
      >
        <List.Item.Meta
          avatar={
            <Avatar
              size={isMobile ? 40 : 48}
              src={student.profilePicture}
              icon={<UserOutlined />}
            />
          }
          title={<div style={{ fontSize: isMobile ? 13 : 14 }}>{highlightedName}</div>}
          description={
            <Space direction="vertical" size={0}>
              <Text type="secondary" style={{ fontSize: isMobile ? 11 : 12 }}>{highlightedEmail}</Text>
              {student.parentEmail && !isMobile && (
                <Text type="secondary" style={{ fontSize: 11 }}>
                  Parent: {student.parentEmail}
                </Text>
              )}
            </Space>
          }
        />
        <Tag color="green" style={{ fontSize: isMobile ? 11 : 12 }}>Grade {student.grade}</Tag>
      </List.Item>
    );
  };

  const renderClassItem = (classItem: ClassSearchResult) => {
    const highlightedSubject = useHighlightMatch(classItem.subject, debouncedSearch);
    const teacher = useHighlightMatch(classItem.teacher?.name, debouncedSearch);
    const student = useHighlightMatch(classItem.student?.name, debouncedSearch);

    return (
      <List.Item
        key={classItem.id}
        onClick={() => handleNavigate(`/classes/list`)}
        style={{ cursor: 'pointer', padding: isMobile ? '8px 12px' : '12px 16px' }}
        className="advanced-search-item"
      >
        <List.Item.Meta
          avatar={<Avatar size={isMobile ? 40 : 48} icon={<BookOutlined />} />}
          title={<div style={{ fontSize: isMobile ? 13 : 14 }}>{highlightedSubject}</div>}
          description={
            <Space direction="vertical" size={0}>
              <Text type="secondary" style={{ fontSize: isMobile ? 11 : 12 }}>
                Teacher: {teacher}
              </Text>
              <Text type="secondary" style={{ fontSize: isMobile ? 11 : 12 }}>
                Student: {student}
              </Text>
              {!isMobile && (
                <Text type="secondary" style={{ fontSize: 11 }}>
                  {new Date(classItem.scheduledAt).toLocaleDateString()}
                </Text>
              )}
            </Space>
          }
        />
        <Tag
          color={
            classItem.status === 'COMPLETED' ? 'success' :
            classItem.status === 'SCHEDULED' ? 'blue' :
            classItem.status === 'IN_PROGRESS' ? 'orange' : 'default'
          }
          style={{ fontSize: isMobile ? 11 : 12 }}
        >
          {classItem.status}
        </Tag>
      </List.Item>
    );
  };

  const isLoading = teachersLoading || studentsLoading || classesLoading;
  const hasResults = teachers.length > 0 || students.length > 0 || classes.length > 0;

  const searchContent = (
    <>
      <div style={{ padding: isMobile ? '12px 16px' : '16px 24px', borderBottom: '1px solid #f0f0f0' }}>
        <Input
          size={isMobile ? "middle" : "large"}
          placeholder="Search across all entities..."
          prefix={<SearchOutlined />}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          autoFocus
          allowClear
        />
      </div>

      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        style={{ padding: isMobile ? '0 12px' : '0 24px' }}
        size={isMobile ? "small" : "middle"}
        items={[
          {
            key: 'all',
            label: `All (${teachers.length + students.length + classes.length})`,
          },
          ...(canViewTeachers ? [{
            key: 'teachers',
            label: `Teachers (${teachers.length})`,
          }] : []),
          ...(canViewStudents ? [{
            key: 'students',
            label: `Students (${students.length})`,
          }] : []),
          {
            key: 'classes',
            label: `Classes (${classes.length})`,
          },
        ]}
      />

      <div style={{ 
        height: isMobile ? 'calc(100vh - 200px)' : 400, 
        overflowY: 'auto', 
        padding: isMobile ? '0 12px 12px' : '0 24px 24px' 
      }}>
        {isLoading ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <Spin size="large" />
          </div>
        ) : !hasResults && searchQuery.length >= 2 ? (
          <Empty description="No results found" />
        ) : searchQuery.length < 2 ? (
          <Empty description="Type at least 2 characters to search" />
        ) : (
          <>
            {(activeTab === 'all' || activeTab === 'teachers') && canViewTeachers && teachers.length > 0 && (
              <>
                {activeTab === 'all' && <Title level={5} style={{ fontSize: isMobile ? 14 : 16 }}>Teachers</Title>}
                <List
                  dataSource={teachers}
                  renderItem={renderTeacherItem}
                  style={{ marginBottom: 24 }}
                />
              </>
            )}
            {(activeTab === 'all' || activeTab === 'students') && canViewStudents && students.length > 0 && (
              <>
                {activeTab === 'all' && <Title level={5} style={{ fontSize: isMobile ? 14 : 16 }}>Students</Title>}
                <List
                  dataSource={students}
                  renderItem={renderStudentItem}
                  style={{ marginBottom: 24 }}
                />
              </>
            )}
            {(activeTab === 'all' || activeTab === 'classes') && classes.length > 0 && (
              <>
                {activeTab === 'all' && <Title level={5} style={{ fontSize: isMobile ? 14 : 16 }}>Classes</Title>}
                <List
                  dataSource={classes}
                  renderItem={renderClassItem}
                />
              </>
            )}
          </>
        )}
      </div>
    </>
  );

  // Mobile: Render as Drawer
  if (isMobile) {
    return (
      <Drawer
        title={
          <Space>
            <SearchOutlined />
            <span>Search</span>
          </Space>
        }
        placement="bottom"
        open={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
        height="90vh"
        styles={{ body: { padding: 0 } }}
      >
        {searchContent}
      </Drawer>
    );
  }

  // Desktop: Render as Modal
  return (
    <Modal
      title={
        <Space>
          <SearchOutlined />
          <span>Advanced Search</span>
        </Space>
      }
      open={searchModalOpen}
      onCancel={() => setSearchModalOpen(false)}
      footer={null}
      width={800}
      styles={{ body: { padding: 0 } }}
    >
      {searchContent}
    </Modal>
  );
};

export default SearchModal;