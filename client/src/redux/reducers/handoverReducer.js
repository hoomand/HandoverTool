import { HANDOVER_LOADING, SET_HANDOVERS } from "../actions/types";

const initialState = {
  data: [],
  loading: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case HANDOVER_LOADING:
      return {
        ...state,
        loading: true
      };
    case SET_HANDOVERS:
      return {
        ...state,
        data: action.payload,
        loading: false
      };
    default:
      return state;
  }
}
