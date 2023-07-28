import { Card, Typography } from 'antd';
import { ShopTwoTone } from '@ant-design/icons';
const { Title, Text } = Typography;

const PackageCard = () => {
    return (
        <Card className='packageCard'>
            <Title level={3} className='package-title'>Paket</Title>
            <ShopTwoTone className='package-icon'/>
            <Text strong className='package-price'>Mtl. 30 Euro</Text>
            <br />
            <div className='packageCard-info'>
                <Text type='success'>Reservierungsverwaltung</Text>
                <Text type='secondary'>Geschäftsstatistik</Text>
                <Text type='secondary'>24/7 Support</Text>
            </div>
        </Card>
    );
};

export default PackageCard;
