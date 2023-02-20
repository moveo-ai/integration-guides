import { yupResolver } from '@hookform/resolvers/yup';
import Button from '@mui/material/Button';
import Head from 'next/head';
import { useSyncLanguage } from 'ni18n';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import Alert from '../../components/Alert';
import ConfirmationBox from '../../components/ConfirmationBox';
import Input from '../../components/Input';
import Loading from '../../components/Loading';
import Select from '../../components/Select';
import Success from '../../components/Success';
import { logger } from '../../config/logger';
import useWebview from '../../hooks/useWebview';
import { demoSchema } from '../../util/validator';

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

function Demo() {
  const { closeWebview, sendContext, missingParameters, params } =
    useWebview('demo');
  const { t, ready } = useTranslation();
  useSyncLanguage(params?.brainLanguage || 'en');
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

  const placeholders = useMemo(() => {
    return {
      firstName: t('common.name'),
      lastName: t('common.surname'),
      gender: t('demo-form.gender'),
      region: t('demo-form.region'),
      city: t('common.city'),
      address: t('common.address'),
      zipCode: t('common.zip_code'),
      phoneNumber: t('common.phone_number'),
      email: t('common.email'),
    };
  }, [t]);

  const genders = useMemo(() => {
    return [
      { label: t('demo-form.male'), value: 'male' },
      { label: t('demo-form.female'), value: 'female' },
      { label: t('common.other'), value: 'other' },
    ];
  }, [t]);

  const prepareConfirmationData = useCallback(
    (data) => {
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
    },
    [genders, placeholders]
  );

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
  if (!ready) {
    return <Loading />;
  }
  if (isSendingContext) {
    return <Loading label={t('common.loading_message')} />;
  }
  if (haveSentContext) {
    return <Success label={t('common.success_message')} />;
  }
  return (
    <>
      <Head>
        <meta
          httpEquiv="Content-Security-Policy"
          content="upgrade-insecure-requests"
        />
        <title>{t('demo-form.title')}</title>
      </Head>

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
            />
          </div>
          <div className="mb-4 sm:w-1/2 xs:w-1 px-2 w-full h-20">
            <Input
              control={control}
              errors={errors.zipCode}
              name="zipCode"
              placeholder={placeholders.zipCode}
              type="number"
            />
          </div>
          <div className="mb-4 sm:w-1/2 xs:w-1 px-2 w-full h-20">
            <Input
              control={control}
              errors={errors.phoneNumber}
              placeholder={placeholders.phoneNumber}
              name="phoneNumber"
              type="number"
            />
          </div>
          <div className="mb-4 sm:w-1/2 xs:w-1 px-2 w-full h-20">
            <Input
              control={control}
              errors={errors.email}
              placeholder={placeholders.email}
              name="email"
              type="email"
            />
          </div>
        </div>
        <div className="flex flex-wrap">
          <div className="flex flex-wrap pb-12">
            <div className="px-2 w-full h-20">
              <span className="disclaimer-text">{t('common.disclaimer')}</span>
            </div>
          </div>
        </div>
        <div className="px-2 w-full">
          <Button type="submit" variant="contained" color="primary">
            {t('common.continue')}
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
    </>
  );
}
export default Demo;
