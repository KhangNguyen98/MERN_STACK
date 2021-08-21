import "./ImageItem.css";
import CustomButton from "../custom-button/CustomButton";
import { LOCAL_HOST } from "../../interaction-with-server/function";
import { MSG_MUST_LOGIN, MSG_WARNING } from "../../validators/message";

import { Fragment } from "react";

//using redux
import { useDispatch, useSelector } from "react-redux";

import { useEffect, useCallback } from "react";

import { useHistory } from "react-router";

//websocket
import { listeningRequest } from "../../util/socketClient";

import { getImages, getOwnImages, deleteImage, saveDownloadCountOfImg } from "../../interaction-with-server/function";

import { GET_USERID, GET_TOKEN } from "../../conventions/convention";


const ImageItem = ({ isShowingFooter, isShowingButton, images }) => {
    //using redux
    const dataFromApp = useSelector(state => state.stateForApp);
    const history = useHistory();
    const dispatch = useDispatch();

    //still research later to know why first render it doesnt run useEffect

    const downLoadImg = useCallback(
        (e, imageID) => {
            e.preventDefault();
            saveDownloadCountOfImg(imageID, dataFromApp.images, dispatch);
        }, [dataFromApp.images, dispatch]
    );

    const removeImage = useCallback(
        (e, imageIDToDelete, ownerID) => {
            e.preventDefault();
            if (!GET_TOKEN(dataFromApp)) {
                history.push(
                    {
                        pathname: "/signin",
                        search: "?message=" + MSG_MUST_LOGIN
                    }
                );
            } else if (dataFromApp.userID !== ownerID && localStorage.getItem("userID") !== ownerID) {
                history.push(
                    {
                        pathname: "/signin",
                        search: "?message=" + MSG_WARNING
                    }
                );
            }
            deleteImage(GET_TOKEN(dataFromApp), imageIDToDelete, dataFromApp.imagesOwnedByUser, dataFromApp.images, dispatch);
        }, [dataFromApp, dispatch, history]
    );

    useEffect(
        () => {
            if (isShowingFooter) {
                getImages(dispatch);
            }
            else if (isShowingButton) {
                getOwnImages(GET_TOKEN(dataFromApp), GET_USERID(dataFromApp), dispatch);
            }
            // if (!isPrivate) {
            //     fetchAllImages(dispatch);
            //     images = dataFromApp.images;
            // } else {
            //     fetchPrivateImages(dataFromApp.userID);
            //     images = dataFromApp.imagesOwnedByUser;
            // }
        }, [isShowingFooter, isShowingButton, dataFromApp, dispatch, localStorage.getItem("token"), localStorage.getItem("userID")]
    );

    //websocket.io
    useEffect(
        () => {
            listeningRequest(dispatch);
        }, [dispatch]
    )

    return (
        <Fragment>
            {images.length === 0 && <p className="message-when-no-data">No image to show!</p>}
            {
                images.length > 0 &&
                images.map(
                    image => {
                        return (
                            <div className="image-item" id={images._id}>
                                <div className="image-container">
                                    <h3 className="time-posted">Posted at {new Date(image.createdAt).toLocaleDateString("en-US")}</h3>
                                    <img src={LOCAL_HOST + image.imageUrl} className="image" alt="img-of-user"></img>
                                </div>
                                {isShowingButton && <div className="button-container">
                                    <CustomButton name="Delete" backgroundColor="red" handler={removeImage} imageIDToDelete={image._id} ownerID={image.creator._id} />
                                </div>}
                                {isShowingFooter &&
                                    <div className="footer">
                                        <h3 className="owner-image">
                                            {image.creator.name}
                                        </h3>
                                        <div className="download-info">
                                            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSrceRJA0ICgRh-c9z9GXpx2pxhnuk4SDX_2g&usqp=CAU" className="download-icon" alt="icon-download"
                                                onClick={e => downLoadImg(e, image._id)}></img>
                                            <h3 className="download-count">{image.downloadCounts}</h3>
                                        </div>
                                    </div>
                                }
                            </div>
                        )
                    }
                )
            }
        </Fragment >
    )
}

export default ImageItem;