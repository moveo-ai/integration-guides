import { TFunction } from 'i18next';

const mockedEvents = (t: TFunction) => [
  {
    eventId: 1156777192,
    imageUrl: '',
    area: t('book-tickets.new_york'),
    type: t('book-tickets.concerts'),
    price: 40,
    title: t('book-tickets.pop_concert'),
    dates: [
      `${t('book-tickets.friday')} 18:00`,
      `${t('book-tickets.saturday')} 19:00`,
    ],
  },
  {
    eventId: 5359597028,
    imageUrl: '',
    area: t('book-tickets.new_york'),
    type: t('book-tickets.concerts'),
    price: 50,
    title: t('book-tickets.classical_concert'),
    dates: [`${t('book-tickets.saturday')} 20:00`],
  },
  {
    eventId: 8192688097,
    imageUrl: '',
    area: t('book-tickets.london'),
    type: t('book-tickets.concerts'),
    price: 50,
    title: t('book-tickets.blues_concert'),
    dates: [
      `${t('book-tickets.friday')} 18:00`,
      `${t('book-tickets.saturday')} 19:00`,
    ],
  },
  {
    eventId: 2926400295,
    imageUrl: '',
    area: t('book-tickets.new_york'),
    type: t('book-tickets.concerts'),
    price: 60,
    title: t('book-tickets.rock_concert'),
    dates: [
      `${t('book-tickets.friday')} 18:00`,
      `${t('book-tickets.saturday')} 19:00`,
    ],
  },
  {
    eventId: 7275315503,
    imageUrl: '',
    area: t('book-tickets.new_york'),
    type: t('book-tickets.concerts'),
    price: 45,
    title: t('book-tickets.electronic_concert'),
    dates: [
      `${t('book-tickets.friday')} 18:00`,
      `${t('book-tickets.saturday')} 19:00`,
    ],
  },
  {
    eventId: 1021223898,
    imageUrl: '',
    area: t('book-tickets.london'),
    type: t('book-tickets.concerts'),
    price: 50,
    title: t('book-tickets.accoustic_concert'),
    dates: [
      `${t('book-tickets.friday')} 18:00`,
      `${t('book-tickets.saturday')} 19:00`,
    ],
  },
  {
    eventId: 5020216125,
    imageUrl: '',
    area: t('book-tickets.new_york'),
    type: t('book-tickets.festivals'),
    price: 120,
    title: t('book-tickets.dance_festival'),
    dates: [
      `${t('book-tickets.friday')} 18:00`,
      `${t('book-tickets.saturday')} 19:00`,
    ],
  },
  {
    eventId: 3780135427,
    imageUrl: '',
    area: t('book-tickets.london'),
    type: t('book-tickets.festivals'),
    price: 100,
    title: t('book-tickets.rap_festival'),
    dates: [
      `${t('book-tickets.friday')} 18:00`,
      `${t('book-tickets.saturday')} 19:00`,
    ],
  },
  {
    eventId: 2472081431,
    imageUrl: '',
    area: t('book-tickets.new_york'),
    type: t('book-tickets.theatrical_performances'),
    price: 15,
    title: t('book-tickets.theatrical_performance'),
    dates: [
      `${t('book-tickets.friday')} 18:00`,
      `${t('book-tickets.saturday')} 19:00`,
    ],
  },
  {
    eventId: 5720563665,
    imageUrl: '',
    area: t('book-tickets.new_york'),
    type: t('book-tickets.theatrical_performances'),
    price: 25,
    title: t('book-tickets.theatrical_performance'),
    dates: [
      `${t('book-tickets.friday')} 18:00`,
      `${t('book-tickets.saturday')} 19:00`,
    ],
  },
  {
    eventId: 1961573367,
    imageUrl: '',
    area: t('book-tickets.london'),
    type: t('book-tickets.theatrical_performances'),
    price: 10,
    title: t('book-tickets.theatrical_performance'),
    dates: [
      `${t('book-tickets.friday')} 18:00`,
      `${t('book-tickets.saturday')} 19:00`,
    ],
  },
  {
    eventId: 1432089195,
    imageUrl: '',
    area: t('book-tickets.new_york'),
    type: t('book-tickets.theatrical_performances'),
    price: 20,
    title: t('book-tickets.theatrical_performance'),
    dates: [
      `${t('book-tickets.friday')} 18:00`,
      `${t('book-tickets.saturday')} 19:00`,
    ],
  },
  {
    eventId: 6416205503,
    imageUrl: '',
    area: t('book-tickets.london'),
    type: t('book-tickets.theatrical_performances'),
    price: 15,
    title: t('book-tickets.theatrical_performance'),
    dates: [
      `${t('book-tickets.friday')} 18:00`,
      `${t('book-tickets.saturday')} 19:00`,
    ],
  },
  {
    eventId: 9016609257,
    imageUrl: '',
    area: t('book-tickets.new_york'),
    type: t('book-tickets.musicals'),
    price: 10,
    title: t('book-tickets.musical'),
    dates: [
      `${t('book-tickets.friday')} 18:00`,
      `${t('book-tickets.saturday')} 19:00`,
    ],
  },
  {
    eventId: 1949622723,
    imageUrl: '',
    area: t('book-tickets.london'),
    type: t('book-tickets.musicals'),
    price: 15,
    title: t('book-tickets.musical'),
    dates: [
      `${t('book-tickets.friday')} 18:00`,
      `${t('book-tickets.saturday')} 19:00`,
    ],
  },
  {
    eventId: 1965215639,
    imageUrl: '',
    area: t('book-tickets.new_york'),
    type: t('book-tickets.dance_performances'),
    price: 35,
    title: t('book-tickets.dance_performance'),
    dates: [
      `${t('book-tickets.friday')} 18:00`,
      `${t('book-tickets.saturday')} 19:00`,
    ],
  },
  {
    eventId: 5101700643,
    imageUrl: '',
    area: t('book-tickets.new_york'),
    type: t('book-tickets.dance_performances'),
    price: 25,
    title: t('book-tickets.dance_performance'),
    dates: [
      `${t('book-tickets.friday')} 18:00`,
      `${t('book-tickets.saturday')} 19:00`,
    ],
  },
  {
    eventId: 8762032072,
    imageUrl: '',
    area: t('book-tickets.london'),
    type: t('book-tickets.dance_performances'),
    price: 30,
    title: t('book-tickets.dance_performance'),
    dates: [
      `${t('book-tickets.friday')} 18:00`,
      `${t('book-tickets.saturday')} 19:00`,
    ],
  },
  {
    eventId: 4373459554,
    imageUrl: '',
    area: t('book-tickets.new_york'),
    type: t('book-tickets.cartoons'),
    price: 5,
    title: t('book-tickets.cartoon'),
    dates: [
      `${t('book-tickets.friday')} 18:00`,
      `${t('book-tickets.saturday')} 19:00`,
    ],
  },
  {
    eventId: 5218933104,
    imageUrl: '',
    area: t('book-tickets.new_york'),
    type: t('book-tickets.cartoons'),
    price: 5,
    title: t('book-tickets.cartoon'),
    dates: [
      `${t('book-tickets.friday')} 18:00`,
      `${t('book-tickets.saturday')} 19:00`,
    ],
  },
  {
    eventId: 3844730324,
    imageUrl: '',
    area: t('book-tickets.london'),
    type: t('book-tickets.cartoons'),
    price: 5,
    title: t('book-tickets.cartoon'),
    dates: [
      `${t('book-tickets.friday')} 18:00`,
      `${t('book-tickets.saturday')} 19:00`,
    ],
  },
  {
    eventId: 9947042135,
    imageUrl: '',
    area: t('book-tickets.london'),
    type: t('book-tickets.cartoons'),
    price: 6,
    title: t('book-tickets.cartoon'),
    dates: [
      `${t('book-tickets.friday')} 18:00`,
      `${t('book-tickets.saturday')} 19:00`,
    ],
  },
  {
    eventId: 4177324785,
    imageUrl: '',
    area: t('book-tickets.new_york'),
    type: t('book-tickets.cartoons'),
    price: 6,
    title: t('book-tickets.cartoon'),
    dates: [
      `${t('book-tickets.friday')} 18:00`,
      `${t('book-tickets.saturday')} 19:00`,
    ],
  },
  {
    eventId: 4160250703,
    imageUrl: '',
    area: t('book-tickets.new_york'),
    type: t('book-tickets.movies'),
    price: 6,
    title: t('book-tickets.action_movie'),
    dates: [
      `${t('book-tickets.friday')} 18:00`,
      `${t('book-tickets.saturday')} 19:00`,
    ],
  },
  {
    eventId: 4745421207,
    imageUrl: '',
    area: t('book-tickets.new_york'),
    type: t('book-tickets.movies'),
    price: 5,
    title: t('book-tickets.horror_movie'),
    dates: [
      `${t('book-tickets.friday')} 18:00`,
      `${t('book-tickets.saturday')} 19:00`,
    ],
  },
  {
    eventId: 9936209867,
    imageUrl: '',
    area: t('book-tickets.london'),
    type: t('book-tickets.movies'),
    price: 6,
    title: t('book-tickets.horror_movie'),
    dates: [
      `${t('book-tickets.friday')} 18:00`,
      `${t('book-tickets.saturday')} 19:00`,
    ],
  },
  {
    eventId: 2948856765,
    imageUrl: '',
    area: t('book-tickets.new_york'),
    type: t('book-tickets.movies'),
    price: 6,
    title: t('book-tickets.comedy_movie'),
    dates: [
      `${t('book-tickets.friday')} 18:00`,
      `${t('book-tickets.saturday')} 19:00`,
    ],
  },
  {
    eventId: 3566592911,
    imageUrl: '',
    area: t('book-tickets.new_york'),
    type: t('book-tickets.movies'),
    price: 7,
    title: t('book-tickets.romance_movie'),
    dates: [
      `${t('book-tickets.friday')} 18:00`,
      `${t('book-tickets.saturday')} 19:00`,
    ],
  },
  {
    eventId: 4966443011,
    imageUrl: '',
    area: t('book-tickets.london'),
    type: t('book-tickets.movies'),
    price: 6,
    title: t('book-tickets.comedy_movie'),
    dates: [
      `${t('book-tickets.friday')} 18:00`,
      `${t('book-tickets.saturday')} 19:00`,
    ],
  },
  {
    eventId: 2227182223,
    imageUrl: '',
    area: t('book-tickets.new_york'),
    type: t('book-tickets.movies'),
    price: 6,
    title: t('book-tickets.mystery_movie'),
    dates: [
      `${t('book-tickets.friday')} 18:00`,
      `${t('book-tickets.saturday')} 19:00`,
    ],
  },
  {
    eventId: 8492747438,
    imageUrl: '',
    area: t('book-tickets.new_york'),
    type: t('book-tickets.movies'),
    price: 5,
    title: t('book-tickets.animation_movie'),
    dates: [
      `${t('book-tickets.friday')} 18:00`,
      `${t('book-tickets.saturday')} 19:00`,
    ],
  },
  {
    eventId: 5878857406,
    imageUrl: '',
    area: t('book-tickets.london'),
    type: t('book-tickets.movies'),
    price: 7,
    title: t('book-tickets.animation_movie'),
    dates: [
      `${t('book-tickets.friday')} 18:00`,
      `${t('book-tickets.saturday')} 19:00`,
    ],
  },
];

export default mockedEvents;