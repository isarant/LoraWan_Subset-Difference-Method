import { deviceConstants } from "../constants/device.constants";

let initStore = {
  device_total_count: 0,
  device_offset: 0,
  device_list: [],
  device_error: "",
  device_requesting: false,
  device_completed: false,
  device: {},
};
export default function (state = initStore, action) {
  switch (action.type) {
    case deviceConstants.DEVICES_REQUEST:
      console.log("DEVICES_REQUEST");
      return {
        ...state,
        device_list: [],
        device_total_count: 0,
        device_error: "",
        device_requesting: true,
        device_completed: false,
        device: {}
      };

    case deviceConstants.DEVICES_SUCCESS:
      console.log("DEVICES_SUCCESS");
      return {
        ...state,
        device_error: "",
        device_list: action.devices.result,
        device_total_count: action.devices.totalCount,
        device_requesting: false,
        device_completed: true,
        device: {}
      };

    case deviceConstants.DEVICES_FAILURE:
      console.log("DEVICES_FAILURE");
      return {
        ...state,
        device_list: [],
        device_error: action.error,
        device_requesting: false,
        device_completed: true,
        device: {}
      };

    case deviceConstants.DEVICE_FILTRE:
      console.log("DEVICE_FILTRE");
      if ((action.devEUI !== "") & (state.device_list !== [])) {
        const mydevice = state.device_list.filter(
          device => device.devEUI === action.devEUI
        );
        return {
          ...state,
          device: mydevice,
          device_error: "",
          device_requesting: false,
          device_completed: false
        };
      } else {
        return state;
      }
    case deviceConstants.DEVICE_RESET:
      console.log("DEVICE_RESET");
      return {
        ...state,
        device: {}
      };
    default:
      return state;
  }
}
