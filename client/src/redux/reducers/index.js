import { combineReducers } from "redux";
import authReducer from "./authReducer";
import errorReducer from "./errorReducer";
import headerReducer from "./headerReducer";
import userReducer from "./userReducer";
import teamReducer from "./teamReducer";

export default combineReducers({
  auth: authReducer,
  errors: errorReducer,
  header: headerReducer,
  users: userReducer,
  teams: teamReducer
});
