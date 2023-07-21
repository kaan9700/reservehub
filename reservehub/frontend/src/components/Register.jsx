import { message } from "antd";
import { makePostRequest } from "../api/api";
import {
    Button,
    Form,
    Input,

} from "antd";
import { useState } from "react";
import { REGISTER } from "../api/endpoints";
import HeaderText from "./HeaderText";
import { useNavigate } from 'react-router-dom';


const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 10 },
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
    },
};



const SignUpForm = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const validatePhoneNumber = (_, value) => {
        // Regular expression to match a valid phone number format
        const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,7}$/im;

        if (value && !phoneRegex.test(value)) {
            return Promise.reject('Please enter a valid phone number!');
        }
        return Promise.resolve();
    };

    const onFinish = async (values) => {
        console.log("Received values of form: ", values);
        setLoading(true);
        try {
            await makePostRequest(REGISTER, values);  // use values directly
            message.success("Registration successful!");
            form.resetFields();
            navigate('/login');
        } catch (error) {
            message.error(`Registration failed: ${error.message}`);
        }
        setLoading(false);
    };

    return (
        <div
            style={{
            display: "flex",
                flexDirection: "column",
                alignItems: "center",
                marginTop: '15%',
            }}
            >
            <HeaderText title="Sign Up your Account" />
            <Form
                {...formItemLayout}
                form={form}
                name="register"
                onFinish={onFinish}
                initialValues={{
                residence: ["zhejiang", "hangzhou", "xihu"],
                    prefix: "86",
                }}
                style={{ maxWidth: 600 }}
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
                    <Input />
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
                    <Input.Password />
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
                    ({ getFieldValue }) => ({
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
                    <Input.Password />
                </Form.Item>

                <Form.Item
                    name="phone"
                    label="Phone Number"
                    rules={[
                    { required: true, message: 'Please enter your phone number!' },
                    { validator: validatePhoneNumber }
                ]}
                    className="label-left-align"
                    >
                    <Input/>
                </Form.Item>

                <Form.Item style={{ display: 'flex', justifyContent: 'left'}}>
                    <Button
                        type="primary"
                        htmlType="submit"
                        style={{ width: '10vw' }}
                        >
                        {loading ? (
                            <svg width="24" height="24" stroke="white" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g><circle cx="12" cy="12" r="9.5" fill="none" strokeWidth="3" strokeLinecap="round"><animate attributeName="stroke-dasharray" dur="1.5s" calcMode="spline" values="0 150;42 150;42 150;42 150" keyTimes="0;0.475;0.95;1" keySplines="0.42,0,0.58,1;0.42,0,0.58,1;0.42,0,0.58,1" repeatCount="indefinite"/><animate attributeName="stroke-dashoffset" dur="1.5s" calcMode="spline" values="0;-16;-59;-59" keyTimes="0;0.475;0.95;1" keySplines="0.42,0,0.58,1;0.42,0,0.58,1;0.42,0,0.58,1" repeatCount="indefinite"/></circle><animateTransform attributeName="transform" type="rotate" dur="2s" values="0 12 12;360 12 12" repeatCount="indefinite"/></g></svg>
                            ): ('Register')}
                    </Button>
                </Form.Item>
            </Form>
        </div>
        );
};

export default SignUpForm;
