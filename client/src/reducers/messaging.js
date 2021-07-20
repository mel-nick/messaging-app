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
  INIT_CONVERSATION,
  SET_ARRIVAL_MESSAGE,
  LOGOUT,
} from "../actions/types";
import { v4 as uuidv4 } from "uuid";

const initialState = {
  activeUsers: [],
  activeConversation: null,
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
              [...state.activeUsers, payload].map((item) => [item["_id"], item])
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
        activeConversation: payload,
        loadingMessages: false,
        loadingMessagesError: null,
      };
    case INIT_CONVERSATION:
      return {
        ...state,
        activeConversation: {
          from: payload.from,
          to: payload.to,
          messages: [],
        },
      };
    case SEND_MESSAGE:
      return {
        ...state,
        sendingMessage: true,
      };
    case SEND_MESSAGE_SUCCESS:
    case SET_ARRIVAL_MESSAGE:
      return {
        ...state,
        sendingMessage: false,
        activeConversation: {
          ...state?.activeConversation,
          messages: [
            ...state?.activeConversation?.messages,
            {
              _id: uuidv4(),
              text: payload.text,
              sender: payload.from,
              date: Date.now(),
            },
          ],
        },
        loadingMessagesError: null,
      };
    case SEND_MESSAGE_ERROR:
      return {
        ...state,
        sendingMessage: false,
        loadingMessagesError: "cant send your message",
      };
    case GET_MESSAGES_ERROR:
      return {
        ...state,
        activeConversation: null,
        loadingMessages: false,
        loadingMessagesError: payload,
      };
    case SET_CURRENT_USER:
      return {
        ...state,
        currentUser: payload,
      };
    case LOGOUT:
      return initialState;
    default:
      return state;
  }
}
