import { TYPES } from 'const';
import { getRandomArrayElement } from 'utils';

const mockPoints = [{
  type: getRandomArrayElement(TYPES),
  basePrice: 11000,
  dateFrom: '2019-07-10T22:55:56.845Z',
  dateTo: '2019-07-11T11:22:13.375Z',
  destination: '1',
  isFavorite: false,
  offers: ['1'],
}, {
  type: getRandomArrayElement(TYPES),
  basePrice: 10000,
  dateFrom: '2019-07-10T12:00:56.845Z',
  dateTo: '2019-07-11T13:00:13.375Z',
  destination: '1',
  isFavorite: false,
  offers: ['1'],
}, {
  type: getRandomArrayElement(TYPES),
  basePrice: 1000,
  dateFrom: '2019-07-10T13:00:56.845Z',
  dateTo: '2019-07-11T14:00:13.375Z',
  destination: '1',
  isFavorite: false,
  offers: ['1'],
}, {
  type: getRandomArrayElement(TYPES),
  basePrice: 100,
  dateFrom: '2019-07-10T15:00:56.845Z',
  dateTo: '2019-07-11T17:00:13.375Z',
  destination: '1',
  isFavorite: false,
  offers: ['1'],
}];

function getRandomPoint() {
  return getRandomArrayElement(mockPoints);
}

export {getRandomPoint};
