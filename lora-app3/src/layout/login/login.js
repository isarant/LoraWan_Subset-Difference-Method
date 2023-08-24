import React, { Component } from "react";
import { connect } from "react-redux";
import { Formik } from "formik";
import { logintoserver } from "../../actions/login.action";

class Login extends Component {
  render() {
    return (
      <div>
        <Formik
          initialValues={{ userName: "admin", userPassword: "lante928" }}
          validate={values => {}}
          onSubmit={values => {
            console.log(values);
            this.props.logintoserver(values.userName, values.userPassword);
          }}
          render={({
            touched,
            errors,
            values,
            handleChange,
            handleBlur,
            handleSubmit
          }) => (
            <form onSubmit={handleSubmit}>
              <div className="form-group row ">
                <label className="col-sm-2 col-form-label">UserName</label>
                <div className="col-sm-10">
                  <input
                    type="text"
                    className="form-control"
                    name="userName"
                    placeholder="UserName"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.UserName}
                  />
                </div>
              </div>
              <div className="form-group row">
                <label className="col-sm-2 col-form-label">Password</label>
                <div className="col-sm-10">
                  <input
                    type="password"
                    className="form-control"
                    name="userPassword"
                    placeholder="Password"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.userPassword}
                  />
                </div>
              </div>
              {this.props.error !== "" && <div>{this.props.error.message}</div>}
              <div className="form-group row ">
                <div className="col-sm-10">
                  <input type="submit" value="Submit" />
                </div>
              </div>
            </form>
          )}
        />
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    logintoserver: (username, password) =>
      dispatch(logintoserver(username, password))
  };
};

const mapStateToProps = state => {
  return {
    login: state.login.login,
    jwt: state.login.jwt,
    loginAt: state.login.loginAt,
    error: state.login.error,
    requesting: state.login.requesting,
    completed: state.login.completed
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Login);
