import React from "react";
import { Button, Result, theme, Space } from "antd";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../module/authentication";

const AuthenticatedNotFound: React.FC = () => {
  const navigate = useNavigate();
  const { token: antToken } = theme.useToken();
  const token= useAuthStore(state=>state.token);
    if(!token) navigate('/login');
  const handleBack = () => navigate(-1);
  const handleDashboard = () => navigate("/dashboard");
  return (
    <div
      style={{
        minHeight: "calc(100vh - 64px)", // header height offset
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: antToken.colorBgLayout,
        borderRadius: antToken.borderRadiusLG,
      }}
    >
      <Result
        status="404"
        title="Page Not Found"
        subTitle="Sorry, the page you’re looking for doesn’t exist or has been moved."
        extra={
          <Space size="middle">
            <Button type="default" onClick={handleBack}>
              Go Back
            </Button>
            <Button type="primary" onClick={handleDashboard}>
              Go to Dashboard
            </Button>
          </Space>
        }
      />
    </div>
  );
};

export default AuthenticatedNotFound;
