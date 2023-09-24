import React from 'react';
import { Layout, Col, Row, Typography } from 'antd';

const { Footer } = Layout;
const { Title, Link } = Typography;

const AppFooter = () => {
  return (
    <Footer style={{ padding: '10px 30px', background: 'white', color: '#595959' }} className={'footer'}>
      <Row gutter={16} style={{ display: 'flex', alignItems: 'center' }}>
        <Col span={12}>
          <Title level={5} style={{ color: '#595959', margin: '0px' }}>
            <Link href="/terms-of-use" target="_blank" rel="noopener noreferrer">
              Terms of Use
            </Link>
          </Title>
        </Col>
        <Col span={12}>
          <Title level={5} style={{ color: '#595959', margin: '0px' }}>
            <Link href="/privacy-policy" target="_blank" rel="noopener noreferrer">
              Privacy Policy
            </Link>
          </Title>
        </Col>
      </Row>
    </Footer>
  );
};

export default AppFooter;
