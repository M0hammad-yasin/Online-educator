import ClassList from "../../module/classes/components/classList/ClassList";
import ClassFilters from "../../module/classes/components/classList/ClassFilters";
import ClassPerDayChart from "../../module/classes/components/ClassGraph/ClassPerDayChart";
import ClassLiveList from "../../module/classes/components/ClassLiveList";
import ClassMiniStatsRow from "../../module/classes/components/ClassMiniStatsRow";
import ClassQuickActions from "../../module/classes/components/ClassQuickActions";
import { Row, Col } from "antd";

const ClassPage: React.FC = () => {
  return (
    <>
      <Row gutter={[12, 12]} align="stretch" justify={'space-between'} >
        <Col xs={24} md={16}>
          <ClassQuickActions />
        </Col>
        <Col xs={24} md={8}>
          <ClassMiniStatsRow />
        </Col>
      </Row>
      <div style={{ margin: "24px 0" }} />
      <Row gutter={[16, 16]} >
        <Col xs={24} md={10}>
          <ClassLiveList />
        </Col>
        <Col xs={24} md={14}>
          <ClassPerDayChart />
        </Col>
      </Row>
      <Row gutter={[16, 16]}>
        <Col xs={24}>
          <ClassFilters />
        </Col>
      </Row>
      <Row gutter={[16, 16]}>
        <Col xs={24}>
          <ClassList />
        </Col>
      </Row>
      
    </>
  );
};
export default ClassPage;