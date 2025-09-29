// client/src/module/classes/pages/UpdateClass.tsx

import React, { useEffect, useState } from 'react';
import { Form, Input, Select, DatePicker, InputNumber, Button, Space, message, Spin } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import { useClass, useUpdateClass } from '../../hooks/useClasses';
import { ClassStatus } from '../../index';
import dayjs from 'dayjs';
import { useStudentsForSelection } from '../../../student';
import { useTeachersForSelection } from '../../../teacher';

const { Option } = Select;

const UpdateClass: React.FC<{ classId: string }> = ({ classId }) => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const { data: classResponse, isLoading, error } = useClass(classId || '');
  const { mutateAsync: updateClass, isPending: isUpdating } = useUpdateClass();

  const [studentDropdownOpen, setStudentDropdownOpen] = useState(false);
  const [teacherDropdownOpen, setTeacherDropdownOpen] = useState(false);

  const { data: studentData, isLoading: isStudentLoading, error: studentError } =
    useStudentsForSelection({}, studentDropdownOpen);
  const { data: teacherData, isLoading: isTeacherLoading, error: teacherError } =
    useTeachersForSelection({}, teacherDropdownOpen);

  useEffect(() => {
    if (classResponse?.data) {
      const classItem = classResponse.data;
      form.setFieldsValue({
        subject: classItem.subject,
        scheduledAt: classItem.scheduledAt ? dayjs(classItem.scheduledAt) : null,
        startTime: classItem.startTime ? dayjs(classItem.startTime) : null,
        duration: parseInt(classItem.duration),
        status: classItem.status,
        teacherId: classItem.teacherId,
        studentId: classItem.studentId,
        classLink: classItem.classLink,
      });
    }
  }, [classResponse, form]);

  const handleSubmit = async (values: any) => {
    try {
      const formattedValues = {
        ...values,
        scheduledAt: values.scheduledAt?.toISOString(),
        startTime: values.startTime?.toISOString(),
        duration: values.duration.toString(),
      };

      await updateClass({
        id: classId!,
        data: formattedValues,
      });

      message.success('Class updated successfully');
      navigate('/classes');
    } catch (err: any) {
      message.error(err.message || 'Failed to update class');
    }
  };

  if (isLoading) {
    return <Spin size="large" tip="Loading class details..." />;
  }

  if (error) {
    return <div>Error loading class: {error.message}</div>;
  }

  const classStatusOptions: { value: ClassStatus; label: string }[] = [
    { value: 'SCHEDULED', label: 'Scheduled' },
    { value: 'IN_PROGRESS', label: 'In Progress' },
    { value: 'COMPLETED', label: 'Completed' },
    { value: 'CANCELLED', label: 'Cancelled' },
  ];

  return (
    <div className="update-class-container">
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        disabled={isUpdating}
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
            onDropdownVisibleChange={setTeacherDropdownOpen}
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
            onDropdownVisibleChange={setStudentDropdownOpen}
            optionFilterProp="children"
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

        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit" loading={isUpdating}>
              Update Class
            </Button>
            <Button onClick={() => navigate('/classes')}>Cancel</Button>
          </Space>
        </Form.Item>
      </Form>
    </div>
  );
};

export default UpdateClass;
