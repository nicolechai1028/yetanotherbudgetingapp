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
import { login } from "../../utils/API";
import { useAppContext } from "../../utils/globalStates/stateProvider";
import { ADD_USER_INFO } from "../../utils/globalStates/actions";

function Login() {
  const [input, setInput] = useState({
    email: "",
    password: "",
  });
  const [_, dispatch] = useAppContext();

  const validateInput = () => {
    const emailRegex = new RegExp(/^(.+)@(.+)\.(.+)$/i);
    return emailRegex.test(input.email);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateInput()) {
      login(input).then(({ data }) => {
        console.log(data);
        dispatch({ type: ADD_USER_INFO, payload: data });
      });
      // session id and user id - useContext
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
          <CardSubtitle className="text-center">
            {_.message || "Welcome!"}
          </CardSubtitle>

          <FormGroup>
            <Label>Email</Label>
            <Input
              name="email"
              type="email"
              placeholder="john@email.com"
              onChange={handleInputChange}
            ></Input>
          </FormGroup>
          <FormGroup>
            <Label>Password</Label>
            <Input
              name="password"
              type="password"
              placeholder="Password"
              onChange={handleInputChange}
            ></Input>
          </FormGroup>
          <Button className="btn-lg btn-dark btn-block">Log In </Button>
          <div className="text-center">
            <a href="/register">Register</a>
            <span className="p-2"></span>
            <a href="/register">Forgot Password</a>
          </div>
        </Form>
      </CardBody>
    </Card>
  );
}

export default Login;
