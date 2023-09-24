import { Card, Typography } from 'antd';
import { ShopOutlined } from '@ant-design/icons';
const { Title, Text } = Typography;

const PackageCard = ({service_package}) => {
    return (
        <Card className='packageCard'>
            
            <Title level={3} className='package-title'>Paket</Title>
            <ShopOutlined className='package-icon'/>
            <br />
            <Text strong className='package-price'>mtl. {service_package.price_monthly} €</Text>
            <br />
            <div className='packageCard-info'>
                {service_package.services.map((service) => (
                    <Text key={service.name} type={service.included ? 'success' : 'secondary'}>{service.name}</Text>
                ))}
            </div>
        </Card>
    );
};

export default PackageCard;
