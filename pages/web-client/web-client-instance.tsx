import React, { useEffect, useState } from 'react';
import { logger } from '../../config/logger';
import styles from '../../styles/web-client-preview.module.css';

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    MoveoAI: any;
  }
}

const Index = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  const initWebClient = async () => {
    if (window.MoveoAI) {
      window.MoveoAI.init({
        // Insert your web-client integration id
        integrationId: '<INTEGRATION_ID>',
        // You can also pass custom options to the web-client to override the default configuration
        // For all methods and events visit https://docs.moveo.ai/docs/integrations/web_configuration
        welcome_message: 'This is a custom opening message',
      })
        .then((instance) => {
          logger.info('desk connected');
          // You can use the instance to control the behaviot of the web-client
          // For all methods and events visit https://docs.moveo.ai/docs/integrations/web_instance_methods_and_events

          // You can assign the instance methods so they can be used in your own codebase
          const openButton = document.getElementById('open-chat-button');

          openButton.onclick = function () {
            instance.openWindow();
          };
          const closeButton = document.getElementById('close-chat-button');

          closeButton.onclick = function () {
            instance.closeWindow();
          };
        })
        .catch((error) => logger.error(error));
    }
  };
  useEffect(() => {
    if (isLoaded) {
      initWebClient();
    }
  }, [isLoaded]);

  useEffect(() => {
    const scriptTag = document.createElement('script');
    scriptTag.src =
      'https://cdn.jsdelivr.net/npm/@moveo-ai/web-client@latest/dist/web-client.min.js';
    scriptTag.addEventListener('load', () => {
      logger.info('Script is loaded');
      setIsLoaded(true);
    });
    document.body.appendChild(scriptTag);
  }, []);

  return (
    <>
      <div className={styles.moveo_preview}>
        <div className={styles.preview_actions}>
          <p className={styles.header_text}>
            <span className={styles.colored}>Preview</span> and{' '}
            <span className={styles.colored}>Test</span>
            <br />
            your Webchat
          </p>
          <p className={styles.body_text}>
            Môveo.ai can help you build engaging conversational applications
            powered by Artificial Intelligence.
          </p>
          <div className={styles.button_container}>
            <button className={styles.action_button} id="open-chat-button">
              Open Webchat
            </button>
            <button className={styles.action_button} id="close-chat-button">
              Close Webchat
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Index;
