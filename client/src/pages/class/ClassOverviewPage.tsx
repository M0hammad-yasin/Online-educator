import React from "react";
import { Row, Col } from "antd";
import ClassMiniStatsRow from "../../module/classes/components/ClassMiniStatsRow";
import ClassPerDayChart from "../../module/classes/components/ClassGraph/ClassPerDayChart";
import ClassRecentActivities from "../../module/classes/components/ClassRecentActivities";
import ClassQuickActions from "../../module/classes/components/ClassQuickActions";
import ClassLiveList from "../../module/classes/components/ClassLiveList";

const ClassOverviewPage: React.FC = () => {
  return (
    <>
      <Row gutter={[12, 12]} align="stretch" justify="space-between">
        <Col xs={24} md={16}>
          <ClassQuickActions />
        </Col>
        <Col xs={24} md={8}>
          <ClassMiniStatsRow />
        </Col>
      </Row>
      <div style={{ margin: "24px 0" }} />
      <Row gutter={[16, 16]}>
        <Col xs={24} md={14}>
          <ClassPerDayChart />
        </Col>
        <Col xs={24} md={10}>
          <ClassLiveList />
        </Col>
      </Row>
    </>
  );
};

export default ClassOverviewPage;