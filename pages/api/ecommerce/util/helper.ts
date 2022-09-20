import { Language } from '../../../../types/moveo';
import { Purchase } from './models';

export const clothingPurchases = [
  {
    PurchaseId: 10303049,
    Price: 100,
    Type: 'Jeans',
    Status: 'Completed',
    Description: 'Men slim jeans',
    Date: '2022-04-12T18:22:47.81',
    ImageURL:
      'https://images.pexels.com/photos/1598507/pexels-photo-1598507.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  },
  {
    PurchaseId: 10303050,
    Price: 120,
    Type: 'Shoes',
    Status: 'Completed',
    Description: 'Nike sneakers',
    Date: '2022-04-13T18:22:47.81',
    ImageURL:
      'https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  },
  {
    PurchaseId: 23930304,
    Price: 200,
    Type: 'Backpack',
    Status: 'Completed',
    Description: 'HighKey Backpack',
    Date: '2022-03-19T15:22:47.81',
    ImageURL:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/4/42/HighKey_Backpack.png/723px-HighKey_Backpack.png?20200321020548',
  },
  {
    PurchaseId: 10303061,
    Price: 130,
    Type: 'Sweater',
    Status: 'Completed',
    Description: 'Christmas Sweater',
    Date: '2022-04-19T15:22:47.81',
    ImageURL:
      'https://upload.wikimedia.org/wikipedia/commons/7/78/Christmas_Sweater.jpg',
  },
  {
    PurchaseId: 10303072,
    Price: 230,
    Type: 'Jacket',
    Status: 'Completed',
    Description: 'Tracksuit jacket',
    Date: '2022-04-20T18:20:41.86',
    ImageURL:
      'https://upload.wikimedia.org/wikipedia/commons/2/2f/Tracksuit_jacket.jpg',
  },
  {
    PurchaseId: 10303083,
    Price: 150,
    Type: 'Jacket',
    Status: 'Completed',
    Description: 'Women Bomber Jacket',
    Date: '2022-04-21T18:20:41.86',
    ImageURL:
      'https://upload.wikimedia.org/wikipedia/commons/7/74/Women_Bomber_Jacket_Front.jpg',
  },
] as Purchase[];

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

export function translateReturnValue(lang: Language) {
  switch (lang) {
    case 'en':
      return 'I want a refund for the product with code ';
    case 'el':
      return 'Θέλω επιστροφή χρημάτων για το προϊόν με κωδικό ';
    case 'ro':
      return 'Doresc rambursarea produsului cu cod ';
    case 'pt-br':
      return 'Quero um reembolso para o produto com código';
    default:
      return 'I want a refund for the product with code ';
  }
}
export function translateExchange(lang: Language) {
  switch (lang) {
    case 'el':
      return 'Ανταλλαγή';
    case 'en':
      return 'Exchange';
    case 'ro':
      return 'Schimb';
    case 'pt-br':
      return 'Intercâmbio';
    default:
      return 'Exchange';
  }
}

export function translateExchangeValue(lang: Language) {
  switch (lang) {
    case 'el':
      return 'Θα ήθελα να ανταλλάξω το προϊόν με κωδικό ';
    case 'en':
      return 'I would like to exchange the product with code ';
    case 'pt-br':
      return 'Gostaria de trocar o produto com código';
    case 'ro':
      return 'As dori sa schimb produsul cu cod';
    default:
      return 'I would like to exchange the product with code ';
  }
}
