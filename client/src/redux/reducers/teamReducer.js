import { TEAM_LOADING, SET_TEAMS } from "../actions/types";

const initialState = {
  data: [],
  loading: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case TEAM_LOADING:
      return {
        ...state,
        loading: true
      };
    case SET_TEAMS:
      return {
        ...state,
        data: action.payload,
        loading: false
      };
    default:
      return state;
  }
}
