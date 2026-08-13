import Observable from '../framework/observable';
import { UpdateType } from '../const';
import Store from '../store/store.js';

export default class PointsModel extends Observable {
  #tripApiService = null;
  #points = [];
  #destinations = [];
  #offers = [];

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
    let isError = false;

    try {
      const points = await this.#tripApiService.points;
      const destinations = await this.#tripApiService.destinations;
      const offers = await this.#tripApiService.offers;

      this.#points = points.map(PointsModel.#adaptToClient);
      this.#destinations = destinations;
      this.#offers = offers;

      Store.destinations = destinations;
      Store.offers = offers;
    } catch (error) {
      this.#points = [];
      this.#destinations = [];
      this.#offers = [];
      isError = true;
    }

    this._notify(UpdateType.INIT, {isError});
  }

  async updatePoint(updateType, update) {
    const index = this.#points.findIndex(({id}) => id === update.id);

    if (index === -1) {
      throw new Error('Can not update unexisting point');
    }

    try {
      const response = await this.#tripApiService.updatePoint(PointsModel.#getUpdatedPoint(update));
      const updatedPoint = PointsModel.#adaptToClient(response);

      this.#points = [
        ...this.#points.slice(0, index),
        updatedPoint,
        ...this.#points.slice(index + 1),
      ];

      this._notify(updateType, update);
    } catch (error) {
      throw new Error('Can not update point');
    }
  }

  async addPoint(updateType, update) {
    try {
      const response = await this.#tripApiService.addPoint(PointsModel.#getUpdatedPoint(update));
      const newPoint = PointsModel.#adaptToClient(response);

      this.#points = [
        newPoint,
        ...this.#points,
      ];

      this._notify(updateType, update);
    } catch (error) {
      throw new Error('Can not add point');
    }
  }

  async deletePoint(updateType, update) {
    const index = this.#points.findIndex(({id}) => id === update.id);

    if (index === -1) {
      throw new Error('Can not delete unexisting point');
    }

    try {
      await this.#tripApiService.deletePoint(update.id);

      this.#points = [
        ...this.#points.slice(0, index),
        ...this.#points.slice(index + 1),
      ];

      this._notify(updateType);
    } catch (error) {
      throw new Error('Can not delete point');
    }
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
