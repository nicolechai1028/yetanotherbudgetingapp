import React, { useState } from "react";
import "./index.css";
import {
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Card,
  CardBody,
  CardTitle,
  CardSubtitle,
} from "reactstrap";
import { register } from "../../utils/API";

function Register() {
  const [input, setInput] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const validateInput = () => {
    const emailRegex = new RegExp(/^(.+)@(.+)\.(.+)$/i);
    return emailRegex.test(input.email) && input.password.length > 6;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateInput()) {
      register(input);
    } else {
      alert("invalid input!");
    }
  };

  const handleInputChange = ({ target: { name, value } }) =>
    setInput({ ...input, [name]: value });
  return (
    <Card
      color=""
      body={true}
      style={{ width: "80%", margin: "auto", align: "center" }}
    >
      <CardBody>
        <Form className="login-form" onSubmit={handleSubmit}>
          <CardTitle className="text-center">
            <h1>Y.A.B.A</h1>
          </CardTitle>
          <CardSubtitle className="text-center">Welcome</CardSubtitle>
          
          <FormGroup>
            <Label>First Name</Label>
            <Input
              name="firstName"
              type="text"
              placeholder="First Name"
            ></Input>
          </FormGroup>
          <FormGroup>
            <Label>Last Name</Label>
            <Input name="lastName" type="text" placeholder="Last Name"></Input>
          </FormGroup>
          <FormGroup>
            <Label>Email</Label>
            <Input name="email" type="email" placeholder="Email"></Input>
          </FormGroup>
          <FormGroup>
            <Label>Password</Label>
            <Input
              name="password"
              type="password"
              placeholder="Password"
            ></Input>
          </FormGroup>
          <Button className="btn-lg btn-dark btn-block">Log In</Button>
          <div className="text-center">
            <a href="/register">Sign-Up</a>
            <span className="p-2"></span>
            <a href="/register">Forgot Password</a>
          </div>
        </Form>
      </CardBody>
    </Card>
  );
}

export default Register;
