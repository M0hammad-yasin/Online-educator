import React, { useEffect } from 'react';
import { Button, Typography, Card, Result } from 'antd';
import { LogoutOutlined, LoginOutlined, HomeOutlined } from '@ant-design/icons';
import { Link, Navigate } from 'react-router-dom';
import { LogoutIllustration, LoadingSpinner } from '../../assets/auth-illustrations';
import useAuthStore from '../../store/authStore';
import styles from './Logout.module.css';

const { Title, Paragraph } = Typography;

const Logout: React.FC = () => {
  const { logout, loading, isAuthenticated } = useAuthStore();
  
  useEffect(() => {
    const performLogout = async () => {
      if (isAuthenticated) {
        try {
          await logout();
          console.log('User logged out successfully');
        } catch (error) {
          console.error('Logout failed:', error);
        }
      }
    };
    
    performLogout();
  }, [logout, isAuthenticated]);

  // If not authenticated and not in the process of logging out, redirect to login
  if (!isAuthenticated && !loading) {
    return <Navigate to="/login" />;
  }

  return (
    <div className={styles.logoutContainer}>
      <div className={styles.logoutWrapper}>
        <Card className={styles.logoutCard} bordered={false}>
          <div className={styles.logoutBackground}>
            <LogoutIllustration />
          </div>
          {loading ? (
            <div className={styles.loggingOutContent}>
              <div className={styles.loadingIcon}>
                <LoadingSpinner />
              </div>
              <Title level={3} className={styles.loadingTitle}>Logging Out</Title>
              <Paragraph className={styles.loadingText}>
                Please wait while we securely log you out of your account...
              </Paragraph>
            </div>
          ) : (
            <Result
              icon={<LogoutOutlined className={styles.logoutIcon} />}
              title="You've Been Logged Out"
              subTitle="Thank you for using Online Educator. You have been successfully logged out of your account."
              extra={[
                <Link to="/login" key="login">
                  <Button type="primary" icon={<LoginOutlined />} size="large" className={styles.actionButton}>
                    Log In Again
                  </Button>
                </Link>,
                <Link to="/" key="home">
                  <Button icon={<HomeOutlined />} size="large" className={styles.secondaryButton}>
                    Back to Home
                  </Button>
                </Link>
              ]}
              className={styles.logoutResult}
            />
          )}
        </Card>

        <div className={styles.logoutBackground}>
          <svg width="100%" height="100%" viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg">
            <path d="M0,0 L500,0 L500,500 L0,500 Z" fill="#1677ff" opacity="0.03" />
            <circle cx="150" cy="150" r="100" fill="#1677ff" opacity="0.05" />
            <circle cx="400" cy="400" r="150" fill="#1677ff" opacity="0.05" />
            <path d="M0,250 Q150,200 250,250 T500,250" stroke="#1677ff" strokeWidth="2" fill="transparent" opacity="0.1" />
            <path d="M0,300 Q200,350 350,300 T500,350" stroke="#1677ff" strokeWidth="2" fill="transparent" opacity="0.1" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default Logout;