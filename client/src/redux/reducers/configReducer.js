import { CONFIGS_LOADING, SET_CONFIGS } from "../actions/types";

const initialState = {
  data: {},
  loading: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case CONFIGS_LOADING:
      return {
        ...state,
        loading: true
      };
    case SET_CONFIGS:
      return {
        ...state,
        data: action.payload,
        loading: false
      };
    default:
      return state;
  }
}
