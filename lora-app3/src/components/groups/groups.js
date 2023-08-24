import React, { Component } from "react";
import { connect } from "react-redux";
import { getGroups, getGroupDetails, getDevicesFromGroup } from "../../actions/groups.action";
import GroupsList from "./groupsList";
import { Button } from "react-bootstrap";

class Groups extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <div>

        <GroupsList  {...this.props} />
      </div>
    );
  }

  componentDidMount() {
    if (this.props.jwt) {
      this.props.getGroups(0, this.props.jwt).then(() => {
        //console.log("Groups this.props.groups_list");
        //console.log(this.props.groups_list);
        for (var group in this.props.groups_list) {
          //console.log('Groups group.id');
          //console.log(this.props.groups_list[group].id);
          this.props.getGroupDetails(this.props.groups_list[group].id, 0, this.props.jwt);
          this.props.getDevicesFromGroup(this.props.groups_list[group].id, 0, this.props.jwt);
        }
      })
    }
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
    getGroups: (offset, jwt) => dispatch(getGroups(offset, jwt)),
    getGroupDetails: (groupid, offset, token) => dispatch(getGroupDetails(groupid, offset, token)),
    getDevicesFromGroup: (groupid, offset, token) => dispatch(getDevicesFromGroup(groupid, offset, token))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Groups);
