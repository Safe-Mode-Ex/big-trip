import { remove, render } from '../framework/render';
import { SortType, UpdateType, UserAction } from '../const';
import { sort } from '../utils/sort';
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

  #tripContainer = null;
  #pointsModel = null;

  constructor({tripContainer, pointsModel}) {
    this.#tripContainer = tripContainer;
    this.#pointsModel = pointsModel;

    this.#pointsModel.addObserver(this.#handleModelEvent);
  }

  get points() {
    return sort[this.#currentSortType](this.#pointsModel.points);
  }

  init() {
    this.#renderTrip();
  }

  #renderTrip() {
    this.#renderSort();
    render(this.#listComponent, this.#tripContainer);

    if (!this.points.length) {
      this.#renderListEmpty();
      return;
    }

    this.#renderPoints();
  }

  #clearTrip(resetSortType = false) {
    this.#pointsPresenters.forEach((presenter) => presenter.destroy());
    this.#pointsPresenters.clear();

    remove(this.#sortComponent);
    remove(this.#emptyListComponent);

    if (resetSortType) {
      this.#currentSortType = SortType.DAY;
    }
  }

  #renderListEmpty() {
    render(new ListEmptyView(), this.#tripContainer);
  }

  #renderPoints() {
    this.points.forEach((point) => this.#renderPoint(point));
  }

  #renderPoint(point) {
    const pointPresenter = new PointPresenter({
      pointListContainer: this.#listComponent,
      onDataChange: this.#handleViewAction,
      onModeChange: this.#handleModeChange,
    });

    pointPresenter.init(point);
    this.#pointsPresenters.set(point.id, pointPresenter);
  }

  #renderSort() {
    this.#sortComponent = new ListSortView({
      currentSortType: this.#currentSortType,
      onSortTypeChange: this.#handleSortTypeChange,
    });
    render(this.#sortComponent, this.#tripContainer);
  }

  #handleModeChange = () => {
    this.#pointsPresenters.forEach((presenter) => presenter.resetView());
  };

  #handleViewAction = (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#pointsModel.updatePoint(updateType, update);
        break;
      case UserAction.ADD_POINT:
        this.#pointsModel.addPoint(updateType, update);
        break;
      case UserAction.DELETE_POINT:
        this.#pointsModel.deletePoint(updateType, update);
        break;
    }
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#pointsPresenters.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this.#clearTrip();
        this.#renderTrip();
        break;
      case UpdateType.MAJOR:
        this.#clearTrip({resetSortType: true});
        this.#renderTrip();
        break;
    }
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#clearTrip();
    this.#renderTrip();
  };
}
