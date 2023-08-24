import { groupsConstants } from "../constants/groups.constants";
import { loginConstants } from "../constants/login.constants";

import axios from "axios";

const apiUrl = "http://163.172.162.0:8080/api";

export const getGroups = (offset, token) => dispatch => {
    dispatch({ type: loginConstants.GENERAL_SPIN });
    return axios
        .get(apiUrl + "/multicast-groups?limit=10&offset=" + offset, {
            headers: {
                "Grpc-Metadata-Authorization": token,
                "Content-Type": "application/json",
                "Accept": "application/json"
            }
        })
        .then(response => {
            dispatch({ type: loginConstants.GENERAL_SPIN_RESET });
            dispatch({
                type: groupsConstants.GROUPS_SUCCESS,
                groups: response.data
            });

        })
        .catch(error => {
            dispatch({ type: loginConstants.GENERAL_SPIN_RESET });
            dispatch({
                type: loginConstants.GENERAL_ERROR,
                error: error
            });
        });
};

export const getDevicesFromGroup = (groupid, offset, token) => dispatch => {
    dispatch({ type: loginConstants.GENERAL_SPIN });
    return axios
        .get(apiUrl + "/devices?multicastGroupID=" + groupid + "&limit=10&offset=" + offset, {
            headers: {
                "Grpc-Metadata-Authorization": token,
                "Content-Type": "application/json",
                "Accept": "application/json"
            }
        })
        .then(response => {
            console.log('group_list_devices');
            console.log(response.data.result);
            dispatch({
                type: groupsConstants.GET_DEVICE_FROM_GROUP_SUCCESS,
                group_list_devices: response.data ? response.data.result : [],
                group_id: groupid
            });
            dispatch({ type: loginConstants.GENERAL_SPIN_RESET });
        })
        .catch(error => {
            dispatch({ type: loginConstants.GENERAL_SPIN_RESET });
            dispatch({
                type: loginConstants.GENERAL_ERROR,
                error: error
            });
        });
};

export const getGroupDetails = (groupid, offset, token) => dispatch => {
    dispatch({ type: loginConstants.GENERAL_SPIN });
    return axios
        .get(apiUrl + "/multicast-groups/" + groupid, {
            headers: {
                "Grpc-Metadata-Authorization": token,
                "Content-Type": "application/json",
                "Accept": "application/json"
            }
        })
        .then(response => {
            dispatch({ type: loginConstants.GENERAL_SPIN_RESET });
            //console.log("getGroupDetails");
            //console.log(response.data.multicastGroup);
            dispatch({
                type: groupsConstants.GET_GROUP_DETAILS_SUCCESS,
                group_details: response.data.multicastGroup,
                group_id: groupid
            });

        })
        .catch(error => {
            dispatch({ type: loginConstants.GENERAL_SPIN_RESET });
            dispatch({
                type: loginConstants.GENERAL_ERROR,
                error: error
            });
        });
};

export const getGroupQueue = (groupid, token) => dispatch => {
    dispatch({ type: loginConstants.GENERAL_SPIN });
    return axios
        .get(apiUrl + "/multicast-groups/" + groupid + "/queue", {
            headers: {
                "Grpc-Metadata-Authorization": token,
                "Content-Type": "application/json",
                "Accept": "application/json"
            }
        })
        .then(response => {
            dispatch({ type: loginConstants.GENERAL_SPIN_RESET });
            //console.log(response.data);
            dispatch({
                type: groupsConstants.GET_QUEUE_GROUP_SUCCESS,
                group_queue_items: response.data.multicastGroup,
                group_id: groupid
            });

        })
        .catch(error => {
            dispatch({ type: loginConstants.GENERAL_SPIN_RESET });
            dispatch({
                type: loginConstants.GENERAL_ERROR,
                error: error
            });
        });
};

export const sendGroupMessage = (groupid, message, confirmed, fPort, token) => dispatch => {
    dispatch({ type: loginConstants.GENERAL_SPIN });
    console.log("fdd");
    console.log(groupid, message, confirmed, fPort, token);
    return axios
        .post(apiUrl + "/multicast-groups/" + groupid + "/queue", {
            "multicastQueueItem": {
                "confirmed": confirmed,
                "data": message,
                "multicastGroupID": groupid,
                "fPort": fPort
            }
        },
            {
                headers: {
                    "Grpc-Metadata-Authorization": token,
                    //"Content-Type": "application/json",
                    "Accept": "application/json"
                },

            }
        )
        .then(response => {
            dispatch({ type: loginConstants.GENERAL_SPIN_RESET });
            dispatch({
                type: groupsConstants.SEND_MESSAGE_TO_GROUP_SUCCESS,
                fCnt: response.data.fCnt,
            });
        })
        .catch(error => {
            dispatch({ type: loginConstants.GENERAL_SPIN_RESET });
            dispatch({
                type: loginConstants.GENERAL_ERROR,
                error: error
            });
        });


};

export const sendGroupNNLMessage = (mymessage, InvokeList) => dispatch => {
    dispatch({ type: loginConstants.GENERAL_SPIN });

    var msg = '{"message":"' + mymessage + '", "vu":[' + InvokeList.join(',') + ']}';

    const msg2 = {
        message: mymessage,
        vu: InvokeList
    };
    console.log(msg);
    return axios
        .post("http://163.172.162.0:3002/NNL/", {
            message: mymessage,
            vu: InvokeList
        },
            {
                headers: {
                    "Content-Type": "application/json",
                    // "Accept": "application/json",
                    //  "Access-Control-Allow-Origin": "*"
                },
            }
        )
        .then(response => {
            dispatch({ type: loginConstants.GENERAL_SPIN_RESET });
            dispatch({
                type: groupsConstants.SEND_MESSAGE_NNL_SUCCESS,
                fCnt: response.data.fCnt,
            });
        })
        .catch(error => {
            dispatch({ type: loginConstants.GENERAL_SPIN_RESET });
            dispatch({
                type: loginConstants.GENERAL_ERROR,
                error: error
            });
        });


};
