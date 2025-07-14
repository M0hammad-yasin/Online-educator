import React, { useRef } from 'react';
import { Form, Input, Button, Typography, Select, Card, Flex, message, InputNumber } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, LoginOutlined } from '@ant-design/icons';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useRegister } from '../hooks/useAuth';
import styles from './Login.module.css';
import { ApiError } from '../../../services/api/types';
import { UserRole } from '../store/authStore';
import { authService } from '../services/auth.service';

const { Title, Text } = Typography;

interface RegisterFormValues {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  grade: number;
  role: UserRole;
}

const Register: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [form] = Form.useForm();
  const { mutate: register, isPending } = useRegister();

  // Get role from query string or default to STUDENT
  const queryParams = new URLSearchParams(location.search);
  const initialRole = (queryParams.get('role')?.toUpperCase() as UserRole) || 'STUDENT';
  const [role, setRole] = React.useState<UserRole>(initialRole);
  React.useEffect(() => {
    authService.setRole(role);
  }, [role]);
  // Helper to parse server error message into field-error map
  const parseServerErrors = (msg: string) => {
    const errorObj: Record<string, string> = {};
    if (!msg) return errorObj;
    msg.split(';').forEach((part) => {
      const [field, ...rest] = part.split(':');
      if (field && rest.length) {
        errorObj[field.trim()] = rest.join(':').trim();
      }
    });
    return errorObj;
  };

  const onFinish = (values: RegisterFormValues) => {
    if (values.password !== values.confirmPassword) {
      message.error('Passwords do not match!');
      return;
    }
    const registerData = { ...values, role };
    register(registerData, {
      onSuccess: () => {
        message.success('Registration successful!');
        navigate('/login');
      },
      onError: (error: any) => {
        const errorMsg = error?.message;
        if (error?.type === 'validation_error') {
          const fieldErrors = parseServerErrors(errorMsg);
          const fieldEntries = Object.entries(fieldErrors);
          form.setFields(
            fieldEntries.map(([name, msg]) => ({ name, errors: [msg] }))
          );
        } else {
          message.error(errorMsg || 'Registration failed. Please try again.');
        }
      },
    });
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
            <Title level={2} className={styles.welcomeTitle}>Create Account</Title>
            <Text className={styles.welcomeText}>
              Join the platform to manage courses, students, and more.
            </Text>
          </div>
        </div>

        <div className={styles.loginRight}>
          <Card className={styles.loginCard} variant="borderless">
            <Title level={3} className={styles.loginTitle}>Sign Up</Title>
            <Text className={styles.loginSubtitle}>Fill in your details to create an account</Text>
            <Form
              form={form}
              name="register_form"
              className={styles.loginForm}
              onFinish={onFinish}
              layout="vertical"
              size="large"
              initialValues={{ role: initialRole }}
            >
              {/* Role selection */}
              <Form.Item
                name="role"
                label="Role"
                rules={[{ required: true, message: 'Please select your role!' }]}
                initialValue={role}
              >
                <Select value={role} onChange={setRole}>
                  <Select.Option value="ADMIN">Admin</Select.Option>
                  <Select.Option value="TEACHER">Teacher</Select.Option>
                  <Select.Option value="STUDENT">Student</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item
                name="name"
                rules={[{ required: true, message: 'Please enter your name!' }]}
              >
                <Input
                  prefix={<UserOutlined className={styles.formIcon} />}
                  placeholder="Full Name"
                  className={styles.formInput}
                />
              </Form.Item>
              <Form.Item
                name="email"
                rules={[
                  { required: true, message: 'Please enter your email!' },
                  { type: 'email', message: 'Please enter a valid email address!' }
                ]}
              >
                <Input
                  prefix={<MailOutlined className={styles.formIcon} />}
                  placeholder="Email Address"
                  className={styles.formInput}
                />
              </Form.Item>
              {role==="STUDENT" &&
              <Form.Item
                name="grade"
                rules={[
                  { required: true, message: 'Please enter your grade!' },
                  {
                    validator: (_, value) => {
                      if (value === null || value === undefined || isNaN(value)) {
                        return Promise.reject('Please enter a valid grade!');
                      }
                      return Promise.resolve();
                    },
                  },
                ]}
              >
                <InputNumber
                  className={styles.formInput}
                  placeholder="Grade"
                  style={{ width: '100%' }}
                />
              </Form.Item>}
              <Form.Item
                name="password"
                rules={[{ required: true, message: 'Please enter your password!' }]}
                hasFeedback
              >
                <Input.Password
                  prefix={<LockOutlined className={styles.formIcon} />}
                  placeholder="Password"
                  className={styles.formInput}
                />
              </Form.Item>
              <Form.Item
                name="confirmPassword"
                dependencies={["password"]}
                hasFeedback
                rules={[
                  { required: true, message: 'Please confirm your password!' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('password') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('Passwords do not match!'));
                    },
                  }),
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined className={styles.formIcon} />}
                  placeholder="Confirm Password"
                  className={styles.formInput}
                />
              </Form.Item>
              
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  disabled={isPending}
                  className={styles.loginButton}
                  loading={isPending}
                  block
                >
                  Sign Up
                </Button>
              </Form.Item>
              <div className={styles.registerPrompt}>
                <Text>Already have an account? </Text>
                <Link to="/login" className={styles.registerLink}>Sign In</Link>
              </div>
              <div style={{ marginTop: 8 }}>
                <Link to="/forgot-password" className={styles.forgotPassword}>
                  Forgot password?
                </Link>
              </div>
            </Form>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Register; 