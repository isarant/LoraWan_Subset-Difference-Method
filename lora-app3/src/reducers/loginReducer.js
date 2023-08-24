import { loginConstants } from "../constants/login.constants";

let initStore = {
  login: false,
  jwt: "",
  error: "",
  requesting: false,
  completed: false,
  general_spin: false,
  general_error: [],

};
export default function (state = initStore, action) {
  switch (action.type) {
    case loginConstants.LOGIN_REQUEST:
      console.log("LOGIN_REQUEST");
      return {
        ...state,
        login: false,
        // jwt: "",
        error: "",
        requesting: true,
        completed: false
      };

    case loginConstants.LOGIN_SUCCESS:
      console.log("LOGIN_SUCCESS");
      console.log(action);
      return {
        ...state,
        login: true,
        jwt: action.data,
        loginAt: action.receivedAt,
        error: "",
        requesting: false,
        completed: true
      };

    case loginConstants.LOGIN_FAILURE:
      console.log("LOGIN_FAILURE");
      return {
        ...state,
        login: false,
        //jwt: "",
        error: action.error,
        requesting: false,
        completed: true
      };
    case loginConstants.LOGOUT:
      console.log("LOGOUT");
      return {
        ...state,
        login: false,
        jwt: "",
        error: "",
        requesting: false,
        completed: false,
        general_modal_open: false,
        general_requesting: false,
        general_error: ""
      };
    case loginConstants.GENERAL_SPIN:
      console.log("GENERAL_SPIN");
      return {
        ...state,
        general_spin: true,
        //general_error: [],
      };
    case loginConstants.GENERAL_SPIN_RESET:
      console.log("GENERAL_SPIN_RESET");
      return {
        ...state,
        general_spin: false,
        //general_error: [],
      };
    case loginConstants.GENERAL_ERROR:
      console.log("GENERAL_ERROR");
      console.log(action.error);
      return {
        ...state,
        general_error: [...state.general_error , action.error]
      };
    case loginConstants.GENERAL_RESET_ERROR:
        console.log("GENERAL_RESET_ERROR");
        return {
          ...state,
          general_error: []

        };  
    default:
      return state;
  }
}
