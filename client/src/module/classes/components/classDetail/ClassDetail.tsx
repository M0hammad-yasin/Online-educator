// client/src/module/classes/components/classDetail/ClassDetail.tsx

import React from 'react';
import { Card, Typography,  Button, Skeleton, Result, Row, Col, Avatar, Space,  } from 'antd';
import { format } from 'date-fns';
import { ArrowLeftOutlined, CalendarOutlined, ClockCircleOutlined, UserOutlined, BookOutlined, VideoCameraOutlined } from '@ant-design/icons';
import { useClass } from '../../hooks/useClasses';
import { motion } from 'framer-motion';
import './ClassDetail.css';

const { Title, Text } = Typography;

interface ClassDetailProps {
  classId: string;
  onBack: () => void;
}

const ClassDetail: React.FC<ClassDetailProps> = ({ classId, onBack }) => {
  const { data: classData, isLoading, error } = useClass(classId);
   if (isLoading) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="class-detail-container"
      >
        <Card className="class-detail-card">
          <Skeleton active avatar paragraph={{ rows: 6 }} />
        </Card>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="class-detail-container"
      >
        <Result
          status="error"
          title="Failed to load class details"
          subTitle={error.message}
          extra={
            <Button type="primary" onClick={onBack}>
              Back to Class List
            </Button>
          }
        />
      </motion.div>
    );
  }

  if (!classData?.data) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="class-detail-container"
      >
        <Result
          status="warning"
          title="No class data found"
          extra={
            <Button type="primary" onClick={onBack}>
              Back to Class List
            </Button>
          }
        />
      </motion.div>
    );
  }

  const classItem = classData.data;

  return (
    <div className="class-detail-container">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.3 }}
        className="class-detail-card"
      >
        <Card>
          <div className="class-detail-header">
            <Button 
              type="text" 
              icon={<ArrowLeftOutlined />} 
              onClick={onBack}
              className="back-button"
              aria-label="Back to classes list"
            >
              Back to Classes
            </Button>
            <Title level={4} className="class-detail-title">
              {classItem?.subject || 'Class Details'}
            </Title>
          </div>

          {isLoading ? (
            <div className="loading-container" aria-live="polite" aria-busy="true">
              <Skeleton active paragraph={{ rows: 4 }} />
              <Skeleton active paragraph={{ rows: 3 }} />
              <Skeleton active paragraph={{ rows: 2 }} />
            </div>
          ) : error ? (
            <Result
              status="error"
              title="Failed to load class details"
              subTitle={error || 'Please try again later'}
              aria-live="assertive"
            />
          ) : !classItem ? (
            <Result
              status="warning"
              title="No class data found"
              subTitle="The requested class could not be found"
              aria-live="assertive"
            />
          ) : (
            <div className="class-detail-content" aria-live="polite">
              <Row gutter={[24, 24]}>
                <Col xs={24} md={12}>
                  <Card className="info-card">
                    <Title level={4}>Schedule Information</Title>
                    <Space direction="vertical" size="middle" className="info-space">
                      <div className="info-item">
                        <CalendarOutlined className="info-icon" />
                        <div>
                          <Text type="secondary">Date</Text>
                          <div>{format(new Date(classItem.scheduledAt), 'MMMM dd, yyyy')}</div>
                        </div>
                      </div>
                      <div className="info-item">
                        <ClockCircleOutlined className="info-icon" />
                        <div>
                          <Text type="secondary">Time</Text>
                          <div>{format(new Date(classItem.scheduledAt), 'hh:mm a')}</div>
                        </div>
                      </div>
                      <div className="info-item">
                        <ClockCircleOutlined className="info-icon" />
                        <div>
                          <Text type="secondary">Duration</Text>
                          <div>{classItem.duration} minutes</div>
                        </div>
                      </div>
                    </Space>
                  </Card>
                </Col>

                <Col xs={24} md={12}>
                  <Card className="info-card">
                    <Title level={4}>Participants</Title>
                    <Space direction="vertical" size="middle" className="info-space">
                      <div className="info-item">
                        <Avatar size="large" icon={<UserOutlined />} />
                        <div>
                          <Text type="secondary">Teacher</Text>
                          <div className="participant-name">{classItem.teacher?.name || 'Not assigned'}</div>
                          <div>{classItem.teacher?.qualification}</div>
                        </div>
                      </div>
                      <div className="info-item">
                        <Avatar size="large" icon={<UserOutlined />} />
                        <div>
                          <Text type="secondary">Student</Text>
                          <div className="participant-name">{classItem.student?.name || 'Not assigned'}</div>
                          <div>Grade {classItem.student?.grade}</div>
                        </div>
                      </div>
                    </Space>
                  </Card>
                </Col>

                <Col xs={24}>
                  <Card className="info-card">
                    <Title level={4}>Class Details</Title>
                    <Space direction="vertical" size="middle" className="info-space">
                      <div className="info-item">
                        <BookOutlined className="info-icon" />
                        <div>
                          <Text type="secondary">Subject</Text>
                          <div>{classItem.subject}</div>
                        </div>
                      </div>
                      {classItem.classLink && (
                        <div className="info-item">
                          <VideoCameraOutlined className="info-icon" />
                          <div>
                            <Text type="secondary">Class Link</Text>
                            <div>
                              <a 
                                href={classItem.classLink} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                aria-label={`Join meeting for ${classItem.subject} class`}
                              >
                                Join Class
                              </a>
                            </div>
                          </div>
                        </div>
                      )}
                    </Space>
                  </Card>
                </Col>
              </Row>
            </div>
          )}
        </Card>
      </motion.div>
    </div>
  );
};

export default ClassDetail;