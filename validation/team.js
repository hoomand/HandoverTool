const isEmpty = require("./is-empty");
const Validator = require("validator");

module.exports = function validateTeamInput(data, user) {
  let errors = {};

  const teamName = !isEmpty(data.name) ? data.name : "";
  const creatorAlias = !isEmpty(user.alias) ? user.alias : "";

  if (!Validator.isLength(teamName, { min: 3, max: 30 })) {
    errors.name = "Team name must be between 3 and 30 characters";
  }

  if (Validator.isEmpty(creatorAlias)) {
    errors.alias = "Creator's alias is required";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
