const Validator = require("validator");
const isEmpty = require("is-empty");

module.exports = function validateProfileUpdateInput(data) {
  let errors = {};
  console.log("#### received data in validation", data);

  // Convert empty fields to an empty string so we can use validator functions
  data.name = !isEmpty(data.name) ? data.name : "";
  data.age = !isEmpty(data.age) ? data.age : "";
  data.birthdate = !isEmpty(data.birthdate) ? data.birthdate : "";
  data.nationality = !isEmpty(data.nationality) ? data.nationality : "";
  data.marital_status = !isEmpty(data.marital_status)
    ? data.marital_status
    : "";
  data.id_number = !isEmpty(data.id_number) ? data.id_number : "";
  //   data.profile_url = !isEmpty(data.profile_url) ? data.profile_url : "";

  // Email checks
  //   if (Validator.isEmpty(data.email)) {
  //     errors.email = "Email field is required";
  //   } else if (!Validator.isEmail(data.email)) {
  //     errors.email = "Email is invalid";
  //   }
  //   // Password checks
  //   if (Validator.isEmpty(data.password)) {
  //     errors.password = "Password field is required";
  //   }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};
