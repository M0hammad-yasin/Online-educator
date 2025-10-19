// client/src/components/GlobalSearch/AdvancedSearchModal.tsx
import React, { useState } from 'react';
import {
  Modal,
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
import { useSearchTeachers, useDebounce,useSearchStudents, useSearchClasses, useRole } from '../../hooks';
import { useNavigate } from 'react-router-dom';
import { useAuthUser } from '../../module/authentication';
import { Role } from '../../constants/role';
import useHighlightMatch from '../../hooks/useHighlightMatch';
import { Class, ClassSearchResult } from '../../module/classes';

const { Text, Title } = Typography;

interface AdvancedSearchModalProps {
  open: boolean;
  onClose: () => void;
}

const AdvancedSearchModal: React.FC<AdvancedSearchModalProps> = ({
  open,
  onClose,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const debouncedSearch = useDebounce(searchQuery, 400);
  const navigate = useNavigate();
  const currentRole = useRole();

  const canViewTeachers = [Role.ADMIN, Role.MODERATOR].includes(currentRole as any);
  const canViewStudents = [Role.ADMIN, Role.MODERATOR, Role.TEACHER].includes(currentRole as any);

  const { data: teachersData, isLoading: teachersLoading } = useSearchTeachers({
    query: debouncedSearch,
    limit: 20,
    enabled: open && canViewTeachers,
  });

  const { data: studentsData, isLoading: studentsLoading } = useSearchStudents({
    query: debouncedSearch,
    limit: 20,
    enabled: open && canViewStudents,
  });

  const { data: classesData, isLoading: classesLoading } = useSearchClasses({
    query: debouncedSearch,
    limit: 20,
    enabled: open,
  });

  const teachers = teachersData?.data || [];
  const students = studentsData?.data || [];
  const classes = classesData?.data || [];

  const handleNavigate = (path: string) => {
    navigate(path);
    onClose();
    setSearchQuery('');
  };

  const renderTeacherItem = (teacher: any) => {
    const highlightedName = useHighlightMatch(teacher.name, debouncedSearch);
    const highlightedEmail = useHighlightMatch(teacher.email, debouncedSearch);

    return (
      <List.Item
        key={teacher.id}
        onClick={() => handleNavigate(`/teachers/${teacher.id}`)}
        style={{ cursor: 'pointer', padding: '12px 16px' }}
        className="advanced-search-item"
      >
        <List.Item.Meta
          avatar={
            <Avatar
              size={48}
              src={teacher.profilePicture}
              icon={<TeamOutlined />}
            />
          }
          title={highlightedName}
          description={
            <Space direction="vertical" size={0}>
              <Text type="secondary">{highlightedEmail}</Text>
              {teacher.qualification && (
                <Text type="secondary" style={{ fontSize: 12 }}>
                  {teacher.qualification}
                </Text>
              )}
            </Space>
          }
        />
        {teacher.classRate && (
          <Tag color="blue">${teacher.classRate}/hr</Tag>
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
        onClick={() => handleNavigate(`/students/${student.id}`)}
        style={{ cursor: 'pointer', padding: '12px 16px' }}
        className="advanced-search-item"
      >
        <List.Item.Meta
          avatar={
            <Avatar
              size={48}
              src={student.profilePicture}
              icon={<UserOutlined />}
            />
          }
          title={highlightedName}
          description={
            <Space direction="vertical" size={0}>
              <Text type="secondary">{highlightedEmail}</Text>
              {student.parentEmail && (
                <Text type="secondary" style={{ fontSize: 12 }}>
                  Parent: {student.parentEmail}
                </Text>
              )}
            </Space>
          }
        />
        <Tag color="green">Grade {student.grade}</Tag>
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
        onClick={() => handleNavigate(`/classes/${classItem.id}`)}
        style={{ cursor: 'pointer', padding: '12px 16px' }}
        className="advanced-search-item"
      >
        <List.Item.Meta
          avatar={<Avatar size={48} icon={<BookOutlined />} />}
          title={highlightedSubject}
          description={
            <Space direction="vertical" size={0}>
              <Text type="secondary">
                Teacher: {teacher}
              </Text>
              <Text type="secondary">
                Student: {student}
              </Text>
              <Text type="secondary" style={{ fontSize: 12 }}>
                {new Date(classItem.scheduledAt).toLocaleDateString()}
              </Text>
            </Space>
          }
        />
        <Tag color={
          classItem.status === 'COMPLETED' ? 'success' :
          classItem.status === 'SCHEDULED' ? 'blue' :
          classItem.status === 'IN_PROGRESS' ? 'orange' : 'default'
        }>
          {classItem.status}
        </Tag>
      </List.Item>
    );
  };

  const isLoading = teachersLoading || studentsLoading || classesLoading;
  const hasResults = teachers.length > 0 || students.length > 0 || classes.length > 0;

  return (
    <Modal
      title={
        <Space>
          <SearchOutlined />
          <span>Advanced Search</span>
        </Space>
      }
      open={open}
      onCancel={onClose}
      footer={null}
      width={800}
      styles={{body:{ padding: 0} }}
    >
      <div style={{ padding: '16px 24px', borderBottom: '1px solid #f0f0f0' }}>
        <Input
          size="large"
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
        style={{ padding: '0 24px' }}
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

      <div style={{ height: 400, overflowY: 'auto', padding: '0 24px 24px' }}>
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
                {activeTab === 'all' && <Title level={5}>Teachers</Title>}
                <List
                  dataSource={teachers}
                  renderItem={renderTeacherItem}
                  style={{ marginBottom: 24 }}
                />
              </>
            )}
            {(activeTab === 'all' || activeTab === 'students') && canViewStudents && students.length > 0 && (
              <>
                {activeTab === 'all' && <Title level={5}>Students</Title>}
                <List
                  dataSource={students}
                  renderItem={renderStudentItem}
                  style={{ marginBottom: 24 }}
                />
              </>
            )}
            {(activeTab === 'all' || activeTab === 'classes') && classes.length > 0 && (
              <>
                {activeTab === 'all' && <Title level={5}>Classes</Title>}
                <List
                  dataSource={classes}
                  renderItem={renderClassItem}
                />
              </>
            )}
          </>
        )}
      </div>
    </Modal>
  );
};

export default AdvancedSearchModal;