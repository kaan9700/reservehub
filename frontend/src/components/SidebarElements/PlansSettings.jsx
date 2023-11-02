import React, {useState, useEffect, useRef, useContext} from 'react';
import {
    Card,
    Typography,
    Col,
    Row,
    Tag,
    Button,
    Popconfirm,
    Form,
    Input,
    InputNumber,
    Select,
    Modal,
    Divider,
    List,
    Switch
} from 'antd';
import {DeleteOutlined, EditOutlined, SaveOutlined, CloseOutlined, PlusOutlined,} from '@ant-design/icons';
import {makeRequest} from "../../api/api.js";
import {GET_PLANS, GET_SERVICES} from "../../api/endpoints.js";
import AuthContext from "../../auth/AuthProvider.jsx";
import DataEditor from "../DataEditor.jsx";

const {Title, Text} = Typography;
const {Option} = Select;

const PlansSettings = () => {
    const [editingPlan, setEditingPlan] = useState(null);
    const [formValues, setFormValues] = useState({});
    const [plans, setPlans] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [reload, setReload] = useState(false);
    const formRef = useRef(null);
    const [services, setServices] = useState([]);
    const [editingService, setEditingService] = useState(null);
    const [isServiceModalVisible, setIsServiceModalVisible] = useState(false);
    const [formValuesService, setFormValuesService] = useState({});
    const serviceFormRef = useRef(null);
    const [reloadService, setReloadService] = useState(false);
    const [availableServices, setAvailableServices] = useState([]);
    const {authTokens} = useContext(AuthContext)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await makeRequest('GET', GET_PLANS, {}, authTokens.access);

                const updatedData = data.map(plan => {
                    if (plan.included_services) {
                        // Umwandeln des Komma-getrennten Strings zurück in eine Liste
                        plan.included_services = plan.included_services.split(',');
                    }
                    return plan;
                });

                setPlans(updatedData);
            } catch (error) {
                console.error('Fehler beim Abrufen der Pläne:', error);
            }
        };

        fetchData();
    }, [reload]);


    useEffect(() => {
        const fetchServices = async () => {
            try {
                const serviceData = await makeRequest('GET', GET_SERVICES);
                const AvailableServicesList = serviceData.map(service => service.service);

                const updatedServiceData = serviceData.map(service => {
                    if (service.some_field) {
                        // Verarbeitung spezifischer Felder, wenn nötig
                    }
                    return service;
                });


                setServices(updatedServiceData);
                setAvailableServices(AvailableServicesList)
            } catch (error) {
                console.error('Fehler beim Abrufen der Dienste:', error);
            }
        };

        fetchServices();
    }, [reloadService]);


    const handleDeletePlan = async (planId) => {

        try {

            const payload = {
                method: 'delete',
                plan_id: planId
            };

            // Senden Sie die DELETE-Anfrage
            await makeRequest('POST', GET_PLANS, payload);

            // Erfolgreich gelöscht. Aktualisieren Sie den Zustand.

            // Zustand ändern, um den useEffect auszulösen und die Liste zu aktualisieren
            setReload(!reload);

        } catch (error) {
            console.error('Komplettes Fehlerobjekt:', JSON.stringify(error, null, 2));
            console.error('Fehler beim Löschen des Plans:', error);
        }
    };


    const handleEditPlan = (plan) => {
        setFormValues(plan);
        setEditingPlan(plan);
    };


    const handleSavePlan = async () => {

        const old_plan_id = editingPlan ? editingPlan.plan_id : null;

        try {
            // Stellen Sie sicher, dass `old_plan_id` und `formValues` die notwendigen Daten enthalten
            const payload = {
                method: 'change',
                old_plan_id: old_plan_id,
                new_data: formValues
            };

            const updatedPlan = await makeRequest('POST', GET_PLANS, payload);

            // Hier können Sie den Zustand aktualisieren, um die Änderungen widerzuspiegeln.
            const updatedPlans = plans.map(plan => plan.plan_id === old_plan_id ? updatedPlan : plan);
            setPlans(updatedPlans);

        } catch (error) {
            console.error('Fehler beim Aktualisieren des Plans:', error);
        }

        setEditingPlan(null);
        setReload(!reload);
    };


    const handleCancelEdit = () => {
        setEditingPlan(null);
    };


    const handleFormChange = changedFields => {
        setFormValues({
            ...formValues,
            ...changedFields,
            old_plan_id: editingPlan?.plan_id // Fügen Sie den aktuellen plan_id als old_plan_id hinzu
        });
    };


    const showModal = () => {
        setIsModalVisible(true);
    };


    const handleOk = async () => {
        try {
            const data = {
                method: 'add',
                ...formValues
            };

            await makeRequest('POST', GET_PLANS, data);


            // Aktualisieren Sie den lokalen Zustand nur, wenn der API-Aufruf erfolgreich war
            setPlans([...plans, formValues]);

            setIsModalVisible(false);
            setFormValues({});
            if (formRef.current) {
                formRef.current.resetFields();
            }
        } catch (error) {
            console.error("Failed to add plan:", error);
        }
    };


    const handleCancel = () => {
        setIsModalVisible(false);
    };


    const handleDeleteService = async (serviceId) => {
        try {
            const payload = {
                method: 'delete',
                service_id: serviceId
            };
            await makeRequest('POST', GET_SERVICES, payload);
            setReloadService(!reloadService);
        } catch (error) {
            console.error('Fehler beim Löschen des Dienstes:', error);
        }
    };


    const handleEditService = (service) => {
        setFormValuesService(service);
        setEditingService(service);
    };


    const handleSaveService = async () => {
        try {
            const payload = {
                method: 'change',
                old_data: editingService,
                new_data: formValuesService
            };
            console.log(payload)
            const updatedService = await makeRequest('POST', GET_SERVICES, payload);
            const updatedServices = services.map(service => service.id === editingService.id ? updatedService : service);
            setServices(updatedServices);
        } catch (error) {
            console.error('Fehler beim Aktualisieren des Dienstes:', error);
        }
        setEditingService(null);
        setReloadService(!reloadService);
    };


    const handleCancelEditService = () => {
        setEditingService(null);
    };


    const handleServiceFormChange = (changedFields) => {
        setFormValuesService({
            ...formValuesService,
            ...changedFields
        });
    };


    const showServiceModal = () => {
        setIsServiceModalVisible(true);
    };


    const handleServiceOk = async () => {
        try {
            const data = {
                method: 'add',
                ...formValuesService
            };
            await makeRequest('POST', GET_SERVICES, data);
            setServices([...services, formValuesService]);
            setIsServiceModalVisible(false);
            setFormValuesService({});
            if (serviceFormRef.current) {
                serviceFormRef.current.resetFields();
            }
        } catch (error) {
            console.error("Failed to add service:", error);
        }
    };


    const handleServiceCancel = () => {
        setIsServiceModalVisible(false);
    };


    return (
        <>
            <Title level={3} className={'dashboard-title'}
                   style={{textAlign: 'left', padding: '40px 0 0 40px'}}>Pläne</Title>

            <div className="card-container">
                {plans.map((plan, index) => (
                    <div className="card-wrapper" key={index}>
                        <Card
                            style={{
                                width: '450px',
                                height: editingPlan?.plan_id === plan.plan_id ? 'auto' : '300px',
                                padding: '20px',
                                textAlign: 'left'
                            }}
                            title={plan.plan_name}
                            bordered={true}
                            extra={
                                <>
                                    {editingPlan?.plan_id === plan.plan_id ? (
                                        <>
                                            <Button type="text" icon={<SaveOutlined/>} onClick={handleSavePlan}/>
                                            <Button type="text" icon={<CloseOutlined/>} onClick={handleCancelEdit}/>
                                        </>
                                    ) : (
                                        <>
                                            <Popconfirm
                                                title="Sind Sie sicher, dass Sie diesen Plan löschen möchten?"
                                                onConfirm={() => handleDeletePlan(plan.plan_id)} okText="Ja"
                                                cancelText="Nein">
                                                <Button type="text" icon={<DeleteOutlined/>}
                                                        style={{color: 'red'}}/>
                                            </Popconfirm>
                                            <Button type="text" icon={<EditOutlined/>}
                                                    onClick={() => handleEditPlan(plan)}/>
                                        </>
                                    )}
                                </>
                            }
                        >
                            {editingPlan?.plan_id === plan.plan_id ? (
                                <Form
                                    layout="vertical"
                                    onValuesChange={(changedFields) => handleFormChange(changedFields)}
                                    initialValues={plan}
                                >
                                    <Form.Item label="Plan Name" name="plan_name">
                                        <Input/>
                                    </Form.Item>
                                    <Form.Item label="Plan-ID" name="plan_id">
                                        <Input/>
                                    </Form.Item>
                                    <Form.Item label="Preis" name="price">
                                        <InputNumber/>
                                    </Form.Item>
                                    <Form.Item label="Beschreibung" name="description">
                                        <Input/>
                                    </Form.Item>
                                    <Form.Item label="Aktiv" name="active">
                                        <Switch defaultChecked={editingPlan.active}/>
                                    </Form.Item>
                                    <Form.Item label="Beinhaltende Dienste" name="included_services">
                                        <Select mode="multiple" style={{width: '100%'}}>
                                            {availableServices.map((service, idx) => (
                                                <Option key={idx} value={service}>
                                                    {service}
                                                </Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                </Form>
                            ) : (
                                <Row>
                                    <Col span={10} style={{textAlign: 'left'}}>
                                        <Text strong>Plan-ID:</Text><br/>
                                        <Text strong>Preis:</Text><br/>
                                        <Text strong>Beschreibung:</Text><br/>
                                        <Text strong>Aktiv:</Text><br/>
                                        <Text strong>Beinhaltende Dienste:</Text>

                                    </Col>
                                    <Col span={14} style={{textAlign: 'left'}}>
                                        <Text code>{plan.plan_id}</Text><br/>
                                        <Text>{plan.price} €</Text><br/>
                                        <Text>{plan.description}</Text><br/>
                                        <Text>{plan.active ?
                                            <Tag color="green" key={plan.active}>
                                                Aktiviert
                                            </Tag>
                                            :

                                            <Tag color="red" key={plan.active}>
                                                Deaktiviert
                                            </Tag>}
                                        </Text><br/>
                                        <div>
                                            {plan.included_services && Array.isArray(plan.included_services) ? (
                                                plan.included_services.map((service, idx) => (
                                                    <Tag color="blue" key={idx}>
                                                        {service}
                                                    </Tag>
                                                ))
                                            ) : (
                                                <p>Keine inkludierten Services.</p>
                                            )}
                                        </div>

                                    </Col>
                                </Row>
                            )}
                        </Card>
                    </div>
                ))}
                <Button type="primary" icon={<PlusOutlined/>} onClick={showModal} style={{margin: '20px 0 20px 40px'}}>
                    Neuer Plan
                </Button>
                <Modal title="Neuer Plan erstellen" open={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
                    <Form layout="vertical" ref={formRef}
                          onValuesChange={(changedFields) => handleFormChange(changedFields)}>
                        <Form.Item label="Plan Name" name="plan_name">
                            <Input/>
                        </Form.Item>
                        <Form.Item label="Plan-ID" name="plan_id">
                            <Input/>
                        </Form.Item>
                        <Form.Item label="Preis" name="price">
                            <InputNumber/>
                        </Form.Item>
                        <Form.Item label="Beschreibung" name="description">
                            <Input/>
                        </Form.Item>
                        <Form.Item label="Beinhaltende Dienste" name="included_services">
                            <Select mode="multiple" style={{width: '100%'}}>
                                {availableServices.map((service, idx) => (
                                    <Option key={idx} value={service}>
                                        {service}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Form>
                </Modal>
                <Divider/>
                <div className={'services-edit-wrapper'}>
                    <Title level={3} className={'dashboard-title'}
                           style={{textAlign: 'left', padding: '0 0 0 40px'}}>Dienste</Title>
                   <DataEditor ENDPOINT={GET_SERVICES}/>
                </div>
            </div>
        </>
    );
};

export default PlansSettings;
