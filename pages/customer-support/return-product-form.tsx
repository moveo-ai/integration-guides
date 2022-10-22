import { yupResolver } from '@hookform/resolvers/yup';
import { StyledEngineProvider, ThemeProvider } from '@mui/material';
import Button from '@mui/material/Button';
import Head from 'next/head';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import Alert from '../../components/Alert';
import ConfirmationBox from '../../components/ConfirmationBox';
import Input from '../../components/Input';
import Loading from '../../components/Loading';
import Select from '../../components/Select';
import Success from '../../components/Success';
import { logger } from '../../config/logger';
import useWebview from '../../hooks/useWebview';
import theme from '../../styles/theme';
import { returnProductSchema } from '../../util/validator';

const reasons = [
  {
    label: 'The product is not what I ordered',
    value: 'wrong_product',
  },
  { label: 'The product is defective', value: 'defective_product' },
  { label: 'I changed my mind', value: 'changed_mind' },
  { label: 'I received a damaged product', value: 'damaged_product' },
  { label: "The size doesn't fit me", value: 'size' },
  { label: 'Other', value: 'other' },
];

const placeholders = {
  productId: 'Product Id',
  orderNo: 'Order No.',
  firstName: 'Name',
  lastName: 'Surname',
  reason: 'Reason',
  city: 'City',
  address: 'Address',
  zipCode: 'Zip code',
  phoneNumber: 'Phone number',
  email: 'Email',
};

type FormInputs = {
  productId: string;
  orderNo: string;
  firstName: string;
  lastName: string;
  reason: string;
  city: string;
  address: string;
  zipCode: string;
  phoneNumber: string;
  email: string;
};

export const prepareConfirmationData = (data) => {
  const preparedData = Object.entries(placeholders).reduce(
    (total, [key, value]) => {
      if (value === placeholders.reason && reasons) {
        const shownValue = reasons.find((item) => item.value === data[key]);
        return [...total, { label: value, value: shownValue?.label }];
      }
      return [...total, { label: value, value: data[key] }];
    },
    []
  );
  return preparedData;
};

function ReturnProduct() {
  const { closeWebview, sendContext, missingParameters } = useWebview('demo');

  const [isSendingContext, setIsSendingContext] = useState(false);
  const [haveSentContext, setHaveSentContext] = useState(false);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({});
  const [confirmationData, setConfirmationData] = useState([]);

  useEffect(() => {
    setError(missingParameters);
  }, [missingParameters]);

  const handleOnCloseError = useCallback(() => {
    setError(null);
  }, []);

  const {
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<FormInputs>({
    resolver: yupResolver(returnProductSchema),
    reValidateMode: 'onChange',
    defaultValues: {
      productId: '',
      orderNo: '',
      firstName: '',
      lastName: '',
      reason: '',
      city: '',
      address: '',
      zipCode: '',
      phoneNumber: '',
      email: '',
    },
  });

  const handleFormClick = (data) => {
    const newData = {
      ...data,
    };
    setFormData(newData);
    setConfirmationData(prepareConfirmationData(newData));
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const postMessageToParent = () => {
    window.parent?.postMessage('closeModal', '*');
  };

  const handleSubmitData = () => {
    setIsSendingContext(true);
    handleClose();
    sendContext(formData)
      .then(() => {
        logger.info('Context submitted to Moveo');
        closeWebview();
        setError(null);
        setIsSendingContext(false);
        setHaveSentContext(true);
        setTimeout(postMessageToParent, 1200);
      })
      .catch((err) => {
        logger.error(err.message);
        setError(err);
        setIsSendingContext(false);
      });
    setError(null);
  };
  if (isSendingContext) {
    return <Loading label="Sending information to Moveo" />;
  }
  if (haveSentContext) {
    return <Success label="Successfully sent information to Moveo" />;
  }
  return (
    <>
      <Head>
        <meta
          httpEquiv="Content-Security-Policy"
          content="upgrade-insecure-requests"
        />
      </Head>
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme}>
          <form
            onSubmit={handleSubmit(handleFormClick)}
            className="bg-white rounded px-8 pt-6 pb-8 w-full h-full overflow-auto"
          >
            <div className="flex flex-wrap">
              {error && (
                <div className="mb-4 px-2 w-full">
                  <Alert
                    message={error?.message}
                    onClose={handleOnCloseError}
                  />
                </div>
              )}
            </div>
            <div className="flex flex-wrap">
              <div className="mb-4 sm:w-1/2 xs:w-1 px-2 w-full h-20">
                <Input
                  control={control}
                  errors={errors.productId}
                  name="productId"
                  placeholder={placeholders.productId}
                  type="number"
                  maxLength={10}
                />
              </div>
              <div className="mb-4 sm:w-1/2 xs:w-1 px-2 w-full h-20">
                <Input
                  control={control}
                  errors={errors.orderNo}
                  name="orderNo"
                  placeholder={placeholders.orderNo}
                  type="number"
                  maxLength={10}
                />
              </div>
              <div className="mb-4 sm:w-1/2 xs:w-1 px-2 w-full h-20">
                <Input
                  control={control}
                  errors={errors.firstName}
                  name="firstName"
                  placeholder={placeholders.firstName}
                  upperCase
                  type="string"
                  maxLength={64}
                />
              </div>
              <div className="mb-4 sm:w-1/2 xs:w-1 px-2 w-full h-20">
                <Input
                  control={control}
                  errors={errors.lastName}
                  name="lastName"
                  placeholder={placeholders.lastName}
                  upperCase
                  type="string"
                  maxLength={64}
                />
              </div>
              <div className="mb-4 sm:w-1/2 xs:w-1 px-2 w-full h-20">
                <Select
                  control={control}
                  errors={errors.reason}
                  options={reasons}
                  name="reason"
                  placeholder={placeholders.reason}
                />
              </div>
              <div className="mb-4 sm:w-1/2 xs:w-1 px-2 w-full h-20">
                <Input
                  control={control}
                  errors={errors.city}
                  name="city"
                  placeholder={placeholders.city}
                  type="string"
                  maxLength={64}
                />
              </div>
              <div className="mb-4 sm:w-1/2 xs:w-1 px-2 w-full h-20">
                <Input
                  control={control}
                  errors={errors.address}
                  name="address"
                  placeholder={placeholders.address}
                  type="text"
                  maxLength={64}
                />
              </div>
              <div className="mb-4 sm:w-1/2 xs:w-1 px-2 w-full h-20">
                <Input
                  control={control}
                  errors={errors.zipCode}
                  name="zipCode"
                  placeholder={placeholders.zipCode}
                  type="number"
                  maxLength={5}
                />
              </div>
              <div className="mb-4 sm:w-1/2 xs:w-1 px-2 w-full h-20">
                <Input
                  control={control}
                  errors={errors.phoneNumber}
                  placeholder={placeholders.phoneNumber}
                  name="phoneNumber"
                  type="number"
                  maxLength={10}
                />
              </div>
              <div className="mb-4 sm:w-1/2 xs:w-1 px-2 w-full h-20">
                <Input
                  control={control}
                  errors={errors.email}
                  placeholder={placeholders.email}
                  name="email"
                  type="email"
                  maxLength={64}
                />
              </div>
            </div>
            <div className="flex flex-wrap">
              <div className="flex flex-wrap pb-12">
                <div className="px-2 w-full h-20">
                  <span className="disclaimer-text">
                    The personal data that you insert will be stored and used by
                    the company only when you submit this Form.
                  </span>
                </div>
              </div>
            </div>
            <div className="px-2 pb-4 w-full">
              <Button type="submit" variant="contained" color="primary">
                Continue
              </Button>
            </div>
          </form>
          {open && (
            <ConfirmationBox
              data={confirmationData}
              handleClose={handleClose}
              open={open}
              handleSubmitData={handleSubmitData}
            />
          )}
        </ThemeProvider>
      </StyledEngineProvider>
    </>
  );
}
export default ReturnProduct;
