import { TYPES } from '../const';
import { getRandomArrayElement } from '../utils';

const mockOffers = [{
  type: getRandomArrayElement(TYPES),
  offers: [{
    id: '1',
    title: 'Upgrade to a business class',
    price: 120
  }, {
    id: '2',
    title: 'Add luggage',
    price: 100
  }]
}, {
  type: getRandomArrayElement(TYPES),
  offers: [{
    id: '3',
    title: 'Choose seats',
    price: 120
  }, {
    id: '4',
    title: 'Add meal',
    price: 300
  }]
}];

export {mockOffers};
