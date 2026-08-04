import AbstractView from '../framework/view/abstract-view';

function createFavoriteButtonTemplate(isFavorite) {
  return `
    <button class="event__favorite-btn${isFavorite ? ' event__favorite-btn--active' : ''}" type="button">
      <span class="visually-hidden">Add to favorite</span>
      <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
        <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
      </svg>
    </button>
  `;
}

export default class FavoriteButtonView extends AbstractView {
  #isFavorite = false;
  #handleClick = null;

  constructor({isFavorite, onClick}) {
    super();

    this.#isFavorite = isFavorite;
    this.#handleClick = onClick;
    this.element.addEventListener('click', this.#clickHandler);
  }

  get template() {
    return createFavoriteButtonTemplate(this.#isFavorite);
  }

  #clickHandler = (evt) => {
    evt.preventDefault();
    this.#handleClick();
  };
}
