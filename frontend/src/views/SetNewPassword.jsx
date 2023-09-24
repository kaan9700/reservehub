import {Form, Input, Button} from "antd";
import HeaderText from "../components/HeaderText.jsx";
import {useNavigate, useParams } from "react-router-dom";
import {makeRequest} from "../api/api.js";
import {SET_NEW_PASSWORD} from "../api/endpoints.js";
import Notifications from "../components/Notifications.jsx";
import {useState} from "react";
import LoadingIcon from "../components/Loader.jsx";


const formItemLayout = {
    labelCol: {
        xs: {span: 24},
        sm: {span: 8},
    },
    wrapperCol: {
        xs: {span: 24},
        sm: {span: 16},
    },
};

const SetNewPassword = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const { uid, token } = useParams();
    const endpoint = SET_NEW_PASSWORD + uid + '/' + token + '/';

    const setNewPassword = async (values) => {
        setLoading(true);
        try {
            // Sie müssen diese API-Anforderung entsprechend Ihrer Backend-Logik ändern
            await makeRequest('POST', endpoint, values);

            Notifications('success', {
                'message': 'Erfolg',
                'description': 'Ihr Passwort wurde erfolgreich zurückgesetzt'
            });
            navigate('/login');
        } catch (error) {
            Notifications('error', {'message': 'Fehler', 'description': error.message});
        }
        setLoading(false);
    };

    return (
        <div className={'form-wrapper'}
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                marginTop: '5%',
            }}>
            <HeaderText title="Neues Passwort festlegen"/>
            <Form
                {...formItemLayout}
                form={form}
                name="set-new-password"
                onFinish={setNewPassword}
                style={{
                    width: 450,
                    maxWidth: '90%',
                }}
                scrollToFirstError
            >
                <Form.Item
                    name="password"
                    label="Neues Passwort"
                    rules={[
                        { required: true, message: "Please input your password!" },
                        { min: 8, message: "Password must be at least 8 characters" },
                        { pattern: /[0-9]/, message: "Password must contain at least one number" },
                        { pattern: /[A-Z]/, message: "Password must contain at least one uppercase letter" },
                        { pattern: /[a-z]/, message: "Password must contain at least one lowercase letter" },
                    ]}
                    hasFeedback
                >
                    <Input.Password/>
                </Form.Item>

                <Form.Item
                    name="confirm"
                    label="Passwort bestätigen"
                    dependencies={['password']}
                    rules={[
                        { required: true, message: "Please confirm your password!" },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue("password") === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error("The two passwords that you entered do not match!"));
                            },
                        }),
                    ]}
                    hasFeedback
                >
                    <Input.Password/>
                </Form.Item>

                <Form.Item style={{display: 'flex', justifyContent: 'left', width: '100%'}}>
                    <Button type="primary" htmlType="submit" style={{width: '200px'}}>
                        {loading ? (
                            <LoadingIcon/>
                        ) : ('Passwort festlegen')}
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default SetNewPassword;
