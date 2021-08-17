
import { validateInput } from "../validators/input";

export const UPDATE_FORM = "UPDATE_FORM";

export const RESET_FORM = "RESET_FORM";

export const onInputChange = (name, value, dispatch, formState) => {

 //cuz when i submit then i used erroMsg to show so i must clear cuz until we dont click state is not modified so react won render.Also after clicking button i set all of them is untoched so we just check to clear msg
 for (const key in formState) { //also cuz formState besides input type we also contain prop isFormValid so MUST CHECK key
  if (key !== "isFormValid" && !formState[key].touched) {
   formState[key].errorMsg = "";
  }
 }

 const { hasError, erroMsg } = validateInput(name, value, formState);
 //after this check we will know that it has error or not

 let isFormValid = true;

 //in here we just expect to know user input still valid or not
 for (const key in formState) {
  const thisInput = formState[name];//get this input from formstate
  //if any specfic input is invalid then we dont need to check every input in formState cuz we just want to get form is invalid or not
  if (key === name && hasError) { //key we get from each input of formState
   isFormValid = false;
   break;
  } else if (key !== name && thisInput.hasError) {
   isFormValid = false;
   break;
  }
 };
 dispatch(
  {
   type: UPDATE_FORM,
   data: {
    name,
    value,
    hasError,
    erroMsg,
    touched: false,
    isFormValid
   }
  }
 )
}

//handle like inputChange but the result is different cuz we want to onBlur event so set touched = true
export const onFocusOut = (name, value, dispatch, formState) => {

 const { hasError, erroMsg } = validateInput(name, value, formState);

 let isFormValid = true;

 for (const key in formState) {

  const thisInput = formState[name];

  if (key === name && hasError) {
   isFormValid = false;
   break;
  } else if (key !== name && thisInput.hasError) {
   isFormValid = false;
   break;
  }
 }
 dispatch(
  {
   type: UPDATE_FORM,
   data: {
    name,
    value,
    hasError,
    erroMsg,
    touched: true,
    isFormValid
   }
  }
 )
}