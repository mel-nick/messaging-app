import { combineReducers } from "redux";
import auth from "./auth";
import messaging from "./messaging";
import onlineUsers from "./users";

export default combineReducers({
  auth,
  messaging,
  onlineUsers,
});
