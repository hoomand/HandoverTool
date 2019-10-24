import axios from "axios";
import { SET_HANDOVERS, HANDOVER_LOADING, GET_ERRORS } from "./types";

export const createHandover = (handoverData, history) => dispatch => {
  axios
    .post("/api/handovers", handoverData)
    .then(() => history.push("/handovers"))
    .catch(err => dispatch({ type: GET_ERRORS, payload: err.response.data }));
};

export const getHandovers = () => dispatch => {
  dispatch(setHandoverLoading);
  axios
    .get("/api/handovers")
    .then(res => dispatch({ type: SET_HANDOVERS, payload: res.data.handovers }))
    .catch(err => dispatch({ type: GET_ERRORS, payload: err.response.data }));
};

export const setHandoverLoading = () => {
  return {
    type: HANDOVER_LOADING
  };
};
