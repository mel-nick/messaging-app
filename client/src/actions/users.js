import { GET_ONLINE_USERS } from "./types";

export const getOnlineUsers = (users) => (dispatch) => {
  dispatch({
    type: GET_ONLINE_USERS,
    payload: users,
  });
};
