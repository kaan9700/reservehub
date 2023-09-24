import {Form, Input, Button} from "antd";
import HeaderText from "../components/HeaderText";
import {useNavigate} from "react-router-dom";
import {makeRequest} from "../api/api.js";
import {PASSWORD_FORGOT} from "../api/endpoints.js";
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

const PasswordReset = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const requestPasswordReset = async (values) => {
        setLoading(true);
        try {

            await makeRequest('POST', PASSWORD_FORGOT, {'email': values.email});

            Notifications('success', {
                'message': 'Erfolg',
                'description': 'Eine E-Mail mit einem Bestätigungslink wurde an die angegebene E-Mail-Adresse gesendet'
            })
            navigate('/login')


        } catch (error) {
            Notifications('error', {'message': 'Fehler', 'description': 'E-Mail nicht gefunden'})
        }
        setLoading(false);
    };

    return (
        <div
            className={'form-wrapper'}
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                marginTop: '5%',
            }}
        >
            <HeaderText title="Reset your Password"/>
            <Form
                {...formItemLayout}
                form={form}
                name="password-reset"
                onFinish={requestPasswordReset}
                style={{
                    maxWidth: 300,
                }}
                scrollToFirstError
            >
                <Form.Item
                    name="email"
                    label="E-mail"
                    rules={[
                        {
                            type: "email",
                            message: "The input is not valid E-mail!",
                        },
                        {
                            required: true,
                            message: "Please input your E-mail!",
                        },
                    ]}
                    className="label-left-align"
                    style={{textAlign: "right"}}
                >
                    <Input/>
                </Form.Item>

                <Form.Item style={{display: 'flex', justifyContent: 'left', width: '100%'}}>
                    <Button type="primary" htmlType="submit" onSubmit={requestPasswordReset} style={{width: '200px'}}>
                        {loading ? (
                            <LoadingIcon/>
                        ) : ('Bestätigungslink senden')}

                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default PasswordReset;
