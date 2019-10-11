import { USER_LOADING, SET_USERS } from "../actions/types";

const initialState = {
  data: [],
  loading: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case USER_LOADING:
      return {
        ...state,
        loading: true
      };
    case SET_USERS:
      return {
        ...state,
        data: action.payload,
        loading: false
      };
    default:
      return state;
  }
}
