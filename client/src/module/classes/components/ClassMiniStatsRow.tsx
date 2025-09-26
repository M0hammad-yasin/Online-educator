// client/src/module/classes/components/ClassMiniStatsRow.tsx

import React from 'react';
import { Row, Col,  } from 'antd';
import { FieldTimeOutlined, PlayCircleOutlined, ScheduleOutlined, LockOutlined } from '@ant-design/icons';
import { useClassesCount } from '../hooks/useClasses';
import { ClassStatus } from '../types/class.type';
import StatTile from './cards/StatTile';
const ClassMiniStatsRow: React.FC = () => {
    const { data: totalResp, isLoading: loadingTotal } = useClassesCount();
    const { data: liveResp, isLoading: loadingLive } = useClassesCount({ status: 'IN_PROGRESS' as ClassStatus });
    const { data: schedResp, isLoading: loadingSched } = useClassesCount({ status: 'SCHEDULED' as ClassStatus });
    const { data: complResp, isLoading: loadingCompl } = useClassesCount({ status: 'COMPLETED' as ClassStatus });

    const total = Number((totalResp as any)?.data ?? 0);
    const live = Number((liveResp as any)?.data ?? 0);
    const scheduled = Number((schedResp as any)?.data ?? 0);
    const completed = Number((complResp as any)?.data ?? 0);

    return (
        <Row gutter={[16, 16]} align="stretch">
            <Col span={12} style={{ height: '100%' }}>
                <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div style={{ flex: 1, display: 'flex' }}>
                        <StatTile
                            title="Total Classes"
                            value={loadingTotal ? undefined : total}
                            icon={<FieldTimeOutlined />}
                            bg="#e6f4ff"
                            fg="#1677ff" />
                    </div>
                    <div style={{ flex: 1, display: 'flex' }}>
                        <StatTile
                            title="live Classes"
                            value={loadingLive ? undefined : live}
                            icon={<PlayCircleOutlined />}
                            bg="#f6ffed"
                            fg="#52c41a" />
                    </div>
                </div>
            </Col>
            <Col span={12} style={{ height: '100%' }}>
                <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div style={{ flex: 1, display: 'flex' }}>
                        <StatTile
                            title="scheduled class"
                            value={loadingSched ? undefined : scheduled}
                            icon={<ScheduleOutlined />}
                            bg="#fff1f0"
                            fg="#ff4d4f" />
                    </div>
                    <div style={{ flex: 1, display: 'flex' }}>
                        <StatTile
                            title="completed class"
                            value={loadingCompl ? undefined : completed}
                            icon={<LockOutlined />}
                            bg="#ffe1f0"
                            fg="#ff0d4f" />
                    </div>
                </div>
            </Col>
        </Row>
    );
};

export default ClassMiniStatsRow;


