import { createSlice, configureStore } from "@reduxjs/toolkit";
const initialState = {
 isAuthen: false,
 token: null,
 userID: null,
 error: null,
 images: [],
 imagesOwnedByUser: []
};

export const stateSlice = createSlice(
 {
  name: "stateForApp",
  initialState,
  reducers: {
   setAuthen(state) {
    return { ...state, isAuth: !state.isAuthen }
   },
   logError(state, action) {
    //redux tells that it cant duel with non-serializable so i wonder do i need to log it?
    return { ...state, error: action.payload }
   },
   logToken(state, action) {
    return { ...state, token: action.payload };
   },
   logUser(state, action) {
    return { ...state, userID: action.payload };
   },
   //non-serializable data 
   savedImages(state, action) {
    return { ...state, images: action.payload };
   },
   //non-serializable data 
   savedImagesOfUser(state, action) {
    return { ...state, imagesOwnedByUser: action.payload };
   },
   logOut(state) {
    localStorage.removeItem("token");
    localStorage.removeItem("userID");
    return { ...state, isAuthen: false, userID: null, token: null };
   },
   //i separate server and client cuz i use websocket for update server (client ui is just update when they takes action themselves) even code has the same (we get clean code for this but cant)
   updateImagesForUIWhenPosting(state, action) {//action.payload will be a new image sent by websocket
    const updatedImages = [...state.images];
    updatedImages.push(action.payload);
    return { ...state, images: updatedImages };
   },
   updateImagesForUIWhenDeleting(state, action) {//action.payload is just id of deleted image
    const updatedImages = state.images.filter(image => image._id !== action.payload);
    return { ...state, images: updatedImages };
   },
   updateOwnerImageWhenPosting(state, action) {
    const updatedImages = [...state.imagesOwnedByUser];
    updatedImages.push(action.payload);
    return { ...state, imagesOwnedByUser: updatedImages };
   },
   updateOwnerImageWhenDeleting(state, action) {
    const updatedImages = state.imagesOwnedByUser.filter(image => image._id !== action.payload);
    return { ...state, imagesOwnedByUser: updatedImages };
   },
   updateImagesForUIWhenDownloading(state, action) {//we get image that has updated downloadCounts
    const updatedImages = state.images.filter(image => image._id !== action.payload._id);
    updatedImages.push(action.payload);
    return { ...state, images: updatedImages };
   }
  }
 }
);

const store = configureStore(
 {
  reducer: { stateForApp: stateSlice.reducer }
 }
);

export const stateAction = stateSlice.actions;

export default store;