import { render } from '../framework/render';
import { generateSort } from '../mock/sort';
import ListSortView from '../view/list-sort-view';
import ListView from '../view/list-view';
import ListEmptyView from '../view/list-empty-view';
import PointPresenter from './point-presenter';

export default class EventsPresenter {
  #listComponent = new ListView();
  #sortComponent = new ListSortView({sort: generateSort()});
  #emptyListComponent = new ListEmptyView();

  #eventsContainer = null;
  #pointsModel = null;
  #eventsPoints = null;

  constructor({eventsContainer, pointsModel}) {
    this.#eventsContainer = eventsContainer;
    this.#pointsModel = pointsModel;
  }

  init() {
    this.#eventsPoints = [...this.#pointsModel.points];
    this.#renderTrip();
  }

  #renderTrip() {
    this.#renderSort();
    this.#renderPointsList();
  }

  #renderPointsList() {
    render(this.#listComponent, this.#eventsContainer);

    if (!this.#eventsPoints.length) {
      this.#renderListEmpty();
      return;
    }

    this.#renderPoints();
  }

  #renderListEmpty() {
    render(new ListEmptyView(), this.#eventsContainer);
  }

  #renderPoints() {
    for (const point of this.#eventsPoints) {
      this.#renderPoint(point);
    }
  }

  #renderPoint(point) {
    const pointPresenter = new PointPresenter({
      pointListContainer: this.#listComponent,
    });

    pointPresenter.init(point);
  }

  #renderSort() {
    render(this.#sortComponent, this.#eventsContainer);
  }
}
