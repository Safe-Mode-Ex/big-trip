import { remove, render, RenderPosition } from '../framework/render';
import UiBlocker from '../framework/ui-blocker/ui-blocker';
import { FilterType, SortType, UpdateType, UserAction } from '../const';
import { sort } from '../utils/sort';
import { filter } from '../utils/filter';
import SortView from '../view/sort-view';
import ListView from '../view/list-view';
import ListEmptyView from '../view/list-empty-view';
import LoadingView from '../view/loading-view';
import PointPresenter from './point-presenter';
import AddPointPresenter from './add-point-presenter';

const TimeLimit = {
  LOWER: 350,
  UPPER: 1000,
};

const LoadingMessage = {
  ERROR: 'Failed to load latest route information',
  LOADING: 'Loading...',
};

export default class TripPresenter {
  #listComponent = new ListView();
  #loadingComponent = null;
  #sortComponent = null;
  #emptyListComponent = null;

  #pointsPresenters = new Map();
  #addPointPresenter = null;
  #currentSortType = SortType.DAY;
  #filterType = FilterType.ALL;
  #isLoading = true;
  #isError = false;
  #isAddingNewPoint = false;

  #tripContainer = null;
  #pointsModel = null;
  #filterModel = null;

  #uiBlocker = new UiBlocker({
    lowerLimit: TimeLimit.LOWER,
    upperLimit: TimeLimit.UPPER,
  });

  constructor({tripContainer, pointsModel, filterModel, onAddPointDestroy}) {
    this.#tripContainer = tripContainer;
    this.#pointsModel = pointsModel;
    this.#filterModel = filterModel;

    this.#addPointPresenter = new AddPointPresenter({
      pointListContainer: this.#listComponent.element,
      onDataChange: this.#handleViewAction,
      onDestroy: onAddPointDestroy,
    });

    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get points() {
    this.#filterType = this.#filterModel.filter;
    const points = this.#pointsModel.points;
    const filteredPoints = filter[this.#filterType](points);
    return sort[this.#currentSortType](filteredPoints);
  }

  init() {
    this.#renderTrip();
  }

  createPoint() {
    this.#isAddingNewPoint = true;
    this.#currentSortType = SortType.DAY;
    this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.ALL);
    this.#addPointPresenter.init();
  }

  #renderTrip() {
    if (this.#isLoading || this.#isError) {
      this.#renderLoading();
      return;
    }

    render(this.#listComponent, this.#tripContainer);

    if (!this.points.length && !this.#isAddingNewPoint) {
      this.#renderListEmpty();
      return;
    }

    this.#renderSort();
    this.#renderPoints();
    this.#isAddingNewPoint = false;
  }

  #clearTrip(resetSortType = false) {
    this.#addPointPresenter.destroy();
    this.#pointsPresenters.forEach((presenter) => presenter.destroy());
    this.#pointsPresenters.clear();

    remove(this.#sortComponent);
    remove(this.#loadingComponent);

    if (this.#emptyListComponent) {
      remove(this.#emptyListComponent);
    }

    if (resetSortType) {
      this.#currentSortType = SortType.DAY;
    }
  }

  #renderListEmpty() {
    this.#emptyListComponent = new ListEmptyView({
      filterType: this.#filterType,
    });

    render(this.#emptyListComponent, this.#tripContainer);
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
    this.#sortComponent = new SortView({
      currentSortType: this.#currentSortType,
      onSortTypeChange: this.#handleSortTypeChange,
    });
    render(this.#sortComponent, this.#tripContainer, RenderPosition.AFTERBEGIN);
  }

  #renderLoading() {
    this.#loadingComponent = new LoadingView({
      message: this.#isError ? LoadingMessage.ERROR : LoadingMessage.LOADING,
    });
    render(this.#loadingComponent, this.#tripContainer);
  }

  #handleModeChange = () => {
    this.#addPointPresenter.destroy();
    this.#pointsPresenters.forEach((presenter) => presenter.resetView());
  };

  #handleViewAction = async (actionType, updateType, update) => {
    this.#uiBlocker.block();

    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#pointsPresenters.get(update.id).setSaving();

        try {
          await this.#pointsModel.updatePoint(updateType, update);
        } catch (error) {
          this.#pointsPresenters.get(update.id).setAborting();
        }

        break;
      case UserAction.ADD_POINT:
        this.#addPointPresenter.setSaving();

        try {
          await this.#pointsModel.addPoint(updateType, update);
        } catch (error) {
          this.#addPointPresenter.setAborting();
        }

        break;
      case UserAction.DELETE_POINT:
        this.#pointsPresenters.get(update.id).setDeleting();

        try {
          await this.#pointsModel.deletePoint(updateType, update);
        } catch (error) {
          this.#pointsPresenters.get(update.id).setAborting();
        }

        break;
    }

    this.#uiBlocker.unblock();
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
      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);

        if (data.isError) {
          this.#isError = true;
        }

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
