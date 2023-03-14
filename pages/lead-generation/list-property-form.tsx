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
import { listPropertySchema } from '../../util/validator';

type FormInputs = {
  name: string;
  offeringType: string;
  propertyType: string;
  location: string;
  size: number;
  price: string;
  email: string;
};

function ListProperty() {
  const { closeWebview, sendContext, missingParameters, params } =
    useWebview('demo');
  useSyncLanguage(params?.brainLanguage || 'en');
  const { t, ready } = useTranslation();
  const [isSendingContext, setIsSendingContext] = useState(false);
  const [haveSentContext, setHaveSentContext] = useState(false);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({});
  const [confirmationData, setConfirmationData] = useState([]);

  const propertyType = useMemo(
    () => [
      {
        label: t('list-property-form.residential'),
        value: 'residential',
      },
      { label: t('list-property-form.commercial'), value: 'commercial' },
      { label: t('list-property-form.plot'), value: 'plots' },
    ],
    [t]
  );

  const offeringType = useMemo(
    () => [
      {
        label: t('list-property-form.sell'),
        value: 'sell',
      },
      { label: t('list-property-form.rent'), value: 'rent' },
    ],
    [t]
  );

  const placeholders = useMemo(() => {
    return {
      name: t('list-property-form.owner'),
      offeringType: t('list-property-form.offering_type'),
      propertyType: t('list-property-form.property_type'),
      size: t('list-property-form.size-sq-m'),
      price: t('list-property-form.asking-price-eur'),
      location: t('list-property-form.location'),
      email: t('common.email'),
    };
  }, [t]);

  const prepareConfirmationData = useCallback(
    (data) => {
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
    },
    [offeringType, placeholders, propertyType]
  );

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
        <title>{t('list-property-form.title')}</title>
      </Head>

      <form
        onSubmit={handleSubmit(handleFormClick)}
        className="bg-white rounded px-8 pt-6 pb-8 w-full h-full overflow-auto"
      >
        <div className="flex flex-wrap">
          {error && (
            <div className="mb-4 px-2 w-full">
              <Alert message={error?.message} onClose={handleOnCloseError} />
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
              <span className="disclaimer-text">{t('common.disclaimer')}</span>
            </div>
          </div>
        </div>
        <div className="px-2 pb-4 w-full">
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
export default ListProperty;
