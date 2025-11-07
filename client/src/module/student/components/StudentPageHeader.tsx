import React from 'react';
import { Button, Space } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { Role } from '../../../constants/role';
import { useStudentModals,hasAccess} from '../';
import {useRole} from '../../../hooks';

const StudentPageHeader: React.FC = () => {
  const currentRole=useRole();
  const {setCreateModalOpen}=useStudentModals();
  return (
    <div style={{ 
      marginBottom: '32px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: '16px',
    }}>
      <div>
        <h1 style={{ 
          margin: 0, 
          fontSize: '28px', 
          fontWeight: 700,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}>
          {currentRole === Role.TEACHER ? 'My Students' : 'Students Management'}
        </h1>
        <p style={{ margin: '4px 0 0 0', opacity: 0.7, fontSize: '14px' }}>
          {currentRole === Role.TEACHER 
            ? 'Manage and track your students progress'
            : 'Comprehensive student management dashboard'
          }
        </p>
      </div>
      
      <Space wrap>
        {hasAccess(currentRole,'quickActions') && (
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={()=>{setCreateModalOpen(true)}}
            style={{
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              border: 'none',
            }}
          >
            Add Student
          </Button>
        )}
      </Space>
    </div>
  );
};

export default StudentPageHeader;
