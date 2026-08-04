import { remove, render, RenderPosition, replace } from '../framework/render';
import { KEY_ESCAPE } from '../const';
import EditPointView from '../view/edit-point-view';
import PointView from '../view/point-view';
import EditPointButtonView from '../view/edit-point-button-view';
import EditPointHeaderView from '../view/edit-point-header-view';

export default class PointPresenter {
  #pointListContainer = null;
  #pointComponent = null;
  #pointEditComponent = null;

  #point = null;

  constructor({pointListContainer}) {
    this.#pointListContainer = pointListContainer;
  }

  init(point) {
    this.#point = point;

    const prevPointComponent = this.#pointComponent;
    const prevPointEditComponent = this.#pointEditComponent;

    this.#pointComponent = new PointView({point: this.#point});

    this.#pointEditComponent = new EditPointView({
      point: this.#point,
      onFormSubmit: this.#handleFormSubmit,
      onFormReset: this.#handleFormReset,
    });
    this.#renderPointEditHeader();

    if (!prevPointComponent || !prevPointEditComponent) {
      this.#renderPoint();
      return;
    }

    if (this.#pointListContainer.contains(prevPointComponent.element)) {
      replace(this.#pointComponent, prevPointComponent);
    }

    if (this.#pointListContainer.contains(prevPointEditComponent.element)) {
      replace(this.#pointEditComponent, prevPointEditComponent);
    }

    remove(prevPointComponent);
    remove(prevPointEditComponent);
  }

  #renderPointEditHeader() {
    const activeEditButtonComponent = new EditPointButtonView({
      onClick: () => {
        this.#closeEditForm();
      },
    });

    const editPointHeaderComponent = new EditPointHeaderView({point: this.#point});

    render(activeEditButtonComponent, editPointHeaderComponent.element);
    render(editPointHeaderComponent, this.#pointEditComponent.element, RenderPosition.AFTERBEGIN);
  }

  #renderPoint() {
    const passiveEditButtonComponent = new EditPointButtonView({
      onClick: () => {
        this.#replaceCardToForm();
        document.addEventListener('keydown', this.#escKeyDownHandler);
      },
    });

    render(passiveEditButtonComponent, this.#pointComponent.element);
    render(this.#pointComponent, this.#pointListContainer.element);
  }

  #handleFormSubmit = () => {
    this.#closeEditForm();
  };

  #handleFormReset = () => {
    this.#closeEditForm();
  };

  #closeEditForm() {
    this.#replaceFormToCard();
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }

  #replaceFormToCard() {
    replace(this.#pointComponent, this.#pointEditComponent);
  }

  #replaceCardToForm() {
    replace(this.#pointEditComponent, this.#pointComponent);
  }

  #escKeyDownHandler = (evt) => {
    if (evt.key === KEY_ESCAPE) {
      evt.preventDefault();
      this.#closeEditForm();
    }
  };
}
