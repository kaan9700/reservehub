import {Form, Input, Button} from "antd";
import Notifications from "../components/Notifications.jsx";
import HeaderText from "../components/HeaderText";
import {useNavigate} from "react-router-dom";
import {useContext, useEffect, useState} from "react";
import AuthContext from "../auth/AuthProvider.jsx";
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

const SignInForm = () => {

    const [form] = Form.useForm();
    const {loginUser, user} = useContext(AuthContext)
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);


    useEffect(() => {
        if (user) {
            navigate('/user')
        }
    }, [])

    const onFinish = async (values) => {
        setLoading(true)
        try {
            await loginUser(values)
        } catch (error) {
            Notifications('error', {'message': 'Fehler', 'description': error.message})
        }
        setLoading(false)
    };


    const handleForgotPassword = () => {
        navigate("/password-reset");
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
            <HeaderText title="Log In to your Account"/>
            <Form
                {...formItemLayout}
                form={form}
                name="login"
                onFinish={onFinish}
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
                    className="label-left-align"  // Hinzufügen dieser Klasse
                    style={{textAlign: "right"}}
                >
                    <Input/>
                </Form.Item>

                <Form.Item
                    name="password"
                    label="Password"
                    rules={[
                        {
                            required: true,
                            message: "Please input your password!",
                        },
                    ]}
                    className="label-left-align"  // Hinzufügen dieser Klasse
                    style={{textAlign: "right"}}
                >
                    <Input.Password/>
                </Form.Item>

                <Form.Item>
                    <a onClick={handleForgotPassword} style={{float: "left"}}>
                        Forgot password?
                    </a>
                </Form.Item>

                <Form.Item style={{display: 'flex', justifyContent: 'left', width: '100%'}}>
                    <Button type="primary" htmlType="submit" style={{width: '115px'}}>
                        {loading ? (
                            <LoadingIcon/>
                        ) : ('Einloggen')}
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default SignInForm;
