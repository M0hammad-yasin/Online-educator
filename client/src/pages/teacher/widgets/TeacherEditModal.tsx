import React, { useEffect } from 'react';
import { Modal, Form, Input, InputNumber, message, Select } from 'antd';
import { Teacher } from '../../../module/teacher/types/teacher.types';
import { useUpdateTeacher } from '../../../module/teacher/hooks/useTeachers';

interface TeacherEditModalProps {
  open: boolean;
  onClose: () => void;
  teacher: Teacher | null;
}

const TeacherEditModal: React.FC<TeacherEditModalProps> = ({ open, onClose, teacher }) => {
  const [form] = Form.useForm();
  const updateTeacherMutation = useUpdateTeacher();

  useEffect(() => {
    if (teacher && open) {
      form.setFieldsValue({
        name: teacher.name,
        email: teacher.email,
        qualification: teacher.qualification,
        classRate: teacher.classRate,
        address: teacher.address,
      });
    }
  }, [teacher, open, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (!teacher) return;

      await updateTeacherMutation.mutateAsync({
        id: teacher.id,
        data: values,
      });

      message.success('Teacher updated successfully');
      form.resetFields();
      onClose();
    } catch (error: any) {
      if (error?.errorFields) return; // Validation error
      message.error(error?.message || 'Failed to update teacher');
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  const qualificationOptions = [
    { label: 'B.Ed', value: 'B.Ed' },
    { label: 'M.Ed', value: 'M.Ed' },
    { label: 'Ph.D', value: 'Ph.D' },
    { label: 'B.Sc', value: 'B.Sc' },
    { label: 'M.Sc', value: 'M.Sc' },
    { label: 'B.A', value: 'B.A' },
    { label: 'M.A', value: 'M.A' },
    { label: 'Other', value: 'Other' },
  ];

  return (
    <Modal
      title="Edit Teacher"
      open={open}
      onOk={handleSubmit}
      onCancel={handleCancel}
      confirmLoading={updateTeacherMutation.isPending}
      width={600}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: 'Please enter teacher name' }]}
        >
          <Input placeholder="Enter teacher name" />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: 'Please enter email' },
            { type: 'email', message: 'Please enter a valid email' },
          ]}
        >
          <Input placeholder="Enter email address" />
        </Form.Item>

        <Form.Item label="Qualification" name="qualification">
          <Select
            placeholder="Select qualification"
            options={qualificationOptions}
            allowClear
          />
        </Form.Item>

        <Form.Item
          label="Class Rate ($/hour)"
          name="classRate"
          rules={[{ type: 'number', min: 0, message: 'Class rate must be positive' }]}
        >
          <InputNumber
            placeholder="Enter hourly rate"
            style={{ width: '100%' }}
            min={0}
            precision={2}
            prefix="$"
          />
        </Form.Item>

        <Form.Item label="Address" name="address">
          <Input.TextArea
            placeholder="Enter address"
            rows={3}
            showCount
            maxLength={200}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default TeacherEditModal;
