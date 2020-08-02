import React from "react";
import { Nav, Navbar, NavbarBrand, NavLink } from "reactstrap";
import { Link } from "react-router-dom";

function NavigationBar() {
  return (
    <Navbar expand="lg" variant="light" bg="light">
      <NavbarBrand className="mr-auto"> Y.A.B.A</NavbarBrand>
      <Nav>
        <Link to="/login">Login</Link>
        <NavLink>Sign up</NavLink>
        <Link to="/budget">Budget</Link>
      </Nav>
    </Navbar>
  );
}

export default NavigationBar;
