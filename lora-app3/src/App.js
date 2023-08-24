import React, { Component } from "react";
import { connect } from "react-redux";
import "./App.css";
import { general_error_reset } from "../src/actions/login.action"
import Devices from "./components/devices/devices";
import Groups from "./components/groups/groups";
import { NavBar } from "./layout/navBar/navBar";
import Login from "./layout/login/login";
import { Container, Row, Col, Modal, Spinner, Alert, Button } from "react-bootstrap";
import MessageList from "./components/messageList/messageList";

class App extends Component {
  show_error = () => {
    if (this.props.general_error !== []) {
      if (this.props.general_error.length > 0) {
        return this.props.general_error.map((err, key) => (
          <Alert key={key} animation="border" size="lg" variant="danger">{err.message}</Alert>
        ));
      }
    }
  };

  show_error_button = () => {
    if (this.props.general_error !== []) {
      if (this.props.general_error.length > 0) {
        return <Button onClick={() => this.props.general_error_reset()}>Close</Button>
      }
    }
  };

  render() {
    return (
      <div className="App">
        <NavBar login={this.props.login} />
        <Modal show={this.props.general_spin || this.props.general_error.length > 0}
          centered={true} keyboard={false}
          backdrop={false} >
          <Modal.Body >
            {this.props.general_spin ? <Spinner animation="border" size="lg" /> : ""}
            {this.show_error()}
            {this.show_error_button()}
          </Modal.Body>
        </Modal>
        <Container fluid="true">
          {!this.props.login && (<Row> <Col sm="3"></Col><Col sm="6"><Login /></Col><Col sm="3"></Col></Row>)}
          <Row className="fixed">
            <Col sm="8">
              {this.props.login && (
                <Devices login={this.props.login} jwt={this.props.jwt} />
              )}
            </Col>
            <Col sm="4">

              {this.props.login && (<Groups login={this.props.login} jwt={this.props.jwt} />)}
            </Col>
          </Row>
          <Row className="fixed-bottom">
            <Col sm="12">{this.props.login && <MessageList />}</Col>
          </Row>
        </Container>
      </div>
    );
  }
}
const mapStateToProps = state => {
  return {
    login: state.login.login,
    jwt: state.login.jwt,
    error: state.login.error,
    requesting: state.login.requesting,
    completed: state.login.completed,
    general_spin: state.login.general_spin,
    general_error: state.login.general_error,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    general_error_reset: () => dispatch(general_error_reset()),
  };

};
export default connect(mapStateToProps,
  mapDispatchToProps)(App);
