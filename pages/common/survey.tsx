import { TextareaAutosize, Typography } from '@mui/material';
import Button from '@mui/material/Button';
import cn from 'classnames';
import Head from 'next/head';
import { useSyncLanguage } from 'ni18n';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Alert from '../../components/Alert';
import Loading from '../../components/Loading';
import Success from '../../components/Success';
import { logger } from '../../config/logger';
import useColorTheme from '../../hooks/useColorTheme';
import useSurvey from '../../hooks/useSurvey';
import useWebview from '../../hooks/useWebview';

import styles from './survey.module.scss';

const MAX_CHARS = 280;

function Survey() {
  const { closeWebview, missingParameters, params } = useWebview('demo');
  const submitSurvey = useSurvey({
    missingParameters,
    ...params,
  });
  const { t, ready } = useTranslation();
  useSyncLanguage(params?.brainLanguage || 'en');
  const [rating, setRating] = useState<number | null>(null);
  const [isSendingContext, setIsSendingContext] = useState(false);
  const [haveSentContext, setHaveSentContext] = useState(false);
  const [input, setInput] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const feedbackSection = useRef<null | HTMLDivElement>(null);
  const mode = useColorTheme();

  const surveyTexts = [
    t('survey.terrible'),
    t('survey.bad'),
    t('survey.okay'),
    t('survey.good'),
    t('survey.excellent'),
  ];
  useEffect(() => {
    setError(missingParameters);
  }, [missingParameters]);

  const handleOnCloseError = useCallback(() => {
    setError(null);
  }, []);

  const handleRatingClick = useCallback((_e, index: number) => {
    setRating(index + 1);
    feedbackSection?.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const handleFormSubmit = useCallback(() => {
    if (rating) {
      setIsSendingContext(true);

      const postMessageToParent = () => {
        window.parent?.postMessage('closeModal', '*');
        closeWebview();
      };

      submitSurvey({ feedback: input?.trim() || '', rating: rating })
        .then(() => {
          logger.info('Rating submitted to Moveo');
          setError(null);
          setIsSendingContext(false);
          setHaveSentContext(true);
          setTimeout(postMessageToParent, 2000);
        })
        .catch((err) => {
          logger.error(err);
          setError(err);
          setIsSendingContext(false);
        });
      setError(null);
    } else {
      setError(t('survey.rating_required'));
    }
  }, [closeWebview, input, rating, submitSurvey, t]);

  const handleInputChange = useCallback((event) => {
    setInput(event.target.value || '');
  }, []);

  if (!ready) {
    return (
      <Loading
        label={''}
        className={cn(styles.Loading, { [styles.dark]: mode === 'dark' })}
      />
    );
  }
  if (isSendingContext) {
    return (
      <Loading
        label={t('survey.submitting')}
        className={cn(styles.Loading, { [styles.dark]: mode === 'dark' })}
      />
    );
  }
  if (haveSentContext) {
    return (
      <Success
        label={t('survey.thanks')}
        color="#1b66d6"
        className={cn(styles.Success, { [styles.dark]: mode === 'dark' })}
      />
    );
  }
  return (
    <>
      <Head>
        <title>{t('survey.survey')}</title>
        <meta
          httpEquiv="Content-Security-Policy"
          content="upgrade-insecure-requests"
        />
      </Head>

      <div className={cn(styles.form, { [styles.dark]: mode === 'dark' })}>
        <div className="flex flex-wrap">
          {error && (
            <div className="px-2 w-full">
              <Alert message={error} onClose={handleOnCloseError} />
            </div>
          )}
        </div>
        <div className={styles.surveyWrapper}>
          <Typography className={styles.title}>
            <span>{t('survey.experience')}</span>
          </Typography>
          <div className={styles.surveyContainer}>
            {Array(5)
              .fill('')
              .map((_, index) => (
                // eslint-disable-next-line jsx-a11y/click-events-have-key-events
                <div
                  key={index}
                  className={cn(styles.circleContainer, {
                    [styles.active]: rating === index + 1,
                  })}
                  onClick={(e) => handleRatingClick(e, index)}
                  role="button"
                  tabIndex={0}
                >
                  <button
                    className={cn(styles.circleBtn, {
                      [styles.hideDescription]:
                        (index !== 0 && index !== 4) || rating,
                      [styles.dark]: mode === 'dark',
                    })}
                  >
                    {index + 1}
                  </button>
                  <Typography>{surveyTexts[index]}</Typography>
                </div>
              ))}
          </div>
        </div>
        {
          <div className={styles.feedback} ref={feedbackSection}>
            {rating && rating < 4 ? (
              <Typography>{t('survey.wrong')}</Typography>
            ) : (
              <Typography>{t('survey.well')}</Typography>
            )}
            <TextareaAutosize
              value={input}
              className={cn(styles.input, {
                [styles.dark]: mode === 'dark',
              })}
              placeholder={t('survey.type_here') || ''}
              onInput={handleInputChange}
              minRows={6}
              maxRows={6}
              maxLength={MAX_CHARS}
            />
            <span className={styles.charCounter}>
              {MAX_CHARS - input.length}
            </span>
          </div>
        }
        <div className={styles.buttonContainer}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="small"
            disabled={!rating && rating !== 0}
            onClick={handleFormSubmit}
            className={styles.buttonLabel}
          >
            {t('survey.submit')}
          </Button>
        </div>
      </div>
    </>
  );
}

export default Survey;
