import React from "react";
import { Button, Result, theme, Space, Layout } from "antd";
import { useNavigate } from "react-router-dom";
import { useAuthStore, useAuthUser } from "../module/authentication";

const { Content } = Layout;

const PublicNotFound: React.FC = () => {
  const navigate = useNavigate();
  const { token : antToken } = theme.useToken();
  const token=useAuthStore((state)=>state.token);
  const user=useAuthUser();
  const handleSignIn = () =>{ 
    if(!user||!token) {
        navigate('/dashboard');
        return;
    }
    navigate("/login")
   };
  const handleSignUp = () =>{
    if(user&&token) {
        navigate('/dashboard');
        return;
    };
     navigate("/register")
  };

  return (
    <Layout
      style={{
        minHeight: "100vh",
        background: antToken.colorBgLayout,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 16px",
      }}
    >
      <Content>
        <Result
          status="404"
          title="Page Not Found"
          subTitle="Sorry, we couldn’t find that page. Try signing in or creating a new account."
          extra={
            <Space size="middle">
              <Button type="default" onClick={handleSignIn}>
                Sign In
              </Button>
              <Button type="primary" onClick={handleSignUp}>
                Sign Up
              </Button>
            </Space>
          }
        />
      </Content>
    </Layout>
  );
};

export default PublicNotFound;
