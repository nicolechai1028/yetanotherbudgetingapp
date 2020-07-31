import React from 'react';
import logo from './logo.svg';
import './App.css';
import Dummy from './components/Dummy/Dummy.js'

import { Button, Form, FormGroup, Label, Input } from 'reactstrap';

import { FacebookLoginButton } from 'react-social-login-buttons';

import Login from "./src/pages/Login/"

function App() {
  return (
    <Login/>

  );
}

export default App;
