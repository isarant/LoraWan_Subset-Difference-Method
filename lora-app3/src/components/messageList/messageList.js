import React, { Component } from "react";
import { ListGroup, Card } from "react-bootstrap";
import Websocket from 'react-websocket';
class MessageList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      connect: false,
    };
  }

  handleData = (data) => {
    this.setState(state => {
      const messages = [...state.messages, data];
      return {
        messages,
      }
    })
  }


  handleOpen = () => {
    this.setState(state => (
      { connect: true }
    ))
  }

  handleClose = () => {
    this.setState(state => (
      { connect: false }
    ))
  }

  sendMessage(message) {
    this.refWebSocket.sendMessage(message);
  }

  // <button onClick={() => this.sendMessage("Hello")} >Send Message</button>

  render() {

    return (
      <div>

        <Card bg={this.state.connect ? 'success' : 'danger'}>
          <Card.Header >Incoming Messages</Card.Header>
          <Card.Body >
            <ListGroup className="pre-scrollable" >

              {this.state.messages.map((message, key) => {

                const messagejson = JSON.parse(message);
                var { applicationID, applicationName, deviceName, devEUI, devAddr, type, error, txInfo, adr, fCnt, fPort, data } = messagejson;
                var variant = 'light'
                if (data)
                  variant = 'primary';
                else if (error)
                  variant = 'danger'
                else if (!error && !data)
                  variant = 'success'

                if (txInfo !== undefined)
                  var { frequency, dr } = txInfo;

                return (
                  <ListGroup.Item key={key} variant={variant}>
                    <div>
                      {deviceName}: {type} {error} {data && atob(data)}
                    </div>
                    {/*
                    <div>
                      {message}
                    </div>
                   */}
                  </ListGroup.Item>
                )
              })}
            </ListGroup>
          </Card.Body>
        </Card>
        <Websocket url='ws://163.172.162.0:1337' onMessage={this.handleData}
          onOpen={this.handleOpen} onClose={this.handleClose}
          reconnect={true} debug={true}
          ref={Websocket => {
            this.refWebSocket = Websocket;
          }} />
      </div>
    );
  }
}

export default MessageList;
