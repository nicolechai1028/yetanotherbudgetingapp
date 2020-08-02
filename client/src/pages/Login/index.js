import React from "react";
import './index.css';

import { Button, Form, FormGroup, Label, Input} from "reactstrap";

function Login() {
  return (
    <Form className="login-form">
      <h1>
        <span className="font-weight-bold">Y.A.B.A</span>
      </h1>
      <h2 className="text-center">Welcome</h2>
      <FormGroup>
        <Label>Email</Label>
        <Input type="email" placeholder="Email"></Input>
      </FormGroup>
      <FormGroup>
        <Label>Password</Label>
        <Input type="password" placeholder="Password"></Input>
      </FormGroup>
      <Button className="btn-lg btn-dark btn-block">Log In</Button>
      <div className="text-center">
        <a href="/register">Register</a>
        <span className="p-2"></span>
        <a href="/register">Forgot Password</a>
      </div>
    </Form>
  );
}

export default Login;
