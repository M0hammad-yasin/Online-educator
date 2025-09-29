import React from 'react';
import { Card, Col, Row, Statistic, theme as antdTheme, Flex, Tag } from 'antd';
import { useStudentCount } from '../../../module/student/hooks/useStudents';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const SummaryCards: React.FC = () => {
  const { token } = antdTheme.useToken();
  const { data, isLoading } = useStudentCount();

  const total = data?.data?.total ?? 0;
  const active = data?.data?.emailVerified ?? 0; // using verified as proxy for active
  const inactive = data?.data?.emailUnverified ?? 0;

  const chartData = [
    { name: 'Verified', value: active, color: token.colorSuccess },
    { name: 'Unverified', value: inactive, color: token.colorWarning },
  ];

  return (
    <Row gutter={[token.size, token.size]}>
      <Col xs={24} sm={12} md={8}>
        <Card bordered={false} bodyStyle={{ padding: token.paddingLG }}>
          <Statistic title="Total Students" value={total} loading={isLoading} />
        </Card>
      </Col>
      <Col xs={24} sm={12} md={8}>
        <Card bordered={false} bodyStyle={{ padding: token.paddingLG }}>
          <Flex align="center" gap={token.size}>
            <div style={{ width: 120, height: 120 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie dataKey="value" data={chartData} innerRadius={40} outerRadius={55} paddingAngle={2}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color as string} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div>
              <div style={{ marginBottom: 8 }}>
                <Tag color={token.colorSuccess}>Verified</Tag>
                <strong>{active}</strong>
              </div>
              <div>
                <Tag color={token.colorWarning}>Unverified</Tag>
                <strong>{inactive}</strong>
              </div>
            </div>
          </Flex>
        </Card>
      </Col>
      <Col xs={24} sm={24} md={8}>
        <Card bordered={false} bodyStyle={{ padding: token.paddingLG }}>
          <Statistic title="Verification Rate" suffix="%" precision={1} value={total ? (active / Math.max(total, 1)) * 100 : 0} loading={isLoading} />
        </Card>
      </Col>
    </Row>
  );
};

export default SummaryCards;


