import Notifications from "../components/Notifications.jsx";
import {makeRequest} from "../api/api";
import {
    Button,
    Form,
    Input,

} from "antd";
import {useState, useContext, useEffect} from "react";
import {REGISTER} from "../api/endpoints";
import HeaderText from "../components/HeaderText";
import {useNavigate} from 'react-router-dom';
import AuthContext from "../auth/AuthProvider.jsx";
import LoadingIcon from "../components/Loader.jsx";


const formItemLayout = {
    labelCol: {
        xs: {span: 24},
        sm: {span: 10},
    },
    wrapperCol: {
        xs: {span: 24},
        sm: {span: 16},
    },
};


const SignUpForm = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const {user} = useContext(AuthContext)
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            navigate('/user')
        }
    }, [navigate, user])
    const validatePhoneNumber = (_, value) => {
        // Regular expression to match a valid phone number format
        const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,7}$/im;

        if (value && !phoneRegex.test(value)) {
            return Promise.reject('Please enter a valid phone number!');
        }
        return Promise.resolve();
    };

    const onFinish = async (values) => {
        console.log("Received values of form: ", values);
        setLoading(true);
        try {
            await makeRequest('POST', REGISTER, values);  // use values directly
            Notifications('success', {
                'message': "Registrierung erfolgreich!",
                'description': "Bitte bestätigen Sie Ihre E-Mail-Adresse"
            });
            form.resetFields();
            navigate('/login');
        } catch (error) {
            Notifications('error', {'message': "Registrierung fehlgeschlagen!", 'description': error.message});
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
            <HeaderText title="Sign Up your Account"/>
            <Form
                {...formItemLayout}
                form={form}
                name="register"
                onFinish={onFinish}
                initialValues={{
                    residence: ["zhejiang", "hangzhou", "xihu"],
                    prefix: "86",
                }}
                style={{maxWidth: 600}}
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
                        {
                            min: 8,
                            message: "Password must be at least 8 characters",
                        },
                        {
                            pattern: /[0-9]/,
                            message: "Password must contain at least one number",
                        },
                        {
                            pattern: /[A-Z]/,
                            message: "Password must contain at least one uppercase letter",
                        },
                        {
                            pattern: /[a-z]/,
                            message: "Password must contain at least one lowercase letter",
                        },
                    ]}
                    className="label-left-align"
                    hasFeedback
                >
                    <Input.Password/>
                </Form.Item>

                <Form.Item
                    name="confirm"
                    label="Confirm Password"
                    dependencies={["password"]}
                    hasFeedback
                    rules={[
                        {
                            required: true,
                            message: "Please confirm your password!",
                        },
                        ({getFieldValue}) => ({
                            validator(_, value) {
                                if (!value || getFieldValue("password") === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(
                                    new Error("The two passwords that you entered do not match!")
                                );
                            },
                        }),
                    ]}
                    className="label-left-align"
                >
                    <Input.Password/>
                </Form.Item>

                <Form.Item
                    name="phone"
                    label="Phone Number"
                    rules={[
                        {required: true, message: 'Please enter your phone number!'},
                        {validator: validatePhoneNumber}
                    ]}
                    className="label-left-align"
                >
                    <Input/>
                </Form.Item>

                <Form.Item style={{display: 'flex', justifyContent: 'left'}}>
                    <Button
                        type="primary"
                        htmlType="submit"
                        style={{minWidth: '100px', width: '10vw'}}
                    >
                        {loading ? (
                            <LoadingIcon/>
                        ) : ('Register')}
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default SignUpForm;
