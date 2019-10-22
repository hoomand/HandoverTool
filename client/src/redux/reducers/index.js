import { combineReducers } from "redux";
import authReducer from "./authReducer";
import errorReducer from "./errorReducer";
import headerReducer from "./headerReducer";
import userReducer from "./userReducer";
import teamReducer from "./teamReducer";
import handoverReducer from "./handoverReducer";
import configReducer from "./configReducer";

export default combineReducers({
  auth: authReducer,
  errors: errorReducer,
  header: headerReducer,
  users: userReducer,
  teams: teamReducer,
  handovers: handoverReducer,
  configs: configReducer
});
