import { sendSurveyToMoveo } from '../lib/moveo';
import { SurveyData } from '../types/moveo';

const useSurvey = ({
  channel,
  integrationId,
  sessionId,
  customerId,
  missingParameters,
  userId,
}) => {
  const submitSurvey = async (survey: SurveyData) => {
    const data = {
      survey,
      user_id: userId || undefined,
    };

    if (!channel || !integrationId || !sessionId) {
      throw new Error(
        'Missing required parameters: channel or integrationId or sessionId'
      );
    }

    if (missingParameters) {
      throw new Error(missingParameters);
    }

    const response = await sendSurveyToMoveo(
      data,
      channel,
      integrationId,
      sessionId,
      customerId
    );

    return response.data;
  };

  return submitSurvey;
};

export default useSurvey;
