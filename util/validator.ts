import * as yup from 'yup';

export const LENGTH_XXS = 16;
export const LENGTH_XS = 32;
export const LENGTH_S = 64;
export const LENGTH_M = 128;
export const LENGTH_L = 256;

export const errorMessage = (name: string, errors: { type: string }) => {
  if (errors?.type === "required") {
    return "Υποχρεωτικό πεδίο";
  }
  if (errors?.type === "oneOf") {
    switch (name) {
      case "terms":
        return "Υποχρεωτικό πεδίο";
      case "country":
        return "Η υπηκοότητα πρέπει να είναι ελληνική";
      default:
        return "";
    }
  }
  if (errors?.type === "typeError") {
    switch (name) {
      case "cardID":
        return "Επιτρέπονται μόνο αριθμοί";
      default:
        return "";
    }
  }
  if (errors?.type === "matches") {
    switch (name) {
      case "name":
      case "surname":
      case "fatherName":
      case "region":
      case "city":
        return `Επιτρέπονται μόνο Ελληνικοί ή Λατινικοί χαρακτήρες`;
      case "afm":
        return "Παρακαλώ εισάγετε έγκυρο ΑΦΜ";
      case "phone_number":
        return "Παρακαλώ εισάγετε έγκυρο αριθμό τηλεφώνου";
      case "email":
        return "Παρακαλώ εισάγετε έγκυρη ηλεκτρονική διεύθυνση";
      case "zipCode":
        return "Παρακαλώ εισάγετε έγκυρο ταχυδρομικό κώδικα";
      default:
        return "";
    }
  }
  return "";
};
const namePattern = /^[a-zA-Z\u0386-\u03ce]{1}[a-zA-z\u0386-\u03ce\s]*$/;
const afmPattern = /^[0-4]{1}[0-9]{8}$/;
const addressPattern = /^[a-zA-Z\u0386-\u03ce]{1}[.a-zA-z\u0386-\u03ce\s\-\d]*$/;
const zipCodePattern = /^[0-9]{5}$/;
const phonePattern = /^[0-9]{10}$/;
const emailPattern =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export const demoSchema = yup.object().shape({
  firstName: yup.string().max(64).required().matches(namePattern),
  lastName: yup.string().max(64).required().matches(namePattern),
  gender: yup.string().max(LENGTH_S).required(),
  afm: yup.string().required().matches(afmPattern),
  address: yup.string().max(LENGTH_S).required().matches(addressPattern),
  region: yup.string().max(LENGTH_S).required().matches(namePattern),
  city: yup.string().max(LENGTH_S).required().matches(namePattern),
  zipCode: yup.string().max(LENGTH_S).required().matches(zipCodePattern),
  phoneNumber: yup.string().max(10).required().matches(phonePattern),
  email: yup.string().max(LENGTH_S).required().matches(emailPattern),
});