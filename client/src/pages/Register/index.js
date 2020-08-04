import React from "react";
// import ReactDOM from "react-dom"
import './index.css';


import { Button, Form, FormGroup, Label, Input} from "reactstrap";

function Register() {


  return (
    <Form className="login-form" onSubmit={()=>""}>
      <h1><span className="font-weight-bold">
       Y.A.B.A</span></h1>
       <h2 className="text-center">Welcome</h2>
       <FormGroup>
         <Label>First Name</Label>
         <Input name="firstName" type="text" placeholder="First Name">
         </Input>
       </FormGroup>
       <FormGroup>
         <Label>Last Name</Label>
         <Input name="lastName" type="text" placeholder="Last Name"
         >
         </Input>
       </FormGroup>
       <FormGroup>
         <Label>Email</Label>
         <Input name="email" type="email" placeholder="Email">
         </Input>
       </FormGroup>
       <FormGroup>
         <Label>Password</Label>
         <Input name="password" type="password" placeholder="Password"
       >
         </Input>
       </FormGroup>
       <Button className="btn-lg btn-dark btn-block">Log In</Button>
      <div className="text-center">
        <a href="/register">Sign-Up</a>
        <span className="p-2"></span>
        <a href="/register">Forgot Password</a>
      </div>
    </Form>
  );
}

export default Register; 