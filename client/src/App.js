import React from 'react';
import './App.css';
import Dummy from './components/Dummy/Dummy.js'
import { BrowserRouter } from "react-router-dom";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Home from "./pages/Home/";
import NavigationBar from "./components/NavigationBar";
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import { FacebookLoginButton } from 'react-social-login-buttons';
import Login from "./src/pages/Login/"

function App() {
  return (
    <>
    <BrowserRouter>
    <NavigationBar />
    <Home />
    <Login/>
  </BrowserRouter>
</>
  );
}

export default App;
