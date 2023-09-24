import {Card, Descriptions, Typography} from 'antd';
import {useParams} from 'react-router-dom';
import {useState, useEffect} from 'react';
import {Elements} from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';
import PaymentForm from '../components/PaymentForm.jsx';

const {Title} = Typography;

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
    const {id} = useParams();
    const service_package = packages.find(pkg => pkg.id === Number(id));


    const PUBLIC_KEY = 'pk_test_51Npf9cH8ERUGOPnDJ0EBYRWpj0iVjzAvR8aswLVIBNnB4Qw39croBqRKLzma14Y2JeWU4PYOd7rxbtaDjSpUb9qT00FTk7mgvC'
    const stripeTestPromise = loadStripe(PUBLIC_KEY);


    return (
        <div style={{maxWidth: 600, margin: '0 auto'}}>
            <Title level={2}>Ihre Bestellung</Title>
            <Card>
                <Title level={4}>{service_package.title}</Title>
                <Descriptions column={1}>
                    <Descriptions.Item
                        label="Monatlicher Preis">{service_package.price_monthly} Euro</Descriptions.Item>
                    <Descriptions.Item label="Jährlicher Preis">{service_package.price_yearly} Euro</Descriptions.Item>
                    <Descriptions.Item label="Abonnementlänge">Ein Jahr</Descriptions.Item>
                </Descriptions>
            </Card>
            <Card style={{marginTop: 20}}>
                <Elements stripe={stripeTestPromise}>
                    <PaymentForm />
                </Elements>
            </Card>

        </div>
    );
};

export default BuyView;
