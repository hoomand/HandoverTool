import axios from "axios";
import { CONFIGS_LOADING, SET_CONFIGS } from "../actions/types";

export const getConfigs = () => dispatch => {
  dispatch(setConfigsLoading);
  axios
    .get("/api/configs/app")
    .then(res => dispatch({ type: SET_CONFIGS, payload: res.data }));
};

export const setConfigsLoading = () => {
  return {
    type: CONFIGS_LOADING
  };
};
