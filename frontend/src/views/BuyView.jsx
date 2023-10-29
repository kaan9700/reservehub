import {useNavigate, useParams} from 'react-router-dom';
import {useState, useEffect, useContext} from 'react';
import Notifications from "../components/Notifications.jsx";
import PackageCard from "../components/PackageCard.jsx";
import {Card, Divider, Typography, Space} from 'antd';
import AuthContext from "../auth/AuthProvider.jsx";
import {v4 as uuidv4} from 'uuid';
import {makeRequest} from "../api/api.js";
import {POST_TRANSACTION} from "../api/endpoints.js";

const {Title, Paragraph} = Typography;


const BuyView = () => {
    const {id} = useParams();
    const [service_package, setServicePackage] = useState(null);
    const navigate = useNavigate(); // Router-History
    const [loading, setLoading] = useState(false);
    const {user, authTokens} = useContext(AuthContext)
    const uniqueTransactionID = uuidv4();


    useEffect(() => {
        if (!user) {
            return navigate('/login?redirectTo=/buy');

        }

        if (user.role !== 'user') {
            Notifications('error', {'message': 'Fehler', 'description': 'Dieser Account hat bereits ein Abo!'})
            navigate('/user');
        }


        if (!service_package) {
            const storedPlan = localStorage.getItem('selected_plan');
            if (storedPlan) {
                setServicePackage(JSON.parse(storedPlan));
            } else {
                navigate('/services');
            }
            return;
        }
         async function prePaymentRequest() {
            try {
                const data = {
                    transaction_id: uniqueTransactionID,
                    plan_id: service_package.plan_id,
                    user_mail: user.email,
                };
                await makeRequest('POST', POST_TRANSACTION, data, authTokens.access);
            } catch (error) {
                console.error("Error during prePaymentRequest:", error);
            }
        }

        // Die Funktion aufrufen
        prePaymentRequest();

        const script = document.createElement('script');
        const clientID = import.meta.env.VITE_APP_PAYPAL_CLIENT_ID;
        script.src = "https://www.paypal.com/sdk/js?client-id=" + clientID + "&vault=true&intent=subscription";
        script.onload = () => {
            if (document.getElementById('paypal-button-container-' + service_package.plan_id)) {
                window.paypal.Buttons({
                    style: {
                        shape: 'rect',
                        color: 'black',
                        layout: 'vertical',
                        label: 'subscribe'
                    },
                    createSubscription: function (data, actions) {
                        return actions.subscription.create({
                            'plan_id': service_package.plan_id,
                            'custom_id': uniqueTransactionID
                        });
                    },

                    onApprove: function (data, actions) {
                        return actions.subscription.get().then(details => {
                            console.log(details);
                            Notifications('success', {
                                'message': "Zahlungsvorgang erfolgreich!",
                                'description': "Bitte check deine Mails nach einer Buchungsbestätigung."
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

                }).render('#paypal-button-container-' + service_package.plan_id);

            }
        };
        setLoading(false);
        document.body.appendChild(script);
        return () => {
            document.body.removeChild(script);
        }


    }, [service_package]);


    if (!service_package) {
        return <div>Loading...</div>; // Oder eine andere Meldung/Fehlerseite
    }

    return (
        <div style={{
            width: 600,
            maxWidth: "80%",
            margin: '0 auto',
            marginBottom: '75px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
        }}>
            <Title level={2} style={{marginTop: '20px'}}>Ihre Bestellung</Title>
            <PackageCard service_package={service_package} viewState={true}/>

            {/* Zusatzinformationen */}
            <Card style={{marginTop: 20}} className={'subscription-details'}>
                <Title level={4}>Abo-Details</Title>
                <Divider/>

                <Space direction="vertical" size="middle">
                    <div>
                        <Title level={5} style={{textAlign: 'left'}}>Aktivierungscode</Title>
                        <Paragraph style={{textAlign: 'justify'}}>
                            Nach einem erfolgreichen Kauf wird Ihnen ein Aktivierungscode an die E-Mail-Adresse Ihres
                            PayPal-Kontos gesendet. Dieser Code muss in Ihrem Nutzerprofil eingegeben werden.
                        </Paragraph>
                    </div>

                    <Divider/>

                    <div>
                        <Title level={5} style={{textAlign: 'left'}}>Automatische Erneuerung</Title>
                        <Paragraph style={{textAlign: 'justify'}}>
                            Das Abo wird automatisch erneuert und kann jederzeit für ab den Folgemonat in den
                            Profileinstellungen gekündigt werden.
                        </Paragraph>
                    </div>
                </Space>
            </Card>

            <Card style={{marginTop: 20}} loading={loading} className={'paypal-buttons'}>
                <div id={"paypal-button-container-" + service_package.plan_id}></div>

            </Card>
        </div>
    );

};

export default BuyView;




