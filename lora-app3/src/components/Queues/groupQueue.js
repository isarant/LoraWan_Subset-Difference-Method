import React from "react";
import { connect } from "react-redux";
import ShowQueue from "./showQueue"
import { getGroupQueue } from "../../actions/groups.action"

const GroupQueue = (Queue) => {
    return class extends Queue {
        constructor(props) {
            super(props);
            this.state = { preview: false };
        }
        render() {
            if (this.props.show && !this.state.preview) {
                this.setState({ preview: true })
                if (this.props.jwt)
                    this.props.getGroupQueue(this.props.groupid, this.props.jwt);
            }

            if (this.props.groupQueueItems) {
                console.log(this.props.groupQueueItems)
                return (
                    <Queue
                        getQueueMessage={this.props.groupQueueItems}
                        show={this.props.show}
                        id={this.props.groupid}
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
        groupQueueItems: state.groups.groupQueueItems

    };
};

const mapDispatchToProps = dispatch => {
    return {
        getGroupQueue: (groupid, jwt) => dispatch(getGroupQueue(groupid, jwt)),
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(GroupQueue(ShowQueue));
