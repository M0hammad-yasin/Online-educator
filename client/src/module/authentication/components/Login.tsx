import React from 'react';
import { Form, Input, Button, Typography, Checkbox, Card, Flex, message, Select } from 'antd';
import { UserOutlined, LockOutlined, LoginOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { LoginIllustration } from '../../../assets/auth-illustrations';
import { useLogin } from '../hooks/useAuth';
import styles from './Login.module.css';
import { authService } from '../services/auth.service';
import { UserRole } from '../store/authStore';

const { Title, Text } = Typography;
const { Option } = Select;
interface LoginFormValues {
  email: string;
  password: string;
  remember: boolean;
  role: UserRole;
}

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { mutate: login, isPending} = useLogin();
  const [role, setRole] = React.useState<UserRole>('STUDENT');

  // Update endpoint when role changes
  React.useEffect(() => {
    authService.setRole(role);
  }, [role]);

  const onFinish = (values: LoginFormValues) => {
    login(
      { email: values.email, password: values.password },
      {
        onSuccess: () => {
          message.success('Login successful!');
          navigate('/dashboard');
        },
        onError: (error: any) => {
          message.error(error?.message || 'Login failed. Please try again.');
        },
      }
    );
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
          <Card className={styles.loginCard} variant="borderless">
            <Title level={3} className={styles.loginTitle}>Sign In</Title>
            <Text className={styles.loginSubtitle}>Enter your credentials to access your account</Text>
            
            <Form
              name="login_form"
              className={styles.loginForm}
              initialValues={{ remember: true, role: 'STUDENT' }}
              onFinish={onFinish}
              layout="vertical"
              size="large"
            >
              {/* Role selection */}
              <Form.Item
                name="role"
                label="Role"
                rules={[{ required: true, message: 'Please select your role!' }]}
                initialValue={role}
              >
                <Select value={role} onChange={setRole}>
                  <Option value="ADMIN">Admin</Option>
                  <Option value="TEACHER">Teacher</Option>
                  <Option value="STUDENT">Student</Option>
                </Select>
              </Form.Item>

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
                  disabled={isPending}
                  className={styles.loginButton}
                  loading={isPending}
                  icon={<LoginOutlined />}
                  block
                >
                  Sign In
                </Button>
              </Form.Item>

              <div className={styles.registerPrompt}>
                <Text>Don't have an account? </Text>
                <Link to={`/register?role=${role}`} className={styles.registerLink}>Sign Up</Link>
              </div>
            </Form>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Login; 