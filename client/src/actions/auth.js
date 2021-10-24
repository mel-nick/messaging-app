import axios from 'axios';
import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  AUTH_ERROR,
  USER_LOADED,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  CLEAR_PROFILE,
  GET_CR_TOKEN,
  SET_CR_TOKEN,
} from './types';
import setAuthToken from '../utils/setAuthToken';

export const loadUser = () => async (dispatch) => {
  if (localStorage.token) {
    setAuthToken(localStorage.token);
  }
  try {
    const res = await axios.get('/api/auth');
    dispatch({
      type: USER_LOADED,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: AUTH_ERROR,
    });
  }
};

export const register =
  ({ firstName, lastName, email, password }) =>
  async (dispatch) => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    const body = JSON.stringify({
      firstName,
      lastName,
      email,
      password,
    });

    try {
      const res = await axios.post('/api/users', body, config);
      dispatch({
        type: REGISTER_SUCCESS,
        payload: res.data,
      });

      dispatch(loadUser());
    } catch (err) {
      console.error(err.response);
      dispatch({
        type: REGISTER_FAIL,
        payload: err?.response?.data?.errors,
      });
    }
  };

export const login = (email, password) => async (dispatch) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  const body = JSON.stringify({
    email,
    password,
  });

  try {
    const res = await axios.post('/api/auth', body, config);
    dispatch({
      type: LOGIN_SUCCESS,
      payload: res.data,
    });
    dispatch(loadUser());
  } catch (err) {
    console.log('error', err?.response);
    dispatch({
      type: LOGIN_FAIL,
      payload: err?.response?.data?.errors,
    });
  }
};

export const logout = () => (dispatch) => {
  dispatch({ type: LOGOUT });
  dispatch({ type: CLEAR_PROFILE });
};

export const getCrToken = () => async (dispatch) => {
  dispatch({ type: GET_CR_TOKEN });
  try {
    const res = await axios.get('/api/auth/token-cr');
    dispatch({
      type: SET_CR_TOKEN,
      payload: res.data,
    });
  } catch (err) {
    console.error(err);
  }
};
