import { deviceQueueConstants } from "../constants/deviceQueue.constants";
let initStore = {
    sendmessage_fCnt: 0,
    sendmessage_requesting: false,
    sendmessage_completed: false,
    sendmessage_error: "",
    deviceQueueItems: [],
    getdeviceQueue_requesting: false,
    getdeviceQueue_completed: false,
    getdeviceQueue_error: ""

};

export default function (state = initStore, action) {
    switch (action.type) {
        case deviceQueueConstants.DEVICEQUEUE_SEND_MESSAGE_REQUEST:
            console.log("DEVICEQUEUE_SEND_MESSAGE_REQUEST");
            return {
                ...state,
                sendmessage_fCnt: 0,
                sendmessage_requesting: true,
                sendmessage_completed: false,
                sendmessage_error: false,
            };
        case deviceQueueConstants.DEVICEQUEUE_SEND_MESSAGE_SUCCESS:
            console.log("DEVICEQUEUE_SEND_MESSAGE_SUCCESS");
            return {
                ...state,
                sendmessage_fCnt: action.fCnt,
                sendmessage_requesting: false,
                sendmessage_completed: true,
                sendmessage_error: ""
            };
        case deviceQueueConstants.DEVICEQUEUE_SEND_MESSAGE_FAILURE:
            console.log("DEVICEQUEUE_SEND_MESSAGE_FAILURE");
            return {
                ...state,
                sendmessage_requesting: false,
                sendmessage_completed: true,
                sendmessage_error: action.error
            };
        case deviceQueueConstants.DEVICEQUEUE_GET_REQUEST:
            console.log("DEVICEQUEUE_GET_REQUEST");
            return {
                ...state,
                deviceQueueItems: [],
                getdeviceQueue_requesting: true,
                getdeviceQueue_completed: false,
                getdeviceQueue_error: false,
            };
        case deviceQueueConstants.DEVICEQUEUE_GET_SUCCESS:
            console.log("DEVICEQUEUE_GET_SUCCESS");
            return {
                ...state,
                deviceQueueItems: action.deviceQueueItems,
                getdeviceQueue_requesting: false,
                getdeviceQueue_completed: true,
                getdeviceQueue_error: ""
            };
        case deviceQueueConstants.DEVICEQUEUE_GET_FAILURE:
            console.log("DEVICEQUEUE_GET_FAILURE");
            return {
                ...state,
                getdeviceQueue_requesting: false,
                getdeviceQueue_completed: true,
                getdeviceQueue_error: action.error
            };
        default:
            return state;
    }
}  