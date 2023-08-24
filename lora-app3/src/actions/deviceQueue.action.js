import { deviceQueueConstants } from "../constants/deviceQueue.constants";
import { loginConstants } from "../constants/login.constants";

import axios from "axios";

const apiUrl = "http://163.172.162.0:8080/api";


export const sendDevicesMessage = (devEUI, message, confirmed, fPort, token) => dispatch => {
    dispatch(requestsendDevicesQueueMessage());
    dispatch({ type: loginConstants.GENERAL_SPIN });
    return axios
        .post(apiUrl + "/devices/" + devEUI + "/queue", {
            "deviceQueueItem": {
                "confirmed": confirmed,
                "data": message,
                "devEUI": devEUI,
                "fPort": fPort
            }
        },
            {
                headers: {
                    "Grpc-Metadata-Authorization": token,
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },

            }
        )
        .then(response => {
            dispatch({ type: loginConstants.GENERAL_SPIN_RESET });
            dispatch(successsendDevicesQueueMessage(response.data));
        })
        .catch(error => {
            dispatch(failsendDevicesQueueMessage(error));
            dispatch({ type: loginConstants.GENERAL_SPIN_RESET });
            dispatch({
                type: loginConstants.GENERAL_ERROR,
                error: error
            });
        });
};

export const requestsendDevicesQueueMessage = () => ({
    type: deviceQueueConstants.DEVICEQUEUE_SEND_MESSAGE_REQUEST
});

export const successsendDevicesQueueMessage = data => ({
    type: deviceQueueConstants.DEVICEQUEUE_SEND_MESSAGE_SUCCESS,
    fCnt: data.fCnt
});

export const failsendDevicesQueueMessage = err => ({
    type: deviceQueueConstants.DEVICEQUEUE_SEND_MESSAGE_FAILURE,
    error: err
});

export const getDevicesQueueMessage = (devEUI, token) => dispatch => {
    //dispatch(requestgetDevicesQueueMessage());
    dispatch({ type: loginConstants.GENERAL_SPIN });
    return axios
        .get(apiUrl + "/devices/" + devEUI + "/queue", {
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Grpc-Metadata-Authorization": token
            }
        })
        .then(response => {
            dispatch({ type: loginConstants.GENERAL_SPIN_RESET });
            dispatch(succesgetDevicesQueueMessage(response.data));
        })
        .catch(error => {
            dispatch({ type: loginConstants.GENERAL_SPIN_RESET });
            dispatch({
                type: loginConstants.GENERAL_ERROR,
                error: error
            });
            //dispatch(failgetDevicesQueueMessage(error));
        });
};

export const requestgetDevicesQueueMessage = () => ({
    type: deviceQueueConstants.DEVICEQUEUE_GET_REQUEST
});

export const succesgetDevicesQueueMessage = data => ({
    type: deviceQueueConstants.DEVICEQUEUE_GET_SUCCESS,
    deviceQueueItems: data.deviceQueueItems
});

export const failgetDevicesQueueMessage = err => ({
    type: deviceQueueConstants.DEVICEQUEUE_GET_FAILURE,
    error: err
});
