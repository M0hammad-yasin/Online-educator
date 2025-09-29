// client/src/module/classes/components/ClassForm.tsx

import React, { useState } from 'react';
import { Form, Input, Select, DatePicker, InputNumber, Button, Space, message } from 'antd';
import type { FormInstance } from 'antd/es/form';
import { useCreateClass } from '../hooks/useClasses';
import { CreateClassRequest, ClassStatus } from '../index';
import { useStudentsForSelection } from '../../student';
import { useTeachersForSelection } from '../../teacher';

const { Option } = Select;

interface ClassFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  form?: FormInstance;
  showActions?: boolean;
}

const ClassForm: React.FC<ClassFormProps> = ({ 
  onSuccess, 
  onCancel,
  form: providedForm,
  showActions = true,
}) => {
  const [internalForm] = Form.useForm();
  const form = providedForm || internalForm;

  const createClassMutation = useCreateClass();

  const [studentDropdownOpen, setStudentDropdownOpen] = useState(false);
  const [teacherDropdownOpen, setTeacherDropdownOpen] = useState(false);

  // Fetch students and teachers for dropdowns
  const { data: studentData, isLoading: isStudentLoading, error: studentError } =
    useStudentsForSelection({}, studentDropdownOpen);
  const { data: teacherData, isLoading: isTeacherLoading, error: teacherError } =
    useTeachersForSelection({}, teacherDropdownOpen);

  const handleStudentDropdownVisibleChange = (open: boolean) => {
    setStudentDropdownOpen(open);
  };

  const handleTeacherDropdownVisibleChange = (open: boolean) => {
    setTeacherDropdownOpen(open);
  };

  const isLoading = createClassMutation.isPending;

  const handleSubmit = async (values: any) => {
    try {
      const formattedValues = {
        ...values,
        scheduledAt: values.scheduledAt?.toISOString(),
        startTime: values.startTime?.toISOString(),
        duration: values.duration.toString(),
      };

      await createClassMutation.mutateAsync(formattedValues as CreateClassRequest);
      message.success('Class created successfully');

      form.resetFields();
      onSuccess?.();
    } catch (error: any) {
      message.error(error.message || 'Failed to create class');
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel?.();
  };

  const classStatusOptions: { value: ClassStatus; label: string }[] = [
    { value: 'SCHEDULED', label: 'Scheduled' },
    { value: 'IN_PROGRESS', label: 'In Progress' },
    { value: 'COMPLETED', label: 'Completed' },
    { value: 'CANCELLED', label: 'Cancelled' },
  ];

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      disabled={isLoading}
    >
      <Form.Item
        name="subject"
        label="Subject"
        rules={[
          { required: true, message: 'Please enter the subject' },
          { min: 3, message: 'Subject must be at least 3 characters' },
        ]}
      >
        <Input placeholder="Enter subject" />
      </Form.Item>

      <Form.Item
        name="teacherId"
        label="Teacher"
        rules={[{ required: true, message: 'Please select a teacher' }]}
        help={teacherError ? 'Failed to load teachers' : undefined}
        validateStatus={teacherError ? 'error' : undefined}
      >
        <Select
          placeholder="Select teacher"
          loading={isTeacherLoading}
          showSearch
          optionFilterProp="children"
          onDropdownVisibleChange={handleTeacherDropdownVisibleChange}
          filterOption={(input, option) =>
            (option?.children?.toString().toLowerCase().includes(input.toLowerCase()) ?? false)
          }
          notFoundContent={
            teacherError ? 'Error loading teachers' : isTeacherLoading ? 'Loading...' : 'No teachers found'
          }
        >
          {teacherData?.data?.map((teacher) => (
            <Option key={teacher.id} value={teacher.id}>
              {teacher.name}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        name="studentId"
        label="Student"
        rules={[{ required: true, message: 'Please select a student' }]}
        help={studentError ? 'Failed to load students' : undefined}
        validateStatus={studentError ? 'error' : undefined}
      >
        <Select
          placeholder="Select student"
          loading={isStudentLoading}
          showSearch
          onDropdownVisibleChange={handleStudentDropdownVisibleChange}
          optionFilterProp="children"
          filterOption={(input, option) =>
            (option?.children?.toString().toLowerCase().includes(input.toLowerCase()) ?? false)
          }
          notFoundContent={
            studentError ? 'Error loading students' : isStudentLoading ? 'Loading...' : 'No students found'
          }
        >
          {studentData?.data?.map((student) => (
            <Option key={student.id} value={student.id}>
              {student.name}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        name="scheduledAt"
        label="Scheduled Date & Time"
        rules={[{ required: true, message: 'Please select scheduled time' }]}
      >
        <DatePicker
          showTime
          format="YYYY-MM-DD HH:mm"
          placeholder="Select scheduled time"
          style={{ width: '100%' }}
        />
      </Form.Item>

      <Form.Item name="startTime" label="Start Time">
        <DatePicker
          showTime
          format="YYYY-MM-DD HH:mm"
          placeholder="Select start time"
          style={{ width: '100%' }}
        />
      </Form.Item>

      <Form.Item
        name="duration"
        label="Duration (minutes)"
        rules={[
          { required: true, message: 'Please enter duration' },
          { type: 'number', min: 40, message: 'Duration must be at least 40 minutes' },
        ]}
      >
        <InputNumber
          min={40}
          max={300}
          placeholder="Enter duration in minutes"
          style={{ width: '100%' }}
        />
      </Form.Item>

      <Form.Item
        name="status"
        label="Class Status"
        initialValue="SCHEDULED"
        rules={[{ required: true, message: 'Please select class status' }]}
      >
        <Select placeholder="Select class status">
          {classStatusOptions.map((option) => (
            <Option key={option.value} value={option.value}>
              {option.label}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        name="classLink"
        label="Class Link"
        rules={[
          {
            pattern: /^https:\/\/app\.conceptboard\.com\/board\/(?:[A-Za-z0-9]{4}-){4}[A-Za-z0-9]{4}$/,
            message:
              'classLink must follow the pattern https://app.conceptboard.com/board/XXXX-XXXX-XXXX-XXXX-XXXX',
          },
        ]}
      >
        <Input placeholder="https://app.conceptboard.com/board/..." />
      </Form.Item>

      {showActions && (
        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit" loading={isLoading}>
              Create Class
            </Button>
            <Button onClick={handleCancel}>Cancel</Button>
          </Space>
        </Form.Item>
      )}
    </Form>
  );
};

export default ClassForm;
