import { getRandomPoint } from '../mock/point';
import { mockOffers } from '../mock/offer';

const POINTS_COUNT = 3;

export default class PointsModel {
  offers = mockOffers;
  points = Array.from({length: POINTS_COUNT}, getRandomPoint);

  getPoints() {
    return this.points.map((point) => {
      const pointOffers = this.offers.find(({type}) => point.type === type);
      const hasOffers = Boolean(pointOffers && pointOffers.offers.length);

      return {
        ...point,
        offers: hasOffers ?
          pointOffers.offers.filter(({id}) => point.offers.some((offerId) => offerId === id)) :
          [],
      };
    });
  }
}
