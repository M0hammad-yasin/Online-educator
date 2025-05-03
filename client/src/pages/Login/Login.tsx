import React from 'react';
import { Form, Input, Button, Typography, Checkbox, Card, Flex, message } from 'antd';
import { UserOutlined, LockOutlined, LoginOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { LoginIllustration } from '../../assets/auth-illustrations';
import useAuthStore from '../../store/authStore';
import styles from './Login.module.css';

const { Title, Text } = Typography;

interface LoginFormValues {
  email: string;
  password: string;
  remember: boolean;
}

const Login: React.FC = () => {
  const { login, loading } = useAuthStore();
  const navigate = useNavigate();

  const onFinish = async (values: LoginFormValues) => {
    try {
      await login(values.email, values.password);
      message.success('Login successful!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Login failed:', error);
      message.error('Login failed. Please check your credentials.');
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginWrapper}>
        <div className={styles.loginLeft}>
          <div className={styles.brandContent}>
            <div className={styles.logo}>
              <span className={styles.logoIcon}><LoginOutlined /></span>
              <span className={styles.logoText}>Online Educator</span>
            </div>
            <Title level={2} className={styles.welcomeTitle}>Welcome Back!</Title>
            <Text className={styles.welcomeText}>
              Access your educational platform to manage courses, students, and more.
            </Text>
            <div className={styles.illustration}>
              <LoginIllustration />
            </div>
          </div>
        </div>

        <div className={styles.loginRight}>
          <Card className={styles.loginCard} bordered={false}>
            <Title level={3} className={styles.loginTitle}>Sign In</Title>
            <Text className={styles.loginSubtitle}>Enter your credentials to access your account</Text>
            
            <Form
              name="login_form"
              className={styles.loginForm}
              initialValues={{ remember: true }}
              onFinish={onFinish}
              layout="vertical"
              size="large"
            >
              <Form.Item
                name="email"
                rules={[
                  { required: true, message: 'Please enter your email!' },
                  { type: 'email', message: 'Please enter a valid email address!' }
                ]}
              >
                <Input 
                  prefix={<UserOutlined className={styles.formIcon} />} 
                  placeholder="Email Address" 
                  className={styles.formInput}
                />
              </Form.Item>

              <Form.Item
                name="password"
                rules={[{ required: true, message: 'Please enter your password!' }]}
              >
                <Input.Password
                  prefix={<LockOutlined className={styles.formIcon} />}
                  placeholder="Password"
                  className={styles.formInput}
                />
              </Form.Item>

              <Flex justify="space-between" align="center" className={styles.formOptions}>
                <Form.Item name="remember" valuePropName="checked" noStyle>
                  <Checkbox>Remember me</Checkbox>
                </Form.Item>

                <Link to="/forgot-password" className={styles.forgotPassword}>
                  Forgot password?
                </Link>
              </Flex>

              <Form.Item>
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  disabled={loading}
                  className={styles.loginButton}
                  loading={loading}
                  icon={<LoginOutlined />}
                  block
                >
                  Sign In
                </Button>
              </Form.Item>

              <div className={styles.registerPrompt}>
                <Text>Don't have an account? </Text>
                <Link to="/register" className={styles.registerLink}>Sign Up</Link>
              </div>
            </Form>
          </Card>
        </div>
      </div>
    </div>
  );
};
export default Login;