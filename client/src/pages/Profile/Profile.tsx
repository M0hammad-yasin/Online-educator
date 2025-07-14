import React, { useEffect } from "react";
import { Card, Avatar, Typography, Descriptions, Tag, Row, Col, Space, Spin, Alert } from "antd";
import { UserOutlined, MailOutlined } from "@ant-design/icons";
import { useProfile } from "../../module/authentication/hooks/useAuth";
import { authService } from "../../services/api";
import useAuthStore from "../../module/authentication/store/authStore";

const { Title, Text } = Typography;

const roleColors: Record<string, string> = {
  ADMIN: "#1677ff",
  TEACHER: "#52c41a",
  STUDENT: "#faad14",
  MODERATOR: "#722ed1",
};

const Profile: React.FC = () => {
    const { user: authUser } = useAuthStore();
  const { data: user, isLoading, isError, error } = useProfile();

  if (isLoading) {
    return <Spin tip="Loading profile..." style={{ display: "block", margin: "80px auto" }} />;
  }
  if (isError) {
    let errorMessage = "Failed to load profile.";
    let errorType = undefined;
    if (error && typeof error === 'object') {
      // Handle custom ApiError
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
  useEffect(()=>{
    authService.setRole(authUser?.role ?? null);
  },[])

  // Role-specific fields (extend as needed)
  const extraFields: { label: string; value: React.ReactNode }[] = [];
  const userAny = user as any;
  if (user.role === "TEACHER") {
    if (userAny.qualification) extraFields.push({ label: "Qualification", value: userAny.qualification });
    if (userAny.classRate) extraFields.push({ label: "Class Rate", value: userAny.classRate });
    if (userAny.address) extraFields.push({ label: "Address", value: userAny.address });
  }
  if (user.role === "STUDENT") {
    if (userAny.grade !== undefined) extraFields.push({ label: "Grade", value: userAny.grade });
    if (userAny.parentEmail) extraFields.push({ label: "Parent Email", value: userAny.parentEmail });
    if (userAny.address) extraFields.push({ label: "Address", value: userAny.address });
    if (userAny.region) extraFields.push({ label: "Region", value: userAny.region });
  }
  if (user.role === "MODERATOR") {
    if (userAny.address) extraFields.push({ label: "Address", value: userAny.address });
  }

  return (
    <Row justify="center" style={{ marginTop: 40 }}>
      <Col xs={24} sm={20} md={16} lg={12} xl={8}>
        <Card
          bordered={false}
          style={{ borderRadius: 16, boxShadow: "0 4px 24px rgba(0,0,0,0.08)", padding: 24 }}
        >
          <Space direction="vertical" align="center" style={{ width: "100%" }}>
            <Avatar
              size={96}
              src={user.profilePicture}
              icon={<UserOutlined />}
              style={{ background: "#f0f2f5", border: "2px solid #e6e6e6" }}
            />
            <Title level={3} style={{ marginBottom: 0 }}>{user.name}</Title>
            <Tag color={roleColors[user.role] || "blue"} style={{ fontSize: 16 }}>{user.role}</Tag>
            <Text type="secondary"><MailOutlined /> {user.email}</Text>
          </Space>
          <Descriptions
            column={1}
            style={{ marginTop: 32 }}
            bordered
            size="middle"
            labelStyle={{ fontWeight: 500, width: 120 }}
          >
            <Descriptions.Item label="User ID">{user.id}</Descriptions.Item>
            {extraFields.map((field) => (
              <Descriptions.Item key={field.label} label={field.label}>{field.value}</Descriptions.Item>
            ))}
          </Descriptions>
        </Card>
      </Col>
    </Row>
  );
};

export default Profile; 