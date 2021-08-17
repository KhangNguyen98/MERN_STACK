
import "./UploadImg.css";

import Image from "../../image/Image";
import CustomButton from "../custom-button/CustomButton";

import { Fragment } from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
// import { useHistory } from "react-router";

import { postImage } from "../../interaction-with-server/function";

import { TOKEN } from "../../conventions/convention";

const UploadImg = () => {
 const dataOfApp = useSelector(state => state.stateForApp);
 const dispatch = useDispatch();
 // const history = useHistory();

 //this is for preview-render(it also require objectURl to be shown so we dont save it when creating post )
 const [img, setImage] = useState({ image: null, imagePath: null });//we must prop image cuz this prop belongs to input type file

 //this is for path 

 const [notification, setNotification] = useState("");
 const revert = () => {
  setImage(
   preImg => {
    return { ...preImg };
   }
  )
 }

 // const turnOffNotification = () => {
 //  if (notification.length > 0) {
 //   setNotification("");
 //  }
 // }

 const turnOnNotification = (msg) => {
  setNotification(msg);
 }

 const inputChangeHandler = async function (e) {
  //damn i love this method ^^
  setImage({ [e.target.name]: URL.createObjectURL(e.target.files[0]), imagePath: e.target.files[0] });
  //e.target.name is image
 }

 const postImageToServer = (e) => {
  e.preventDefault();
  if (!img.image) {
   setNotification("Please choose image firstly then u can post");
   return;
  }
  //img.image (preview Image)
  //img.imagePath is used to send to server for saving
  postImage(TOKEN(dataOfApp), img.imagePath, dispatch, setImage, turnOnNotification);
 }

 return (
  <Fragment>
   {notification.length > 0 && <div className="centered">{notification}</div>}
   <form encType="multipart/form-data" className="form-submit-image" id="form-to-post-img">
    <input type="file" name="image" className="image-input" onChange={(e) => {
     inputChangeHandler(e)
    }} onBlur={() => revert()} accept="image/*"></input>
    <CustomButton name="Submit" backgroundColor="blue" handler={(e) => { postImageToServer(e) }} />
   </form>
   <div className="centered">
    {img.image && <Image backgroundImage={img.image} />}
   </div>
  </Fragment>
 );
}

export default UploadImg;