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
import Modal from '../../components/AlertModal';

function Register() {
  const [input, setInput] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const [message,setMessage] = useState("");
  const [modalShow, setModalShow] = useState(false);

  const validateInput = () => {
    const emailRegex = new RegExp(/^(.+)@(.+)\.(.+)$/i);
    return emailRegex.test(input.email) && input.password.length > 3;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateInput()) {
      register(input).then(({data})=> {
        console.log(data);
        setMessage(`Success! Welcome to Y.A.B.A ${data.firstName}! \nCheck your email to verify your account!`)
        setModalShow(true);
        setTimeout(()=> setModalShow(false), 5000)
      })
    } else {
      alert("invalid input!");
    }
  };

  const handleInputChange = ({ target: { name, value } }) =>
    setInput({ ...input, [name]: value });

  return (
    <>
    <Modal show={modalShow} title="Registration Successful!" body={message} />
    <Card
      color=""
      body={true}
      style={{ width: "60%", margin: "auto", align: "center"}}
    >
      <CardBody>
        <Form className="login-form" onSubmit={handleSubmit}>
          <CardTitle className="text-center">
            <h1>Y.A.B.A</h1>
          </CardTitle>
          <CardSubtitle className="text-center">Welcome!</CardSubtitle>
          <FormGroup>
            <Label>First Name</Label>
            <Input
            onChange={handleInputChange}
              name="firstName"
              type="text"
              placeholder="First Name"
            ></Input>
          </FormGroup>
          <FormGroup>
            <Label>Last Name</Label>
            <Input
            onChange={handleInputChange}
            name="lastName" type="text" placeholder="Last Name"></Input>
          </FormGroup>
          <FormGroup>
            <Label>Email</Label>
            <Input
            onChange={handleInputChange}
            name="email" type="email" placeholder="Email"></Input>
          </FormGroup>
          <FormGroup>
            <Label>Password</Label>
            <Input
            onChange={handleInputChange}
              name="password"
              type="password"
              placeholder="Password"
            ></Input>
          </FormGroup>
          <Button className="btn-color btn-lg btn-dark btn-block">Sign Up</Button>
        </Form>
      </CardBody>
    </Card>
    </>
  );
}

export default Register;
