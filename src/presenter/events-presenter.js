import { render, RenderPosition, replace } from '../framework/render';
import { KEY_ESCAPE } from '../const';
import { generateSort } from '../mock/sort';
import EditPointViewButton from '../view/edit-point-view-button';
import EditPointView from '../view/edit-point-view';
import EventPointView from '../view/event-point';
import ListSortView from '../view/list-sort-view';
import ListView from '../view/list-view';
import EditPointHeaderView from '../view/edit-point-header-view';
import ListEmptyView from '../view/list-empty-view';

export default class EventsPresenter {
  #listComponent = new ListView();
  #eventsContainer = null;
  #pointsModel = null;
  #eventsPoints = null;

  constructor({eventsContainer, pointsModel}) {
    this.#eventsContainer = eventsContainer;
    this.#pointsModel = pointsModel;
  }

  init() {
    this.#eventsPoints = [...this.#pointsModel.points];
    this.#renderEvents();
  }

  #renderPoint(point) {
    const escKeyDownHandler = (evt) => {
      if (evt.key === KEY_ESCAPE) {
        evt.preventDefault();
        closeEditForm();
      }
    };

    const passiveEditButtonComponent = new EditPointViewButton({
      onClick: () => {
        replaceCardToForm();
        document.addEventListener('keydown', escKeyDownHandler);
      },
    });

    const activeEditButtonComponent = new EditPointViewButton({
      onClick: () => {
        closeEditForm();
      },
    });

    const editPointHeaderComponent = new EditPointHeaderView({point});
    const editPointComponent = new EditPointView({
      point,
      onFormSubmit: () => {
        closeEditForm();
      },
      onFormReset: () => {
        closeEditForm();
      },
    });

    render(activeEditButtonComponent, editPointHeaderComponent.element);
    render(editPointHeaderComponent, editPointComponent.element, RenderPosition.AFTERBEGIN);

    const pointComponent = new EventPointView({point});
    render(passiveEditButtonComponent, pointComponent.element);
    render(pointComponent, this.#listComponent.element);

    function replaceCardToForm() {
      replace(editPointComponent, pointComponent);
    }

    function replaceFormToCard() {
      replace(pointComponent, editPointComponent);
    }

    function closeEditForm() {
      replaceFormToCard();
      document.removeEventListener('keydown', escKeyDownHandler);
    }
  }

  #renderEvents() {
    const sort = generateSort();
    render(new ListSortView({sort}), this.#eventsContainer);
    render(this.#listComponent, this.#eventsContainer);

    if (!this.#eventsPoints.length) {
      render(new ListEmptyView(), this.#eventsContainer);
      return;
    }

    for (const point of this.#eventsPoints) {
      this.#renderPoint(point);
    }
  }
}
