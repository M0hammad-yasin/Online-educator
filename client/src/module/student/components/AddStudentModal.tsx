import React from 'react';
import { Modal, Row, Col, Input, Select, Form, message } from 'antd';
import { useCreateStudent ,useStudentModals} from '../';
const AddStudentModal: React.FC = () => {
  const createStudentMutation = useCreateStudent();
  const { setCreateModalOpen, isCreateModalOpen: isOpen, closeAllModals: onClose } = useStudentModals();
  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    const payload = {
      ...values,
      parentEmail: values.parentEmail ? values.parentEmail : undefined,
    };
    createStudentMutation.mutate(payload, {
      onSuccess: () => {
        setCreateModalOpen(false);
        form.resetFields();
      // INSERT_YOUR_CODE
        message.success("Student added successful");
      },
      onError:(error)=>{
        message.error(error.message,4);
      }
    });
  };

  const handleCancel = () => {
    form.resetFields();
    onClose();
    message.warning("student is not created");
  };

  return (
    <Modal
      title="Add New Student"
      open={isOpen}
      onCancel={handleCancel}
      onOk={() => form.submit()}
      okText="Add Student"
      width={600}
      okButtonProps={{
        style: {
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          border: 'none',
        }
      }}
    >
      <div style={{ marginTop: '24px' }}>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{ grade: 1 }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="Full Name"
                rules={[
                  { required: true, message: 'Name is required' },
                  { min: 3, message: 'Name must be at least 3 characters long' },
                ]}
              >
                <Input placeholder="Enter student name" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true, message: 'Email is required' },
                  { type: 'email', message: 'Please enter a valid email address' },
                ]}
              >
                <Input type="email" placeholder="student@example.com" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="password"
                label="Password"
                rules={[
                  { required: true, message: 'Password is required' },
                  { min: 8, message: 'Password must be at least 8 characters long' },
                ]}
              >
                <Input type="password" placeholder="Enter password" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="grade"
                label="Grade"
                rules={[
                  { required: true, message: 'Grade is required' },
                  {
                    validator: (_, value) => {
                      if (typeof value !== 'number') return Promise.reject('Grade must be a number');
                      if (value < 1) return Promise.reject('Grade should not be empty');
                      if (value > 12) return Promise.reject('Grade must be at most 12');
                      return Promise.resolve();
                    }
                  }
                ]}
              >
                <Select placeholder="Select grade" style={{ width: '100%' }}>
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((grade) => (
                    <Select.Option key={grade} value={grade}>
                      Grade {grade}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="region"
                label="Region"
                rules={[
                  { required: true, message: 'Region is required' },
                  { min: 2, message: 'Region must be at least 2 characters long' },
                ]}
              >
                <Select placeholder="Select region" style={{ width: '100%' }}>
                  <Select.Option value="North">North</Select.Option>
                  <Select.Option value="South">South</Select.Option>
                  <Select.Option value="East">East</Select.Option>
                  <Select.Option value="West">West</Select.Option>
                  <Select.Option value="Canada">Canada</Select.Option>
                  <Select.Option value="USA">USA</Select.Option>
                  <Select.Option value="England">England</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="parentEmail"
                label="Parent Email"
                rules={[{ type: 'email', message: 'Please enter a valid parent email' }]}
              >
                <Input type="email" placeholder="parent@example.com" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </div>
    </Modal>
  );
};

export default AddStudentModal;
