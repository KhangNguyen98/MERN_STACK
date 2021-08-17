
import UploadImg from "../upload/UploadImg";
import ImageItem from "../image-item/ImageItem";
import "./UserFunction.css";
import { useSelector } from "react-redux";
import { useHistory } from "react-router";
import { MSG_MUST_LOGIN } from "../../validators/message";
import { USERID } from "../../conventions/convention";
import { data } from "browserslist";
const UserFunction = () => {
 const dataFromApp = useSelector(state => state.stateForApp);

 //check authenticated
 const history = useHistory();
 if (!USERID(data)) {
  history.push(
   {
    pathname: "/signin",
    search: "?message=" + MSG_MUST_LOGIN
   }
  )
 }
 // useEffect(
 //  () => {
 //   console.log("PARENT U MUST OBEY ME");
 //  }, [dataFromApp.getOwnImages]
 // )
 //fetch owned user image
 // useEffect(
 //  () => {
 //   console.log("I DONT KNOW WHY");
 //   getOwnImages(dataFromApp.token, dataFromApp.userID, dispatch, history);
 //  }, [dataFromApp.imagesOwnedByUser, getOwnImages, dataFromApp.token, dataFromApp.userID, history, dispatch]
 // );


 // console.log("I NEED U MAN", dataFromApp.imagesOwnedByUser);
 //turnOffNotification client side if existed notification
 // const turnOffNotication = () => {

 // }


 //note: FUK EVEN CHECKING AUTHEN CHILD COMPONENT STILL RENDER SO CHECKING TOO =.="
 return (
  <div>
   <UploadImg />
   {USERID(dataFromApp) &&
    <div className="image-container">
     <ImageItem images={dataFromApp.imagesOwnedByUser} isShowingButton={true} />
    </div>
   }

  </div>
 )
};

export default UserFunction;