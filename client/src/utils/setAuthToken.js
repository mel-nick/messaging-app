import axios from 'axios';

const setAuthToken = (token) => {
  if (token) {
    axios.defaults.headers.common['Access'] = token;
  } else {
    delete axios.defaults.headers.common['Access'];
  }
};

export default setAuthToken;
