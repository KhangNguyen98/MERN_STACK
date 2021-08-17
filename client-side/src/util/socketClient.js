import openSocket from "socket.io-client";
import { stateAction } from "../redux/store";
import { SERVER_ADDRESS_TO_CONNECT } from "../conventions/convention";

export const listeningRequest = (dispatch) => {
 const socketClient = openSocket(SERVER_ADDRESS_TO_CONNECT, {
  // withCredentials: true,
  extraHeaders: {
   "my-custom-header": "J4J"
  },
 });
 socketClient.on("modification", notification => {
  if (notification.action === "posted") {
   dispatch(stateAction.updateImagesForUIWhenPosting(notification.image));
  } else if (notification.action === "deleted") {
   dispatch(stateAction.updateImagesForUIWhenDeleting(notification.imageID));
  } else if (notification.action === "increaseDownloadCount") {
   dispatch(stateAction.updateImagesForUIWhenDownloading(notification.updatedImage));
  }
 });
};