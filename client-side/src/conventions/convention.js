export const TIME_REMAINING_MILISECONDS = 60 * 60 * 1000;
export const EXPIRY_DATE = new Date(new Date() + TIME_REMAINING_MILISECONDS);
export const SERVER_ADDRESS_TO_CONNECT = "http://localhost:8080";
export const USERID = (dataFromApp) => {
 return dataFromApp.userID || localStorage.getItem("userID");
}
export const TOKEN = (dataFromApp) => {
 return dataFromApp.token || localStorage.getItem("token");
}