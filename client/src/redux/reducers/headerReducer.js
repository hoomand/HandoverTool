import { SET_HEADER_TITLE } from "../actions/types";
const initialState = {
  headerTitle: "Login"
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_HEADER_TITLE:
      return {
        ...state,
        headerTitle: action.payload
      };
    default:
      return state;
  }
}
