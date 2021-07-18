// import axios from 'axios';
// import { GET_ALL_USERS, USERS_LOADED, USERS_ERROR } from './types';
// // import {setAlert} from './alert';

// //get all users
// export const getAllUsers = () => async (dispatch) => {
//   dispatch({
//     type: GET_ALL_USERS,
//   });
//   try {
//     const res = await axios.get('/api/users');
//     dispatch({
//       type: USERS_LOADED,
//       payload: res.data,
//     });
//   } catch (err) {
//     dispatch({
//       type: USERS_ERROR,
//       payload: {
//         msg: err.response.statusText,
//         status: err.response.status,
//       },
//     });
//   }
// };
