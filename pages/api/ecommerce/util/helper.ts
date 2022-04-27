import { Language } from '../../../../types/moveo';

export function translateDate(lang: Language) {
  switch (lang) {
    case 'el':
      return 'Ημερομηνία';
    case 'en':
      return 'Date';
    case 'ro':
      return 'Data';
    case 'pt-br':
      return 'Data';
    default:
      return 'Date';
  }
}

export function translateTime(lang: Language) {
  switch (lang) {
    case 'el':
      return 'Ώρα';
    case 'en':
      return 'Time';
    case 'ro':
      return 'Ora';
    case 'pt-br':
      return 'Tempo';
    default:
      return 'Time';
  }
}

export function translateReturn(lang: Language) {
  switch (lang) {
    case 'el':
      return 'Επιστροφή';
    case 'en':
      return 'Return';
    case 'ro':
      return 'Returneaza';
    case 'pt-br':
      return 'Devolver';
    default:
      return 'Return';
  }
}

export function translateTalkToHuman(lang: Language) {
  switch (lang) {
    case 'el':
      return 'Επικοινωνία με κάποιον συνάδελφο';
    case 'en':
      return 'Talk to a representative';
    case 'ro':
      return 'Discutați cu un reprezentant';
    case 'pt-br':
      return 'Falar com um agente';
    default:
      return 'Talk to a representative';
  }
}

export function translatePastPurchases(lang: Language) {
  switch (lang) {
    case 'el':
      return 'Παλαιότερες Αγορές';
    case 'en':
      return 'Past Purchases';
    case 'ro':
      return 'Tranzacții mai vechi';
    case 'pt-br':
      return 'Transações anteriores';
    default:
      return 'Past Transactions';
  }
}
