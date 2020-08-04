import React, {useState} from "react";
import './index.css';
import { Button, Form, FormGroup, Label, Input, Card, CardBody, CardTitle, CardSubtitle} from "reactstrap";
import {login} from '../../utils/API'

function Login(){
  const [input, setInput] = useState({
    email: "",
    password: ""
  })

const validateInput = () => {
  const emailRegex = new RegExp(/^(.+)@(.+)\.(.+)$/i);
  return emailRegex.test(input.email) && input.password.length > 6
}

const handleSubmit = (e) => {
  e.preventDefault();
  if(validateInput()){
    login(input)
  }else{
    alert("invalid input!")
  }
}

const handleInputChange = ({target:{name, value}}) => setInput({...input, [name]:value})


  return (
    <Card color="success" body={true} inverse={true} style={{width: "80%", margin:"auto"}}>
      <CardBody>
         <Form className="login-form" onSubmit={handleSubmit}>
      <CardTitle><h1>Y.A.B.A</h1></CardTitle>
      <CardSubtitle>Welcome</CardSubtitle>

      <FormGroup>
        <Label>Email</Label>
        <Input name="email" type="email" placeholder="john@email.com" 
        onChange = {handleInputChange} >
        </Input>

      </FormGroup>
      <FormGroup>
        <Label>Password</Label>
        <Input name="password" type="password" placeholder="Password" 
       onChange={handleInputChange}>
        </Input>
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
