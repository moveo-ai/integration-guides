import * as yup from 'yup';

export const LENGTH_XXS = 16;
export const LENGTH_XS = 32;
export const LENGTH_S = 64;
export const LENGTH_M = 128;
export const LENGTH_L = 256;

export const errorMessage = (name: string, errors: { type: string }) => {
  if (errors?.type === 'required') {
    return 'Field is required';
  }
  if (errors?.type === 'oneOf') {
    switch (name) {
      case 'terms':
        return 'Field is required';
      case 'country':
        return 'Η υπηκοότητα πρέπει να είναι ελληνική';
      default:
        return '';
    }
  }
  if (errors?.type === 'length') {
    switch (name) {
      case 'productId':
        return 'Please insert a 10 digit number';
      case 'orderNo':
        return 'Please insert a 10 digit number';
      case 'cardNumber':
        return 'Card number consists of 16 digits';
      case 'cvv':
        return 'CVV consists of 3 digits';
      case 'expDate':
        return 'Date should have format MM/YY';
      default:
        return '';
    }
  }
  if (errors?.type === 'typeError') {
    switch (name) {
      case 'cardID':
        return 'Only numbers are allowed';
      case 'productId':
        return 'Only numbers are allowed';
      case 'orderNo':
        return 'Only numbers are allowed';
      default:
        return '';
    }
  }
  if (errors?.type === 'matches') {
    switch (name) {
      case 'firstName':
        return `Only Greek or Latin characters are allowed`;
      case 'lastName':
        return `Only Greek or Latin characters are allowed`;
      case 'fatherName':
        return `Only Greek or Latin characters are allowed`;
      case 'region':
        return `Only Greek or Latin characters are allowed`;
      case 'city':
        return `Only Greek or Latin characters are allowed`;
      case 'cardHolder':
        return `Only Greek or Latin characters are allowed`;
      case 'phoneNumber':
        return 'Please insert valid phone number';
      case 'email':
        return 'Please insert valid email address';
      case 'zipCode':
        return 'Please insert valid zip code';
      case 'cvv':
        return 'Please insert a valid cvv';
      case 'cardNumber':
        return 'Please insert a valid card number';
      case 'expDate':
        return 'Please insert a valid date';
      default:
        return '';
    }
  }
  return '';
};
const namePattern = /^[a-zA-Z\u0386-\u03ce]{1}[a-zA-z\u0386-\u03ce\s]*$/;
const addressPattern =
  /^[a-zA-Z\u0386-\u03ce]{1}[.a-zA-z\u0386-\u03ce\s\-\d]*$/;
const zipCodePattern = /^[0-9]{5}$/;
const phonePattern = /^[0-9]{10}$/;
const creditCardNumber = /^[0-9]{16}$/;
const cvvPatern = /^[0-9]{3}$/;
const expDatePatern = /^(0[1-9]|1[0-2])\/?([0-9]{2})$/;
const emailPattern =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const pricePattern = /^[0-9,.]*$/;

export const demoSchema = yup.object().shape({
  firstName: yup.string().max(64).required().matches(namePattern),
  lastName: yup.string().max(64).required().matches(namePattern),
  gender: yup.string().max(LENGTH_S).required(),
  address: yup.string().max(LENGTH_S).required().matches(addressPattern),
  region: yup.string().max(LENGTH_S).required().matches(namePattern),
  city: yup.string().max(LENGTH_S).required().matches(namePattern),
  zipCode: yup.string().max(LENGTH_S).required().matches(zipCodePattern),
  phoneNumber: yup.string().max(10).required().matches(phonePattern),
  email: yup.string().max(LENGTH_S).required().matches(emailPattern),
});

export const returnProductSchema = yup.object().shape({
  productId: yup.string().required().length(10),
  orderNo: yup.string().required().length(10),
  firstName: yup.string().max(64).required().matches(namePattern),
  lastName: yup.string().max(64).required().matches(namePattern),
  reason: yup.string().max(LENGTH_S).required(),
  address: yup.string().max(LENGTH_S).required().matches(addressPattern),
  city: yup.string().max(LENGTH_S).required().matches(namePattern),
  zipCode: yup.string().max(LENGTH_S).required().matches(zipCodePattern),
  phoneNumber: yup.string().max(10).required().matches(phonePattern),
  email: yup.string().max(LENGTH_S).required().matches(emailPattern),
});

export const paymentFormSchema = yup.object().shape({
  cardNumber: yup.string().required().length(16).matches(creditCardNumber),
  expDate: yup.string().required().length(5).matches(expDatePatern),
  cvv: yup.string().max(64).required().matches(cvvPatern),
  cardHolder: yup.string().max(LENGTH_S).required().matches(namePattern),
});

export const listPropertySchema = yup.object().shape({
  name: yup.string().max(64).required().matches(namePattern),
  offeringType: yup.string().max(LENGTH_S).required(),
  propertyType: yup.string().max(LENGTH_S).required(),
  location: yup.string().max(LENGTH_S).required(),
  size: yup.string().max(LENGTH_S).required().matches(pricePattern),
  price: yup.string().max(LENGTH_S).required().matches(pricePattern),
  email: yup.string().max(LENGTH_S).required().matches(emailPattern),
});
