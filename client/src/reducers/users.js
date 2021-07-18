/* eslint-disable import/no-anonymous-default-export */
import { GET_ALL_USERS, USERS_LOADED, USERS_ERROR } from '../actions/types';

const initialState = {
  list: [],
  loading: false,
  error: {},
};

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_ALL_USERS:
      return {
        ...state,
        loading: true,
      };
    case USERS_LOADED:
      return {
        ...state,
        list: payload,
        loading: false,
      };
    case USERS_ERROR:
      return {
        ...state,
        error: payload,
        loading: false,
      };

    default:
      return state;
  }
}
