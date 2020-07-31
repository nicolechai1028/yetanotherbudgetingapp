import React from 'react';
import { BrowserRouter } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Home from "./pages/Home/";
import NavigationBar from "./components/NavigationBar";
import Login from "./pages/Login.js"

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
