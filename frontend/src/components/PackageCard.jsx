import { Card, Typography } from 'antd';
import { ShopOutlined } from '@ant-design/icons';
const { Title, Text } = Typography;

const PackageCard = ({service_package}) => {
    console.log(service_package)

    return (
        <Card className='packageCard'>
            
            <Title level={3} className='package-title'>{service_package.plan_name}</Title>
            <ShopOutlined className='package-icon'/>
            <br />
            <Text strong className='package-price'>mtl. {service_package.price} €</Text>
            <br />
            <div className='packageCard-info'>

            </div>
        </Card>
    );
};

export default PackageCard;
