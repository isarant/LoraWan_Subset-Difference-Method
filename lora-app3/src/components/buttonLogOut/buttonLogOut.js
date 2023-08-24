import React from "react";
import { connect } from "react-redux";
import { logOut } from "../../actions/login.action";

const ButtonLogOut = ({ logout }) => {
  return <button onClick={logout}>Logout</button>;
};
const mapDispatchToProps = dispatch => {
  return {
    logout: () => dispatch(logOut())
  };
};
export default connect(
  null,
  mapDispatchToProps
)(ButtonLogOut);
