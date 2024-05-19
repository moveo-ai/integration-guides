import { yupResolver } from '@hookform/resolvers/yup';

import Button from '@mui/material/Button';
import Head from 'next/head';
import { useSyncLanguage } from 'ni18n';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Resolver, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import Alert from '../../components/Alert';
import Input from '../../components/Input';
import Loading from '../../components/Loading';
import Success from '../../components/Success';
import { logger } from '../../config/logger';
import useWebview from '../../hooks/useWebview';
import { random } from '../../util/util';
import { paymentFormSchema } from '../../util/validator';

type FormInputs = {
  cardNumber: string;
  expDate: string;
  cvv: string;
  cardHolder: string;
};

function PaymentForm() {
  const { getContext, sendContext, missingParameters, isLoading, params } =
    useWebview('demo');
  const { t, ready } = useTranslation();
  useSyncLanguage(params?.brainLanguage || 'en');
  const [isSendingContext, setIsSendingContext] = useState(false);
  const [haveSentContext, setHaveSentContext] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [context, setContext] = useState<{ total_cost?: number }>({});

  useEffect(() => {
    setError(missingParameters);
  }, [missingParameters]);

  const handleOnCloseError = useCallback(() => {
    setError(null);
  }, []);

  const loadContext = useCallback(
    () =>
      getContext()
        .then((response) => {
          setContext(response);
          setLoading(false);
        })
        .catch((error) => {
          logger.error(error, 'Error retrieving context');
          setLoading(false);
        }),
    [getContext]
  );

  useEffect(() => {
    if (!isLoading) {
      loadContext();
    }
  }, [isLoading, loadContext]);

  const placeholders = useMemo(() => {
    return {
      cardNumber: t('payment_form.card_number'),
      expDate: t('payment_form.exp_date'),
      cvv: t('payment_form.cvv'),
      cardHolder: t('payment_form.card_holder'),
    };
  }, [t]);

  const {
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<FormInputs>({
    resolver: yupResolver(paymentFormSchema) as Resolver<FormInputs>,
    reValidateMode: 'onChange',
    defaultValues: {
      cardNumber: '1234567887654321',
      expDate: '01/22',
      cvv: '012',
      cardHolder: 'John Doe',
    },
  });

  const postMessageToParent = () => {
    window.parent?.postMessage('closeModal', '*');
  };

  const handleSubmitData = (form) => {
    // Generate the transaction id as a random 10 digit number
    const bookingReferenceNo = Math.floor(random(1000000000, 9999999999));
    setLoading(true);
    setIsSendingContext(true);
    sendContext({ ...form, booking_referance_no: bookingReferenceNo })
      .then(() => {
        logger.info('Context submitted to Moveo');
        setError(null);
        setIsSendingContext(false);
        setHaveSentContext(true);
        setTimeout(postMessageToParent, 2000);
      })
      .catch((err) => {
        logger.error(err.message);
        setError(err);
        setIsSendingContext(false);
      });
    setError(null);
    setLoading(false);
  };
  if (!ready) {
    return <Loading />;
  }
  if (isSendingContext) {
    return <Loading label={t('payment_form.loading')} />;
  }
  if (haveSentContext) {
    return <Success label={t('payment_form.success')} />;
  }
  return (
    <>
      <Head>
        <meta
          httpEquiv="Content-Security-Policy"
          content="upgrade-insecure-requests"
        />
        <title>{t('payment_form.payment-form')}</title>
      </Head>
      <form
        onSubmit={handleSubmit(handleSubmitData)}
        className="bg-white rounded px-8 pt-6 w-full h-full overflow-auto"
      >
        <div className="flex  flex-wrap justify-center">
          <div className="flex flex-wrap pb-8 ">
            <div className="px-2 w-full ">
              <span className="payment-emoji mr-4">💳</span>
              <span className="payment-disclaimer">
                {t('payment_form.title')}
              </span>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap">
          {error && (
            <div className="mb-4 px-2 w-full">
              <Alert message={error?.message} onClose={handleOnCloseError} />
            </div>
          )}
        </div>
        <div className="flex flex-wrap">
          <div className="mb-4 sm:w-3/4 xs:w-1 px-2 w-full h-20">
            <Input
              control={control}
              errors={errors.cardNumber}
              name="cardNumber"
              placeholder={placeholders.cardNumber}
              type="number"
              maxLength={16}
            />
          </div>
          <div className="mb-4 sm:w-1/4 xs:w-1 px-2 w-full h-20">
            <Input
              control={control}
              errors={errors.expDate}
              name="expDate"
              placeholder={placeholders.expDate}
              type="string"
              maxLength={5}
            />
          </div>
          <div className="mb-4 sm:w-1/4 xs:w-1 px-2 w-full h-20">
            <Input
              control={control}
              errors={errors.cvv}
              name="cvv"
              placeholder={placeholders.cvv}
              upperCase
              type="number"
              maxLength={3}
            />
          </div>
          <div className="mb-4 sm:w-3/4 xs:w-1 px-2 w-full h-20">
            <Input
              control={control}
              errors={errors.cardHolder}
              name="cardHolder"
              placeholder={placeholders.cardHolder}
              upperCase
              type="string"
              maxLength={64}
            />
          </div>
        </div>
        <div className="flex pb-8 flex-wrap justify-center">
          {!loading && (
            <div className="px-2 sm:w-1/4 xs:w-1 w-full justify-center">
              <Button
                type="submit"
                variant="contained"
                fullWidth
                color="primary"
              >
                {context.total_cost
                  ? `${t('payment_form.pay')} ${context.total_cost}€`
                  : `${t('payment_form.pay')}`}
              </Button>
              {loading && (
                <div className="myloader">
                  <Loading label={t('common.loading')} />
                </div>
              )}
            </div>
          )}
        </div>
      </form>
    </>
  );
}
export default PaymentForm;
