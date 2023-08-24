import { loginConstants } from "../constants/login.constants";

import axios from "axios";

const apiUrl = "http://163.172.162.0:8080/api/internal/login";

export const logintoserver = (username, password) => dispatch => {
  dispatch(requestLogin());
  return axios
    .post(apiUrl, {
      password: password,
      username: username
    })
    .then(response => {
      dispatch(recieveLogin(response.data));
    })
    .catch(error => {
      dispatch(failLogin(error));
    });
};

export const requestLogin = () => ({
  type: loginConstants.LOGIN_REQUEST
});

export const recieveLogin = data => ({
  type: loginConstants.LOGIN_SUCCESS,
  data: data.jwt
});

export const failLogin = err => ({
  type: loginConstants.LOGIN_FAILURE,
  error: err
});

export const logOut = () => ({
  type: loginConstants.LOGOUT
});

export const general_error_reset = ()=>({
  type: loginConstants.GENERAL_RESET_ERROR
});