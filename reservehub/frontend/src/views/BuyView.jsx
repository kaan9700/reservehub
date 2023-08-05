import {Card, Descriptions, Typography} from 'antd';
import {useParams} from 'react-router-dom';
import React, { useEffect } from 'react';

const { Title } = Typography;

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

const BuyView = () => {
    const { id } = useParams();
    const service_package = packages.find(pkg => pkg.id === Number(id));

    useEffect(() => {
        const script = document.createElement('script');
        script.src = "https://www.paypal.com/sdk/js?client-id=AVmmlXnLZTZbx-UU-qcEon100jYuvqJ8_LZb33g8Zj8rEtEHsuxbEzd3rPsT9eF40Jhg4X5RAlA1TqvL&vault=true&intent=subscription";
        script.onload = () => {
            window.paypal.Buttons({
                style: {
                    shape: 'rect',
                    color: 'black',
                    layout: 'vertical',
                    label: 'subscribe'
                },
                createSubscription: function(data, actions) {
                    return actions.subscription.create({
                        'plan_id': 'P-4BC606410U8165602MTGZIXQ'
                    });
                },
                onApprove: function(data, actions) {
                    alert(data.subscriptionID);
                }
            }).render('#paypal-button-container-P-4BC606410U8165602MTGZIXQ');
        };
        document.body.appendChild(script);
        return () => {
            document.body.removeChild(script);
        }
    }, []);

    return (
        <div style={{maxWidth: 600, margin: '0 auto'}}>
            <Title level={2}>Ihre Bestellung</Title>
            <Card>
                <Title level={4}>{service_package.title}</Title>
                <Descriptions column={1}>
                    <Descriptions.Item label="Monatlicher Preis">{service_package.price_monthly} Euro</Descriptions.Item>
                    <Descriptions.Item label="Jährlicher Preis">{service_package.price_yearly} Euro</Descriptions.Item>
                    <Descriptions.Item label="Abonnementlänge">Ein Jahr</Descriptions.Item>
                </Descriptions>
            </Card>
            <div id="paypal-button-container-P-4BC606410U8165602MTGZIXQ" style={{marginTop: 30}}></div>
        </div>
        );
};

export default BuyView;
