import {Card, Descriptions, Typography} from 'antd';
import {useParams} from 'react-router-dom';
import {useState, useEffect} from 'react';
import Notifications from "../components/Notifications.jsx";


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


    useEffect(() => {
        const script = document.createElement('script');
        script.src = "https://www.paypal.com/sdk/js?client-id=AVmmlXnLZTZbx-UU-qcEon100jYuvqJ8_LZb33g8Zj8rEtEHsuxbEzd3rPsT9eF40Jhg4X5RAlA1TqvL&vault=true&intent=subscription";
        script.onload = () => {
            if (document.getElementById('paypal-button-container-P-2FL68816J8692583GMUK5T4A')) {
                window.paypal.Buttons({
                    style: {
                        shape: 'rect',
                        color: 'black',
                        layout: 'vertical',
                        label: 'subscribe'
                    },
                    createSubscription: function (data, actions) {
                        return actions.subscription.create({
                            'plan_id': 'P-2FL68816J8692583GMUK5T4A'
                        });
                    },

                    onApprove: function (data, actions) {
                        return actions.subscription.get().then(details => {
                            Notifications('success', {
                            'message': "Zahlungsvorgang erfolgreich!",
                            'description': "Bitte check deine Mails nach einer Buchungsbestätigung"
                        });
                        });
                    },

                    onCancel: function (data) {
                        Notifications('warning', {
                            'message': "Zahlungsvorgang wurde abgebrochen",
                            'description': "Bitte erneut versuchen"
                        });
                    },
                    onError: function (err) {
                        Notifications('error', {
                            'message': "Ein Fehler ist aufgetreten",
                            'description': "Bitte check deine Mails nach einer Buchungsbestätigung oder versuche es erneut."
                        });
                    }
                }).render('#paypal-button-container-P-2FL68816J8692583GMUK5T4A');
            }
        }; // 3F8DR5FHWC74
        document.body.appendChild(script);
        return () => {
            document.body.removeChild(script);
        }
    }, []);


    return (
        <div style={{maxWidth: 600, margin: '0 auto'}}>
            <Title level={2}>Ihre Bestellung</Title>
            <Card>
                <Card>
                    <Title level={4}>{service_package.title}</Title>
                    <Descriptions column={1}>
                        <Descriptions.Item
                            label="Monatlicher Preis">{service_package.price_monthly} Euro</Descriptions.Item>
                        <Descriptions.Item
                            label="Jährlicher Preis">{service_package.price_yearly} Euro</Descriptions.Item>
                        <Descriptions.Item label="Abonnementlänge">Ein Jahr</Descriptions.Item>
                    </Descriptions>
                </Card>
            </Card>
            <Card style={{marginTop: 20}}>
                <div id="paypal-button-container-P-2FL68816J8692583GMUK5T4A"></div>
            </Card>
        </div>
    );
};

export default BuyView;



