import {
  SET_USER,
  SET_AUTHENTICATED,
  SET_UNAUTHENTICATED,
  LOADING_USER,
} from "../types";

const initialState = {
  authenticated: false,
  userLoading: false,
  credentials: {},
  likes: [],
  notifications: [],
};

export default function userReducer(state = initialState, action) {
  switch (action.type) {
    case SET_AUTHENTICATED:
      return {
        ...state,
        authenticated: true,
      };
    case SET_UNAUTHENTICATED:
      return initialState;
    case SET_USER:
      return {
        authenticated: true,
        userLoading: false,
        ...action.payload,
      };
    case LOADING_USER:
      return {
        ...state,
        userLoading: true,
      };
    default:
      return state;
  }
}
