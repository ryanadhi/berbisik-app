import {
  SET_WHISPERS,
  LIKE_WHISPER,
  UNLIKE_WHISPER,
  LOADING_DATA,
  DELETE_WHISPER,
  POST_WHISPER,
  SET_WHISPER,
  SUBMIT_COMMENT,
} from "../types";

const initialState = {
  whispers: [],
  whisper: {},
  dataLoading: false,
};

export default function (state = initialState, actions) {
  switch (actions.type) {
    case LOADING_DATA:
      return {
        ...state,
        dataLoading: true,
      };
    case SET_WHISPERS:
      return {
        ...state,
        whispers: actions.payload,
        dataLoading: false,
      };
    case SET_WHISPER:
      return {
        ...state,
        whisper: actions.payload,
      };
    case LIKE_WHISPER:
    case UNLIKE_WHISPER:
      let indexLike = state.whispers.findIndex(
        (whisper) => whisper.whisperId === actions.payload.whisperId
      );
      state.whispers[indexLike] = actions.payload;
      if (state.whisper.whisperId === actions.payload.whisperId) {
        state.whisper = actions.payload;
      }
      return {
        ...state,
      };
    case DELETE_WHISPER:
      let indexDelete = state.whispers.findIndex(
        (whisper) => whisper.whisperId === actions.payload
      );
      state.whispers.splice(indexDelete, 1);
      return {
        ...state,
      };
    case POST_WHISPER:
      return {
        ...state,
        whispers: [actions.payload, ...state.whispers],
      };
    case SUBMIT_COMMENT:
      return {
        ...state,
        whisper: {
          ...state.whisper,
          comments: [actions.payload, ...state.whisper.comments],
        },
      };
    default:
      return state;
  }
}
