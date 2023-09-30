// UserPage.jsx

import React, {useContext, useState} from 'react';
import {Card, Button, Typography, Divider, Descriptions, Modal, Input} from 'antd';
import {json, useNavigate} from 'react-router-dom';
import {ExclamationCircleFilled} from '@ant-design/icons';
import AuthContext from "../../auth/AuthProvider.jsx";
import Notifications from "../../components/Notifications.jsx";
import LoadingIcon from "../../components/Loader.jsx";

const {Title, Text} = Typography;
const {confirm} = Modal;


const User = ({users}) => {

    const navigate = useNavigate();
    const {user, deleteAccount, logoutUser} = useContext(AuthContext)
    const [loading, setLoading] = useState(false);
    const [activationCode, setActivationCode] = useState('');  // Neuer useState Hook für den Aktivierungscode
    const [codeError, setCodeError] = useState(null);  // Neuer useState Hook für Fehlermeldungen

    const handleDeleteUser = async () => {
        setLoading(true);
        if (user) {
            let response = await deleteAccount();
            Notifications('error', {'message': 'Fehler', 'description': response.message})

        } else {
            console.error("Auth dispatch function is undefined");
        }
        setLoading(false);
    };

    const handleActivatePro = () => {
        if (activationCode === '123456') {  // Dummy-Überprüfung
            console.log('Pro-Einstellungen aktiviert!');
            setCodeError(null);
        } else {
            setCodeError('Ungültiger Aktivierungscode.');
        }
    };

    const showModal = () => {
        confirm({
            title: 'Wollen Sie wirklich Ihren Account löschen?',
            icon: <ExclamationCircleFilled/>,
            content: 'Dieser Schritt kann nicht rückgängig gemacht werden.',
            okText: 'Ja',
            okButtonProps: {danger: true},
            cancelButtonProps: {autoFocus: false},
            cancelText: 'Abbrechen',
            centered: true,
            onOk() {
                handleDeleteUser()
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    };

    return (
        <div className={'standardUser-wrapper'} style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'start',
            height: '100%',
            backgroundColor: '#f0f2f5'
        }}>
            <Card className={'standardUser'}
                  style={{marginTop: '50px', width: '70%', boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)'}}>
                <Title level={2} style={{display: 'block'}}>Willkommen zurück!</Title>
                <Text style={{display: 'block', marginTop: '10px'}}>Es scheint, dass Sie momentan kein aktives Abo
                    haben.</Text>
                <Divider/>
                <Descriptions title="Benutzerinformationen" layout="vertical" bordered>
                    <Descriptions.Item label="E-Mail">{user.email}</Descriptions.Item>
                    <Descriptions.Item
                        label="Registriert seit">{new Date(user.registeredDate).toLocaleDateString()}</Descriptions.Item>
                    {/* Hier können Sie weitere Benutzerinformationen hinzufügen */}
                </Descriptions>

                <Divider/>
                <div style={{marginBottom: '20px'}}>
                    <Title level={4}>Aktivieren Sie Ihre Pro-Einstellungen</Title>
                    <div style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                    }}>
                        <Input
                            value={activationCode}
                            onChange={(e) => setActivationCode(e.target.value)}
                            placeholder="Aktivierungscode eingeben"
                            style={{marginRight: '10px'}}
                        />
                        <Button type="primary" onClick={handleActivatePro}>Aktivieren</Button>
                    </div>
                    {codeError && <Text type="danger" style={{marginTop: '10px'}}>{codeError}</Text>}
                    <div style={{marginBottom: '40px'}}></div>
                    <Button type="primary" size="large" onClick={() => navigate('/services')}>
                        Entdecken Sie unsere Dienste
                    </Button>
                </div>

                <Divider/>
                <Button type="primary" size="large" style={{marginLeft: '20px'}} onClick={showModal} danger>
                    {loading ? (
                        <LoadingIcon/>
                    ) : ('Account löschen')}
                </Button>

            </Card>
        </div>
    );

}

export default User;
