
import { Button, Card, Col, Row, Typography } from 'antd';
import SideBar from "../SideBar.jsx";

const { Text } = Typography;

const Superadmin = () => {
  return (
    <>
    <SideBar />
    <div style={{ display: 'flex', height: '100vh' }}>
      <Row align="middle" style={{ width: '100%' }}>
        <Col span={12}>
          <Card title="Persönliche Informationen" style={{ width: '80%', marginLeft: '10%', marginRight: '10%', marginBottom: '20px', textAlign: 'left' }}>
            <Text style={{ display: 'block', marginBottom: '10px', textAlign: 'left' }}>Name: Max Mustermann</Text>
            <Text style={{ display: 'block', marginBottom: '10px', textAlign: 'left' }}>Email: max.mustermann@example.com</Text>
            <Text style={{ display: 'block', marginBottom: '10px', textAlign: 'left' }}>Telefon: +49 123 4567890</Text>
          </Card>
        </Col>
        <Col span={12} style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', marginRight: '10%', marginBottom: '20px' }}>
          <Button type="primary" style={{ marginBottom: '10px', width: '30%' }}>Neuer Admin</Button>
          <Button type="primary" danger style={{ width: '30%' }}>Admin Entfernen</Button>
        </Col>
      </Row>
    </div>
    </>

  );
}

export default Superadmin;
