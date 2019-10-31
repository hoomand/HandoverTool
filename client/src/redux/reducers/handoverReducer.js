import {
  HANDOVER_LOADING,
  SET_HANDOVERS,
  SET_HANDOVER
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
    case SET_HANDOVER:
      // eslint-disable-next-line no-case-declarations
      const { data } = state;
      data[action.payload.id] = action.payload;
      return {
        ...state,
        data: data,
        loading: false
      };

    default:
      return state;
  }
}
