import AbstractView from '../framework/view/abstract-view';
import { generateSort } from '../mock/sort';

function createListSortTemplate(sort, currentSortType) {
  return `
    <form class="trip-events__trip-sort trip-sort" action="#" method="get">
      ${sort.map(({type, disabled}) => (`
        <div class="trip-sort__item trip-sort__item--${type}">
          <input
            id="sort-${type}"
            class="trip-sort__input visually-hidden"
            type="radio"
            name="trip-sort"
            value="sort-${type}"
            data-sort-type="${type}"
            ${disabled ? 'disabled' : ''}
            ${type === currentSortType ? 'checked' : ''}
          >
          <label class="trip-sort__btn" for="sort-${type}">${type}</label>
        </div>
      `)).join('')}
    </form>
  `;
}

export default class ListSortView extends AbstractView {
  #sort = generateSort();
  #currentSortType = null;
  #handleSortTypeChange = null;

  constructor({currentSortType, onSortTypeChange}) {
    super();

    this.#currentSortType = currentSortType;
    this.#handleSortTypeChange = onSortTypeChange;
    this.element.addEventListener('change', this.#sortTypeChangeHandler);
  }

  get template() {
    return createListSortTemplate(this.#sort, this.#currentSortType);
  }

  #sortTypeChangeHandler = (evt) => {
    if (evt.target.tagName !== 'INPUT') {
      return;
    }

    evt.preventDefault();
    this.#handleSortTypeChange(evt.target.dataset.sortType);
  };
}
