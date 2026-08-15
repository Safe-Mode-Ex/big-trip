const TYPES = [
  'Taxi',
  'Bus',
  'Train',
  'Ship',
  'Drive',
  'Flight',
  'Check-in',
  'Sightseeing',
  'Restaurant',
];

const EMPTY_POINT = {
  type: 'flight',
  basePrice: 0,
  dateFrom: undefined,
  dateTo: undefined,
  destination: null,
  isFavorite: false,
  offers: [],
};

const FilterType = {
  ALL: 'everything',
  FUTURE: 'future',
  PRESENT: 'present',
  PAST: 'past',
};

const SortType = {
  DAY: 'day',
  EVENT: 'event',
  TIME: 'time',
  PRICE: 'price',
  OFFERS: 'offers',
};

const UserAction = {
  UPDATE_POINT: 'UPDATE_POINT',
  ADD_POINT: 'ADD_POINT',
  DELETE_POINT: 'DELETE_POINT',
};

const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  INIT: 'INIT',
};

const DEC_RADIX = 10;
const KEY_ESCAPE = 'Escape';
const FLATPICKR_DATE_FORMAT = 'd/m/y H:i';
const MIN_POINT_PRICE = 1;

export {
  TYPES,
  EMPTY_POINT,
  FilterType,
  SortType,
  UserAction,
  UpdateType,
  DEC_RADIX,
  KEY_ESCAPE,
  FLATPICKR_DATE_FORMAT,
  MIN_POINT_PRICE,
};
