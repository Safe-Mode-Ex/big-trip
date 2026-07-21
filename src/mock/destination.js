import { getRandomArrayElement } from 'utils';

const mockDestinations = [{
  id: '1',
  description: 'Chamonix, is a beautiful city, a true asian pearl, with crowded streets.',
  name: 'Chamonix',
  pictures: [
    {
      src: 'http://picsum.photos/300/200?r=0.0762563005163317',
      description: 'Chamonix parliament building'
    }
  ]
}, {
  id: '2',
  description: 'Geneva is a city in Switzerland that lies at the southern tip of expansive Lac Léman (Lake Geneva). Surrounded by the Alps and Jura mountains, the city has views of dramatic Mont Blanc.',
  name: 'Geneva',
  pictures: [
    {
      src: 'https://loremflickr.com/248/152?random=1',
      description: 'Geneva parliament building'
    }
  ]
}];

function getRandomDestination() {
  return getRandomArrayElement(mockDestinations);
}

export {getRandomDestination};
