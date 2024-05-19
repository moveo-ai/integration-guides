import { yupResolver } from '@hookform/resolvers/yup';
import Button from '@mui/material/Button';
import Head from 'next/head';
import { useSyncLanguage } from 'ni18n';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Resolver, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import Alert from '../../components/Alert';
import ConfirmationBox from '../../components/ConfirmationBox';
import Input from '../../components/Input';
import Loading from '../../components/Loading';
import Select from '../../components/Select';
import Success from '../../components/Success';
import { logger } from '../../config/logger';
import useWebview from '../../hooks/useWebview';
import { returnProductSchema } from '../../util/validator';

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

function ReturnProduct() {
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

  const reasons = useMemo(
    () => [
      {
        label: t('return_product_form.wrong_product'),
        value: 'wrong_product',
      },
      {
        label: t('return_product_form.defective_product'),
        value: 'defective_product',
      },
      { label: t('return_product_form.changed_mind'), value: 'changed_mind' },
      {
        label: t('return_product_form.damaged_product'),
        value: 'damaged_product',
      },
      { label: t('return_product_form.size'), value: 'size' },
      { label: t('common.other'), value: 'other' },
    ],
    [t]
  );

  const placeholders = useMemo(() => {
    return {
      productId: t('return_product_form.product_id'),
      orderNo: t('return_product_form.orderNo'),
      firstName: t('common.name'),
      lastName: t('common.surname'),
      reason: t('return_product_form.reason'),
      city: t('common.city'),
      address: t('common.address'),
      zipCode: t('common.zip_code'),
      phoneNumber: t('common.phone_number'),
      email: t('common.email'),
    };
  }, [t]);

  const prepareConfirmationData = useCallback(
    (data) => {
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
    },
    [placeholders, reasons]
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
    resolver: yupResolver(returnProductSchema) as Resolver<FormInputs>,
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
        <title>{t('return_product_form.title')}</title>
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
export default ReturnProduct;
