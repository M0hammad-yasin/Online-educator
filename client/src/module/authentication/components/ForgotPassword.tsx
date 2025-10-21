import React, { FormEvent } from 'react';
import { Form, Input, Button, Typography, Card, message, Result } from 'antd';
import { MailOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { ForgotPasswordIllustration, SuccessCheckmark } from '../../../assets/auth-illustrations';
import styles from './ForgotPassword.module.css';
import { useForgotPassword } from '../hooks/useAuth';
import OTP from 'antd/es/input/OTP';

const { Title, Text, Paragraph } = Typography;

interface ForgotPasswordFormValues {
  email: string;
}

const ForgotPassword: React.FC = () => {
  const navigate=useNavigate();
  const { mutate:forgotPassword, isPending,isSuccess } = useForgotPassword();
  const onFinish =  (values: ForgotPasswordFormValues) => {
     const maskEmail=(email: string)=> {
      const [name, domain] = email.split("@");
      if (name.length <= 4) return `${name[0]}******@${domain}`;
      return `${name.slice(0, 2)}******${name.slice(-2)}@${domain}`;
    }
    
        forgotPassword(values.email,{
          onSuccess:()=>{
            console.log(`please enter the OTP send to ${maskEmail(values.email)}`);
            message.success(`please enter the OTP send to ${maskEmail(values.email)}`,8 );
          },onError:(error)=>{
            message.error(error?.message||"forgot password failed. Please try again");
          }
        });
  };

  const handleOTPSubmit=()=>{
    // console.log(event);
      navigate('/login');
  }

  return (
    <div className={styles.forgotContainer}>
      <div className={styles.forgotWrapper}>
        <Card className={styles.forgotCard} variant='borderless'>
          {!isSuccess ? (
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
                    loading={isPending}
                    disabled={isPending}
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
              <OTP
              onSubmit={handleOTPSubmit}>

              </OTP>
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