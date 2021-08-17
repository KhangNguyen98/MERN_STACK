import "../../FormInput.scss";
import CustomButton from "../custom-button/CustomButton";

//using redux
import { useDispatch } from "react-redux";

import { useReducer, useCallback } from "react";

import { useHistory } from "react-router";

import { signup } from "../../interaction-with-server/function";

import { UPDATE_FORM, onInputChange, onFocusOut, RESET_FORM } from "../../util/form";

import { validateName, validateEmail, validatePassword, validateConfirmPassword } from "../../validators/rule";

import { ERR_MSG_NAME, ERR_MSG_EMAIL, ERR_MSG_PASSWORD, ERR_MSG_CONFIRM_PASSWORD } from "../../validators/message";

//useReducer
const formReducer = (state, action) => {
  switch (action.type) {
    case UPDATE_FORM:
      const { name, value, hasError, error, touched, isFormValid } = action.data;
      return { ...state, [name]: { ...state[name], value, hasError, error, touched }, isFormValid };//update state of specific input type

    case RESET_FORM:
      return initialState;
    default:
      return state;
  }
}

const BLUE_PRINT_ERR_MSG = (msg) => {
  return <div className="err-message">
    {msg}
  </div>
}

const initialState = {
  name: { value: "", touched: false, hasError: true, errorMsg: "" },
  email: { value: "", touched: false, hasError: true, errorMsg: "" },
  password: { value: "", touched: false, hasError: true, errorMsg: "" },
  confirmPassword: { value: "", touched: false, hasError: true, errorMsg: "" },
  isFormValid: false
}


const SignUpForm = () => {

  const history = useHistory();
  const dispatch = useDispatch();

  //useReducer to checkvalid 
  const [formState, setFormState] = useReducer(formReducer, initialState);
  //ur mission is putting this to useEffect to avoid infinite rerender
  const signUp = useCallback(
    (e) => {
      e.preventDefault();
      if (!formState.isFormValid) {
        for (const key in formState) {
          if (key === "name") {
            if (validateName(formState[key].value)) {
              formState[key].errorMsg = ERR_MSG_NAME;
              formState[key].touched = false;
            }
          } else if (key === "email") {
            if (validateEmail(formState[key].value)) {
              formState[key].errorMsg = ERR_MSG_EMAIL;
              formState[key].touched = false;
            }
          } else if (key === "password") {
            if (validatePassword(formState[key].value)) {
              formState[key].errorMsg = ERR_MSG_PASSWORD;
              formState[key].touched = false;
            }
          } else if (key === "confirmPassword") {
            if (validateConfirmPassword(formState[key].value)) {
              formState[key].errorMsg = ERR_MSG_CONFIRM_PASSWORD;
              formState[key].touched = false;
            }
          }
        }

        //must cuz we want react rerender
        history.push({
          pathname: "/signin",
        });
        return;
      }
      const { email, name, password } = formState;

      //cuz each of them is obj (value, error, hasError,...) so we should put value not obj
      signup(email.value, name.value, password.value, dispatch, history, setFormState);
    }, [formState, history]
  );

  // useEffect(
  //   () => {
  //     //
  //     if (!formState.isFormValid) {
  //       return;
  //     }
  //     const { email, name, password } = formState;
  //     signup(e, email, name, password, dispatch, history);
  //   }, [signup]
  // )


  return (
    <form className="sign-up-form">
      <div className="notification-to-user">
        <h2>You dont have an account</h2>
        <span>Sign up with your email and password</span>
      </div>
      <div className="element-in-group">
        <input type="input" name="name" required minLength="5" className="user-name" placeholder=" "
          value={formState.name.value}
          onChange={e => {
            onInputChange("name", e.target.value, setFormState, formState)
          }} onBlur={e => {
            onFocusOut("name", e.target.value, setFormState, formState)
          }}
        ></input>
        <label className="label-for-input">Name</label>
        {formState.name.errorMsg.length > 0 ? BLUE_PRINT_ERR_MSG(formState.name.errorMsg) : <div className="requirement">
          Name Length must be equal or larger than 5
        </div>}
      </div>
      <div className="element-in-group">
        <input type="email" name="email" required minLength="5" placeholder=" "
          value={formState.email.value}
          onChange={e => {
            onInputChange("email", e.target.value, setFormState, formState)
          }}
          onBlur={e => {
            onFocusOut("email", e.target.value, setFormState, formState)
          }}
        ></input>
        <label className="label-for-input">Email</label>
        {formState.email.errorMsg.length > 0 ? BLUE_PRINT_ERR_MSG(formState.email.errorMsg) : <div className="requirement">
          Invalid Email! Length must be equal or larger than 5
        </div>}
      </div>
      <div className="element-in-group">
        <input type="password" name="password" required minLength="5" placeholder=" "
          value={formState.password.value}
          onChange={e => {
            onInputChange("password", e.target.value, setFormState, formState)
          }}
          onBlur={e => {
            onFocusOut("password", e.target.value, setFormState, formState)
          }}
        ></input>
        <label className="label-for-input">Password</label>
        {formState.password.errorMsg.length > 0 ? BLUE_PRINT_ERR_MSG(formState.password.errorMsg) : <div className="requirement">
          Password Length must be equal or larger than 5
        </div>}
      </div>
      <div className="element-in-group">
        <input type="password" name="confirmPassword" required placeholder=" "
          value={formState.confirmPassword.value}
          onChange={e => {
            onInputChange("confirmPassword", e.target.value, setFormState, formState)
          }}
          onBlur={e => {
            onFocusOut("confirmPassword", e.target.value, setFormState, formState)
          }}
        ></input>
        <label className="label-for-input">Confirm Password</label>
        {formState.confirmPassword.errorMsg.length > 0 ? BLUE_PRINT_ERR_MSG(formState.confirmPassword.errorMsg) : null}
      </div>
      <div className="element-in-group disable-button">
        <CustomButton name="sign up" handler={signUp} />
      </div>
    </form>
  )
}

export default SignUpForm;