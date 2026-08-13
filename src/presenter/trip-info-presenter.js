import { remove, render, RenderPosition } from '../framework/render';
import { SortType } from '../const';
import { sort } from '../utils/sort';
import TripInfoView from '../view/trip-info-view';

export default class TripInfoPresenter {
  #tripInfoContainer = null;
  #pointsModel = null;
  #tripInfoComponent = null;

  #path = '';

  constructor({tripInfoContainer, pointsModel}) {
    this.#tripInfoContainer = tripInfoContainer;
    this.#pointsModel = pointsModel;
  }

  init() {
    this.#pointsModel.addObserver(this.#handleModelEvent);
  }

  #handleModelEvent = () => {
    const prevTripInfoComponent = this.#tripInfoComponent;

    this.#tripInfoComponent = new TripInfoView({
      points: sort[SortType.DAY](this.#pointsModel.points, true),
    });

    if (prevTripInfoComponent) {
      remove(prevTripInfoComponent);
    }

    render(this.#tripInfoComponent, this.#tripInfoContainer, RenderPosition.AFTERBEGIN);
  };
}
