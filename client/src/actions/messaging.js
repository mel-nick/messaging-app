import axios from "axios";

import {
  SET_CURRENT_USER,
  SEND_MESSAGE,
  GET_MESSAGES,
  GET_MESSAGES_SUCCESS,
  GET_MESSAGES_ERROR,
  SEND_MESSAGE_SUCCESS,
  SEND_MESSAGE_ERROR,
  INIT_CONVERSATION,
  SET_ARRIVAL_MESSAGE,
  GET_CHATS,
  GET_CHATS_SUCCESS,
  GET_CHATS_ERROR,
  ADD_ONLINE_USER_TO_ACTIVE_CHATS,
} from "./types";

const config = {
  headers: {
    "Content-Type": "application/json",
  },
};

export const setCurrentUser = (user) => (dispatch) => {
  dispatch({ type: SET_CURRENT_USER, payload: user });
};
export const getChats = (user) => async (dispatch) => {
  dispatch({ type: GET_CHATS });

  try {
    const res = await axios.post(`/api/messages/chats`, { user }, config);
    dispatch({
      type: GET_CHATS_SUCCESS,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: GET_CHATS_ERROR,
      payload: {
        msg: err?.response?.data,
        status: err?.response?.status,
      },
    });
  }
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

export const addOnlineUserToActiveChats =
  (currentUser) => (dispatch, getState) => {
    const onlineUsers = getState().onlineUsers;
    // eslint-disable-next-line array-callback-return
    onlineUsers?.map((onlineUser) => {
      if (onlineUser?._id === currentUser?._id) {
        return dispatch({
          type: ADD_ONLINE_USER_TO_ACTIVE_CHATS,
          payload: onlineUser,
        });
      }
    });
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
    dispatch({
      type: SEND_MESSAGE_ERROR,
      payload: {
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

export const setArrivalMessage = (data) => (dispatch) => {
  dispatch({
    type: SET_ARRIVAL_MESSAGE,
    payload: data,
  });
};
