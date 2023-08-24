import React, { Component } from 'react';
import { connect } from "react-redux";
import { sendGroupMessage, sendGroupNNLMessage } from "../../actions/groups.action";
import { Card, Button } from "react-bootstrap";
import GroupListDevices from "./groupListDevices"
import SendMessage from "../Queues/sendMessage"
import { FaRegTrashAlt, FaRegPaperPlane, FaRegListAlt, FaSitemap } from "react-icons/fa";

const a = {
    display: 'inline-block',
    fontsize: '20px',
    padding: '20px'
};

class Group extends Component {
    constructor(props) {
        super(props);
        this.state = {
            Modal: false,
            NNL: false,
            InvokeList: []
        };
    }


    // console.log("Group group ");
    // console.log(group);
    // console.log("Group group_details ");
    // console.log(group_details);

    // console.log(id ? id : "");
    // console.log("Group group_devices ");
    // console.log(group_devices);
    render() {
        var { group, group_devices, group_details } = this.props;
        if (group_details)
            var { id, name, mcAddr, mcNwkSKey, mcAppSKey, fCnt, groupType, dr, frequency, pingSlotPeriod, serviceProfileID } = group_details;
        return (
            <frameElement>
                <Card>
                    <Card.Body>
                        <Card.Title>{name ? name : ""}</Card.Title>
                        <Card.Text>
                            <GroupListDevices group_devices={group_devices} onChangeInvokeList={(InvokeList) => { this.setState({ InvokeList: InvokeList }) }} />
                        </Card.Text>
                        <Card.Text>
                            {this.state.InvokeList.length}
                            <div>{this.state.InvokeList.map(val => (<div style={a} >  {val}</div>))}</div>
                            {group_devices ? <Button variant="light" onClick={() => { this.setState({ Modal: true, NNL: false }) }}> <FaRegPaperPlane /></Button> : ""}

                            {this.state.InvokeList.length > 0 ? <Button variant="light" onClick={() => { this.setState({ Modal: true, NNL: true }) }}> <FaSitemap /></Button> : ""}

                        </Card.Text>
                    </Card.Body>
                </Card>
                <SendMessage
                    show={this.state.Modal}
                    nnl={this.state.NNL}
                    InvokeList={this.state.InvokeList}
                    sendmessage={(id, message, confirmed, fPort) => {
                        if (this.props.jwt)
                            this.props.sendGroupMessage(id, message, confirmed, fPort, this.props.jwt);
                    }}
                    sendmessagennl={(message) => {
                        this.props.sendGroupNNLMessage(message, this.state.InvokeList);
                    }}
                    onHide={() => { this.setState({ Modal: false }) }}
                    id={id ? id : ""}
                    name={name ? name : ""}
                    error_message={""}
                />
            </frameElement>
        );
    }
}

const mapStateToProps = state => {
    return {
        jwt: state.login.jwt,
        groups_list: state.groups.groups_list,
        groups_offset: state.groups.groups_offset,
        groups_list_details: state.groups.groups_list_details,
        groups_list_devices: state.groups.groups_list_devices
    };
};

const mapDispatchToProps = dispatch => {
    return {
        sendGroupMessage: (groupid, message, confirmed, fPort, token) => dispatch(sendGroupMessage(groupid, message, confirmed, fPort, token)),
        sendGroupNNLMessage: (message, InvokeList) => dispatch(sendGroupNNLMessage(message, InvokeList))
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Group);
