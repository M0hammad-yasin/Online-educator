// client/src/module/classes/components/SortableHeader.tsx

import React from 'react';
import { CaretUpOutlined, CaretDownOutlined } from '@ant-design/icons';
import { theme } from 'antd';

interface SortableHeaderProps {
  title: string;
  currentOrder: 'asc' | 'desc' | null;
  onClick: () => void;
}

const SortableHeader: React.FC<SortableHeaderProps> = ({ title, currentOrder, onClick }) => {
  const isActive = currentOrder !== null;
  const {token : antdToken}=theme.useToken();
  
  const getArrowIcon = () => {
    return currentOrder === 'desc' ? <CaretUpOutlined /> : <CaretDownOutlined />;
  };

  const getArrowColor = () => {
    return isActive ? '#1890ff' : '#949191';
  };

  return (
    <div 
      style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '4px',
        cursor: 'pointer',
        userSelect: 'none',
        padding: '4px 8px',
        borderRadius: '4px',
        transition: 'background-color 0.2s ease',
      }}
      onClick={onClick}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = antdToken.colorBgSpotlight;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = 'transparent';
      }}
    >
      <span style={{ fontWeight: isActive ? 600 : 400 }}>{title}</span>
      <span style={{ color: getArrowColor(), fontSize: '12px' }}>
        {getArrowIcon()}
      </span>
    </div>
  );
};

export default SortableHeader;


