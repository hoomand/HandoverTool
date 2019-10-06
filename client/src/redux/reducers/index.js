import { combineReducers } from "redux";
import authReducer from "./authReducer";
import errorReducer from "./errorReducer";
import headerReducer from "./headerReducer";

export default combineReducers({
  auth: authReducer,
  errors: errorReducer,
  header: headerReducer
});
