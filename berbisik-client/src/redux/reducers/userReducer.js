import {
  SET_USER,
  SET_AUTHENTICATED,
  SET_UNAUTHENTICATED,
  LOADING_USER,
  LIKE_WHISPER,
  UNLIKE_WHISPER,
  MARK_NOTIFICATIONS_READ,
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
    case LIKE_WHISPER:
      return {
        ...state,
        likes: [
          ...state.likes,
          {
            userCreated: state.credentials.username,
            whisperId: action.payload.whisperId,
            createdAt: new Date().toISOString(),
          },
        ],
      };
    case UNLIKE_WHISPER:
      return {
        ...state,
        likes: state.likes.filter(
          (like) => like.whisperId !== action.payload.whisperId
        ),
      };
    case MARK_NOTIFICATIONS_READ:
      state.notifications.forEach((not) => (not.read = true));
      return {
        ...state,
      };
    default:
      return state;
  }
}
