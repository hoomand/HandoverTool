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

  if (isEmpty(errors) && Validator.isEmpty(userAlias)) {
    errors.userAlias = "Oncall alias is required";
  }
  if (isEmpty(errors) && Validator.isEmpty(handingOverTeam)) {
    errors.handingOverTeam = "Handing over team cannot be empty";
  }

  if (isEmpty(errors) && Validator.isEmpty(handedOverTeam)) {
    errors.handedOverTeam = "Handed over team cannot be empty";
  }

  if (handedOverTeam === handingOverTeam) {
    errors.handedOverTeam =
      "Handing over team and handed over team cannot be the same";
  }

  if (isEmpty(errors) && !isEmpty(handedOverItems)) {
    if (!Array.isArray(handedOverItems)) {
      errors.handoverItems = "Handover items should be an array";
    } else {
      handedOverItems.forEach((item, index) => {
        let noFaultYet = true;

        if (noFaultYet && !isObject(item)) {
          errors.handoverItems = "Each handover item must be an object";
          noFaultYet = false;
        }

        if (
          noFaultYet &&
          !("status" in item && "link" in item && "description" in item)
        ) {
          errors.handoverItems =
            "Each handover item must have a status, link and description property";
          noFaultYet = false;
        }

        if (noFaultYet && !(item.status in handOverConfigs.validStatuses)) {
          errors.handoverItems = "Handover item status is not valid";
          errors.section = "status";
          errors.index = index;
          noFaultYet = false;
        }

        if (noFaultYet && !Validator.isURL(item.link)) {
          errors.handoverItems = "Handover item link is not a valid URL";
          errors.section = "link";
          errors.index = index;
          noFaultYet = false;
        }
      });
    }
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
