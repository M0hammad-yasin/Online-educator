// client/src/module/classes/components/ClassMiniStatsRow.tsx

import React from 'react';
import { Card, Row, Col, Typography, theme } from 'antd';
import { FieldTimeOutlined, PlayCircleOutlined, ScheduleOutlined } from '@ant-design/icons';
import { useClassesCount } from '../hooks/useClasses';
import { ClassStatus } from '../types/class.type';

const { Text } = Typography;

const StatTile: React.FC<{
  title: string;
  value?: number;
  icon: React.ReactNode;
  bg: string;
  fg: string;
}> = ({ title, value, icon, bg, fg }) => {
  const { token } = theme.useToken();
  return (
    <Card
      size="default"
      styles={{ body: { padding: 12 } }}
      style={{
        borderRadius: 12,
        background: token.colorBgContainer,
        boxShadow: token.boxShadowTertiary,
      }}
    >
      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: 10,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: bg,
            color: fg,
            fontSize: 18,
          }}
        >
          {icon}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column',alignItems:'center', lineHeight: 1.1,gap:5 }}>
          <Text  style={{fontWeight:'bold', fontSize: 16 }}>{title}</Text>
          <Text strong style={{ fontSize: 22 }}>{value ?? 0}</Text>
        </div>
      </div>
    </Card>
  );
};

const ClassMiniStatsRow: React.FC = () => {
  const { data: totalResp, isLoading: loadingTotal } = useClassesCount();
  const { data: liveResp, isLoading: loadingLive } = useClassesCount({ status: 'IN_PROGRESS' as ClassStatus });
  const { data: schedResp, isLoading: loadingSched } = useClassesCount({ status: 'SCHEDULED' as ClassStatus });

  const total = Number((totalResp as any)?.data ?? 0);
  const live = Number((liveResp as any)?.data ?? 0);
  const scheduled = Number((schedResp as any)?.data ?? 0);

  return (
    <Row gutter={[0, 12]}>
      <Col span={24}>
        <StatTile
          title="Total Classes"
          value={loadingTotal ? undefined : total}
          icon={<FieldTimeOutlined />}
          bg="#e6f4ff"
          fg="#1677ff"
        />
      </Col>
      <Col span={24}>
        <StatTile
          title="live Classes"
          value={loadingLive ? undefined : live}
          icon={<PlayCircleOutlined />}
          bg="#f6ffed"
          fg="#52c41a"
        />
      </Col>
      <Col span={24}>
        <StatTile
          title="scheduled class"
          value={loadingSched ? undefined : scheduled}
          icon={<ScheduleOutlined />}
          bg="#fff1f0"
          fg="#ff4d4f"
        />
      </Col>
    </Row>
  );
};

export default ClassMiniStatsRow;


