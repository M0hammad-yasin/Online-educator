import ClassForm from "../../module/classes/components/ClassForm";
import ClassList from "../../module/classes/components/ClassList";
import ClassFilters from "../../module/classes/components/ClassFilters";
import ClassPerDayChart from "../../module/classes/components/ClassPerDayChart";
import ClassLiveList from "../../module/classes/components/ClassLiveList";
import ClassMiniStatsRow from "../../module/classes/components/ClassMiniStatsRow";
import ClassQuickActions from "../../module/classes/components/ClassQuickActions";
import { Row, Col } from "antd";

const ClassPage: React.FC = () => {
  return (
    <div>
       <Row gutter={[16,16]} >
        <Col xs={24} md={5}>
          <ClassMiniStatsRow />
        </Col>
        <Col xs={24} md={9}>
          <ClassLiveList />
        </Col>
        <Col xs={24} md={10}>
          <ClassPerDayChart />
        </Col>
      </Row>
      <Row gutter={[16,16]}>
        <Col xs={24}>
          <ClassFilters />
        </Col>
      </Row>
      <Row gutter={[16,16]}>
        <Col xs={24}>
          <ClassList />
        </Col>
      </Row>
      <Row gutter={[16,16]} justify="end">
        <Col xs={24} md={16}>
          <ClassQuickActions />
        </Col>
      </Row>
    </div>
  );
};
export default ClassPage;