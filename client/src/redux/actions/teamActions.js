import axios from "axios";
import { SET_TEAMS, TEAM_LOADING, GET_ERRORS } from "./types";

export const createTeam = (teamData, history) => dispatch => {
  axios
    .post("/api/teams", teamData)
    .then(() => history.push("/teams"))
    .catch(err => dispatch({ type: GET_ERRORS, payload: err.response.data }));
};

export const getTeams = () => dispatch => {
  dispatch(setTeamLoading);
  axios
    .get("/api/teams")
    .then(res => dispatch({ type: SET_TEAMS, payload: res.data.teams }))
    .catch(err => {
      dispatch({ type: GET_ERRORS, payload: err.response.data });
      dispatch({ type: SET_TEAMS, payload: {} });
    });
};
export const setTeamLoading = () => {
  return {
    type: TEAM_LOADING
  };
};
