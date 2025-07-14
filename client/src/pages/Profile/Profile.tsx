import React, { useEffect } from "react";
import { Card, Avatar, Typography, Descriptions, Tag, Row, Col, Space, Spin, Alert } from "antd";
import { UserOutlined, MailOutlined } from "@ant-design/icons";
import { useProfile } from "../../module/authentication/hooks/useAuth";
import { authService } from "../../services/api";
import useAuthStore from "../../module/authentication/store/authStore";
import type { Admin } from "../../module/admin/types";
import type { Teacher } from "../../module/teacher/types";
import type { Student } from "../../module/student/types";
import type { Moderator } from "../../module/moderator/types";

const { Title, Text } = Typography;

const roleColors: Record<string, string> = {
  ADMIN: "#1677ff",
  TEACHER: "#52c41a",
  STUDENT: "#faad14",
  MODERATOR: "#722ed1",
};

type UserType = Admin | Teacher | Student | Moderator;

const Profile: React.FC = () => {
  const { user: authUser } = useAuthStore();
  const { data: userRaw, isLoading, isError, error } = useProfile();

  // Narrow user type based on authUser.role
  let user: UserType | undefined = undefined;
  if (userRaw && authUser?.role === "ADMIN") user = userRaw as Admin;
  if (userRaw && authUser?.role === "TEACHER") user = userRaw as Teacher;
  if (userRaw && authUser?.role === "STUDENT") user = userRaw as Student;
  if (userRaw && authUser?.role === "MODERATOR") user = userRaw as Moderator;

  useEffect(() => {
    authService.setRole(authUser?.role ?? null);
  }, []);

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

  // Role-specific fields
  const extraFields: { label: string; value: React.ReactNode }[] = [];
  if (user.role === "TEACHER") {
    const teacher = user as Teacher;
    if (teacher.qualification) extraFields.push({ label: "Qualification", value: teacher.qualification });
    if (teacher.classRate) extraFields.push({ label: "Class Rate", value: teacher.classRate });
    if (teacher.address) extraFields.push({ label: "Address", value: teacher.address });
  }
  if (user.role === "STUDENT") {
    const student = user as Student;
    if (student.grade !== undefined) extraFields.push({ label: "Grade", value: student.grade });
    if (student.parentEmail) extraFields.push({ label: "Parent Email", value: student.parentEmail });
    if (student.address) extraFields.push({ label: "Address", value: student.address });
    if (student.region) extraFields.push({ label: "Region", value: student.region });
  }
  if (user.role === "MODERATOR") {
    const moderator = user as Moderator;
    if (moderator.address) extraFields.push({ label: "Address", value: moderator.address });
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