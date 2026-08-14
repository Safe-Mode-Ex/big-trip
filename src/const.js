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

const MS_IN_SEC = 1000;
const SEC_IN_MIN = 60;
const MIN_IN_HOUR = 60;
const HOUR_IN_DAY = 24;
const MS_IN_HOUR = MS_IN_SEC * SEC_IN_MIN * MIN_IN_HOUR;
const MS_IN_DAY = MS_IN_HOUR * HOUR_IN_DAY;
const DEC_RADIX = 10;
const KEY_ESCAPE = 'Escape';
const EVENT_DATE_FORMAT = 'DD/MM/YY HH:mm';
const FLATPICKR_DATE_FORMAT = 'd/m/y H:i';
const MIN_POINT_PRICE = 1;

export {
  TYPES,
  EMPTY_POINT,
  FilterType,
  SortType,
  UserAction,
  UpdateType,
  MS_IN_HOUR,
  MS_IN_DAY,
  DEC_RADIX,
  KEY_ESCAPE,
  EVENT_DATE_FORMAT,
  FLATPICKR_DATE_FORMAT,
  MIN_POINT_PRICE,
};
