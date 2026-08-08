const TYPES = ['Taxi', 'Bus', 'Train', 'Ship', 'Drive', 'Flight', 'Check-in', 'Sightseeing', 'Restaurant'];
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

export {
  TYPES,
  FilterType,
  SortType,
  MS_IN_HOUR,
  MS_IN_DAY,
  DEC_RADIX,
  KEY_ESCAPE,
  EVENT_DATE_FORMAT,
  FLATPICKR_DATE_FORMAT,
};
