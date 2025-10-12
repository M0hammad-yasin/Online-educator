import React, { useState } from 'react';
import { Modal, Row, Col, Input, Select } from 'antd';
import { CreateStudentRequest } from '../types/student.types';

interface AddStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddStudent: (studentData: CreateStudentRequest) => void;
}

const AddStudentModal: React.FC<AddStudentModalProps> = ({
  isOpen,
  onClose,
  onAddStudent,
}) => {
  const [formData, setFormData] = useState<CreateStudentRequest>({
    name: '',
    email: '',
    grade: 1,
    region: undefined,
    parentEmail: undefined,
    password: '',
  });

  const handleFormChange = (field: keyof CreateStudentRequest, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddStudent = () => {
    onAddStudent(formData);
    setFormData({
      name: '',
      email: '',
      grade: 1,
      region: undefined,
      parentEmail: undefined,
      password: '',
    });
    onClose();
  };

  const handleCancel = () => {
    setFormData({
      name: '',
      email: '',
      grade: 1,
      region: undefined,
      parentEmail: undefined,
      password: '',
    });
    onClose();
  };

  return (
    <Modal
      title="Add New Student"
      open={isOpen}
      onCancel={handleCancel}
      onOk={handleAddStudent}
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
        <Row gutter={16}>
          <Col span={12}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>
                Full Name <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <Input 
                placeholder="Enter student name"
                value={formData.name}
                onChange={(e) => handleFormChange('name', e.target.value)}
              />
            </div>
          </Col>
          <Col span={12}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>
                Email <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <Input 
                type="email" 
                placeholder="student@example.com"
                value={formData.email}
                onChange={(e) => handleFormChange('email', e.target.value)}
              />
            </div>
          </Col>
          <Col span={12}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>
                Password <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <Input 
                type="password" 
                placeholder="Enter password"
                value={formData.password}
                onChange={(e) => handleFormChange('password', e.target.value)}
              />
            </div>
          </Col>
          <Col span={12}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>
                Grade <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <Select 
                placeholder="Select grade"
                style={{ width: '100%' }}
                value={formData.grade}
                onChange={(value) => handleFormChange('grade', value)}
              >
                {Array.from({ length: 12 }, (_, i) => i + 1).map(grade => (
                  <Select.Option key={grade} value={grade}>
                    Grade {grade}
                  </Select.Option>
                ))}
              </Select>
            </div>
          </Col>
          <Col span={12}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>
                Region
              </label>
              <Select 
                placeholder="Select region"
                style={{ width: '100%' }}
                value={formData.region}
                onChange={(value) => handleFormChange('region', value)}
                allowClear
              >
                <Select.Option value="North">North</Select.Option>
                <Select.Option value="South">South</Select.Option>
                <Select.Option value="East">East</Select.Option>
                <Select.Option value="West">West</Select.Option>
                <Select.Option value="Canada">Canada</Select.Option>
                <Select.Option value="USA">USA</Select.Option>
                <Select.Option value="England">England</Select.Option>
              </Select>
            </div>
          </Col>
          <Col span={12}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>
                Parent Email
              </label>
              <Input 
                type="email" 
                placeholder="parent@example.com"
                value={formData.parentEmail}
                onChange={(e) => handleFormChange('parentEmail', e.target.value)}
              />
            </div>
          </Col>
          <Col span={24}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>
                Address
              </label>
              <Input 
                placeholder="Enter student address"
                value={formData.address}
                onChange={(e) => handleFormChange('address', e.target.value)}
              />
            </div>
          </Col>
        </Row>
      </div>
    </Modal>
  );
};

export default AddStudentModal;
