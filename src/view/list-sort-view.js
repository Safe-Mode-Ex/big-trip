import AbstractView from '../framework/view/abstract-view';
import { SortType } from '../const';

function createListSortTemplate(sort) {
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
            ${disabled ? 'disabled' : ''}
            ${type === SortType.DAY ? 'checked' : ''}
          >
          <label class="trip-sort__btn" for="sort-${type}">${type}</label>
        </div>
      `)).join('')}
    </form>
  `;
}

export default class ListSortView extends AbstractView {
  #sort = null;

  constructor({sort}) {
    super();
    this.#sort = sort;
  }

  get template() {
    return createListSortTemplate(this.#sort);
  }
}
