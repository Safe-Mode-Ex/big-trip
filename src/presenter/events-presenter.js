import { render, RenderPosition, replace } from '../framework/render';
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

  constructor({eventsContainer, pointsModel}) {
    this.#eventsContainer = eventsContainer;
    this.#pointsModel = pointsModel;
  }

  init() {
    this.#eventsPoints = [...this.#pointsModel.points];
    render(new ListSortView(), this.#eventsContainer);
    this.#renderPointsList();
  }

  #renderPoint(point) {
    const escKeyDownHandler = (evt) => {
      if (evt.key === 'Escape') {
        evt.preventDefault();
        replaceFormToCard();
        document.removeEventListener('keydown', escKeyDownHandler);
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
        replaceFormToCard();
        document.removeEventListener('keydown', escKeyDownHandler);
      },
    });

    const editPointHeaderComponent = new EditPointHeaderView({point});
    const editPointComponent = new EditPointView({
      point,
      onFormSubmit: () => {
        replaceFormToCard();
        document.removeEventListener('keydown', escKeyDownHandler);
      },
      onFormReset: () => {
        replaceFormToCard();
        document.removeEventListener('keydown', escKeyDownHandler);
      },
    });

    render(activeEditButtonComponent, editPointHeaderComponent.element);
    render(editPointHeaderComponent, editPointComponent.element, RenderPosition.AFTERBEGIN);

    const pointComponent = new EventPointView({point});
    render(passiveEditButtonComponent, pointComponent.element);

    function replaceCardToForm() {
      replace(editPointComponent, pointComponent);
    }

    function replaceFormToCard() {
      replace(pointComponent, editPointComponent);
    }

    render(pointComponent, this.#listComponent.element);
  }

  #renderPointsList() {
    render(this.#listComponent, this.#eventsContainer);

    for (const point of this.#eventsPoints) {
      this.#renderPoint(point);
    }
  }
}
