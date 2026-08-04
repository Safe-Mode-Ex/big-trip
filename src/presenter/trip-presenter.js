import { render } from '../framework/render';
import { SortType } from '../const';
import { updateItem } from '../utils/common';
import { sort } from '../utils/sort';
import { generateSort } from '../mock/sort';
import ListSortView from '../view/list-sort-view';
import ListView from '../view/list-view';
import ListEmptyView from '../view/list-empty-view';
import PointPresenter from './point-presenter';

export default class TripPresenter {
  #listComponent = new ListView();
  #sortComponent = null;
  #emptyListComponent = new ListEmptyView();

  #pointsPresenters = new Map();
  #currentSortType = SortType.DAY;
  #sourcedTripPoints = [];

  #eventsContainer = null;
  #pointsModel = null;
  #tripPoints = null;

  constructor({eventsContainer, pointsModel}) {
    this.#eventsContainer = eventsContainer;
    this.#pointsModel = pointsModel;
  }

  init() {
    this.#tripPoints = [...this.#pointsModel.points];
    this.#sourcedTripPoints = [...this.#pointsModel.points];
    this.#renderTrip();
  }

  #renderTrip() {
    this.#renderSort();
    this.#renderPointsList();
  }

  #renderPointsList() {
    render(this.#listComponent, this.#eventsContainer);

    if (!this.#tripPoints.length) {
      this.#renderListEmpty();
      return;
    }

    this.#renderPoints();
  }

  #clearPointsList() {
    this.#pointsPresenters.forEach((presenter) => presenter.destroy());
    this.#pointsPresenters.clear();
  }

  #renderListEmpty() {
    render(new ListEmptyView(), this.#eventsContainer);
  }

  #renderPoints() {
    for (const point of this.#tripPoints) {
      this.#renderPoint(point);
    }
  }

  #renderPoint(point) {
    const pointPresenter = new PointPresenter({
      pointListContainer: this.#listComponent,
      onDataChange: this.#handlePointChange,
      onModeChange: this.#handleModeChange,
    });

    pointPresenter.init(point);
    this.#pointsPresenters.set(point.id, pointPresenter);
  }

  #renderSort() {
    this.#sortComponent = new ListSortView({
      sort: generateSort(),
      onSortTypeChange: this.#handleSortTypeChange,
    });
    render(this.#sortComponent, this.#eventsContainer);
  }

  #handleModeChange = () => {
    this.#pointsPresenters.forEach((presenter) => presenter.resetView());
  };

  #handlePointChange = (updatedPoint) => {
    this.#tripPoints = updateItem(this.#tripPoints, updatedPoint);
    this.#sourcedTripPoints = updateItem(this.#tripPoints, updatedPoint);
    this.#pointsPresenters.get(updatedPoint.id).init(updatedPoint);
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#sortPoints(sortType);
    this.#clearPointsList();
    this.#renderPointsList();
  };

  #sortPoints(sortType) {
    sort[sortType](this.#tripPoints);
    this.#currentSortType = sortType;
  }
}
