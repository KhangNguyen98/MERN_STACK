
import { validateName, validateEmail, validatePassword, validateConfirmPassword } from "./rule";
import { ERR_MSG_NAME, ERR_MSG_PASSWORD, ERR_MSG_CONFIRM_PASSWORD, ERR_MSG_EMAIL } from "./message";

export const validateInput = (name, value, formState) => {
  let hasError = false, errorMsg = "";
  switch (name) {
    case "name":
      if (validateName(value)) {
        hasError = true;
        errorMsg = ERR_MSG_NAME;
      }
      break;
    case "email":
      if (validateEmail(value)) {
        hasError = true;
        errorMsg = ERR_MSG_EMAIL;
      }
      break;
    case "password":
      if (validatePassword(value)) {
        hasError = true;
        errorMsg = ERR_MSG_PASSWORD
      }
      break;
    case "confirmPassword":
      if (validateConfirmPassword(value, formState.password.value)) {
        hasError = true;
        errorMsg = ERR_MSG_CONFIRM_PASSWORD;
      }
      break;
    default:
      return { hasError, errorMsg };
  }
  return { hasError, errorMsg };
}