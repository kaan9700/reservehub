import { Form, Input, Button } from "antd";
import React from "react";
import { makePostRequest } from "../api/api";
import { LOGIN } from "../api/endpoints";
import { message } from "antd";
import HeaderText from "./HeaderText";
import { useNavigate } from "react-router-dom";

import jwt_decode from "jwt-decode";
import useAuth from "../auth/useAuth.tsx"

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};

const SignInForm = () => {
  const [form] = Form.useForm();
  const { setAuth } = useAuth()

  const authDispatch = 'test';
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      const response = await makePostRequest(LOGIN, values);
      const { access, refresh } = response;
      localStorage.setItem("access", access);
      localStorage.setItem("refresh", refresh);

      message.success("Login successful!");
      form.resetFields();

      // Update isLoggedIn state
      authDispatch && authDispatch({ type: "login" });

      // Read token from local storage
      const token = window.localStorage.getItem("access");
      if (token) {
        // Decode token
        const decodedToken = jwt_decode(token);
        localStorage.setItem('userRole', decodedToken.role);
        // Check user role and redirect accordingly
        if (decodedToken.role == "Superuser" || decodedToken.role === "admin") {
          navigate("/user");
        }  else {
          navigate("/");
        }
      }
    } catch (error) {
      message.error(`Login failed: ${error.message}`);
    }
  };




  const handleForgotPassword = () => {
    navigate("/password_reset");
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
      <HeaderText title="Log In to your Account" />
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
          style={{ textAlign: "right" }}
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
          ]}
        className="label-left-align"  // Hinzufügen dieser Klasse
        style={{ textAlign: "right" }}
        >
        <Input.Password />
        </Form.Item>

        <Form.Item>
          <a onClick={handleForgotPassword} style={{ float: "left" }}>
            Forgot password?
          </a>
        </Form.Item>

        <Form.Item style={{ display: 'flex', justifyContent: 'left'}}>
          <Button type="primary" htmlType="submit" style={{ width: '10vw' }} >
            Sign In
          </Button>
        </Form.Item>
      </Form>
    </div>
    );
};

export default SignInForm;
