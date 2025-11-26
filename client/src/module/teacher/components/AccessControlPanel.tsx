import React, { useState, useEffect } from 'react';
import {
  Card,
  Switch,
  Space,
  Typography,
  Divider,
  message,
  Spin,
  Alert,
  theme as antdTheme,
} from 'antd';
import {
  LockOutlined,
  UnlockOutlined,
  EyeOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import { accessControlService } from '../../admin';
import { TeacherAccessControl } from '../types';

const { Text } = Typography;

interface AccessControlPanelProps {
  teacherId: string;
}

interface AccessControl {
  canSeeClass?: boolean;
  canAddClass?: boolean;
  canUpdateClass?: boolean;
  canDeleteClass?: boolean;
}

const AccessControlPanel: React.FC<AccessControlPanelProps> = ({ teacherId }) => {
  const { token } = antdTheme.useToken();
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [accessControl, setAccessControl] = useState<TeacherAccessControl>();

  useEffect(() => {
    fetchAccessControl();
  }, [teacherId]);

  const fetchAccessControl = async () => {
    setLoading(true);
    try {
      const response = await accessControlService.getAccessControl(teacherId);
      if (response.success && response.data) {
        setAccessControl(response.data);
      }
    } catch (error: any) {
      message.error(error?.message || 'Failed to fetch access control');
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (permission: keyof AccessControl, value: boolean) => {
    setUpdating(true);
    try {
      const access=await accessControlService.updateAccessControl(teacherId, {
        [permission]: value,
      });
      
      setAccessControl(access.data);
      
      message.success(`Permission ${value ? 'granted' : 'revoked'} successfully`);
    } catch (error: any) {
      message.error(error?.message || 'Failed to update access control');
      // Revert the change
      setAccessControl((prev) => prev);
    } finally {
      setUpdating(false);
    }
  };

  const permissions = [
    {
      key: 'canSeeClass' as const,
      label: 'View Classes',
      description: 'Allow teacher to view class information',
      icon: <EyeOutlined />,
    },
    {
      key: 'canAddClass' as const,
      label: 'Create Classes',
      description: 'Allow teacher to create new classes',
      icon: <PlusOutlined />,
    },
    {
      key: 'canUpdateClass' as const,
      label: 'Update Classes',
      description: 'Allow teacher to modify existing classes',
      icon: <EditOutlined />,
    },
    {
      key: 'canDeleteClass' as const,
      label: 'Delete Classes',
      description: 'Allow teacher to delete classes (use with caution)',
      icon: <DeleteOutlined />,
    },
  ];

  return (
    <Card
      title={
        <Space>
          <LockOutlined />
          <span>Access Control</span>
        </Space>
      }
      size="small"
    >
      <Alert
        message="Admin Only Feature"
        description="Manage teacher permissions and access levels for class management."
        type="info"
        showIcon
        style={{ marginBottom: token.marginMD }}
      />

      {loading ? (
        <Spin />
      ) : (
        <Space direction="vertical" style={{ width: '100%' }} size="large">
          {permissions.map((permission, index) => (
            <React.Fragment key={permission.key}>
              <Space
                style={{
                  width: '100%',
                  justifyContent: 'space-between',
                }}
              >
                <Space direction="vertical" size={0}>
                  <Space>
                    {permission.icon}
                    <Text strong>{permission.label}</Text>
                  </Space>
                  <Text type="secondary" style={{ fontSize: token.fontSizeSM }}>
                    {permission.description}
                  </Text>
                </Space>
                <Switch
                  checked={accessControl?.[permission.key] ?? false}
                  onChange={(checked) => handleToggle(permission.key, checked)}
                  loading={updating}
                  checkedChildren={<UnlockOutlined />}
                  unCheckedChildren={<LockOutlined />}
                />
              </Space>
              {index < permissions.length - 1 && <Divider style={{ margin: 0 }} />}
            </React.Fragment>
          ))}
        </Space>
      )}
    </Card>
  );
};

export default AccessControlPanel;
