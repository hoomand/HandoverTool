const isEmpty = require("./is-empty");
const { isObject } = require("../utils");
const Validator = require("validator");
const { handoverItem: handOverConfigs } = require("../config/app");

module.exports = function validateHandoverInput(data, user) {
  let errors = {};

  const userAlias = !isEmpty(user.alias) ? user.alias : "";
  const handingOverTeam = !isEmpty(data.handingOverTeam)
    ? data.handingOverTeam
    : "";
  const handedOverTeam = !isEmpty(data.handedOverTeam)
    ? data.handedOverTeam
    : "";

  const handedOverItems = !isEmpty(data.items) ? data.items : "";

  if (Validator.isEmpty(userAlias)) {
    errors.userAlias = "Oncall alias is required";
  }
  if (Validator.isEmpty(handingOverTeam)) {
    errors.handingOverTeam = "Handing over team cannot be empty";
  }

  if (Validator.isEmpty(handedOverTeam)) {
    errors.handedOverTeam = "Handed over team cannot be empty";
  }

  if (!isEmpty(handedOverItems)) {
    if (!Array.isArray(handedOverItems)) {
      errors.items = "Handover items should be an array";
    } else {
      handedOverItems.forEach(item => {
        let noFaultYet = true;

        if (noFaultYet && !isObject(item)) {
          errors.items = "Each handover item must be an object";
          noFaultYet = false;
        }

        if (
          noFaultYet &&
          !("status" in item && "link" in item && "description" in item)
        ) {
          errors.items =
            "Each handover item must have a status, link and description property";
          noFaultYet = false;
        }

        if (noFaultYet && !(item.status in handOverConfigs.validStatuses)) {
          errors.items = "Handover item status is not valid";
          noFaultYet = false;
        }

        }
      });
    }
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
