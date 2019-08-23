const isEmpty = require("./is-empty");
const Validator = require("validator");

module.exports = function validateLoginInput(data) {
  let errors = {};

  alias = !isEmpty(data.alias) ? data.alias : "";
  password = !isEmpty(data.password) ? data.password : "";

  if (Validator.isEmpty(alias)) {
    errors.alias = "Alias field is required";
  }

  if (Validator.isEmpty(password)) {
    errors.password = "Password field is required";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
