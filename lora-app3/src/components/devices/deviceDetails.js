import React, { Component } from "react";
import { Modal, Button, ListGroup } from "react-bootstrap";

class DeviceDetails extends Component {
  render() {
    if (this.props.device[0] !== undefined) {
      return (
        <Modal
          {...this.props}
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered

        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
              Device Details
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <h4>{this.props.device[0].name}</h4>
            <ListGroup>
              <ListGroup.Item>
                applicationID: {this.props.device[0].applicationID}
              </ListGroup.Item>
              <ListGroup.Item>
                description: {this.props.device[0].description}
              </ListGroup.Item>
              <ListGroup.Item>
                devEUI: {this.props.device[0].devEUI}
              </ListGroup.Item>
              <ListGroup.Item>
                deviceProfileID: {this.props.device[0].deviceProfileID}
              </ListGroup.Item>
              <ListGroup.Item>
                deviceProfileName: {this.props.device[0].deviceProfileName}
              </ListGroup.Item>
              <ListGroup.Item>
                deviceStatusBattery: {this.props.device[0].deviceStatusBattery}
              </ListGroup.Item>
              <ListGroup.Item>
                deviceStatusBatteryLevel:
                {this.props.device[0].deviceStatusBatteryLevel}
              </ListGroup.Item>
              <ListGroup.Item>
                deviceStatusBatteryLevelUnavailable:
                {this.props.device[0].deviceStatusBatteryLevelUnavailable}
              </ListGroup.Item>
              <ListGroup.Item>
                deviceStatusExternalPowerSource:
                {this.props.device[0].deviceStatusExternalPowerSource}
              </ListGroup.Item>
              <ListGroup.Item>
                deviceStatusMargin: {this.props.device[0].deviceStatusMargin}
              </ListGroup.Item>
              <ListGroup.Item>
                lastSeenAt: {this.props.device[0].lastSeenAt}
              </ListGroup.Item>
            </ListGroup>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.props.onHide}>Close</Button>
          </Modal.Footer>
        </Modal>
      );
    } else {
      return <div />;
    }
  }
}

export default DeviceDetails;
