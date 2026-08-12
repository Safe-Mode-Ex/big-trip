import { mockOffers } from '../mock/offer';
import { mockDestinations } from '../mock/destination';
import Observable from '../framework/observable';
import { UpdateType } from '../const';

export default class PointsModel extends Observable {
  #tripApiService = null;
  #points = [];
  #destinations = mockDestinations;
  #offers = mockOffers;

  constructor({tripApiService}) {
    super();
    this.#tripApiService = tripApiService;
  }

  get points() {
    return this.#points.map((point) => {
      const pointOffers = this.#offers.find(({type}) => point.type === type);
      const hasOffers = Boolean(pointOffers && pointOffers.offers.length);

      return {
        ...point,
        destination: this.#destinations.find(({id}) => id === point.destination) ?? '',
        offers: hasOffers ?
          pointOffers.offers.filter(({id}) => point.offers.some((offerId) => offerId === id)) :
          [],
      };
    });
  }

  async init() {
    try {
      const points = await this.#tripApiService.points;
      this.#points = points.map(PointsModel.#adaptToClient);
    } catch (error) {
      this.#points = [];
    }

    this._notify(UpdateType.INIT);
  }

  async updatePoint(updateType, update) {
    const index = this.#points.findIndex(({id}) => id === update.id);

    if (index === -1) {
      throw new Error('Can not update unexisting point');
    }

    try {
      const response = await this.#tripApiService.updatePoint(PointsModel.#getUpdatedPoint(update));
      const updatedPoint = this.#adaptToClient(response);

      this.#points = [
        ...this.#points.slice(0, index),
        updatedPoint,
        ...this.#points.slice(index + 1),
      ];

      this._notify(updateType, update);
    } catch (error) {
      throw new Error('Can\'t update point');
    }
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

  static #adaptToClient(point) {
    const adaptedPoint = {
      ...point,
      basePrice: point.base_price,
      dateFrom: point.date_from,
      dateTo: point.date_to,
      isFavorite: point.is_favorite,
    };

    delete adaptedPoint.base_price;
    delete adaptedPoint.date_from;
    delete adaptedPoint.date_to;
    delete adaptedPoint.is_favorite;

    return adaptedPoint;
  }
}
