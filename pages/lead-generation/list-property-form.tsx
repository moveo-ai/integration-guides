import { yupResolver } from '@hookform/resolvers/yup';
import { ThemeProvider } from '@mui/material';
import { StyledEngineProvider } from '@mui/material/styles';

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
import { listPropertySchema } from '../../util/validator';

const propertyType = [
  {
    label: 'Residential',
    value: 'residential',
  },
  { label: 'Commercial', value: 'commercial' },
  { label: 'Plot', value: 'plots' },
];

const offeringType = [
  {
    label: 'Sell',
    value: 'sell',
  },
  { label: 'Rent', value: 'rent' },
];

const placeholders = {
  name: "Owner's Name",
  offeringType: 'Offering type',
  propertyType: 'Property type',
  size: 'Size (sq.m)',
  price: 'Asking price (€)',
  location: 'Location',
  email: 'Email',
};

type FormInputs = {
  name: string;
  offeringType: string;
  propertyType: string;
  location: string;
  size: number;
  price: string;
  email: string;
};

export const prepareConfirmationData = (data) => {
  const preparedData = Object.entries(placeholders).reduce(
    (total, [key, value]) => {
      if (value === placeholders.propertyType && propertyType) {
        const shownValue = propertyType.find(
          (item) => item.value === data[key]
        );
        return [...total, { label: value, value: shownValue?.label }];
      }
      if (value === placeholders.offeringType && offeringType) {
        const shownValue = offeringType.find(
          (item) => item.value === data[key]
        );
        return [...total, { label: value, value: shownValue?.label }];
      }
      return [...total, { label: value, value: data[key] }];
    },
    []
  );
  return preparedData;
};

function ListProperty() {
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
    resolver: yupResolver(listPropertySchema),
    reValidateMode: 'onChange',
    defaultValues: {
      name: 'JOHN DOE',
      offeringType: 'sell',
      propertyType: 'residential',
      location: 'EXAMPLE STR 42, 50500 NEW YORK',
      size: 100,
      price: '100.000',
      email: 'example@mail.com',
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
                  errors={errors.name}
                  name="name"
                  placeholder={placeholders.name}
                  upperCase
                  type="string"
                  maxLength={64}
                />
              </div>
              <div className="mb-4 sm:w-1/2 xs:w-1 px-2 w-full h-20">
                <Select
                  control={control}
                  errors={errors.offeringType}
                  options={offeringType}
                  name="offeringType"
                  placeholder={placeholders.offeringType}
                />
              </div>
              <div className="mb-4 sm:w-1/2 xs:w-1 px-2 w-full h-20">
                <Select
                  control={control}
                  errors={errors.propertyType}
                  options={propertyType}
                  name="propertyType"
                  placeholder={placeholders.propertyType}
                />
              </div>
              <div className="mb-4 sm:w-1/2 xs:w-1 px-2 w-full h-20">
                <Input
                  control={control}
                  errors={errors.location}
                  name="location"
                  placeholder={placeholders.location}
                  type="string"
                  maxLength={64}
                  upperCase
                />
              </div>
              <div className="mb-4 sm:w-1/2 xs:w-1 px-2 w-full h-20">
                <Input
                  control={control}
                  errors={errors.size}
                  name="size"
                  placeholder={placeholders.size}
                  type="number"
                  isCurrency
                  maxLength={5}
                />
              </div>
              <div className="mb-4 sm:w-1/2 xs:w-1 px-2 w-full h-20">
                <Input
                  control={control}
                  errors={errors.price}
                  name="price"
                  placeholder={placeholders.price}
                  isCurrency
                  type="number"
                  maxLength={7}
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
export default ListProperty;
