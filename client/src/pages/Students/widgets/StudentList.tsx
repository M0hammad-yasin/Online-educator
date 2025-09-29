import React from 'react';
import { Avatar, Button, Flex, List, Pagination, Space, Tag, Tooltip, theme as antdTheme } from 'antd';
import { useStudents } from '../../../module/student/hooks/useStudents';
import { useStudentFilters } from '../../../module/student/store/useStudentStore';
import { Role } from '../../../constants/role';
import useAuthStore from '../../../module/authentication/store/authStore';

const StudentList: React.FC = () => {
  const { token } = antdTheme.useToken();
  const { filters, setFilters } = useStudentFilters();
  const user = useAuthStore((s) => s.user);
  const role = user?.role;

  const { data, isLoading } = useStudents(filters);
  const items = data?.data || [];
  const total = items.length

  const isAdminOrMod = role === Role.ADMIN || role === Role.MODERATOR;

  return (
    <>
      <List
        loading={isLoading}
        dataSource={items}
        renderItem={(item: any) => (
          <List.Item
            actions={
              isAdminOrMod
                ? [
                    <Tooltip key="edit" title="Edit student">
                      <Button size="small">Edit</Button>
                    </Tooltip>,
                    <Tooltip key="suspend" title="Suspend">
                      <Button size="small" danger>
                        Suspend
                      </Button>
                    </Tooltip>,
                    <Tooltip key="assign" title="Assign teacher">
                      <Button size="small" type="primary">
                        Assign
                      </Button>
                    </Tooltip>,
                  ]
                : [
                    <Tooltip key="view" title="View profile">
                      <Button size="small" type="link">
                        View profile
                      </Button>
                    </Tooltip>,
                    <Tooltip key="message" title="Message">
                      <Button size="small" type="link">
                        Message
                      </Button>
                    </Tooltip>,
                  ]
            }
          >
            <List.Item.Meta
              avatar={<Avatar shape="square" size={48} src={item.profilePicture} />}
              title={
                <Space size={token.sizeSM}>
                  <span style={{ fontWeight: 600 }}>{item.name}</span>
                  <Tag color={token.colorInfo}>Grade {item.grade}</Tag>
                </Space>
              }
              description={
                <Flex vertical gap={4}>
                  <span style={{ color: token.colorTextSecondary }}>{item.email}</span>
                  <span style={{ color: token.colorTextTertiary }}>Last class: {item.updatedAt ? new Date(item.updatedAt).toLocaleDateString() : 'N/A'}</span>
                </Flex>
              }
            />
          </List.Item>
        )}
      />
      <Flex justify="end" style={{ marginTop: token.margin }}>
        <Pagination
          current={filters.page || 1}
          pageSize={filters.limit || 10}
          total={total}
          showSizeChanger
          onChange={(page, pageSize) => setFilters({ page, limit: pageSize })}
        />
      </Flex>
    </>
  );
};

export default StudentList;


