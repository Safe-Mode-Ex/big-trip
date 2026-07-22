import { getRandomPoint } from '../mock/point';
import { mockOffers } from '../mock/offer';
import { mockDestinations } from '../mock/destination';

const POINTS_COUNT = 3;

export default class PointsModel {
  destinations = mockDestinations;
  offers = mockOffers;
  points = Array.from({length: POINTS_COUNT}, getRandomPoint);

  getPoints() {
    return this.points.map((point) => {
      const pointOffers = this.offers.find(({type}) => point.type === type);
      const hasOffers = Boolean(pointOffers && pointOffers.offers.length);

      return {
        ...point,
        destination: this.destinations.find(({id}) => id === point.destination),
        offers: hasOffers ?
          pointOffers.offers.filter(({id}) => point.offers.some((offerId) => offerId === id)) :
          [],
      };
    });
  }
}
