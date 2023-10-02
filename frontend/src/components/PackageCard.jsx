import {Button, Card, Divider, Typography} from 'antd';
import {CheckCircleOutlined, ShopOutlined} from '@ant-design/icons';
import {useNavigate} from 'react-router-dom';

const {Title, Text} = Typography;

const PackageCard = ({service_package, viewState}) => {
    const includedServicesArray = service_package.included_services.split(',');
    const navigate = useNavigate(); // Router-History


    const handleGetStartedClick = () => {

        localStorage.setItem('selected_plan', JSON.stringify(service_package));

        navigate('/buy');
    };


    return (
        <Card className='packageCard'>
            {/* Title */}
            <Title level={2} className='package-title'>
                {service_package.plan_name}
            </Title>


            {/* Price */}
            <Title level={3} className='package-price' style={{color: '#1890ff', textAlign: 'left', width: '75%'}}>
                {service_package.price} € / Monat
            </Title>
            <Text style={{textAlign: 'left', width: '75%'}}>
                Abonnements können jederzeit gekündigt werden.

            </Text>
            <br/>

            {/* Button */}
            {/* wenn viewstate false ist soll der button angezeigt werden */}
            {viewState === false && (
            <Button type="primary" className='get-started-button' onClick={handleGetStartedClick}>
                Los Geht's
            </Button>
            )}
            {/* Divider */}
            <Divider/>

            {/* Services */}

            <div className='packageCard-info'
                 style={{minHeight: '100px'}}>  {/* Sie können die Höhe nach Bedarf anpassen */}
                <Title level={5} style={{textAlign: 'left'}} className={'services-signature'}>
                    Leistungen:
                </Title>
                {includedServicesArray.map((serviceObj) => (

                        <div key={serviceObj}
                             style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                            <CheckCircleOutlined style={{color: '#17B169'}}/>
                            <Text level={1} style={{marginLeft: '8px'}}>
                                {serviceObj}
                            </Text>
                        </div>

                ))}
            </div>

        </Card>

    )
        ;
};

export default PackageCard;
