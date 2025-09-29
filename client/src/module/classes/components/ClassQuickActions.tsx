// client/src/module/classes/components/ClassQuickActions.tsx

import React, { useState } from 'react';
import { Card, Row, Col, Button, Typography, Form, Modal } from 'antd';
import { PlusCircleOutlined, VideoCameraOutlined, AppstoreOutlined } from '@ant-design/icons';
import ClassForm from './ClassForm';

const { Text } = Typography;

const QuickCard: React.FC<{
    title: string;
    description: string;
    icon: React.ReactNode;
    actionText: string;
    onClick: () => void;
    style?: React.CSSProperties;
    variant?: 'default' | 'primary';
}> = ({ title, description, icon, actionText, onClick, style, variant = 'default' }) => {
    if (variant === 'primary') {
        return (
            <Card
                hoverable
                onClick={onClick}
                style={{
                    borderRadius: 16,
                    border: 'none',
                    background: 'linear-gradient(135deg, #2f54eb 0%, #597ef7 100%)',
                    color: '#ffffff',
                    minHeight: 180,
                    ...style,
                }}
                styles={{ body: { padding: 20 } }}
            >
                <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between', gap: 4 }}>
                    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                        <div
                            style={{
                                width: 50,
                                height: 50,
                                borderRadius: 14,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                background: 'rgba(255,255,255,0.2)',
                                color: '#ffffff',
                                fontSize: 22,
                                flex: '0 0 auto',
                            }}
                        >
                            {icon}
                        </div>
                        <div style={{ flex: 1 }}>
                            <Text strong style={{ display: 'block', color: '#ffffff', fontSize: 21 }}>{title}</Text>
                            <Text style={{ fontSize: 13, color: 'rgba(255,255,255,0.9)' }}>{description}</Text>
                            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.8)', marginTop: 3 }}>
                                Set date, time, participants and meeting link
                            </div>
                        </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Button
                            type="primary"
                            onClick={onClick}
                            size="large"
                            style={{
                                width: '100%',
                                background: '#ffffff',
                                color: '#2f54eb',
                                borderColor: '#ffffff',
                            }}
                        >
                            {actionText}
                        </Button>
                    </div>
                </div>
            </Card>
        );
    }

    return (
        <Card
            hoverable
            onClick={onClick}
            style={{ borderRadius: 12, ...style }}
            styles={{ body: { padding: 12 } }}
        >
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <div
                    style={{
                        width: 42,
                        height: 42,
                        borderRadius: 12,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: '#f0f5ff',
                        color: '#3056eb',
                        fontSize: 19,
                        flex: '0 0 auto',
                    }}
                >
                    {icon}
                </div>
                <div style={{ flex: 1 }}>
                    <Text strong style={{ display: 'block' }}>{title}</Text>
                    <Text type="secondary" style={{ fontSize: 10 }}>{description}</Text>
                </div>
                <Button type="primary" onClick={onClick}>
                    {actionText}
                </Button>
            </div>
        </Card>
    );
};

const ClassQuickActions: React.FC = () => {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [createForm] = Form.useForm();

    const handleOpenCreate = () => setIsCreateOpen(true);
    const handleCancelCreate = () => {
        createForm.resetFields();
        setIsCreateOpen(false);
    };
    const handleSuccessCreate = () => {
        createForm.resetFields();
        setIsCreateOpen(false);
    };
    return (
        <>
            <Row gutter={[12, 12]} align="stretch">
                <Col xs={24} md={12}>
                    <QuickCard
                        title="Create new class"
                        description="Schedule and invite teacher and student"
                        icon={<PlusCircleOutlined />}
                        actionText="Create"
                        onClick={handleOpenCreate}
                        style={{ height: '100%' }}
                        variant="primary" />
                </Col>
                <Col  xs={24} md={12} style={{ height: '100%' }} >
                    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 12 }}>
                        <div style={{ flex: 1, display: 'flex' }}>
                            <QuickCard
                                title="Zoom app"
                                description="Open Zoom to start or join a meeting"
                                icon={<VideoCameraOutlined />}
                                actionText="Open"
                                onClick={() => window.open('https://zoom.us/', '_blank', 'noopener,noreferrer')}
                                style={{ height: '100%', width: '100%' }} />
                        </div>
                        <div style={{ flex: 1, display: 'flex' }}>
                            <QuickCard
                                title="Conceptboard"
                                description="Collaborative whiteboard for interactive sessions"
                                icon={<AppstoreOutlined />}
                                actionText="Launch"
                                onClick={() => window.open('https://conceptboard.com/', '_blank', 'noopener,noreferrer')}
                                style={{ height: '100%', width: '100%' }} />
                        </div>
                    </div>
                </Col>
            </Row>
            <Modal
                title="Create new class"
                open={isCreateOpen}
                onCancel={handleCancelCreate}
                destroyOnClose
                footer={[
                    <Button key="cancel" onClick={handleCancelCreate}>Cancel</Button>,
                    <Button key="create" type="primary" onClick={() => createForm.submit()}>Create</Button>,
                ]}
            >
                <ClassForm
                    onSuccess={handleSuccessCreate}
                    onCancel={handleCancelCreate}
                    form={createForm}
                    showActions={false} />
            </Modal>
        </>
    );
};

export default ClassQuickActions;

