/* eslint-disable import/no-anonymous-default-export */
import {
  SET_MESSAGING_ACTIVE,
  SET_CURRENT_USER,
  GET_MESSAGES,
  GET_MESSAGES_SUCCESS,
  GET_MESSAGES_ERROR,
  SEND_MESSAGE,
  SEND_MESSAGE_SUCCESS,
  SEND_MESSAGE_ERROR,
} from '../actions/types';

const initialState = {
  activeUsers: [],
  // activeMessageWindow: {
  //   from: null,
  //   to: null,
  //   messages: [],
  // },
  activeMessageWindow: null,
  loadingMessages: false,
  loadingMessagesError: null,
  currentUser: null,
  sendingMessage: false,
};

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case SET_MESSAGING_ACTIVE:
      return {
        ...state,
        currentUser: payload,
        activeUsers:
          [
            ...new Map(
              [...state.activeUsers, payload].map((item) => [item['_id'], item])
            ).values(),
          ] || [],
      };
    case GET_MESSAGES:
      return {
        ...state,
        loadingMessages: true,
      };
    case GET_MESSAGES_SUCCESS:
      return {
        ...state,
        activeMessageWindow: payload,
        loadingMessages: false,
        loadingMessagesError: null,
      };
    case SEND_MESSAGE:
      return {
        ...state,
        sendingMessage: true,
      };
    case SEND_MESSAGE_SUCCESS:
      return {
        ...state,
        sendingMessage: false,
        activeMessageWindow: payload,
        loadingMessagesError: null,
      };
    case SEND_MESSAGE_ERROR:
      return {
        ...state,
        sendingMessage: false,
        loadingMessagesError: 'cant send your message',
      };
    case GET_MESSAGES_ERROR:
      return {
        ...state,
        activeMessageWindow: null,
        loadingMessages: false,
        loadingMessagesError: payload,
      };
    case SET_CURRENT_USER:
      return {
        ...state,
        currentUser: payload,
      };

    default:
      return state;
  }
}
