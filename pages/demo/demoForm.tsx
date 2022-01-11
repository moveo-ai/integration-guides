import { yupResolver } from '@hookform/resolvers/yup';
import { ThemeProvider } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Head from 'next/head';
import Script from 'next/script';
import React, { useCallback, useEffect, useState } from 'react';
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
import { demoSchema } from '../../util/validator';

const genders = [
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' },
  { label: 'Other', value: 'other' },
];

const placeholders = {
  firstName: 'Name',
  lastName: 'Surname',
  gender: 'Gender',
  region: 'Region',
  city: 'City',
  address: 'Address',
  zipCode: 'Zip code',
  phoneNumber: 'Phone number',
  email: 'Email',
};

type FormInputs = {
  firstName: string;
  lastName: string;
  gender: string;
  region: string;
  city: string;
  address: string;
  zipCode: string;
  phoneNumber: string;
  email: string;
};

export const prepareConfirmationData = (data) => {
  const preparedData = Object.entries(placeholders).reduce(
    (total, [key, value]) => {
      if (value === placeholders.gender && genders) {
        const shownValue = genders.find((item) => item.value === data[key]);
        return [...total, { label: value, value: shownValue?.label }];
      }
      return [...total, { label: value, value: data[key] }];
    },
    []
  );
  return preparedData;
};

function Demo() {
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
    resolver: yupResolver(demoSchema),
    reValidateMode: 'onChange',
    defaultValues: {
      firstName: '',
      lastName: '',
      gender: '',
      region: '',
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
    window.top.postMessage('closeModal', '*');
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
      {/* Global Site Tag (gtag.js) - Google Analytics */}
      <Script
        strategy="lazyOnload"
        src="https://www.googletagmanager.com/gtag/js?id=UA-207029739-1"
      />

      <Script id="google-tag-manager-script" strategy="lazyOnload">
        {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'UA-207029739-1', {
              page_path: window.location.pathname,
            });
          `}
      </Script>

      <Head>
        <meta
          httpEquiv="Content-Security-Policy"
          content="upgrade-insecure-requests"
        />
      </Head>
      <ThemeProvider theme={theme}>
        <form
          onSubmit={handleSubmit(handleFormClick)}
          className="bg-white rounded px-8 pt-6 pb-8 w-full h-full"
        >
          <div className="flex flex-wrap">
            {error && (
              <div className="mb-4 px-2 w-full">
                <Alert message={error?.message} onClose={handleOnCloseError} />
              </div>
            )}
          </div>
          <div className="flex flex-wrap">
            <div className="mb-4 md:w-1/3 sm:w-1/2 xs:w-1 px-2 w-full h-20">
              <Input
                control={control}
                errors={errors.firstName}
                name="firstName"
                placeholder={placeholders.firstName}
                upperCase
                autoComplete="name"
                type="string"
              />
            </div>
            <div className="mb-4 md:w-1/3 sm:w-1/2 xs:w-1 px-2 w-full h-20">
              <Input
                control={control}
                errors={errors.lastName}
                name="lastName"
                placeholder={placeholders.lastName}
                upperCase
                autoComplete="family-name"
                type="string"
              />
            </div>
            <div className="mb-4 md:w-1/3 sm:w-1/2 xs:w-1 px-2 w-full h-20">
              <Select
                control={control}
                errors={errors.gender}
                options={genders}
                name="gender"
                placeholder={placeholders.gender}
              />
            </div>
          </div>
          <div className="flex-wrap">
            <div className="mb-4 sm:w-1/2 xs:w-1 px-2 w-full h-20">
              <Input
                control={control}
                errors={errors.region}
                name="region"
                placeholder={placeholders.region}
                type="string"
              />
            </div>
            <div className="mb-4 sm:w-1/2 xs:w-1 px-2 w-full h-20">
              <Input
                control={control}
                errors={errors.city}
                name="city"
                placeholder={placeholders.city}
                type="string"
              />
            </div>
            <div className="mb-4 sm:w-1/2 xs:w-1 px-2 w-full h-20">
              <Input
                control={control}
                errors={errors.address}
                name="address"
                placeholder={placeholders.address}
                type="text"
                autoComplete="street-address"
              />
            </div>
            <div className="mb-4 sm:w-1/2 xs:w-1 px-2 w-full h-20">
              <Input
                control={control}
                errors={errors.zipCode}
                name="zipCode"
                placeholder={placeholders.zipCode}
                type="number"
                autoComplete="postal-code"
              />
            </div>
            <div className="mb-4 sm:w-1/2 xs:w-1 px-2 w-full h-20">
              <Input
                control={control}
                errors={errors.phoneNumber}
                placeholder={placeholders.phoneNumber}
                name="phoneNumber"
                type="tel"
                autoComplete="tel-national"
              />
            </div>
            <div className="mb-4 sm:w-1/2 xs:w-1 px-2 w-full h-20">
              <Input
                control={control}
                errors={errors.email}
                placeholder={placeholders.email}
                name="email"
                type="email"
                autoComplete="email"
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
          <div className="px-2 w-full">
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
    </>
  );
}
export default Demo;
