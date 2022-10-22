import { yupResolver } from '@hookform/resolvers/yup';
import { StyledEngineProvider } from '@mui/material/styles';

import { ThemeProvider } from '@mui/material';
import Button from '@mui/material/Button';
import Head from 'next/head';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import Alert from '../../components/Alert';
import Input from '../../components/Input';
import Loading from '../../components/Loading';
import Success from '../../components/Success';
import { logger } from '../../config/logger';
import useWebview from '../../hooks/useWebview';
import theme from '../../styles/theme';
import { random } from '../../util/util';
import { paymentFormSchema } from '../../util/validator';

const placeholders = {
  cardNumber: 'Card Number',
  expDate: 'Expiration Date',
  cvv: 'CVV',
  cardHolder: 'Card Holder Name',
};

type FormInputs = {
  cardNumber: string;
  expDate: string;
  cvv: string;
  cardHolder: string;
};

function PaymentForm() {
  const { getContext, sendContext, missingParameters, isLoading } =
    useWebview('demo');

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

  const {
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<FormInputs>({
    resolver: yupResolver(paymentFormSchema),
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
  if (isSendingContext) {
    return <Loading label="Your payment is being processed" />;
  }
  if (haveSentContext) {
    return <Success label={`Your payment was successful`} />;
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
            onSubmit={handleSubmit(handleSubmitData)}
            className="bg-white rounded px-8 pt-6 w-full h-full overflow-auto"
          >
            <div className="flex  flex-wrap justify-center">
              <div className="flex flex-wrap pb-8 ">
                <div className="px-2 w-full ">
                  <span className="payment-emoji mr-4">💳</span>
                  <span className="payment-disclaimer">
                    Pay securely with your credit or debit card
                  </span>
                </div>
              </div>
            </div>
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
                    {context.total_cost ? `Pay ${context.total_cost}€` : 'Pay'}
                  </Button>
                  {loading && (
                    <div className="myloader">
                      <Loading label="Loading" />
                    </div>
                  )}
                </div>
              )}
            </div>
          </form>
        </ThemeProvider>
      </StyledEngineProvider>
    </>
  );
}
export default PaymentForm;
