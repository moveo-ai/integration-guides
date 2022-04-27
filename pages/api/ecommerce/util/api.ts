import pino from 'pino';
import { Purchase } from './models';

export const listPurchases = async (
  logger: pino.Logger,
  user_id: string,
  session_id: string,
  request_id: string,
  moveo_request_id: string
): Promise<Purchase[]> => {
  const url = 'https://dummy-url-that-returns-purchases';
  const data = { CustomerId: user_id };

  // these are some good headers to be passed to your API
  const headers = {
    'User-Agent': `moveo-webhooks-${process.env.VERCEL_GIT_COMMIT_SHA}`,
    'X-Moveo-Session-Id': session_id,
    'X-Moveo-Request-Id': moveo_request_id,
    'X-Request-Id': request_id,
  };

  logger.info({...data, ...headers}, `Retrieving purchases from ${url}`);

  // API results are mocked
  return [
    {
        PurchaseId: 10303049,
        Price: 190,
        Type: 'Keyboard',
        ProductURL:
          'https://www.skroutz.gr/s/24785578/Logitech-G915-TKL-Ασύρματο-Gaming-Μηχανικό-Πληκτρολόγιο-Tenkeyless-με-GL-Tactile-διακόπτες-και-RGB-φωτισμό-Αγγλικό-US-Λευκό.html',
        ReturnURL: 'https://www.skroutz.gr/ecommerce/return_policy',
        Status: 'Completed',
        Description: 'Logitech Wireless Keyboard',
        Date: '2022-04-12T18:22:47.81',
        ImageURL:
          'https://a.scdn.gr/images/sku_main_images/032009/32009883/xlarge_20211110153952_mediarange_mros132_gr_asyrmato_bluetooth_pliktrologio_elliniko_asimi.jpeg',
    },
    {
        PurchaseId: 10303049,
        Price: 190,
        Type: 'Mouse',
        ProductURL:
          'https://www.skroutz.gr/s/23123626/Xiaomi-Mi-Dual-Mode-Ασύρματο-Bluetooth-Mini-Ποντίκι-Μαύρο.html?from=best_sellers_tag',
        ReturnURL: 'https://www.skroutz.gr/ecommerce/return_policy',
        Status: 'Completed',
        Description: 'Xiaomi Mi Dual Mode Mouse',
        Date: '2022-04-13T18:22:47.81',
        ImageURL:
          'https://b.scdn.gr/images/sku_main_images/023123/23123626/xlarge_20211215131712_xiaomi_mi_dual_mode_asyrmato_bluetooth_mini_pontiki_mayro.jpeg'
    },
    {
      PurchaseId: 23930304,
      Price: 3000,
      Type: 'Laptop',
      ProductURL:
        'https://www.skroutz.gr/s/25634434/Apple-MacBook-Air-13-3-2020-M1-8GB-256GB-SSD-Retina-Display-Space-Gray-GR-Keyboard.html',
      ReturnURL: 'https://www.skroutz.gr/ecommerce/return_policy',
      Status: 'Completed',
      Description: 'Apple MacBook Air 13.3',
      Date: '2022-03-19T15:22:47.81',
      ImageURL:
        'https://c.scdn.gr/images/sku_main_images/025634/25634434/xlarge_20201113094413_apple_macbook_air_13_3_m1_8gb_256gb_retina_display_macos_big_sur_2020_space_gray.jpeg',
    },
    {
      PurchaseId: 10303049,
      Price: 80,
      Type: 'Keyboard',
      ProductURL:
        'https://www.skroutz.gr/s/19953854/Zeroground-KB-2800G-Satomi-Gaming-Μηχανικό-Πληκτρολόγιο-με-Outemu-Red-διακόπτες-και-RGB-φωτισμό-Αγγλικό-US.html',
      ReturnURL: 'https://www.skroutz.gr/ecommerce/return_policy',
      Status: 'Completed',
      Description: 'Satomi Gaming Keyboard',
      Date: '2022-04-19T15:22:47.81',
      ImageURL:
        'https://a.scdn.gr/images/sku_main_images/019953/19953854/xlarge_20200304152526_zeroground_kb_2800g_satomi.jpeg',
    },
    {
      PurchaseId: 10303049,
      Price: 400,
      Type: 'TV',
      ProductURL:
        'https://www.skroutz.gr/s/27732284/Samsung-Smart-Τηλεόραση-LED-4K-UHD-UE50AU7172-HDR-50.html?from=best_sellers_tag',
      ReturnURL: 'https://www.skroutz.gr/ecommerce/return_policy',
      Status: 'Completed',
      Description: 'Samsung Smart TV',
      Date: '2022-04-20T18:20:41.86',
      ImageURL:
        'https://b.scdn.gr/images/sku_main_images/027732/27732284/xlarge_20211123151309_samsung_smart_tileorasi_led_4k_uhd_ue50au7172_hdr_50.jpeg',
    },
    {
      PurchaseId: 10303049,
      Price: 400,
      Type: 'XBOX',
      ProductURL:
        'https://www.skroutz.gr/s/24662008/Microsoft-Xbox-Series-S.html?from=best_sellers_tag',
      ReturnURL: 'https://www.skroutz.gr/ecommerce/return_policy',
      Status: 'Completed',
      Description: 'Xbox Series S',
      Date: '2022-04-21T18:20:41.86',
      ImageURL:
        'https://b.scdn.gr/images/sku_main_images/020592/20592739/xlarge_20191018102824_microsoft_xbox_one_x_1tb_star_wars_jedi_fallen_order.jpeg'
    },
  ];
};
