import { NextApiRequest } from 'next';
import pino from 'pino';

type MoveoChannel =
  | 'facebook'
  | 'viber'
  | 'web'
  | 'zendesk'
  | 'hangout'
  | 'apifon'
  | 'sunco';

type MoveoContextWithPageInfo = {
  context: MoveoContext;
  page?: FacebookPageContext | null;
  trigger_node_id?: string;
  user_id?: string;
};

interface MoveoContext {
  [key: string]: string | number | boolean | null;
}

interface WebhookResponse {
  output: MoveoContext;
  responses?: Action[];
}

export type WebhookAction = {
  action_id: string;
  type: 'webhook';
  webhook_id: string;
  fallback: Action[];
};

export type Action = {
  action_id: string;
} & (
  | {
      type: 'text';
      texts: string[];
      options?: { label: string; text: string }[];
    }
  | {
      type: 'handover';
      external: boolean;
    }
  | { type: 'url'; url: string }
  | { type: 'audio'; url: string }
  | { type: 'image'; url: string; name: string; size: number }
  | { type: 'video'; url: string; name: string; size: number }
  | { type: 'file'; url: string; name: string; size: number }
  | { type: 'carousel'; cards: CarouselCardProps[] }
  | {
      type: 'webview';
      url: string;
      name: string;
      label: string;
      height: string;
      trigger_node_id: string;
    }
  | {
      type: 'reset';
      nodeId: string;
      name: string;
      variables?: string[];
    }
  | WebhookAction
  | {
      type: 'tag';
      tags: string[];
    }
  | {
      type: 'event';
      name: string;
      trigger_node_id: string;
    }
);

type ButtonBase = { label: string; type: string };
type AsUrl = { type: 'url'; url: string };
type AsPostback = { type: 'postback'; value: string };
type AsPhone = { type: 'phone'; value: string };
type AsWebview = {
  type: 'webview';
  url: string;
  trigger_node_id: string;
  height?: 'tall' | 'compact' | 'full';
};

export type CarouselButton = ButtonBase &
  (AsUrl | AsPostback | AsPhone | AsWebview);

export type CarouselCardProps = {
  title: string;
  subtitle: string;
  media: { type: 'image' | 'video'; url: string };
  default_action?: CarouselButton;
  buttons: CarouselButton[];
};

type NextApiRequestWithLog = NextApiRequest & {
  moveo_id: string;
  id: string;
  log: pino.Logger;
  rawBody?: ArrayBuffer;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ApiHandler<T = any> =
  | NextApiHandler<T>
  | ((
      req: NextApiRequestWithLog,
      res: NextApiResponse<T>
    ) => void | Promise<void>);

type Language = 'el' | 'en' | 'ro' | 'pt-br' | 'it' | 'de' | 'es' | 'fr' | 'bg';

export type SurveyData = {
  feedback: string;
  rating: number;
};
