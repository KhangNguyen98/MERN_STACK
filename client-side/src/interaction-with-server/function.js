import { stateAction } from "../redux/store";

import { RESET_FORM } from "../util/form";

import { ERR_MSG_LOGIN, SUCCESS_MSG_SIGN_UP } from "../validators/message";

import { EXPIRY_DATE } from "../conventions/convention";

import { setAutoLogOut } from "../custom-function/logOut";

export const LOCAL_HOST = "http://localhost:8080/";//use this to show img

export const SERVER_ADDRESS = "http://localhost:8080/graphql";


const configRequest = (graphQuery) => {
  return {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(graphQuery)
  };
};

const configRequestWithAuthorization = (token, graphQuery) => {
  return {
    method: "POST",
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(graphQuery)
  };
}

export const getImages = (dispatch) => {
  const graphQuery = {
    query: `{
            getImages{
                _id
                imageUrl
                createdAt
                downloadCounts
                creator{
                name
                }
            }
        }`
  };
  fetch(SERVER_ADDRESS, configRequest(graphQuery))
    .then(
      resData => {
        return resData.json();
      }
    )
    .then(
      resData => {
        // console.log("CO GI DO DEO ON", resData);
        if (resData.errors && resData.errors[0].statusCode === 500) {
          throw new Error("Something went wrong!");
        }
        //i still dont know why graphql return null when no data when fetching together but if data fetching together has info then even no data it return array
        resData.data.getImages = resData.data.getImages || [];
        dispatch(
          stateAction.savedImages(resData.data.getImages)
        );
      }
    )
    .catch(
      err => {
        console.log(err);
        dispatch(
          stateAction.logError(err)
        );
      }
    )
};

export const getOwnImages = (token, userID, dispatch) => {
  const graphQuery = {
    query: `
        query fetchPrivateImages($userID: ID!) {
          getOwnImages(userID: $userID){
            _id
            imageUrl
            createdAt,
            creator{
              _id
            }
          }
        }
      `,
    variables: {
      userID
    }
  };

  fetch(SERVER_ADDRESS, configRequestWithAuthorization(token, graphQuery))
    .then(
      resData => {
        return resData.json();
      }
    )
    .then(
      resData => {
        if (resData.errors && resData.errors.statusCode === 500) {
          const error = new Error("Oops !!! Something went wrong!");
          error.statusCode = 500;
          throw error;
        }
        dispatch(
          stateAction.savedImagesOfUser(resData.data.getOwnImages)
        );
        // history.push(
        //   {
        //     pathname: "/resource"
        //   }
        // )
      }
    )
    .catch(
      err => {
        console.log(err);
        dispatch(stateAction.logError(err));
      }
    )
};

export const signup = (email, name, password, dispatch, history, setFormState) => {
  const graphQuery = {
    query: `
   mutation signUpHandler($email: String!, $name: String!, $password: String!){
      signup(userInput:{email: $email, name: $name, password: $password}){
        _id
        name
      }
   }`,
    variables: {
      email, name, password
    }
  };
  fetch(SERVER_ADDRESS, configRequest(graphQuery))
    .then(
      resData => {
        return resData.json();
      }
    )
    .then(
      resData => {
        if (resData.errors && resData.errors[0].statusCode === 422) {
          const error = new Error("Invalid user input");
          error.statusCode = 422;
          throw error;
        }

        //reset form
        setFormState(
          {
            type: RESET_FORM
          }
        );

        history.push(
          {
            pathname: "/signin",
            search: "?message=" + SUCCESS_MSG_SIGN_UP
          }
        );
      }
    )
    .catch(
      err => {
        console.log(err);
        dispatch(
          stateAction.logError(err)
        );
      }
    )
    ;
}

export const signin = (email, password, dispatch, history, setNotification) => {
  const graphQuery = {
    query: `
      query signInHandler($email: String!, $password: String!){
        signin(email: $email, password: $password){
          token
          userID
        }
      }
    `,
    variables: {
      email, password
    }
  };
  fetch(SERVER_ADDRESS, configRequest(graphQuery))
    .then(
      resData => {
        return resData.json();
      }
    )
    .then(
      resData => {
        if (resData.errors && resData.errors[0].statusCode === 422) {
          // throw new Error("Authenticated");
          setNotification(ERR_MSG_LOGIN);
          return;
          // history.push(
          //   {
          //     pathname: "/signin"
          //   }
          // );
        }
        const token = resData.data.signin.token;
        const userID = resData.data.signin.userID;
        dispatch(stateAction.logToken(token));
        dispatch(stateAction.logUser(userID));
        setAutoLogOut(history);
        localStorage.setItem("userID", userID);
        localStorage.setItem("token", token);
        localStorage.setItem("expinary-date", EXPIRY_DATE);

        //need to setTime for logout for authentication
        //setTimeOut for calling method logout


        setNotification("");
        history.push(
          {
            pathname: "/"
          }
        )

      }
    )
    .catch(
      err => {
        console.log(err);
        dispatch(stateAction.logError(err));
      }
    )
}

export const postImage = (token, imageUrl, dispatch, setImage, turnOnNotification) => {
  //graphql cant duel with image so we must use restful
  const formData = new FormData();
  formData.append("image", imageUrl);
  fetch(LOCAL_HOST + "post-image", {
    method: "POST",
    headers: {
      Authorization: "Bearer " + token
    },
    body: formData
  })
    .then(
      resData => {
        return resData.json();
      }
    )
    .then(
      result => {
        if (!result.filePath) {
          const error = new Error("Invaid user input");
          error.statusCode = 422;
          throw error;
        }
        //server duel with \\ but http get / so we must parse this
        const imageUrl = result.filePath.replace("\\", "/");
        const graphQuery = {
          query: `
            mutation postImageToServer($imageUrl: String!){
              postImage(imageInput:{imageUrl: $imageUrl}){
                _id
                imageUrl
                createdAt
                downloadCounts
                creator{
                  name
                }
              }
            }
          `,
          variables: {
            imageUrl
          }
        };
        fetch(SERVER_ADDRESS, configRequestWithAuthorization(token, graphQuery))
          .then(
            resData => {
              return resData.json();
            }
          )
          .then(
            resData => {
              if (resData.errors && (resData.erros.statusCode === 401 || resData.erros.statusCode === 422)) {
                const error = new Error("Invalid input  from user");
                error.statusCode = 422;
                throw error;
              }

              //clear previewImage and imageUrl we save on state of UploadImg
              setImage({});

              //clear value of input type file
              const form = document.getElementById("form-to-post-img");
              form.reset();

              turnOnNotification("You have posted succesfully");

              //update owner UI
              dispatch(stateAction.updateOwnerImageWhenPosting(resData.data.postImage));//when executed graphQuery result is image

              // //i use it cuz i want to fetch images of user from server again
              // history.push(
              //   {
              //     pathname: "/resource"
              //   }
              // )

            }
          )

      }
    )
    .catch(
      err => {
        dispatch(
          stateAction.logError(err)
        )
      }
    );
}

export const deleteImage = (token, imageID, imagesOwnedByUser, images, dispatch) => {
  const graphQuery = {
    query: `
      mutation removeImage($imageID: ID!){
        deleteImage(imageID: $imageID)
      }
    `,
    variables: {
      imageID
    }
  };
  fetch(SERVER_ADDRESS, configRequestWithAuthorization(token, graphQuery))
    .then(
      resData => {
        return resData.json();
      }
    )
    .then(
      resData => {
        if (resData.errors && (resData.errors.statusCode === 401 || resData.errors.statusCode === 500)) {
          const error = new Error("DELETE FAILED");
          error.statusCode = 403;
          throw error;
        }

        //use redux for update UI of owner
        dispatch(stateAction.updateOwnerImageWhenDeleting(imageID));

        //will use redux for convenience replace this not clean this also for web socket
        // const newImagesOwnedByUser = imagesOwnedByUser.filter(image => image._id !== imageID);
        // const newImages = images.filter(image => image._id !== imageID);
        // dispatch(stateAction.savedImagesOfUser(newImagesOwnedByUser));// i dont need it anymore cuz i use websocket
        // dispatch(stateAction.savedImages(newImages));
      }
    )
    .catch(
      err => {
        console.log(err);
        dispatch(stateAction.logError(err));
      }
    )
}

export const saveDownloadCountOfImg = (imageID, images, dispatch) => {
  const formData = new FormData();
  formData.append("imageID", imageID);
  fetch(LOCAL_HOST + "save-download-count-of-img", {
    method: "PUT",
    body: formData
  })
    .then(
      resData => {
        //cuz i use res.download
        if (resData.status !== 200) {
          return resData.json();
        }
        return resData.blob();//new discovery
      }
    )
    .then(
      resData => {
        if (resData.errors && (resData.errors[0].statusCode === 422 || resData.errors[0].stateAction === 500)) {
          const error = new Error("Failed to download img! Maybe image doesnt exist anymore!");
          error.statusCode = 422;
          throw error;
        }
        let updatedImg = images.filter(image => image._id === imageID);
        //fuk filter return array damn sr i forgot
        //so we must get  [0]
        updatedImg = { ...updatedImg[0], downloadCounts: updatedImg[0].downloadCounts + 1 };

        //downloadImg
        const fileName = updatedImg.imageUrl.split("/")[1];
        const href = window.URL.createObjectURL(resData);
        const link = document.createElement('a');
        link.href = href;
        link.setAttribute('download', fileName); //or any other extension
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // var file = window.URL.createObjectURL(resData);
        // window.location.assign(file);

        //dont need cuz use websocket
        // const newImages = images.filter(image => image._id !== imageID);
        // newImages.push(updatedImg);
        // dispatch(stateAction.savedImages(newImages));
      }
    )
    .catch(
      err => {
        console.log(err);
        dispatch(stateAction.logError(err));
      }
    )
}