import {
  HANDOVER_LOADING,
  SET_HANDOVERS,
} from "../actions/types";
import { convertArrayToHash } from "../../utils/Utils";

const initialState = {
  data: {},
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
        data: convertArrayToHash(action.payload, "id"),
        loading: false
      };
      return {
        ...state,
        data: action.payload,
        loading: false
      };
    default:
      return state;
  }
}
