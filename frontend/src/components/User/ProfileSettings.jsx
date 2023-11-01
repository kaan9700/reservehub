import React, {useContext, useEffect, useState} from 'react';
import {Card, Input, Typography, Button, Space, Form, Modal, Switch} from 'antd';
import {InfoCircleOutlined} from '@ant-design/icons';
import {GET_USERINFORMATION} from "../../api/endpoints.js";
import {makeRequest} from "../../api/api.js";
import AuthContext from "../../auth/AuthProvider.jsx";

const {Title} = Typography;
const {confirm} = Modal;

const ProfileSettings = () => {
    const {authTokens} = useContext(AuthContext)
    const [initialState, setInitialState] = useState({
        email: '',
        phone: '',
        newsletter: null,
        reservations: null,
        requests: null,
    });
    const [personalInformation, setPersonalInformation] = useState({
        email: '',
        phone: '',
        newsletter: null,
        reservations: null,
        requests: null,
    });

    useEffect(() => {
        const fetchData = async () => {
            try {

                const response = await makeRequest('GET', GET_USERINFORMATION, {}, authTokens.access)


                setPersonalInformation({
                    email: response.email,
                    phone: response.phone,
                    newsletter: response.newsletter_notifications,
                    reservations: response.reservation_notifications,
                    requests: response.requests_notifications,

                })
                setInitialState({
                    email: response.email,
                    phone: response.phone,
                    newsletter: response.newsletter_notifications,
                    reservations: response.reservation_notifications,
                    requests: response.requests_notifications,
                })


            } catch (e) {
                console.log(e);
            }
        }


        fetchData()
    }, []);


    const hasChanged = initialState.email !== personalInformation.email || initialState.phone !== personalInformation.phone || initialState.newsletter !== personalInformation.newsletter || initialState.reservations !== personalInformation.reservations || initialState.requests !== personalInformation.requests;

    const handleConfirmSave = async () => {
        const data =  {
            email: personalInformation.email,
            phone: personalInformation.phone,
            newsletter: personalInformation.newsletter,
            reservations: personalInformation.reservations,
            requests: personalInformation.requests,
        }
        console.log(data)
        const response = await makeRequest('POST', GET_USERINFORMATION, data, authTokens.access)

    };

    const showModal = () => {
        confirm({
            title: 'Änderungen bestätigen',
            content: 'Möchten Sie die Änderungen wirklich speichern?',
            okText: 'Ja',
            cancelText: 'Abbrechen',

            onOk() {
                handleConfirmSave()
            },
            onCancel() {
                console.log('Abgebrochen');
            },
        });
    };

    return (
        <>
            <Space direction="vertical" size={20} style={{width: '100%'}}>
                <Title level={3} className={'dashboard-title'}>Profil Einstellungen</Title>
                <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '20px',
                    justifyContent: 'space-between',
                    padding: '0 30px'
                }}>
                    <Card style={{flex: 1}} title="Persönliche Informationen"
                          className="responsive-card-profile-settings personal-information-settings">
                        <Form layout="vertical" className={'profile-settings-form'}>
                            <Form.Item label="E-Mail">
                                <Input
                                    className="input-width"
                                    value={personalInformation.email}
                                    onChange={(event) => setPersonalInformation(prev => ({
                                        ...prev,
                                        email: event.target.value
                                    }))}/>

                            </Form.Item>
                            <Form.Item label="Telefon">
                                <Input
                                    className="input-width"
                                    value={personalInformation.phone}
                                    onChange={(event) => setPersonalInformation(prev => ({
                                        ...prev,
                                        phone: event.target.value
                                    }))}/>
                            </Form.Item>
                            <Form.Item>
                                <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                                    <Button type={'primary'} style={{marginRight: '50px'}} onClick={showModal}
                                            disabled={!hasChanged} block>Änderungen
                                        speichern</Button>
                                    <Button type={'primary'} block>Passwort ändern</Button>
                                </div>
                            </Form.Item>
                        </Form>
                    </Card>
                    <Card style={{flex: 1}} title='E-Mail Benachrichtigungen'
                          className="responsive-card-profile-settings">
                        <Space className={'profil-settings-email-notification-spacer'} style={{width: '100%'}}>
                            <Form>
                                <div className="form-item-container">
                                    <span className="form-item-label">Reservierungen:</span>
                                    <Switch
                                        checked={personalInformation.reservations}
                                        onChange={(checked) => setPersonalInformation(prev => ({
                                            ...prev,
                                            reservations: checked
                                        }))}
                                    />
                                </div>
                                <div className="form-item-container">
                                    <span className="form-item-label">Anfragen:</span>
                                    <Switch
                                        checked={personalInformation.requests}
                                        onChange={(checked) => setPersonalInformation(prev => ({
                                            ...prev,
                                            requests: checked
                                        }))}
                                    />
                                </div>
                                <div className="form-item-container">
                                    <span className="form-item-label">Newsletter:</span>
                                    <Switch
                                        checked={personalInformation.newsletter}
                                        onChange={(checked) => setPersonalInformation(prev => ({
                                            ...prev,
                                            newsletter: checked
                                        }))}
                                    />
                                </div>
                            </Form>
                        </Space>
                    </Card>
                </div>

                <Space direction="vertical" size={20} align="start" style={{
                    display: 'flex',
                    flexDirection: "row",
                    alignItems: 'stretch',
                    width: '200px',
                    marginLeft: '30px'
                }}>
                    <Button type={'primary'} danger block>Abonnement kündigen</Button>
                    <Button type={'primary'} danger block>Account löschen</Button>
                </Space>
            </Space>
        </>
    );
};

export default ProfileSettings;
