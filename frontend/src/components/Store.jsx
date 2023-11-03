import React, {useState, useEffect, useContext} from 'react';
import {Typography, Layout, Input, Select, Upload, Button, Modal, Form, Row, Col, Card, Space} from 'antd';
import {PlusOutlined} from '@ant-design/icons';
import {makeRequest} from "../api/api.js";
import {GET_BUSINESSINFORMATION, GET_BUSINESSTYPE} from "../api/endpoints.js";
import AuthContext from "../auth/AuthProvider.jsx";

const {Title} = Typography;
const {Content} = Layout;
const {Option} = Select;
const {confirm} = Modal;
const getBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
};

const Store = () => {

    const {authTokens} = useContext(AuthContext)

    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');
    const [fileList, setFileList] = useState([]);
    const [pdfList, setPdfList] = useState([]);


    const [loading, setLoading] = useState(true);
    const [typeList, setTypeList] = useState([]);
    const [initialState, setInitialState] = useState({
        businessName: "",
        businessType: "",
        openingFrom: "",
        openingTo: "",
        street: "",
        houseNumber: "",
        city: "",
        postalCode: "",
        phone: "",
        website: "",
        pdf: [],
        pictures: [],
    });

    const [editedData, setEditedData] = useState({
        businessName: "",
        businessType: "",
        openingFrom: "",
        openingTo: "",
        street: "",
        houseNumber: "",
        city: "",
        postalCode: "",
        phone: "",
        website: "",
        pdf: [],
        pictures: [],
    });

    const handleCancel = () => setPreviewOpen(false);


    useEffect(() => {
        console.log('test')
        const fetchData = async () => {
            console.log('test2')
            try {

                const response = await makeRequest('GET', GET_BUSINESSINFORMATION, {}, authTokens.access)
                console.log(response)

                setEditedData({
                    businessName: response.business_name,
                    businessType: response.business_type,
                    openingFrom: response.opening_from,
                    openingTo: response.opening_to,
                    street: response.street,
                    houseNumber: response.house_number,
                    city: response.city,
                    postalCode: response.postal_code,
                    phone: response.phone,
                    website: response.website,
                    pdf: response.pdfs,
                    pictures: response.pictures,


                })
                setInitialState({
                    businessName: response.business_name,
                    businessType: response.business_type,
                    openingFrom: response.opening_from,
                    openingTo: response.opening_to,
                    street: response.street,
                    houseNumber: response.house_number,
                    city: response.city,
                    postalCode: response.postal_code,
                    phone: response.phone,
                    website: response.website,
                    pdf: response.pdfs,
                    pictures: response.pictures,
                })


            } catch (e) {
                console.log(e);
            }

            try {

                const response = await makeRequest('GET', GET_BUSINESSTYPE, {}, authTokens.access)
                const newTypeList = response.map(item => item.business_type);
                setTypeList(newTypeList);
            } catch (e) {
                console.log(e);
            }

            setLoading(false)
        }
        fetchData()

    }, []);


    const handlePreview = async (file) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }

        setPreviewImage(file.url || file.preview);
        setPreviewOpen(true);
        setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
    };

    const handleChange = ({fileList}) => setFileList(fileList);

    const handlePdfChange = ({fileList}) => setPdfList(fileList);

    const uploadButton = (
        <div>
            <PlusOutlined/>
            <div style={{marginTop: 8}}>Upload</div>
        </div>
    );


    const handleInputChange = (name, value) => {
        setEditedData(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const dataHasChanged = JSON.stringify(initialState) !== JSON.stringify(editedData);


    const handleConfirmSave = async () => {
        const data = {
            businessName: editedData.businessName,
            businessType: editedData.businessType,
            openingFrom: editedData.openingFrom,
            openingTo: editedData.openingTo,
            street: editedData.street,
            houseNumber: editedData.houseNumber,
            city: editedData.city,
            postalCode: editedData.postalCode,
            phone: editedData.phone,
            website: editedData.website,
            pdf: editedData.pdf,
            pictures: editedData.pictures,


        }

        await makeRequest('POST', GET_BUSINESSINFORMATION, data, authTokens.access)
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
            <Title level={3} className={'dashboard-title'}>Geschäft</Title>
            <Content style={{padding: '0 30px', color: 'black'}}>
                <Card loading={loading}>
                    <Form layout="vertical">
                        <Title level={4} style={{float: 'left'}}>Allgemein</Title>
                        <Row gutter={16}>
                            <Col xs={24} sm={24} md={12}>
                                <Form.Item label="Geschäftsname"
                                           rules={[{required: true, message: 'Bitte Geschäftsname eingeben'}]}>
                                    <Input
                                        value={editedData.businessName}
                                        onChange={e => handleInputChange('businessName', e.target.value)}
                                    />
                                </Form.Item>
                            </Col>
                            <Col xs={24} sm={24} md={12}>
                                <Form.Item label="Art des Geschäftes"
                                           rules={[{required: true, message: 'Bitte Geschäftsart auswählen'}]}>
                                    <Select defaultValue={editedData.businessType} style={{width: '100%'}}
                                            onChange={value => handleInputChange('businessType', value)}>
                                        {typeList.map(type => (
                                            <Option key={type} value={type}>{type}</Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col xs={24} sm={24} md={12}>
                                <Form.Item label="Telefon" rules={[
                                    {required: true, message: 'Bitte Telefonnummer eingeben'},
                                    {
                                        pattern: /^[0-9+\-() ]+$/,
                                        message: 'Bitte eine gültige Telefonnummer eingeben'
                                    }
                                ]}>
                                    <Input
                                        value={editedData.phone}
                                        onChange={e => handleInputChange('phone', e.target.value)}
                                    />
                                </Form.Item>
                            </Col>
                            <Col xs={24} sm={24} md={12} style={{textAlign: 'left'}}>
                                <Form.Item label="Öffnungszeiten">
                                    <div style={{display: 'flex', flexDirection: 'row', gap: '15px'}}>
                                        <div style={{display: 'flex', gap: '10px', alignItems: 'center'}}>
                                            <span>Von: </span>
                                            <Select
                                                defaultValue={editedData.openingFrom ? parseInt(editedData.openingFrom) : undefined}
                                                style={{width: '90px'}}
                                                onChange={value => handleInputChange('openingFrom', value)}>

                                                {Array.from({length: 24}, (_, i) => (
                                                    <Option key={i} value={i}>{i}:00</Option>
                                                ))}

                                            </Select>
                                        </div>
                                        <div style={{display: 'flex', gap: '10px', alignItems: 'center'}}>
                                            <span style={{margin: '0 1%'}}>bis:</span>
                                            <Select
                                                defaultValue={editedData.openingTo ? parseInt(editedData.openingTo) : undefined}
                                                style={{width: '90px'}}
                                                onChange={value => handleInputChange('openingTo', value)}>

                                                {Array.from({length: 24}, (_, i) => (
                                                    <Option key={i} value={i}>{i}:00</Option>
                                                ))}

                                            </Select>
                                        </div>
                                    </div>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Title level={4} style={{float: 'left'}}>Adresse</Title>
                        <Row gutter={16}>
                            <Col xs={24} sm={24} md={10}>
                                <Form.Item label="Straße"
                                           rules={[{required: true, message: 'Bitte Straße eingeben'}]}>
                                    <Input
                                        value={editedData.street}
                                        onChange={e => handleInputChange('street', e.target.value)}
                                    />
                                </Form.Item>
                            </Col>
                            <Col xs={24} sm={24} md={2}>
                                <Form.Item label="Nr." rules={[
                                    {required: true, message: 'Bitte Hausnummer eingeben'},
                                    {pattern: /^[0-9]*$/, message: 'Nur Zahlen erlaubt'}
                                ]}>
                                    <Input
                                        value={editedData.houseNumber}
                                        onChange={e => handleInputChange('houseNumber', e.target.value)}
                                    />
                                </Form.Item>
                            </Col>
                            <Col xs={24} sm={24} md={5}>
                                <Form.Item label="Ort" rules={[{required: true, message: 'Bitte Ort eingeben'}]}>
                                    <Input
                                        value={editedData.city}
                                        onChange={e => handleInputChange('city', e.target.value)}
                                    />
                                </Form.Item>
                            </Col>
                            <Col xs={24} sm={24} md={5}>
                                <Form.Item label="Postleitzahl" rules={[
                                    {required: true, message: 'Bitte Postleitzahl eingeben'},
                                    {pattern: /^[0-9]{5}$/, message: 'Genau 5 Zahlen erlaubt'}
                                ]}>
                                    <Input
                                        value={editedData.postalCode}
                                        onChange={e => handleInputChange('postalCode', e.target.value)}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Title level={4} style={{float: 'left'}}>Weiteres</Title>
                        <Row gutter={16}>
                            <Col xs={24} sm={24} md={12}>
                                <Form.Item label="Webseite" rules={[
                                    {required: true, message: 'Bitte Webseite eingeben'},
                                    {type: 'url', message: 'Bitte eine gültige Webseite eingeben'}
                                ]}>
                                    <Input
                                        value={editedData.website}
                                        onChange={e => handleInputChange('website', e.target.value)}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col xs={24} sm={24} md={24}>
                                <Form.Item label="PDF" style={{textAlign: 'left'}}>
                                    <Upload
                                        listType="picture-card"
                                        accept=".pdf"
                                        fileList={pdfList}
                                        onChange={handlePdfChange}
                                        beforeUpload={() => false}
                                    >
                                        {pdfList.length >= 5 ? null : uploadButton}
                                    </Upload>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col xs={24} sm={24} md={24}>
                                <Form.Item label="Bilder" style={{textAlign: 'left'}}>
                                    <Upload
                                        listType="picture-card"
                                        fileList={fileList}
                                        onPreview={handlePreview}
                                        onChange={handleChange}
                                        beforeUpload={() => false}
                                    >
                                        {fileList.length >= 5 ? null : uploadButton}
                                    </Upload>
                                    <Modal open={previewOpen} title={previewTitle} footer={null}
                                           onCancel={handleCancel}>
                                        <img alt="example" style={{width: '100%'}} src={previewImage}/>
                                    </Modal>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Form.Item>
                            <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                                <Button type={'primary'} style={{width: '200px'}} onClick={showModal}
                                        disabled={!dataHasChanged} block>Änderungen
                                    speichern</Button>

                            </div>
                        </Form.Item>
                    </Form>

                </Card>

            </Content>
        </>
    );
};

export default Store;
