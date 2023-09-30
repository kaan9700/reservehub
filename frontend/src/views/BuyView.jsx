import {Card, Descriptions, Typography} from 'antd';
import {useNavigate, useParams} from 'react-router-dom';
import {useState, useEffect} from 'react';
import Notifications from "../components/Notifications.jsx";
import PackageCard from "../components/PackageCard.jsx";

const {Title} = Typography;


const BuyView = () => {
    const {id} = useParams();
    const [service_package, setServicePackage] = useState(null);
    const navigate = useNavigate(); // Router-History


    useEffect(() => {
        if (!service_package) {
            const storedPlan = localStorage.getItem('selected_plan');
            if (storedPlan) {
                setServicePackage(JSON.parse(storedPlan));
            } else {
                navigate('/services');
            }
            return;
        }
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


    }, [service_package]);


    if (!service_package) {
        return <div>Loading...</div>; // Oder eine andere Meldung/Fehlerseite
    }

    return (
        <div style={{maxWidth: 600, margin: '0 auto'}}>
            <Title level={2}>Ihre Bestellung</Title>
            <PackageCard service_package={service_package}/>
            <Card style={{marginTop: 20}}>
                <div id="paypal-button-container-P-2FL68816J8692583GMUK5T4A"></div>
            </Card>
        </div>
    );
};

export default BuyView;




