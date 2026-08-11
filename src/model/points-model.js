import { getRandomPoint } from '../mock/point';
import { mockOffers } from '../mock/offer';
import { mockDestinations } from '../mock/destination';
import Observable from '../framework/observable';

const POINTS_COUNT = 3;

export default class PointsModel extends Observable {
  #tripApiService = null;
  #destinations = mockDestinations;
  #offers = mockOffers;
  #points = Array.from({length: POINTS_COUNT}, getRandomPoint);

  constructor({tripApiService}) {
    super();

    this.#tripApiService = tripApiService;

    this.#tripApiService.points.then((points) => {
      console.log(points);
    });
  }

  get points() {
    return this.#points.map((point) => {
      const pointOffers = this.#offers.find(({type}) => point.type === type);
      const hasOffers = Boolean(pointOffers && pointOffers.offers.length);

      return {
        ...point,
        destination: this.#destinations.find(({id}) => id === point.destination),
        offers: hasOffers ?
          pointOffers.offers.filter(({id}) => point.offers.some((offerId) => offerId === id)) :
          [],
      };
    });
  }

  updatePoint(updateType, update) {
    const index = this.#points.findIndex(({id}) => id === update.id);

    if (index === -1) {
      throw new Error('Can not update unexisting point');
    }

    this.#points = [
      ...this.#points.slice(0, index),
      PointsModel.#getUpdatedPoint(update),
      ...this.#points.slice(index + 1),
    ];

    this._notify(updateType, update);
  }

  addPoint(updateType, update) {
    this.#points = [
      PointsModel.#getUpdatedPoint(update),
      ...this.#points,
    ];

    this._notify(updateType, update);
  }

  deletePoint(updateType, update) {
    const index = this.#points.findIndex(({id}) => id === update.id);

    if (index === -1) {
      throw new Error('Can not delete unexisting point');
    }

    this.#points = [
      ...this.#points.slice(0, index),
      ...this.#points.slice(index + 1),
    ];

    this._notify(updateType, update);
  }

  static #getUpdatedPoint(point) {
    return {
      ...point,
      destination: point.destination.id,
      offers: point.offers.length ? point.offers.map(({id}) => id) : [],
    };
  }
}
