import axios from "axios";
import { SET_TEAMS, TEAM_LOADING } from "./types";

export const getTeams = () => dispatch => {
  dispatch(setTeamLoading);
  axios
    .get("/api/teams")
    .then(res => dispatch({ type: SET_TEAMS, payload: res.data.teams }))
    .catch(err => {
      console.log(err);
      dispatch({ type: SET_TEAMS, payload: {} });
    });
};
export const setTeamLoading = () => {
  return {
    type: TEAM_LOADING
  };
};
