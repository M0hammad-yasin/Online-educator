import React from "react";
import { Row, Col, Card } from "antd";
import ClassForm from "../../module/classes/components/ClassForm";

const ClassCreatePage: React.FC = () => {
  return (
    <Row gutter={[16, 16]} justify="center">
      <Col xs={24} md={20} lg={18}>
        <Card title="Create New Class" bordered={false}>
          <ClassForm />
        </Card>
      </Col>
    </Row>
  );
};

export default ClassCreatePage;