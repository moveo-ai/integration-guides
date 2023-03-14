import * as yup from 'yup';

export const LENGTH_XXS = 16;
export const LENGTH_XS = 32;
export const LENGTH_S = 64;
export const LENGTH_M = 128;
export const LENGTH_L = 256;

export const errorMessage = (name: string, errors: { type: string }, t) => {
  if (errors?.type === 'required') {
    return t('errors.required');
  }
  if (errors?.type === 'oneOf') {
    switch (name) {
      default:
        return '';
    }
  }
  if (errors?.type === 'length') {
    switch (name) {
      case 'productId':
      case 'orderNo':
        return t('errors.ten_digit_num');
      case 'cardNumber':
        return t('errors.credit_card_digits');
      case 'cvv':
        return t('errors.cvv_digits');
      case 'expDate':
        return t('errors.date_format');
      default:
        return '';
    }
  }
  if (errors?.type === 'typeError') {
    switch (name) {
      case 'cardID':
      case 'productId':
      case 'orderNo':
        return t('errors.only_numbers');
      default:
        return '';
    }
  }
  if (errors?.type === 'matches') {
    switch (name) {
      case 'firstName':
      case 'lastName':
      case 'region':
      case 'city':
      case 'cardHolder':
        return t('errors.only_latin');
      case 'phoneNumber':
        return t('errors.phone_number');
      case 'email':
        return t('errors.email');
      case 'zipCode':
        return t('errors.zip_code');
      case 'cvv':
        return t('errors.cvv');
      case 'cardNumber':
        return t('errors.credit_card');
      case 'expDate':
        return t('errors.date');
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
