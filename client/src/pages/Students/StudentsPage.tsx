import React, { useMemo } from 'react';
import { Card, Row, Col, theme as antdTheme } from 'antd';
import useAuthStore from '../../module/authentication/store/authStore';
import { Role } from '../../constants/role';
import { getVisibleWidgets } from './widgets/config';
import SummaryCards from './widgets/SummaryCards.tsx';
import FiltersBar from './widgets/FiltersBar.tsx';
import StudentList from './widgets/StudentList.tsx';

// removed useBreakpoint for now

const widgetRenderer: Record<string, React.FC> = {
  SummaryCards: SummaryCards,
  FiltersBar: FiltersBar,
  StudentList: StudentList,
};

const StudentsPage: React.FC = () => {
  const user = useAuthStore((s) => s.user);
  const { token } = antdTheme.useToken();
  // const screens = useBreakpoint();

  const role = user?.role ?? Role.TEACHER;
  const widgets = useMemo(() => getVisibleWidgets(role), [role]);

  const glassCardStyle: React.CSSProperties = {
    background: token.colorBgContainer,
    borderRadius: token.borderRadiusLG,
    boxShadow: token.boxShadow,
    backdropFilter: 'saturate(160%) blur(6px)',
    border: `1px solid ${token.colorBorderSecondary || token.colorBorder}`,
  } as React.CSSProperties;

  return (
    <div style={{ padding: token.paddingLG }}>
      <Row gutter={[token.size, token.sizeLG]}>
        {widgets.top.map((w) => {
          const Comp = widgetRenderer[w.key];
          if (!Comp) return null;
          return (
            <Col key={w.key} xs={24} sm={24} md={24} lg={24}>
              <Card style={glassCardStyle} variant={'borderless'} styles={{ body:{padding: token.paddingLG} }}>
                <Comp />
              </Card>
            </Col>
          );
        })}
      </Row>

      <div style={{ height: token.sizeSM }} />

      <Row gutter={[token.size, token.sizeLG]}>
        {widgets.main.map((w) => {
          const Comp = widgetRenderer[w.key];
          if (!Comp) return null;
          return (
            <Col key={w.key} xs={24} sm={24} md={24} lg={24}>
              <Card style={glassCardStyle} bordered={false}
               styles={{body:{ padding: token.paddingLG }}} >
                <Comp />
              </Card>
            </Col>
          );
        })}
      </Row>
    </div>
  );
};

export default StudentsPage;


