import {Button, Card, Form, Input, List, Modal, Popconfirm, Typography} from "antd";
import {CloseOutlined, DeleteOutlined, EditOutlined, PlusOutlined, SaveOutlined} from "@ant-design/icons";
import React, {useContext, useEffect, useRef, useState} from "react";
import {makeRequest} from "../api/api.js";
import AuthContext from "../auth/AuthProvider.jsx";

const {Title, Text} = Typography;

const DataEditor = ({ENDPOINT}) => {
    const [editingBusinessType, setEditingBusinessType] = useState(null);
    const {authTokens} = useContext(AuthContext)
    const [types, setTypes] = useState([]); //
    const [reloadType, setReloadType] = useState(false);
    const [formValuesType, setFormValuesType] = useState({});
    const [isTypeModalVisible, setIsTypeModalVisible] = useState(false);
    const typeFormRef = useRef(null);


    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await makeRequest('GET', ENDPOINT, {}, authTokens.access);

                let updatedData = data.map(item => {
                    // Die ID extrahieren und den Rest in ein neues Objekt packen
                    let {id, ...rest} = item;
                    // Der erste Schlüssel im rest-Objekt (das sollte der zu ändernde Schlüssel sein)
                    let keyToChange = Object.keys(rest)[0];
                    // Erstellen Sie ein neues Objekt mit der ID und dem neuen 'type' Schlüssel
                    return {
                        id: id,
                        type: item[keyToChange]
                    };
                });
                 console.log(updatedData)
                setTypes(updatedData);
            } catch (error) {
                console.error('Fehler beim Abrufen der Pläne:', error);
            }
        };

        fetchData();
    }, [reloadType]);


    const handleSaveType = async () => {
        try {
            const payload = {
                method: 'change',
                old_data: editingBusinessType,
                new_data: formValuesType
            };
            console.log(payload)
            const updatedType = await makeRequest('POST', ENDPOINT, payload, authTokens.access);
            const updatedTypes = types.map(type => type.id === editingBusinessType.id ? updatedType : type);
            setTypes(updatedTypes);
        } catch (error) {
            console.error('Fehler beim Aktualisieren des Dienstes:', error);
        }
        setEditingBusinessType(null);
        setReloadType(!reloadType);
    };

    const handleCancelEditType = () => {
        setEditingBusinessType(null);
    };

    const handleDeleteType = async (typeId) => {
        try {
            const payload = {
                method: 'delete',
                type_id: typeId
            };
            await makeRequest('POST', ENDPOINT, payload, authTokens.access);
            setReloadType(!reloadType);
        } catch (error) {
            console.error('Fehler beim Löschen des Dienstes:', error);
        }
    };

    const handleEditType = (type) => {
        setFormValuesType(type);
        setEditingBusinessType(type);
    };

    const handleTypeFormChange = (changedFields) => {
        setFormValuesType({
            ...formValuesType,
            ...changedFields
        });
    };


    const showTypeModal = () => {
        setIsTypeModalVisible(true);
    };

    const handleTypeeCancel = () => {
        setIsTypeModalVisible(false);
    };

    const handleTypeOk = async () => {
        try {
            const data = {
                method: 'add',
                ...formValuesType
            };
            await makeRequest('POST', ENDPOINT, data, authTokens.access);
            setEditingBusinessType(null);
            setTypes([...types, formValuesType]);
            setIsTypeModalVisible(false);
            setFormValuesType({});
            if (typeFormRef.current) {
                typeFormRef.current.resetFields();
            }

        } catch (error) {
            console.error("Failed to add element:", error);
        }
        setReloadType(!reloadType)
    };


    return (

        <>

            <List
                bordered
                dataSource={types}
                style={{marginLeft: '40px', background: 'white'}}
                renderItem={type => (
                    <List.Item
                        actions={[
                            editingBusinessType?.id === type.id ? (
                                <>
                                    <Button type="text" icon={<SaveOutlined/>}
                                            onClick={() => handleSaveType(type.id)}/>
                                    <Button type="text" icon={<CloseOutlined/>}
                                            onClick={handleCancelEditType}/>
                                </>
                            ) : (
                                <>
                                    <Popconfirm
                                        title="Sind Sie sicher, dass Sie diesen Dienst löschen möchten?"
                                        onConfirm={() => handleDeleteType(type.id)} okText="Ja"
                                        cancelText="Nein"
                                    >
                                        <Button type="text" icon={<DeleteOutlined/>} style={{color: 'red'}}/>
                                    </Popconfirm>
                                    <Button type="text" icon={<EditOutlined/>}
                                            onClick={() => handleEditType(type)}/>
                                </>
                            )
                        ]}
                    >
                        {editingBusinessType?.id === type.id ? (
                            <Form
                                layout="vertical"
                                onValuesChange={(changedFields) => handleTypeFormChange(changedFields)}
                                initialValues={type}

                            >
                                <Form.Item name="type" style={{margin: '0'}}>
                                    <Input/>
                                </Form.Item>
                            </Form>
                        ) : (
                            type.type
                        )}
                    </List.Item>
                )}/>
            <Button type="primary" icon={<PlusOutlined/>} onClick={showTypeModal}
                    style={{margin: '20px 0 20px 40px', float: 'left'}}>
                Neuer Dienst
            </Button>
            <Modal title="Neues Element erstellen" open={isTypeModalVisible} onOk={handleTypeOk}
                   onCancel={handleTypeeCancel}>
                <Form layout="vertical" ref={typeFormRef}
                      onValuesChange={(changedFields) => handleTypeFormChange(changedFields)}>
                    <Form.Item label="Element Name" name="type">
                        <Input/>
                    </Form.Item>
                </Form>
            </Modal>
        </>


    )
}

export default DataEditor;