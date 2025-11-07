import React, { useEffect, useState } from "react";
import { 
  Card, 
  Avatar, 
  Typography, 
  Tag, 
  Row, 
  Col, 
  Space, 
  Spin, 
  Alert, 
  Button, 
  Input, 
  Select,
  InputNumber,
  message
} from "antd";
import { UserOutlined, MailOutlined, EditOutlined, SaveOutlined, CloseOutlined } from "@ant-design/icons";
import { useProfile, usePatchProfile } from "../../module/authentication/hooks/useAuth";
import { authService } from "../../services/api";
import useAuthStore from "../../module/authentication/store/authStore";
import type { Admin } from "../../module/admin/types";
import type { Teacher } from "../../module/teacher/types";
import type { Student } from "../../module/student/types/student.types";
import type { Moderator } from "../../module/moderator/types";

const { Title, Text } = Typography;
const { Option } = Select;

const roleColors: Record<string, string> = {
  ADMIN: "#1677ff",
  TEACHER: "#52c41a",
  STUDENT: "#faad14",
  MODERATOR: "#722ed1",
};

type UserType = Admin | Teacher | Student | Moderator;

interface EditableFieldProps {
  label: string;
  value: any;
  fieldKey: string;
  type?: 'text' | 'email' | 'number' | 'select';
  options?: { value: string; label: string }[];
  onSave: (fieldKey: string, value: any) => void;
  isEditing: boolean;
  onEdit: (fieldKey: string) => void;
  onCancel: () => void;
  isPending?: boolean;
}

const EditableField: React.FC<EditableFieldProps> = ({
  label,
  value,
  fieldKey,
  type = 'text',
  options,
  onSave,
  isEditing,
  onEdit,
  onCancel,
  isPending = false,
}) => {
  const [editValue, setEditValue] = useState(value);

  useEffect(() => {
    setEditValue(value);
  }, [value]);

  const handleSave = () => {
    onSave(fieldKey, editValue);
  };

  const renderEditInput = () => {
    switch (type) {
      case 'email':
        return (
          <Input
            type="email"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onPressEnter={handleSave}
            autoFocus
          />
        );
      case 'number':
        return (
          <InputNumber
            value={editValue}
            onChange={(val) => setEditValue(val)}
            onPressEnter={handleSave}
            style={{ width: '100%' }}
            autoFocus
          />
        );
      case 'select':
        return (
          <Select
            value={editValue}
            onChange={(val) => setEditValue(val)}
            style={{ width: '100%' }}
            autoFocus
          >
            {options?.map((option) => (
              <Option key={option.value} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Select>
        );
      default:
        return (
          <Input
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onPressEnter={handleSave}
            autoFocus
          />
        );
    }
  };

  return (
    <div style={{ marginBottom: 16, padding: 16, border: '1px solid #f0f0f0', borderRadius: 8 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <Text strong style={{ color: '#666' }}>{label}</Text>
        {!isEditing && (
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => onEdit(fieldKey)}
            style={{ color: '#1677ff' }}
          />
        )}
      </div>
      
      {isEditing ? (
        <div>
          {renderEditInput()}
          <div style={{ marginTop: 8, display: 'flex', gap: 8 }}>
            <Button
              type="primary"
              size="small"
              icon={<SaveOutlined />}
              onClick={handleSave}
              disabled={isPending}
            >
              Save
            </Button>
            <Button
              size="small"
              icon={<CloseOutlined />}
              onClick={onCancel}
              disabled={isPending}
            >
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <div style={{ minHeight: 32, display: 'flex', alignItems: 'center' }}>
          <Text>{value || 'Not set'}</Text>
        </div>
      )}
    </div>
  );
};

const Profile: React.FC = () => {
  const { user: authUser } = useAuthStore();
  const { data: userRaw, isLoading, isError, error, refetch } = useProfile();
  const { mutate: patchProfile ,isPending} = usePatchProfile();
  const [editingField, setEditingField] = useState<string | null>(null);

  // Narrow user type based on authUser.role
  let user: UserType | undefined = undefined;
  if (userRaw && authUser?.role === "ADMIN") user = userRaw as Admin;
  if (userRaw && authUser?.role === "TEACHER") user = userRaw as Teacher;
  if (userRaw && authUser?.role === "STUDENT") user = userRaw as Student;
  if (userRaw && authUser?.role === "MODERATOR") user = userRaw as Moderator;

  useEffect(() => {
    authService.setRole(authUser?.role ?? null);
  }, []);

  const handleFieldSave = async (fieldKey: string, value: any) => {
    patchProfile(
      { [fieldKey]: value },
      {
        onSuccess: () => {
          message.success(`${fieldKey} updated successfully!`);
          setEditingField(null);
          refetch();
        },
        onError: () => {
          message.error(`Failed to update ${fieldKey}`);
        },
      }
    );
  };

  const handleEditField = (fieldKey: string) => {
    setEditingField(fieldKey);
  };

  const handleCancelEdit = () => {
    setEditingField(null);
  };

  if (isLoading) {
    return <Spin tip="Loading profile..." style={{ display: "block", margin: "80px auto" }} />;
  }

  if (isError) {
    let errorMessage = "Failed to load profile.";
    let errorType = undefined;
    if (error && typeof error === 'object') {
      if ('type' in error && 'message' in error) {
        errorMessage = (error as any).message;
        errorType = (error as any).type;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
    }
    return (
      <Alert
        type="error"
        message={errorType ? `${errorType}: ${errorMessage}` : errorMessage}
        style={{ maxWidth: 500, margin: "40px auto" }}
      />
    );
  }

  if (!user) {
    return <Card style={{ maxWidth: 500, margin: "40px auto" }}><Text type="danger">No user data found.</Text></Card>;
  }

  const getEditableFields = () => {
    const baseFields = [
      { key: 'name', label: 'Name', value: user.name, type: 'text' },
      { key: 'email', label: 'Email', value: user.email, type: 'email' },
    ];

    const roleSpecificFields: any[] = [];
    
    if (user.role === "TEACHER") {
      const teacher = user as Teacher;
      roleSpecificFields.push(
        { key: 'qualification', label: 'Qualification', value: teacher.qualification, type: 'text' },
        { key: 'classRate', label: 'Class Rate', value: teacher.classRate, type: 'number' },
        { key: 'address', label: 'Address', value: teacher.address, type: 'text' }
      );
    }
    
    if (user.role === "STUDENT") {
      const student = user as Student;
      roleSpecificFields.push(
        { key: 'grade', label: 'Grade', value: student.grade, type: 'number' },
        { key: 'parentEmail', label: 'Parent Email', value: student.parentEmail, type: 'email' },
        { key: 'address', label: 'Address', value: student.address, type: 'text' },
        { key: 'region', label: 'Region', value: student.region, type: 'text' }
      );
    }
    
    if (user.role === "MODERATOR") {
      const moderator = user as Moderator;
      roleSpecificFields.push(
        { key: 'address', label: 'Address', value: moderator.address, type: 'text' }
      );
    }

    return [...baseFields, ...roleSpecificFields];
  };

  return (
    <div style={{ padding: '24px', maxWidth: 1200, margin: '0 auto' }}>
      <Row gutter={[24, 24]}>
       
 {/* Left Side - Profile Card */}
      
        <Col xs={24} md={16}>
          <Card
            title="Profile Information"
            variant='borderless'
            style={{ 
              borderRadius: 16, 
              boxShadow: "0 4px 24px rgba(0,0,0,0.08)"
            }}
          >
            {getEditableFields().map((field) => (
              <EditableField
                key={field.key}
                label={field.label}
                value={field.value}
                fieldKey={field.key}
                type={field.type}
                options={field.options}
                onSave={handleFieldSave}
                isEditing={editingField === field.key}
                onEdit={handleEditField}
                onCancel={handleCancelEdit}
                isPending={isPending}
              />
            ))}
          </Card>
        </Col>
          {/* Right Side - Editable Fields */}
         <Col xs={24} md={8}>
          <Card
            bordered={false}
            style={{ 
              borderRadius: 16, 
              boxShadow: "0 4px 24px rgba(0,0,0,0.08)", 
              padding: 24,
              height: 'fit-content'
            }}
          >
            <Space direction="vertical" align="center" style={{ width: "100%" }}>
              <Avatar
                size={96}
                src={user.profilePicture}
                icon={<UserOutlined />}
                style={{ background: "#f0f2f5", border: "2px solid #e6e6e6" }}
              />
              <Title level={3} style={{ marginBottom: 0 }}>{user.name}</Title>
              <Tag color={roleColors[user.role] || "blue"} style={{ fontSize: 16 }}>
                {user.role}
              </Tag>
              <Text type="secondary">
                <MailOutlined /> {user.email}
              </Text>
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Profile;