import { remove, render, RenderPosition, replace } from '../framework/render';
import { KEY_ESCAPE } from '../const';
import EditPointView from '../view/edit-point-view';
import PointView from '../view/point-view';
import EditPointHeaderView from '../view/edit-point-header-view';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

export default class PointPresenter {
  #pointListContainer = null;
  #pointComponent = null;
  #pointEditComponent = null;
  #pointEditHeaderComponent = null;

  #point = null;
  #mode = Mode.DEFAULT;

  #handleDataChange = null;
  #handleModeChange = null;

  constructor({pointListContainer, onDataChange, onModeChange}) {
    this.#pointListContainer = pointListContainer;
    this.#handleDataChange = onDataChange;
    this.#handleModeChange = onModeChange;
  }

  init(point) {
    this.#point = point;

    const prevPointComponent = this.#pointComponent;
    const prevPointEditComponent = this.#pointEditComponent;

    this.#pointComponent = new PointView({
      point: this.#point,
      onEditClick: () => {
        this.#replaceCardToForm();
        document.addEventListener('keydown', this.#escKeyDownHandler);
      },
      onFavoriteClick: this.#handleFavoriteClick,
    });

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

    if (this.#mode === Mode.DEFAULT) {
      replace(this.#pointComponent, prevPointComponent);
    }

    if (this.#mode === Mode.EDITING) {
      replace(this.#pointEditComponent, prevPointEditComponent);
    }

    remove(prevPointComponent);
    remove(prevPointEditComponent);
  }

  resetView() {
    if (this.#mode !== Mode.DEFAULT) {
      this.#pointEditHeaderComponent.reset(this.#point);
      this.#replaceFormToCard();
    }
  }

  destroy() {
    remove(this.#pointComponent);
    remove(this.#pointEditComponent);
  }

  #renderPointEditHeader() {
    this.#pointEditHeaderComponent = new EditPointHeaderView({
      point: this.#point,
      onClose: () => {
        this.#closeEditForm();
      },
    });

    render(this.#pointEditHeaderComponent, this.#pointEditComponent.element, RenderPosition.AFTERBEGIN);
  }

  #renderPoint() {
    render(this.#pointComponent, this.#pointListContainer.element);
  }

  #handleFormSubmit = () => {
    this.#handleDataChange(this.#point);
    this.#closeEditForm();
  };

  #handleFormReset = () => {
    this.#closeEditForm();
  };

  #handleFavoriteClick = () => {
    this.#handleDataChange({...this.#point, isFavorite: !this.#point.isFavorite});
  };

  #closeEditForm() {
    this.#pointEditHeaderComponent.reset(this.#point);
    this.#replaceFormToCard();
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }

  #replaceFormToCard() {
    replace(this.#pointComponent, this.#pointEditComponent);
    this.#mode = Mode.DEFAULT;
  }

  #replaceCardToForm() {
    replace(this.#pointEditComponent, this.#pointComponent);
    this.#handleModeChange();
    this.#mode = Mode.EDITING;
  }

  #escKeyDownHandler = (evt) => {
    if (evt.key === KEY_ESCAPE) {
      evt.preventDefault();
      this.#closeEditForm();
    }
  };
}
