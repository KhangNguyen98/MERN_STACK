import "../../FormInput.scss";

import { useRef, useState, useCallback } from "react";

import { signin } from "../../interaction-with-server/function";

import { validateEmail, validatePassword } from "../../validators/rule";

import { useDispatch } from "react-redux";

import { useHistory } from "react-router";

import { ERR_MSG_LOGIN } from "../../validators/message";

import CustomButton from "../custom-button/CustomButton";
const SignInForm = () => {

 const email = useRef("");
 const password = useRef("");
 const [notificationToUser, setNotification] = useState("");
 //why i set initial is empty why it cant access prop length ??
 const dispatch = useDispatch();
 const history = useHistory();

 const turnOffNotication = useCallback
  (
   () => {
    if (notificationToUser.length > 0) {
     setNotification("");
    }
   }, [setNotification]
  );

 const signIn = useCallback(
  (e) => {
   e.preventDefault();
   if (validateEmail(email.current.value) || validatePassword(password.current.value)) {
    setNotification(ERR_MSG_LOGIN);
    return;
   }
   signin(email.current.value, password.current.value, dispatch, history, setNotification);
  }, [validateEmail, validatePassword, setNotification, signin, dispatch, history]
 )

 return (
  <form className="sign-in-form">
   <div className="notification-to-user">
    <h2>You already have an account</h2>
    <span> Sign in with your email and password</span>
   </div>
   <div className="element-in-group">
    <input type="email" name="email" required minLength="5" placeholder=" " ref={email} onChange={turnOffNotication}></input>
    <label className="label-for-input">Email</label>
    <div className="requirement">
     Invalid Email! Length must be equal or larger than 5
    </div>
   </div>
   <div className="element-in-group">
    <input type="password" name="password" required minLength="5" placeholder=" " ref={password} onChange={turnOffNotication}></input>
    <label className="label-for-input">Password</label>
    <div className="requirement">
     Password Length must be equal or larger than 5
    </div>
   </div>
   {notificationToUser.length > 0 && <div className="err-message">{notificationToUser}</div>}
   <div className="element-in-group">
    <CustomButton name="sign in" handler={signIn} />
   </div>
  </form>
 )
}

export default SignInForm;