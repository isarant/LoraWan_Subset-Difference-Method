import React, { Component } from "react";
import { connect } from "react-redux";
import {
  getDevices,
  filtre_device,
  reset_device,
} from "../../actions/device.action";
import { sendDevicesMessage } from "../../actions/deviceQueue.action";
import DevicesList from "./devicesList";
import DeviceDetails from "./deviceDetails";
import { Button } from "react-bootstrap";
import SendMessage from "../Queues/sendMessage";
import DeviceQueue from "../Queues/deviceQueue"

class Devices extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalShow: '',
      devEUI: ''
    };
  }



  render() {

    let modalDeviceDetailsClose = () => {
      this.props.reset_device();
      this.setState({ modalShow: '' })
    }
    let modalSendDeviceClose = () => {
      this.setState({ modalShow: '', devEUI: '' })
    }
    if (this.props.error) {
      return <div>{this.props.device_error.message}</div>;
    } else {
      return (
        <div>
          <DevicesList
            {...this.props}
            click={(devEUI, devstr) => {
              this.setState({ modalShow: devstr });
              this.props.filtre_device(devEUI);
            }
            } />
          <DeviceDetails
            show={this.props.device.length > 0 && this.state.modalShow === 'DeviceDetails'}
            onHide={modalDeviceDetailsClose}
            device={this.props.device}
          />
          <SendMessage
            show={this.props.device[0] && this.state.modalShow === 'SendDevice'}
            sendmessage={(id, message, confirmed, fPort) => {
              if (this.props.jwt)
                this.props.sendDevicesMessage(id, message, confirmed, fPort, this.props.jwt);
            }}
            onHide={modalSendDeviceClose}
            id={this.props.device[0] ? this.props.device[0].devEUI : ""}
            name={this.props.device[0] ? this.props.device[0].name : ""}
            error_message={this.props.sendmessage_requesting}
          />
          <DeviceQueue
            show={this.props.device[0] && this.state.modalShow === 'DeviceQueue'}
            devEUI={this.props.device[0] ? this.props.device[0].devEUI : ""}
            name={this.props.device[0] ? this.props.device[0].name : ""}
            onHide={() => { this.setState({ modalShow: '', devEUI: '' }) }} />
        </div>
      );
    }
  }

  componentDidMount() {
    if (this.props.jwt)
      this.props.get_devices(0, this.props.jwt);
  }
}

const mapStateToProps = state => {
  return {
    jwt: state.login.jwt,
    device_list: state.devices.device_list,
    device_requesting: state.devices.device_requesting,
    device_completed: state.devices.device_completed,
    device_error: state.devices.device_error,
    device: state.devices.device,
    sendmessage_fCnt: state.devicesQueue.sendmessage_fCnt,
    sendmessage_requesting: state.devicesQueue.sendmessage_requesting,
    sendmessage_completed: state.devicesQueue.sendmessage_completed,
    sendmessage_error: state.devicesQueue.sendmessage_error
  };
};

const mapDispatchToProps = dispatch => {
  return {
    filtre_device: devEUI => dispatch(filtre_device(devEUI)),
    get_devices: (offset, jwt) => dispatch(getDevices(offset, jwt)),
    reset_device: () => dispatch(reset_device()),
    sendDevicesMessage: (devEUI, message, confirmed, fPort, token) => dispatch(sendDevicesMessage(devEUI, message, confirmed, fPort, token))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Devices);
