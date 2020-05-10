import axios from "axios";
import {
  SET_USER,
  SET_ERRORS,
  CLEAR_ERRORS,
  LOADING_UI,
  LOADING_USER,
  SET_UNAUTHENTICATED,
  MARK_NOTIFICATIONS_READ,
} from "../types";
import { getWhispers } from "./dataAction";

// Helpers
const setAuthorizationHeader = (token) => {
  const firebaseAuthToken = `Bearer ${token}`;
  localStorage.setItem("firebaseAuthToken", firebaseAuthToken);
  axios.defaults.headers.common["Authorization"] = firebaseAuthToken;
};

export const login = (userData, history) => (dispatch) => {
  dispatch({ type: LOADING_UI });
  axios
    .post("/login", userData)
    .then(({ data }) => {
      setAuthorizationHeader(data.token);
      dispatch(getUserData());
      dispatch({ type: CLEAR_ERRORS });
      history.push("/");
    })
    .catch((err) => {
      dispatch({
        type: SET_ERRORS,
        payload: err.response.data,
      });
    });
};

export const signup = (newUserData, history) => (dispatch) => {
  dispatch({ type: LOADING_UI });
  axios
    .post("/signup", newUserData)
    .then(({ data }) => {
      setAuthorizationHeader(data.token);
      dispatch(getUserData());
      dispatch({ type: CLEAR_ERRORS });
      history.push("/");
    })
    .catch((err) => {
      dispatch({
        type: SET_ERRORS,
        payload: err.response.data,
      });
    });
};

export const logout = () => (dispatch) => {
  localStorage.removeItem("firebaseAuthToken");
  delete axios.defaults.headers.common["Authorization"];
  dispatch({ type: SET_UNAUTHENTICATED });
};

export const uploadImage = (formData) => (dispatch) => {
  dispatch({ type: LOADING_USER });
  axios
    .post("/users/image", formData)
    .then(() => {
      dispatch(getUserData());
      setTimeout(() => {
        dispatch(getWhispers());
      }, 2500);
    })
    .catch((err) => console.log(err));
};

export const editUserDetails = (userDetails) => (dispatch) => {
  dispatch({ type: LOADING_USER });
  axios
    .post("/users", userDetails)
    .then(() => {
      dispatch(getUserData());
    })
    .catch((err) => console.log(err));
};

export const getUserData = () => (dispatch) => {
  dispatch({ type: LOADING_USER });
  axios
    .get("/users")
    .then(({ data }) => {
      dispatch({
        type: SET_USER,
        payload: data,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

export const markNotificationsRead = (notificationIds) => (dispatch) => {
  axios
    .post("/notifications", notificationIds)
    .then((res) => {
      dispatch({
        type: MARK_NOTIFICATIONS_READ,
      });
    })
    .catch((err) => console.log(err));
};
