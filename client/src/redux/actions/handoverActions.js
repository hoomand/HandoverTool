import axios from "axios";
import {
  SET_HANDOVERS,
  SET_HANDOVER,
  HANDOVER_LOADING,
  GET_ERRORS,
  RESET_ERRORS
} from "./types";

export const createHandover = (handoverData, history) => dispatch => {
  dispatch({ type: RESET_ERRORS });
  axios
    .post("/api/handovers", handoverData)
    .then(() => history.push("/handovers"))
    .catch(err => dispatch({ type: GET_ERRORS, payload: err.response.data }));
};

export const getHandovers = () => dispatch => {
  dispatch({ type: RESET_ERRORS });
  dispatch(setHandoverLoading);
  axios
    .get("/api/handovers")
    .then(res => dispatch({ type: SET_HANDOVERS, payload: res.data.handovers }))
    .catch(err => dispatch({ type: GET_ERRORS, payload: err.response.data }));
};

export const getHandover = handoverId => (dispatch, getState) => {
  dispatch({ type: RESET_ERRORS });
  if (!(handoverId in getState().handovers)) {
    dispatch(setHandoverLoading);
    axios
      .get(`/api/handovers/${handoverId}`)
      .then(res =>
        dispatch({ type: SET_HANDOVER, payload: res.data.handover[0] })
      )

      .catch(err => dispatch({ type: GET_ERRORS, payload: err.response.data }));
  }
};

export const setHandoverLoading = () => {
  return {
    type: HANDOVER_LOADING
  };
};
