import { SET_HEADER_TITLE } from "../actions/types";

export const setHeaderTitle = title => {
  return {
    type: SET_HEADER_TITLE,
    payload: title
  };
};
