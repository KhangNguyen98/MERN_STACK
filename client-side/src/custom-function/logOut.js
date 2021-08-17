import { stateAction } from "../redux/store";
import { TIME_REMAINING_MILISECONDS } from "../conventions/convention";

let timer;

export const logOut = (dispatch) => {
 dispatch(stateAction.logOut());
 localStorage.removeItem("userID");
 localStorage.removeItem("token");
 localStorage.removeItem("expinary-date");
}

export const setAutoLogOut = (history) => {
 timer = setTimeout(
  () => {
   logOut();
   history.push({
    pathname: "/signin",
    search: "?message=Your session has been expired"
   });
  }, TIME_REMAINING_MILISECONDS
 )
};

export const clearTimeOut = () => {
 clearTimeout(timer);
}
