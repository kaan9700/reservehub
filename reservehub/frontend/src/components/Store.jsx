import React, { useState, useEffect } from 'react';
import { Typography, Layout, Input, Select, Upload, Button, Modal, Form, Row, Col } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

const { Title } = Typography;
const { Content } = Layout;
const { Option } = Select;

const getBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
};

const Store = () => {
    const [originalData, setOriginalData] = useState({});
    const [editedData, setEditedData] = useState({
        businessName: "",
        businessType: "",
        street: "",
        houseNumber: "",
        postalCode: "",
        phone: "",
        website: "",
        pdf: [],
        pictures: [],
    });

    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');
    const [fileList, setFileList] = useState([]);
    const [pdfList, setPdfList] = useState([]);

    const handleCancel = () => setPreviewOpen(false);

    const handlePreview = async (file) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }

        setPreviewImage(file.url || file.preview);
        setPreviewOpen(true);
        setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
    };

    const handleChange = ({ fileList }) => setFileList(fileList);

    const handlePdfChange = ({ fileList }) => setPdfList(fileList);

    const uploadButton = (
        <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
        </div>
    );

    useEffect(() => {
        loadData();
    }, []);

    const loadData = () => {
        const data = {
            businessName: "",
            businessType: "Restaurant",
            street: "",
            houseNumber: "",
            postalCode: "",
            phone: "",
            website: "",
            pdf: [],
            pictures: [],
        };
        setOriginalData(data);
        setEditedData({ ...data });
    };

    const handleSave = () => {
        console.log("Data saved");
        setOriginalData({ ...editedData });
    };

    const handleInputChange = (name, value) => {
        setEditedData(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const dataHasChanged = JSON.stringify(originalData) !== JSON.stringify(editedData);

    const isFormValid = () => {
        return editedData.businessName !== "" && 
               editedData.businessType !== "" && 
               editedData.street !== "" && 
               editedData.houseNumber !== "" &&
               editedData.postalCode !== "" && 
               editedData.phone !== "" && 
               editedData.website !== "";
    }

    return (
        <>
            <Title level={3} className={'dashboard-title'} style={{ textAlign: 'left', marginLeft: '10px' }}>Geschäft</Title>
            <Content style={{ padding: '0 50px', color: 'black' }}>
                <Form layout="vertical">
                    <Row gutter={16}>
                        <Col xs={24} sm={24} md={12}>
                            <Form.Item label="Geschäftsname" rules={[{ required: true, message: 'Bitte Geschäftsname eingeben' }]}>
                                <Input
                                    value={editedData.businessName}
                                    onChange={e => handleInputChange('businessName', e.target.value)}
                                />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={24} md={12}>
                            <Form.Item label="Art des Geschäftes" rules={[{ required: true, message: 'Bitte Geschäftsart auswählen' }]}>
                                <Select defaultValue={editedData.businessType} style={{ width: '100%' }} onChange={value => handleInputChange('businessType', value)}>
                                    <Option value="Restaurant">Restaurant</Option>
                                    <Option value="Bar">Bar</Option>
                                    <Option value="Cafe">Cafe</Option>
                                    <Option value="Friseur">Friseur</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col xs={24} sm={24} md={8}>
                            <Form.Item label="Straße" rules={[{ required: true, message: 'Bitte Straße eingeben' }]}>
                                <Input
                                    value={editedData.street}
                                    onChange={e => handleInputChange('street', e.target.value)}
                                />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={24} md={8}>
                            <Form.Item label="Hausnummer" rules={[
                                { required: true, message: 'Bitte Hausnummer eingeben' },
                                { pattern: /^[0-9]*$/, message: 'Nur Zahlen erlaubt' }
                            ]}>
                                <Input
                                    value={editedData.houseNumber}
                                    onChange={e => handleInputChange('houseNumber', e.target.value)}
                                />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={24} md={8}>
                            <Form.Item label="Postleitzahl" rules={[
                                { required: true, message: 'Bitte Postleitzahl eingeben' },
                                { pattern: /^[0-9]{5}$/, message: 'Genau 5 Zahlen erlaubt' }
                            ]}>
                                <Input
                                    value={editedData.postalCode}
                                    onChange={e => handleInputChange('postalCode', e.target.value)}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col xs={24} sm={24} md={12}>
                            <Form.Item label="Telefon" rules={[
                                { required: true, message: 'Bitte Telefonnummer eingeben' },
                                { pattern: /^[0-9+\-() ]+$/, message: 'Bitte eine gültige Telefonnummer eingeben' }
                            ]}>
                                <Input
                                    value={editedData.phone}
                                    onChange={e => handleInputChange('phone', e.target.value)}
                                />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={24} md={12}>
                            <Form.Item label="Webseite" rules={[
                                { required: true, message: 'Bitte Webseite eingeben' },
                                { type: 'url', message: 'Bitte eine gültige Webseite eingeben' }
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
                            <Form.Item label="PDF" style={{ textAlign: 'left' }}>
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
                            <Form.Item label="Bilder" style={{ textAlign: 'left' }}>
                                <Upload
                                    listType="picture-card"
                                    fileList={fileList}
                                    onPreview={handlePreview}
                                    onChange={handleChange}
                                    beforeUpload={() => false}
                                >
                                    {fileList.length >= 5 ? null : uploadButton}
                                </Upload>
                                <Modal visible={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
                                    <img alt="example" style={{ width: '100%' }} src={previewImage} />
                                </Modal>
                            </Form.Item>
                        </Col>
                    </Row>
                    {dataHasChanged && isFormValid() && (
                        <Row>
                            <Col xs={24} sm={24} md={24} style={{ textAlign: 'right' }}>
                                <Button type="primary" onClick={handleSave}>Speichern</Button>
                            </Col>
                        </Row>
                    )}
                </Form>
            </Content>
        </>
        );
};

export default Store;
