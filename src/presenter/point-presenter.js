import { remove, render, RenderPosition, replace } from '../framework/render';
import { KEY_ESCAPE } from '../const';
import EditPointView from '../view/edit-point-view';
import PointView from '../view/point-view';
import EditPointButtonView from '../view/edit-point-button-view';
import EditPointHeaderView from '../view/edit-point-header-view';
import FavoriteButtonView from '../view/favorite-button-view';

export default class PointPresenter {
  #pointListContainer = null;
  #pointComponent = null;
  #pointEditComponent = null;

  #point = null;

  #handleDataChange = null;

  constructor({pointListContainer, onDataChange}) {
    this.#pointListContainer = pointListContainer;
    this.#handleDataChange = onDataChange;
  }

  init(point) {
    this.#point = point;

    const prevPointComponent = this.#pointComponent;
    const prevPointEditComponent = this.#pointEditComponent;

    this.#pointComponent = new PointView({
      point: this.#point,
      onFavoriteClick: this.#handleFavoriteClick,
    });
    this.#renderPointActionButtons();

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

    if (this.#pointListContainer.element.contains(prevPointComponent.element)) {
      replace(this.#pointComponent, prevPointComponent);
    }

    if (this.#pointListContainer.element.contains(prevPointEditComponent.element)) {
      replace(this.#pointEditComponent, prevPointEditComponent);
    }

    remove(prevPointComponent);
    remove(prevPointEditComponent);
  }

  destroy() {
    remove(this.#pointComponent);
    remove(this.#pointEditComponent);
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

  #renderPointActionButtons() {
    const favoriteButtonComponent = new FavoriteButtonView({
      isFavorite: this.#point.isFavorite,
      onClick: this.#handleFavoriteClick,
    });

    const passiveEditButtonComponent = new EditPointButtonView({
      onClick: () => {
        this.#replaceCardToForm();
        document.addEventListener('keydown', this.#escKeyDownHandler);
      },
    });

    render(favoriteButtonComponent, this.#pointComponent.element);
    render(passiveEditButtonComponent, this.#pointComponent.element);
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
