import React from "react";
import { connect } from "react-redux";
import ShowQueue from "./showQueue"
import { getDevicesQueueMessage } from "../../actions/deviceQueue.action"

const DeviceQueue = (Queue) => {
    return class extends Queue {
        constructor(props) {
            super(props);
            this.state = { preview: false };
        }
        render() {
            if (this.props.show && !this.state.preview) {
                this.setState({ preview: true })
                if (this.props.jwt)
                    this.props.getDevicesQueueMessage(this.props.devEUI, this.props.jwt);
            }

            if (this.props.deviceQueueItems) {
                console.log(this.props.deviceQueueItems)
                return (
                    <Queue
                        getQueueMessage={this.props.deviceQueueItems}
                        show={this.props.show}
                        id={this.props.devEUI}
                        name={this.props.name}
                        onHide={this.props.onHide}
                    />
                )
            } else {
                return <div />;
            }
        }
    }
}

const mapStateToProps = state => {
    return {
        jwt: state.login.jwt,
        deviceQueueItems: state.devicesQueue.deviceQueueItems,
        getdeviceQueue_requesting: state.devicesQueue.getdeviceQueue_requesting,
        getdeviceQueue_completed: state.devicesQueue.getdeviceQueue_completed,
        getdeviceQueue_error: state.devicesQueue.getdeviceQueue_error
    };
};

const mapDispatchToProps = dispatch => {
    return {
        getDevicesQueueMessage: (devEUI, jwt) => dispatch(getDevicesQueueMessage(devEUI, jwt)),
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(DeviceQueue(ShowQueue));
