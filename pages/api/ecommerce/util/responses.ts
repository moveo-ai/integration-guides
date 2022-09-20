import moment from 'moment';
import pino from 'pino';
import {
  CarouselButton,
  CarouselCardProps,
  Language,
} from '../../../../types/moveo';
import { MAX_CARDS_PER_CAROUSEL } from '../../util/helper';
import {
  translateDate,
  translateExchange,
  translateExchangeValue,
  translatePastPurchases,
  translateReturn,
  translateReturnValue,
  translateTalkToHuman,
  translateTime,
} from './helper';
import { Purchase } from './models';

export function createLastPurchaseCard(
  cursor,
  lang: Language
): CarouselCardProps {
  let title;
  let subtitle;
  let label;
  let value;

  if (cursor) {
    title = translateTalkToHuman(lang);
    if (lang === 'el') {
      subtitle =
        'Αν δεν βρήκατε το αγορά που ψάχνετε μπορείτε να μιλήσετε με κάποιον συνάδελφό μας';
      label = 'Επικοινωνία';
      value = 'Θέλω να μιλήσω με άνθρωπο';
    } else if (lang === 'ro') {
      subtitle =
        'Dacă nu ați reușit să găsiți tranzacția pe care o căutați, atunci puteți vorbi cu un reprezentant';
      label = 'Agent';
      value = 'Conversație cu o persoană';
    } else if (lang === 'pt-br') {
      subtitle =
        'Se você não conseguiu encontrar a conversa que estava procurando, falamos com um representante';
      label = 'Agente Humano';
      value = 'Eu quero falar com um agente humano';
    } else {
      subtitle =
        'If you could not find the purchase you were looking for, then you can to talk to a representative';
      label = 'Human Agent';
      value = 'I want to speak to a human agent';
    }
  } else {
    title = translatePastPurchases(lang);
    label = title;
    if (lang === 'el') {
      subtitle = 'Αν δεν βρήκατε την συναλλαγή που ψάχνετε, πατήστε παρακάτω';
      value = 'Δεν την βλεπω εδω';
    } else if (lang === 'ro') {
      subtitle =
        'Dacă nu ați reușit să găsiți tranzacția pe care o căutați, vă rugăm să apăsați mai jos.';
      value = 'Nu am găsit-o';
    } else if (lang === 'pt-br') {
      subtitle =
        'Se você não conseguiu encontrar a transação que estava procurando, pressione abaixo';
      value = 'Eu não vejo isso aqui';
    } else {
      subtitle =
        'If you were unable to find the transaction you were looking for, please press below';
      value = 'I dont see it here';
    }
  }

  return {
    media: {
      url: 'https://media.wired.com/photos/59325eba9be5e55af6c246eb/191:100/w_1280,c_limit/amazoncart-feat.jpg',
      type: 'image',
    },
    title,
    subtitle,
    buttons: [
      {
        type: 'postback',
        label,
        // triggers #negative intent, so that we load older transactions
        value,
      },
    ],
  };
}

export function purchaseToCard(
  purchase: Purchase,
  lang: Language,
  isClothes?: boolean
): CarouselCardProps {
  const imageURL = purchase.ImageURL;
  const subtitle = purchase.Description;

  const created = purchase.Date;

  const fulldate = moment.utc(created).utcOffset(0).format('DD/MM/YYYY');
  const timestamp = moment.utc(created).utcOffset(0).format('HH:mm');

  const title = `${translateDate(lang)}: ${fulldate} -- ${translateTime(
    lang
  )}: ${timestamp}`;

  const buttons: CarouselButton[] = [];

  const labelReturn = translateReturn(lang);
  const labelExchange = translateExchange(lang);
  const valueReturn = translateReturnValue(lang);
  const valueExchange = translateExchangeValue(lang);

  const url = purchase.ProductURL;

  if (isClothes) {
    buttons.push(
      {
        type: 'postback',
        label: labelReturn,
        value: valueReturn + purchase.PurchaseId.toString(),
      },
      {
        type: 'postback',
        label: labelExchange,
        value: valueExchange + purchase.PurchaseId.toString(),
      }
    );
  } else {
    buttons.push({
      type: 'url',
      label: labelReturn,
      url,
    });
  }

  return {
    media: {
      url: imageURL,
      type: 'image',
    },
    title,
    subtitle,
    buttons,
  };
}

/**
   *
   * @param {*} purchases list of purchases
   * @param {*} cursor string or undefined
   * @param {*} langCode language code
   * @param {*} log logger instance
   *
   * Select purchases based on:
      1. Most recent
      2. purchase is dated before the cursor
*/
export function purchaseCardsFromAPI(
  log: pino.Logger,
  purchases: Purchase[],
  langCode: Language,
  cursor?: string,
  isClothes?: boolean
) {
  // Compare the 2 dates to sort from newest to oldest
  purchases.sort(function (a, b) {
    const keyA = Date.parse(a.Date);
    const keyB = Date.parse(b.Date);
    if (keyA > keyB) return -1;
    if (keyA < keyB) return 1;
    return 0;
  });

  // unix time: any purchase after this date will be disregarded
  // since we start by displaying the most recent purchases
  const lastValidDate = cursor ? Date.parse(cursor) : Date.now();

  const selected: CarouselCardProps[] = [];
  let newCursor;
  for (let i = 0; i < purchases.length; i += 1) {
    const purchase = purchases[i];

    const purchaseDate = Date.parse(purchase.Date);
    if (lastValidDate <= purchaseDate) {
      log.info(
        {
          purchase_id: purchase.PurchaseId,
        },
        `Ignoring purchase with date ${purchase.Date} since it happened after cursor at: ${lastValidDate}`
      );
      continue;
    }

    log.debug(
      {
        purchase_id: purchase.PurchaseId,
      },
      `Adding purchase with date ${purchase.Date} since it happened before cursor at: ${cursor}`
    );

    if (selected.length === MAX_CARDS_PER_CAROUSEL) {
      break;
    }

    selected.push(purchaseToCard(purchase, langCode, isClothes));
    newCursor = purchase.Date;
  }

  if (selected.length >= 1 && selected.length <= MAX_CARDS_PER_CAROUSEL) {
    log.debug('Creating last card for carousel');
    selected.push(createLastPurchaseCard(cursor, langCode));
  }

  return { cards: selected, cursor: newCursor };
}
