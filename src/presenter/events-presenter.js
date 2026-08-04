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

  #renderSort() {
    render(this.#sortComponent, this.#eventsContainer);
  }
}
