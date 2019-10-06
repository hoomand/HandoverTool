const isEmpty = require("./is-empty");
const appConfigs = require("../config/app");
const Validator = require("validator");

module.exports = function validateRegisterInput(data) {
  let errors = {};

  const alias = !isEmpty(data.alias) ? data.alias : "";
  const password = !isEmpty(data.password) ? data.password : "";

  if (!Validator.isLength(alias, { min: 3, max: 30 })) {
    errors.alias = "Alias must be between 3 and 30 characters";
  }
  if (appConfigs.aliasIsEmail && !Validator.isEmail(alias)) {
    errors.alias = "Alias must be a valid email address";
  }
  if (!Validator.isLength(password, { min: 8, max: 50 })) {
    errors.password = "Password must be between 8 to 50 characters long";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
