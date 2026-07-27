import { remove, render, RenderPosition } from '../framework/render';
import EditPointViewButton from '../view/edit-point-view-button';
import EditPointView from '../view/edit-point-view';
import EventPointView from '../view/event-point';
import ListSortView from '../view/list-sort-view';
import ListView from '../view/list-view';
import EditPointHeaderView from '../view/edit-point-header-view';

export default class EventsPresenter {
  #listComponent = new ListView();
  #eventsContainer = null;
  #pointsModel = null;
  #eventsPoints = null;
  #isEdit = null;

  constructor({eventsContainer, pointsModel}) {
    this.#eventsContainer = eventsContainer;
    this.#pointsModel = pointsModel;
  }

  init() {
    this.#eventsPoints = [...this.#pointsModel.points];
    this.#isEdit = this.#eventsPoints.reduce((result, point) => {
      result[point.id] = false;
      return result;
    }, {});

    render(new ListSortView(), this.#eventsContainer);
    this.#renderPointsList();
  }

  #renderPoint(point) {
    const isEdit = this.#isEdit[point.id];
    const editButtonComponent = new EditPointViewButton({
      onClick: () => this.#handleEditButtonClick(point.id),
    });

    if (isEdit) {
      const editPointHeaderComponent = new EditPointHeaderView({point});
      const editPointComponent = new EditPointView({point});

      render(editButtonComponent, editPointHeaderComponent.element);
      render(editPointHeaderComponent, editPointComponent.element, RenderPosition.AFTERBEGIN);
      render(editPointComponent, this.#listComponent.element);

      return;
    }

    const pointComponent = new EventPointView({point});
    render(editButtonComponent, pointComponent.element);
    render(pointComponent, this.#listComponent.element);
  }

  #renderPointsList() {
    render(this.#listComponent, this.#eventsContainer);

    for (const point of this.#eventsPoints) {
      this.#renderPoint(point);
    }
  }

  #handleEditButtonClick = (pointId) => {
    this.#isEdit[pointId] = !this.#isEdit[pointId];
    remove(this.#listComponent);
    this.#renderPointsList();
  };
}
