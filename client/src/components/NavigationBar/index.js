import React from "react";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import { Link } from "react-router-dom";

function NavigationBar() {
  return (
    <Navbar expand="lg" variant="light" bg="light">
      <Navbar.Brand className="mr-auto"> Y.A.B.A</Navbar.Brand>
      <Nav>
        <Link to="/login">Login</Link>
        <Nav.Link>Sign up</Nav.Link>
        <Link to="/budget">Budget</Link>
      </Nav>
    </Navbar>
  );
}

export default NavigationBar;
