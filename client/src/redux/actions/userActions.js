import axios from "axios";
import { SET_USERS, USER_LOADING } from "./types";

export const getUsers = () => dispatch => {
  dispatch(setUserLoading);
  axios
    .get("/api/users")
    .then(res => dispatch({ type: SET_USERS, payload: res.data.users }))
    .catch(err => {
      console.err(err);
      dispatch({ type: SET_USERS, payload: {} });
    });
};
export const setUserLoading = () => {
  return {
    type: USER_LOADING
  };
};
