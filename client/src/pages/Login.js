import React from 'react';
import './App.css';


import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import { FacebookLoginButton } from 'react-social-login-buttons';

function Login() {
  return (
    <Form className="login-form">
      <h1><span className="font-weight-bold">
       Yet Another Budgeting App</span></h1>
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
       <div className="text-center pt-3">
         Or continue with your social account
      </div>
      <FacebookLoginButton className="mt-3 mb-3"/>
      <div className="text-center">
        <a href="/sign-up">Sign-Up</a>
        <span className="p-2"></span>
        <a href="/sign-up">Forgot Password</a>
      </div>
    </Form>

  );
}

export default Login; 