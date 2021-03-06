import {
  SET_WHISPERS,
  LIKE_WHISPER,
  UNLIKE_WHISPER,
  LOADING_DATA,
  DELETE_WHISPER,
  POST_WHISPER,
  SET_WHISPER,
  SUBMIT_COMMENT,
  LOADING_POST_WHISPER,
  STOP_LOADING_POST_WHISPER,
} from "../types";

const initialState = {
  whispers: [],
  whisper: {},
  dataLoading: false,
  postWhisperLoading: false,
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
      let indexLike = state.whispers.findIndex(
        (whisper) => whisper.whisperId === actions.payload.whisperId
      );
      state.whispers[indexLike] = actions.payload;
      if (state.whisper.whisperId === actions.payload.whisperId) {
        state.whisper.likeCount = state.whisper.likeCount + 1;
      }
      return {
        ...state,
      };
    case UNLIKE_WHISPER:
      let indexUnlike = state.whispers.findIndex(
        (whisper) => whisper.whisperId === actions.payload.whisperId
      );
      state.whispers[indexUnlike] = actions.payload;
      if (state.whisper.whisperId === actions.payload.whisperId) {
        state.whisper.likeCount = state.whisper.likeCount - 1;
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
      let indexComment = state.whispers.findIndex(
        (whisper) => whisper.whisperId === actions.payload.whisperId
      );
      state.whispers[indexComment].commentCount =
        state.whispers[indexComment].commentCount + 1;
      return {
        ...state,
        whisper: {
          ...state.whisper,
          commentCount: state.whisper.commentCount + 1,
          comments: [actions.payload, ...state.whisper.comments],
        },
      };
    case LOADING_POST_WHISPER:
      return {
        ...state,
        postWhisperLoading: true,
      };
    case STOP_LOADING_POST_WHISPER:
      return {
        ...state,
        postWhisperLoading: false,
      };
    default:
      return state;
  }
}
