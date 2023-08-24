import { combineReducers } from "redux";
import devicesReducer from "./devicesReducer";
import loginReducer from "./loginReducer";
import devicesQueueReducer from "./devicesQueueReducer"
import groupsReducer from "./groupsReducer"
const allReducers = combineReducers({
  login: loginReducer,
  devices: devicesReducer,
  devicesQueue: devicesQueueReducer,
  groups: groupsReducer
});
export default allReducers;
