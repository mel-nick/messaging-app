/* eslint-disable import/no-anonymous-default-export */
import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  AUTH_ERROR,
  USER_LOADED,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  HIDE_ERROR_TOASTER,
  SHOW_ERROR_TOASTER,
  SET_CR_TOKEN,
} from '../actions/types';

const initialState = {
  token: localStorage.getItem('token'),
  isAuthenticated: null,
  loading: true,
  user: null,
  errorMessage: null,
  showErrorToastr: false,
  _crToken: null,
};

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case USER_LOADED:
      return {
        ...state,
        isAuthenticated: true,
        user: payload,
        loading: false,
        errorMessage: null,
      };
    case SET_CR_TOKEN:
      return {
        ...state,
        ...payload,
      };
    case REGISTER_SUCCESS:
    case LOGIN_SUCCESS:
      localStorage.setItem('token', payload.token);
      return {
        ...state,
        ...payload,
        isAuthenticated: true,
        loading: false,
        errorMessage: null,
      };
    case REGISTER_FAIL:
    case LOGIN_FAIL:
      localStorage.removeItem('token');
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        loading: false,
        user: null,
        errorMessage: payload,
        showErrorToastr: true,
        _crToken: null,
      };
    case SHOW_ERROR_TOASTER:
      return {
        ...state,
        errorMessage: payload,
        showErrorToastr: true,
      };
    case HIDE_ERROR_TOASTER:
      return {
        ...state,
        errorMessage: null,
        showErrorToastr: false,
      };
    case AUTH_ERROR:
    case LOGOUT:
      localStorage.removeItem('token');
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        loading: false,
        user: null,
        errorMessage: null,
        showErrorToastr: false,
        _crToken: null,
      };
    default:
      return state;
  }
}
