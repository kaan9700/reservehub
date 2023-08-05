import {Card, Button, List, Typography, Divider, Collapse} from 'antd';
import React from 'react';

const {Title, Paragraph, Text} = Typography;
const {Panel} = Collapse;
import {useParams, useNavigate} from 'react-router-dom';
import HeaderText from "../components/HeaderText";


const packages = [
    {
        'id': 63456345345,
        'title': 'Basis Paket',
        'price_monthly': 25,
        'price_yearly': 250,
        'services': [
            {
                'name': 'Reservierungsverwaltung',
                'included': true,
                'description': 'Hier ist die Beschreibung für Reservierungsverwaltung'
            },
            {
                'name': 'Geschäftsstatistik',
                'included': false,
                'description': 'Hier ist die Beschreibung für Geschäftsstatistik'
            },
            {
                'name': 'Geschäftspromotion',
                'included': false,
                'description': 'Hier ist die Beschreibung für Geschäftspromotion'
            },
            {'name': '24/7 Support', 'included': false, 'description': 'Hier ist die Beschreibung für 24/7 Support'},

        ]
    },
    {
        'id': 123123123,
        'title': 'Premium Paket',
        'price_monthly': 30,
        'price_yearly': 320,
        'services': [
            {
                'name': 'Reservierungsverwaltung',
                'included': true,
                'description': 'Hier ist die Beschreibung für Reservierungsverwaltung'
            },
            {
                'name': 'Geschäftsstatistik',
                'included': true,
                'description': 'Hier ist die Beschreibung für Geschäftsstatistik'
            },
            {
                'name': 'Geschäftspromotion',
                'included': true,
                'description': 'Hier ist die Beschreibung für Geschäftspromotion'
            },
            {'name': '24/7 Support', 'included': false, 'description': 'Hier ist die Beschreibung für 24/7 Support'},
        ]
    }
];
const ServiceInfo = () => {
    const {id} = useParams();
    const navigate = useNavigate();
    const service_package = packages.find(pkg => pkg.id === Number(id));

    const handleBuy = () => {
        localStorage.setItem('selectedPackage', id);
        navigate(`/buy/${id}`);
    }

    return (
        <div style={{maxWidth: 800, margin: '0 auto'}}>
            <HeaderText title={service_package.title}/>
            <Paragraph>
                Das {service_package.title} bietet Ihnen folgende Vorteile:
            </Paragraph>
            <List
                itemLayout="horizontal"
                dataSource={service_package.services}
                bordered
                renderItem={service => (
                    <List.Item>
                        <List.Item.Meta
                            title={service.included ?
                                <Collapse ghost items={[{

                                    key: '1',
                                    label: <Text style={{ color: 'green' }}>
                                        {service.name} (Inklusive)
                                        </Text>,
                                    children: <p>{service.name} - {service.description}</p>
                                }]}/>


                                :
                                <Text style={{color: 'grey'}}>
                                    {service.name} (nicht inklusive)
                                </Text>
                            }
                        />
                    </List.Item>
                )}
            />
            <Divider/>
            <Paragraph>
                <Text strong>Monatlicher Preis: </Text> {service_package.price_monthly} Euro
            </Paragraph>
            <Paragraph>
                <Text strong>Jährlicher Preis: </Text> {service_package.price_yearly} Euro
            </Paragraph>
            <Button type="primary" size="large" onClick={handleBuy}>Kaufen</Button>
        </div>
    );
};

export default ServiceInfo;