export const validateName = (value) => {
 return value.trim().length === 0 || value.trim().length < 6
}

export const validateEmail = (value) => {
 return !/^[\w]+@[\w]+([.][\w]+)+$/.test(value) || value.trim().length < 6;
}

export const validatePassword = (value) => {
 return value.trim().length < 6;
}

export const validateConfirmPassword = (value, valueFormPassword) => {
 return value !== valueFormPassword;
}