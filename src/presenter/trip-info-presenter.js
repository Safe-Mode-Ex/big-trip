import { render, RenderPosition } from '../framework/render';
import TripInfoView from '../view/trip-info-view';

export default class TripInfoPresenter {
  #tripInfoContainer = null;
  #pointsModel = null;
  #tripInfoComponent = null;

  constructor({tripInfoContainer, pointsModel}) {
    this.#tripInfoContainer = tripInfoContainer;
    this.#pointsModel = pointsModel;

    this.#pointsModel.addObserver(this.#handleModelEvent);
  }

  init() {
    this.#tripInfoComponent = new TripInfoView({
      points: this.#pointsModel.points,
    });
  }

  #handleModelEvent = () => {
    render(this.#tripInfoComponent, this.#tripInfoContainer, RenderPosition.AFTERBEGIN);
  };
}
