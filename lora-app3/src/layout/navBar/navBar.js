import React from "react";
import ButtonLogOut from "../../components/buttonLogOut/buttonLogOut";
import { Navbar } from "react-bootstrap";

export const NavBar = login => {
  return (
    <Navbar bg="primary" variant="dark" expand="lg">
      <Navbar.Brand>LoraWan Multicast</Navbar.Brand>
      <Navbar.Toggle />
      <Navbar.Collapse className="justify-content-end">
        <Navbar.Text>{login && <ButtonLogOut />}</Navbar.Text>
      </Navbar.Collapse>
    </Navbar>
  );
};
