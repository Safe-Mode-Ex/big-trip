import { render, RenderPosition, replace } from '../framework/render';
import { KEY_ESCAPE } from '../const';
import EditPointViewButton from '../view/edit-point-view-button';
import EditPointView from '../view/edit-point-view';
import EventPointView from '../view/event-point';
import ListSortView from '../view/list-sort-view';
import ListView from '../view/list-view';
import EditPointHeaderView from '../view/edit-point-header-view';

export default class EventsPresenter {
  #listComponent = new ListView();
  #pointComponent = null;
  #editPointComponent = null;
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
    const passiveEditButtonComponent = new EditPointViewButton({
      onClick: () => {
        this.#replaceCardToForm();
        document.addEventListener('keydown', this.#escKeyDownHandler);
      },
    });

    const activeEditButtonComponent = new EditPointViewButton({
      onClick: () => {
        this.#closeEditForm();
      },
    });

    const editPointHeaderComponent = new EditPointHeaderView({point});

    this.#pointComponent = new EventPointView({point});
    this.#editPointComponent = new EditPointView({
      point,
      onFormSubmit: () => {
        this.#closeEditForm();
      },
      onFormReset: () => {
        this.#closeEditForm();
      },
    });

    render(passiveEditButtonComponent, this.#pointComponent.element);
    render(activeEditButtonComponent, editPointHeaderComponent.element);
    render(editPointHeaderComponent, this.#editPointComponent.element, RenderPosition.AFTERBEGIN);
    render(this.#pointComponent, this.#listComponent.element);
  }

  #renderEvents() {
    render(new ListSortView(), this.#eventsContainer);
    render(this.#listComponent, this.#eventsContainer);

    for (const point of this.#eventsPoints) {
      this.#renderPoint(point);
    }
  }

  #replaceCardToForm() {
    replace(this.#editPointComponent, this.#pointComponent);
  }

  #replaceFormToCard() {
    replace(this.#pointComponent, this.#editPointComponent);
  }

  #closeEditForm() {
    this.#replaceFormToCard();
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }

  #escKeyDownHandler = (evt) => {
    if (evt.key === KEY_ESCAPE) {
      evt.preventDefault();
      this.#closeEditForm();
    }
  };
}
