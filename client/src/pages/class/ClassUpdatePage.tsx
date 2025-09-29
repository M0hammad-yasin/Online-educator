import React, { useEffect } from "react";
import { Row, Col, Card,Modal } from "antd";
import UpdateClass from "../../module/classes/components/updateClass/UpdateClass";
import { useParams,useNavigate } from "react-router-dom";
const ClassUpdatePage: React.FC = () => {
  let { id } = useParams<{ id: string }>();

  const navigate = useNavigate();
  useEffect(() => {
    if (!id) {
      Modal.warning({
        title: 'Invalid Request',
        content: 'No class ID was provided. You will be redirected to the classes page.',
        okText: 'Okay',
        onOk: () => navigate('/classes'),
      });
    }
  }, [id, navigate]);

  if (!id) return null; // prevents rendering UpdateClass when id is missing

  return (
    <Row gutter={[16, 16]} justify="center">
      <Col xs={24} md={20} lg={18}>
        <Card title="Update Class" bordered={false}>
          <UpdateClass classId={id} />
        </Card>
      </Col>
    </Row>
  );
};

export default ClassUpdatePage;