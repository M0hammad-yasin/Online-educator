import React, { useState } from 'react';
import { Form, Input, Button, Typography, Card, message } from 'antd';
import { MailOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { ForgotPasswordIllustration, SuccessCheckmark } from '../../assets/auth-illustrations';
import useAuthStore from '../../store/authStore';
import styles from './ForgotPassword.module.css';

const { Title, Text, Paragraph } = Typography;

interface ForgotPasswordFormValues {
  email: string;
}

const ForgotPassword: React.FC = () => {
  const { forgotPassword, loading } = useAuthStore();
  const [submitted, setSubmitted] = useState(false);

  const onFinish = async (values: ForgotPasswordFormValues) => {
    try {
      await forgotPassword(values.email);
      setSubmitted(true);
      message.success('Password reset instructions sent!');
    } catch (error) {
      console.error('Error sending reset instructions:', error);
      message.error('Error sending reset instructions. Please try again.');
    }
  };

  return (
    <div className={styles.forgotContainer}>
      <div className={styles.forgotWrapper}>
        <Card className={styles.forgotCard} bordered={false}>
          {!submitted ? (
            <>
              <Title level={3} className={styles.forgotTitle}>Forgot Password</Title>
              <Text className={styles.forgotSubtitle}>
                Enter your email address and we'll send you instructions to reset your password.
              </Text>
              
              <Form
                name="forgot_password_form"
                className={styles.forgotForm}
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
                    prefix={<MailOutlined className={styles.formIcon} />} 
                    placeholder="Email Address" 
                    className={styles.formInput}
                  />
                </Form.Item>

                <Form.Item>
                  <Button 
                    type="primary" 
                    htmlType="submit" 
                    className={styles.submitButton}
                    loading={loading}
                    block
                  >
                    Send Reset Instructions
                  </Button>
                </Form.Item>
              </Form>
            </>
          ) : (
            <div className={styles.successMessage}>
              <div className={styles.successIcon}>
                <SuccessCheckmark />
              </div>
              <Title level={3} className={styles.successTitle}>Check Your Email</Title>
              <Paragraph className={styles.successText}>
                We've sent password reset instructions to your email address. Please check your inbox and follow the instructions.
              </Paragraph>
              <Paragraph className={styles.successNote}>
                If you don't receive an email within a few minutes, check your spam folder or try again.
              </Paragraph>
            </div>
          )}
          
          <div className={styles.backToLogin}>
            <Link to="/login" className={styles.backLink}>
              <ArrowLeftOutlined /> Back to Login
            </Link>
          </div>
        </Card>

        <div className={styles.forgotBackground}>
          <ForgotPasswordIllustration />
        </div>
      </div>
    </div>
  );
};
export default ForgotPassword;