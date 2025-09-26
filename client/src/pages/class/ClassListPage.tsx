import React from "react";
import { Row, Col } from "antd";
import ClassList from "../../module/classes/components/classList/ClassList";
import ClassFilters from "../../module/classes/components/classList/ClassFilters";

const ClassListPage: React.FC = () => {
  return (
    <>
      <Row gutter={[16, 16]}>
               <Col xs={24} >
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

export default ClassListPage;