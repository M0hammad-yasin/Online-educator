// client/src/module/classes/components/ClassMiniStatsRow.tsx

import React from 'react';
import { Card, Row, Col, Typography, theme } from 'antd';
import { FieldTimeOutlined, PlayCircleOutlined, ScheduleOutlined, LockOutlined } from '@ant-design/icons';
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
            size="small"
            styles={{ body: { padding: 8 } }}
            style={{
                borderRadius: 12,
                background: token.colorBgContainer,
                boxShadow: token.boxShadowTertiary,
                height: '100%'
            }}
        >
            <div style={{ display: 'flex', gap: 5, alignItems: 'center', justifyContent:'space-around' }}>
                <div
                    style={{
                        width: 37,
                        height: 37,
                        borderRadius: 10,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: bg,
                        color: fg,
                        fontSize: 15,
                    }}
                >
                    {icon}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                    <Text style={{  textAlign: 'center' }}>
                        {/* {title.split(' ').map((word, index) => (
                            <span style={{fontWeight:'bold', fontSize:13}} key={index}>
                                {word}
                                {index < title.split(' ').length - 1 && <br />}
                            </span>
                        ))} */}
                            <span style={{fontWeight:'bold', fontSize:13}} >{title}</span>

                    </Text>
                    <Text strong style={{ fontSize: 18 }}>{value ?? 0}</Text>
                </div>
            </div>
        </Card>
    );
};

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


