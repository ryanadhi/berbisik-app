import {
  SET_WHISPERS,
  LOADING_DATA,
  LIKE_WHISPER,
  UNLIKE_WHISPER,
  DELETE_WHISPER,
  SET_ERRORS,
  POST_WHISPER,
  CLEAR_ERRORS,
  LOADING_UI,
  SET_WHISPER,
  STOP_LOADING_UI,
  SUBMIT_COMMENT,
  LOADING_POST_WHISPER,
  STOP_LOADING_POST_WHISPER,
} from "../types";

import axios from "axios";

// Get all whispers
export const getWhispers = () => (dispatch) => {
  dispatch({ type: LOADING_DATA });
  axios
    .get("/whispers")
    .then(({ data }) => {
      dispatch({
        type: SET_WHISPERS,
        payload: data,
      });
    })
    .catch((err) => {
      dispatch({
        type: SET_WHISPERS,
        payload: [],
      });
    });
};

// Get one whisper
export const getWhisper = (whisperId) => (dispatch) => {
  dispatch({ type: LOADING_UI });
  axios
    .get(`/whispers/${whisperId}`)
    .then(({ data }) => {
      dispatch({
        type: SET_WHISPER,
        payload: data,
      });
      dispatch({ type: STOP_LOADING_UI });
    })
    .catch((err) => console.log(err));
};

// Post one whisper
export const postWhisper = (newWhisper) => (dispatch) => {
  dispatch({ type: LOADING_POST_WHISPER });
  axios
    .post("/whispers", newWhisper)
    .then(({ data }) => {
      dispatch({
        type: POST_WHISPER,
        payload: data,
      });
      dispatch(clearErrors());
    })
    .catch((err) => {
      dispatch({
        type: SET_ERRORS,
        payload: err.response.data,
      });
    })
    .finally(() => {
      dispatch({ type: STOP_LOADING_POST_WHISPER });
    });
};

// Like a whisper
export const likeWhisper = (whisperId) => (dispatch) => {
  axios
    .get(`/whispers/${whisperId}/like`)
    .then(({ data }) => {
      dispatch({
        type: LIKE_WHISPER,
        payload: data,
      });
    })
    .catch((err) => console.log(err));
};

// Unlike a whisper
export const unlikeWhisper = (whisperId) => (dispatch) => {
  axios
    .get(`/whispers/${whisperId}/unlike`)
    .then(({ data }) => {
      dispatch({
        type: UNLIKE_WHISPER,
        payload: data,
      });
    })
    .catch((err) => console.log(err));
};

// Submit a comment
export const submitComment = (whisperId, commentData) => (dispatch) => {
  axios
    .post(`/whispers/${whisperId}/comment`, commentData)
    .then(({ data }) => {
      dispatch({
        type: SUBMIT_COMMENT,
        payload: data,
      });
      dispatch(clearErrors());
    })
    .catch((err) => {
      dispatch({
        type: SET_ERRORS,
        payload: err.response.data,
      });
    });
};

// Delete a whisper
export const deleteWhisper = (whisperId) => (dispatch) => {
  axios
    .delete(`/whispers/${whisperId}`)
    .then(() => {
      dispatch({ type: DELETE_WHISPER, payload: whisperId });
    })
    .catch((err) => console.log(err));
};

// Get whispers for one account
export const getUserData = (username) => (dispatch) => {
  dispatch({ type: LOADING_DATA });
  axios
    .get(`/users/${username}`)
    .then(({ data }) => {
      dispatch({
        type: SET_WHISPERS,
        payload: data.whispers,
      });
    })
    .catch(() => {
      dispatch({
        type: SET_WHISPERS,
        payload: [],
      });
    });
};

export const clearErrors = () => (dispatch) => {
  dispatch({ type: CLEAR_ERRORS });
};
