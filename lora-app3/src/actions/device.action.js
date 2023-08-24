import { deviceConstants } from "../constants/device.constants";
import { loginConstants } from "../constants/login.constants";

import axios from "axios";

const apiUrl = "http://163.172.162.0:8080/api";

export const getDevices = (offset, token) => dispatch => {
  dispatch({ type: deviceConstants.DEVICES_REQUEST });
  dispatch({ type: loginConstants.GENERAL_SPIN });
  return axios
    .get(apiUrl + "/devices?limit=10&offset=" + offset, {
      headers: {
        "Grpc-Metadata-Authorization": token,
        "Content-Type": "application/json",
        "Accept": "application/json"
      }
    })
    .then(response => {
      dispatch({ type: loginConstants.GENERAL_SPIN_RESET });
      dispatch(
        {
          type: deviceConstants.DEVICES_SUCCESS,
          devices: response.data
        }
      );
    })
    .catch(error => {
      dispatch({ type: loginConstants.GENERAL_SPIN_RESET });
      dispatch({
        type: deviceConstants.DEVICES_FAILURE,
        error: error
      });
      dispatch({
        type: loginConstants.GENERAL_ERROR,
        error: error
      });
    });
};

export const editDevices = (devEUI, devicedata, token) => dispatch => {
  dispatch(() => ({ type: loginConstants.GENERAL_SPIN }));
  return axios
    .put(apiUrl + "/devices/" + devEUI, devicedata, {
      headers: {
        "Grpc-Metadata-Authorization": token,
        "Content-Type": "application/json",
        "Accept": "application/json"
      }
    })
    .then(response => {
      dispatch({ type: loginConstants.GENERAL_SPIN_RESET });
      dispatch(response.data = data => ({
        type: deviceConstants.DEVICE_EDIT_SUCCESS,
      }));
      dispatch(getDevices(token));
    })
    .catch(error => {
      dispatch({ type: loginConstants.GENERAL_SPIN_RESET });
      dispatch(error = err => ({
        type: loginConstants.GENERAL_ERROR,
        error: err
      }));
    });
};

export const addDevices = (devicedata, token) => dispatch => {
  dispatch(() => ({ type: loginConstants.GENERAL_SPIN }));
  dispatch(() => ({ type: deviceConstants.DEVICE_ADD_REQUEST }));
  return axios
    .post(apiUrl + "/devices/", devicedata, {
      headers: {
        "Grpc-Metadata-Authorization": token,
        "Content-Type": "application/json",
        "Accept": "application/json"
      }
    })
    .then(response => {
      dispatch({ type: loginConstants.GENERAL_SPIN_RESET });
      dispatch(response.data = data => ({
        type: deviceConstants.DEVICE_ADD_SUCCESS,
      }));
      dispatch(getDevices(token));
    })
    .catch(error => {
      dispatch({ type: loginConstants.GENERAL_SPIN_RESET });
      dispatch(error = err => ({
        type: loginConstants.GENERAL_ERROR,
        error: err
      }));
    });
};

export const delDevices = (devEUI, token) => dispatch => {
  dispatch(() => ({ type: loginConstants.GENERAL_SPIN }));
  return axios
    .delete(apiUrl + "/devices/" + devEUI, {
      headers: {
        "Grpc-Metadata-Authorization": token,
        "Content-Type": "application/json",
        "Accept": "application/json"
      }
    })
    .then(response => {
      dispatch({ type: loginConstants.GENERAL_SPIN_RESET });
      dispatch(response.data = data => ({
        type: deviceConstants.DEVICE_ADD_SUCCESS,
      }));
      dispatch(getDevices(token));
    })
    .catch(error => {
      dispatch({ type: loginConstants.GENERAL_SPIN_RESET });
      dispatch(error = err => ({
        type: loginConstants.GENERAL_ERROR,
        error: err
      }));
    });
};

export const filtre_device = devEUI => (
  {
    type: deviceConstants.DEVICE_FILTRE,
    devEUI: devEUI
  });

export const reset_device = devEUI => ({
  type: deviceConstants.DEVICE_RESET,
  devEUI: devEUI
});
