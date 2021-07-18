import axios from "axios";

import {
  SET_MESSAGING_ACTIVE,
  SET_CURRENT_USER,
  SEND_MESSAGE,
  GET_MESSAGES,
  GET_MESSAGES_SUCCESS,
  GET_MESSAGES_ERROR,
  SEND_MESSAGE_SUCCESS,
  SEND_MESSAGE_ERROR,
  INIT_CONVERSATION,
} from "./types";

const config = {
  headers: {
    "Content-Type": "application/json",
  },
};

export const setActiveMessaging = (user) => (dispatch) => {
  dispatch({ type: SET_MESSAGING_ACTIVE, payload: user });
};

export const setCurrentUser = (user) => (dispatch) => {
  dispatch({ type: SET_CURRENT_USER, payload: user });
};

export const getMessages = (from, to) => async (dispatch) => {
  dispatch({ type: GET_MESSAGES });

  try {
    const res = await axios.post(`/api/messages/history`, { from, to }, config);
    dispatch({
      type: GET_MESSAGES_SUCCESS,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: GET_MESSAGES_ERROR,
      payload: {
        msg: err?.response?.data,
        status: err?.response?.status,
      },
    });
  }
};

export const sendMessage = (data) => async (dispatch) => {
  dispatch({ type: SEND_MESSAGE });
  try {
    await axios.post(`/api/messages`, data, config);
    await dispatch({
      type: SEND_MESSAGE_SUCCESS,
      payload: data,
    });
  } catch (err) {
    console.log(err);
    dispatch({
      type: SEND_MESSAGE_ERROR,
      payload: {
        // msg: err?.response?.data,
        // status: err?.response?.status,
        msg: "message have not been sent",
      },
    });
  }
};
export const initConversation = (data) => (dispatch) => {
  dispatch({
    type: INIT_CONVERSATION,
    payload: data,
  });
};
